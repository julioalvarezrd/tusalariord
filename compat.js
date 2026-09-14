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

  const extraIncome=document.getElementById('extraIncomeFields');
  if(extraIncome&&!document.getElementById('extraIncomeToggle')){
    const body=document.createElement('div');
    body.id='extraIncomeContent';
    body.className='extra-income-collapsible-body';
    while(extraIncome.firstChild) body.appendChild(extraIncome.firstChild);

    const toggle=document.createElement('button');
    toggle.id='extraIncomeToggle';
    toggle.className='extra-income-toggle';
    toggle.type='button';
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-controls',body.id);
    toggle.innerHTML='<span><strong>Otros ingresos mensuales</strong><small>Comisiones, propinas y otros ingresos</small></span><i aria-hidden="true">⌄</i>';

    extraIncome.append(toggle,body);

    const syncExtraIncomeState=()=>{
      if(mobileQuery.matches){
        const expanded=toggle.getAttribute('aria-expanded')==='true';
        extraIncome.classList.toggle('extra-income-collapsed',!expanded);
      }else{
        extraIncome.classList.remove('extra-income-collapsed');
      }
    };

    toggle.addEventListener('click',()=>{
      const expanded=toggle.getAttribute('aria-expanded')==='true';
      toggle.setAttribute('aria-expanded',String(!expanded));
      extraIncome.classList.toggle('extra-income-collapsed',expanded);
    });

    syncExtraIncomeState();
    mobileQuery.addEventListener?.('change',syncExtraIncomeState);
  }

  const seoSection=document.getElementById('como-funciona');
  if(seoSection&&!document.getElementById('seoMobileToggle')){
    const body=document.createElement('div');
    body.id='seoMobileContent';
    body.className='seo-collapsible-body';
    while(seoSection.firstChild) body.appendChild(seoSection.firstChild);

    const toggle=document.createElement('button');
    toggle.id='seoMobileToggle';
    toggle.className='seo-mobile-toggle';
    toggle.type='button';
    toggle.setAttribute('aria-expanded','false');
    toggle.setAttribute('aria-controls',body.id);
    toggle.innerHTML='<span><small>Entiende tu nómina</small><strong>Cómo se calcula tu salario</strong></span><i aria-hidden="true">⌄</i>';

    seoSection.append(toggle,body);

    const syncSeoState=()=>{
      if(mobileQuery.matches){
        const expanded=toggle.getAttribute('aria-expanded')==='true';
        seoSection.classList.toggle('seo-collapsed',!expanded);
      }else{
        seoSection.classList.remove('seo-collapsed');
      }
    };

    toggle.addEventListener('click',()=>{
      const expanded=toggle.getAttribute('aria-expanded')==='true';
      toggle.setAttribute('aria-expanded',String(!expanded));
      seoSection.classList.toggle('seo-collapsed',expanded);
    });

    syncSeoState();
    mobileQuery.addEventListener?.('change',syncSeoState);
  }

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