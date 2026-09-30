export default async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({success:false,error:'Método não permitido'});
  try{
    const body=typeof req.body==='string'?JSON.parse(req.body||'{}'):req.body||{};
    const accessKey=process.env.WEB3FORMS_ACCESS_KEY;
    if(!accessKey)return res.status(500).json({success:false,error:'WEB3FORMS_ACCESS_KEY não configurada na Vercel'});

    const clean=Object.fromEntries(
      Object.entries(body).filter(([k])=>!['replyTo','subject'].includes(k))
    );
    const text=Object.entries(clean)
      .map(([k,v])=>k+': '+String(v??''))
      .join('\n');

    const response=await fetch('https://api.web3forms.com/submit',{
      method:'POST',
      headers:{
        'Content-Type':'application/json',
        'Accept':'application/json'
      },
      body:JSON.stringify({
        access_key:accessKey,
        subject:body.subject||'Contacto WDesigns',
        from_name:body.name||'Cliente WDesigns',
        email:body.replyTo||body.email||'',
        replyto:body.replyTo||body.email||'',
        message:text,
        botcheck:''
      })
    });

    const data=await response.json().catch(()=>({}));
    if(!response.ok||data.success!==true){
      return res.status(502).json({success:false,error:data.message||('Web3Forms HTTP '+response.status)});
    }

    return res.status(200).json({success:true,message:data.message||'Pedido enviado com sucesso'});
  }catch(e){
    return res.status(500).json({success:false,error:e?.message||'Erro interno no envio'});
  }
}
