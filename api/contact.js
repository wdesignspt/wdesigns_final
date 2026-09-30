export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({success:false,error:'Método não permitido'});
  try{
    const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):req.body||{};
    const clean=Object.fromEntries(Object.entries(body).filter(([k])=>k!=='replyTo'&&k!=='subject'));
    const text=Object.entries(clean).map(([k,v])=>k+': '+String(v??'')).join('\n');
    const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{'Authorization':'Bearer '+process.env.RESEND_API_KEY,'Content-Type':'application/json'},body:JSON.stringify({
      from:'WDesigns <onboarding@resend.dev>',to:['wdesigns.comercial@gmail.com'],reply_to:body.replyTo||undefined,subject:body.subject||'Contacto WDesigns',text
    })});
    const data=await response.json().catch(()=>({}));
    if(!response.ok)return res.status(502).json({success:false,error:data.message||'Serviço de email indisponível'});
    return res.status(200).json({success:true,id:data.id});
  }catch(e){return res.status(500).json({success:false,error:'Erro interno no envio'})}
}