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
  const mobileQuery=window.matchMedia('(max-width: 900px)');

  function syncResultVisibility(){
    if(!resultCard)return;
    resultCard.hidden=mobileQuery.matches;
  }

  syncResultVisibility();
  mobileQuery.addEventListener?.('change',syncResultVisibility);

  document.addEventListener('DOMContentLoaded',()=>{
    const form=document.getElementById('payrollForm');
    const salary=document.getElementById('salary');
    if(!form||!resultCard)return;

    form.addEventListener('submit',()=>{
      const amount=Number(String(salary?.value||'').replace(/,/g,''))||0;
      if(amount<=0)return;

      if(mobileQuery.matches){
        resultCard.hidden=false;
        requestAnimationFrame(()=>{
          resultCard.scrollIntoView({behavior:'smooth',block:'start'});
        });
      }
    });

    form.addEventListener('reset',()=>{
      resultCard.hidden=mobileQuery.matches;
    });
  });
})();
