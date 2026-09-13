(()=>{
  const marker=document.createElement('span');
  marker.id='inverseHint';
  marker.hidden=true;
  marker.setAttribute('aria-hidden','true');
  document.body.appendChild(marker);

  const net=document.getElementById('net');
  if(net&&!document.getElementById('fortnight')){
    const row=document.createElement('div');
    row.className='fortnight-equivalent';
    row.innerHTML='<span>Equivalente quincenal</span><strong id="fortnight">RD$ 0.00</strong>';
    net.insertAdjacentElement('afterend',row);
  }
})();
