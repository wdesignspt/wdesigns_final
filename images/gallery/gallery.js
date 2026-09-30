// ===============================================================
// GALERIA WDESIGNS
// COMO ADICIONAR UMA PEÇA:
// 1. Copia a fotografia para a pasta images/gallery/
// 2. Duplica uma linha de exemplo abaixo.
// 3. Troca ficheiro, nome, descrição e preço.
// ===============================================================

const forSale = [
  // {src:'images/gallery/vaso-laranja.jpg', title:'Vaso geométrico', desc:'Vaso decorativo impresso em PLA.', price:'15,00 €'},
  // {src:'images/gallery/suporte.jpg', title:'Suporte de secretária', desc:'Suporte prático para organização.', price:'8,00 €'},
];

const technicalWorks = [
  // {src:'images/gallery/peca-tecnica-01.jpg', title:'Adaptador técnico', desc:'Peça criada para uma aplicação específica.'},
  // {src:'images/gallery/suporte-medida.jpg', title:'Suporte à medida', desc:'Componente funcional produzido por impressão 3D.'},
];

const saleGrid = document.querySelector('#sale-grid');
const technicalGrid = document.querySelector('#technical-grid');

function emptyMessage(type){
  const sale = type === 'sale';
  return `<div class="placeholder">
    <div>
      <strong>${sale ? 'A montra está pronta.' : 'O portefólio técnico está pronto.'}</strong>
      ${sale ? 'Adiciona aqui as fotografias das peças que tens para venda, com o respetivo preço.' : 'Adiciona aqui fotografias dos trabalhos técnicos que já realizaste.'}
    </div>
  </div>`;
}

function renderGrid(items, target, type){
  target.innerHTML = '';
  if(!items.length){ target.innerHTML = emptyMessage(type); return; }

  items.forEach(item => {
    const card = document.createElement('article');
    card.className = 'card';
    const label = type === 'sale' ? 'Disponível' : 'Trabalho realizado';
    card.innerHTML = `
      <div class="card-media">
        <img loading="lazy" src="${item.src}" alt="${item.title}">
        <span class="badge">${label}</span>
      </div>
      <div class="card-body">
        <h3>${item.title}</h3>
        <p>${item.desc || ''}</p>
        <div class="card-footer">
          ${type === 'sale' ? `<span class="price">${item.price || 'Preço sob indicação'}</span>` : '<span></span>'}
          <span class="view">Ver fotografia +</span>
        </div>
      </div>`;
    card.addEventListener('click', () => openLightbox(item, type));
    target.appendChild(card);
  });
}

const lb = document.querySelector('#lightbox');
const large = document.querySelector('#large');
const ltitle = document.querySelector('#ltitle');
const ldesc = document.querySelector('#ldesc');
const lprice = document.querySelector('#lprice');
const lbadge = document.querySelector('#lbadge');

function openLightbox(item,type){
  large.src = item.src;
  large.alt = item.title;
  ltitle.textContent = item.title;
  ldesc.textContent = item.desc || '';
  lbadge.textContent = type === 'sale' ? 'Peça para venda' : 'Trabalho técnico realizado';
  lprice.textContent = type === 'sale' ? (item.price || '') : '';
  lb.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeLightbox(){
  lb.hidden = true;
  document.body.style.overflow = '';
}

document.querySelector('#close').addEventListener('click', closeLightbox);
lb.addEventListener('click', e => { if(e.target === lb) closeLightbox(); });
document.addEventListener('keydown', e => { if(e.key === 'Escape' && !lb.hidden) closeLightbox(); });
document.querySelector('#year').textContent = new Date().getFullYear();

renderGrid(forSale, saleGrid, 'sale');
renderGrid(technicalWorks, technicalGrid, 'technical');
