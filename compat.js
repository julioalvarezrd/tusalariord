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

  const resultCard=document.querySelector('.result-card');
  if(resultCard) resultCard.hidden=true;

  document.addEventListener('DOMContentLoaded',()=>{
    const form=document.getElementById('payrollForm');
    const salary=document.getElementById('salary');
    if(!form||!resultCard)return;

    form.addEventListener('submit',()=>{
      const amount=Number(String(salary?.value||'').replace(/,/g,''))||0;
      if(amount>0) resultCard.hidden=false;
    });

    form.addEventListener('reset',()=>{
      resultCard.hidden=true;
    });
  });
})();
