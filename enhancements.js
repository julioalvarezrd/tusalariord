(()=>{
  const $=id=>document.getElementById(id);
  const parseMoney=text=>Number(String(text||'').replace(/[^0-9.-]/g,''))||0;
  const format=n=>n.toLocaleString('es-DO',{style:'currency',currency:'DOP'});
  const originalCalculate=window.calculate;
  const moneyIds=['net','gross','rSalary','rTips','rCommissions','rOther','afp','sfs','isr','deductions','tssBase','isrBase','fortnight'];
  const optionalIncomeRows=['rCommissions','rTips','rOther'];
  let selectedPeriod='month';
  let selectedMode='gross-to-net';

  function multiplier(){return selectedPeriod==='fortnight'?2:1}
  function setPeriodLabels(){
    const word=selectedPeriod==='fortnight'?'quincenal':'mensual';
    $('salaryLabel').textContent=selectedMode==='net-to-gross'?`Neto ${word} deseado`:`Salario base ${word}`;
    $('resultPeriod').textContent=word;
    $('calculateButton').textContent=selectedMode==='net-to-gross'?'Calcular salario bruto':'Calcular salario neto';
    $('extraIncomeFields').hidden=selectedMode==='net-to-gross';
    $('inverseHint').hidden=selectedMode!=='net-to-gross';
  }

  function readResult(){
    return Object.fromEntries(moneyIds.map(id=>[id,parseMoney($(id)?.textContent)]));
  }

  function syncOptionalIncomeRows(values={}){
    optionalIncomeRows.forEach(id=>{
      const value=values[id]||0;
      const row=$(id)?.closest('p');
      if(row) row.hidden=value<=0;
    });
  }

  function renderPeriod(values){
    const divisor=selectedPeriod==='fortnight'?2:1;
    moneyIds.forEach(id=>{if($(id)&&id!=='fortnight')$(id).textContent=format((values[id]||0)/divisor)});
    if($('fortnight')) $('fortnight').textContent=format((values.net||0)/2);
    syncOptionalIncomeRows(values);
    const gross=(values.gross||0)/divisor,net=(values.net||0)/divisor,deductions=(values.deductions||0)/divisor;
    const netPct=gross>0?Math.max(0,Math.min(100,net/gross*100)):0;
    const dedPct=gross>0?Math.max(0,Math.min(100,deductions/gross*100)):0;
    if($('netBar')) $('netBar').style.width=`${netPct}%`;
    if($('deductionsBar')) $('deductionsBar').style.width=`${dedPct}%`;
    if($('grossPercent')) $('grossPercent').textContent=`${netPct.toFixed(1)}% neto`;
    if($('deductionPercent')) $('deductionPercent').textContent=`${dedPct.toFixed(1)}% descuentos`;
    if($('afpBase')) $('afpBase').textContent=format(Math.min((values.tssBase||0)/divisor,464460/divisor));
    if($('sfsBase')) $('sfsBase').textContent=format(Math.min((values.tssBase||0)/divisor,232230/divisor));
  }

  function runGrossToNet(){
    const factor=multiplier();
    const fields=['salary','tips','commissions','otherIncome'];
    const original={};
    fields.forEach(id=>{original[id]=$(id).value;$(id).value=(Number(String(original[id]||0).replace(/,/g,''))||0)*factor});
    const ok=originalCalculate();
    const values=readResult();
    fields.forEach(id=>{$(id).value=original[id]});
    if(ok)renderPeriod(values);
    return ok;
  }

  function runNetToGross(){
    const target=(Number(String($('salary').value||0).replace(/,/g,''))||0)*multiplier();
    if(target<=0){$('salary').focus();return false}
    const saved={salary:$('salary').value,tips:$('tips').value,commissions:$('commissions').value,other:$('otherIncome').value};
    $('tips').value=0;$('commissions').value=0;$('otherIncome').value=0;
    let low=0,high=Math.max(target*2,1000),result=null;
    for(let guard=0;guard<20;guard++){ $('salary').value=high; originalCalculate(); if(parseMoney($('net').textContent)>=target)break; high*=2; }
    for(let i=0;i<42;i++){
      const mid=(low+high)/2;$('salary').value=mid;originalCalculate();
      const current=parseMoney($('net').textContent);
      if(current<target)low=mid;else high=mid;
    }
    $('salary').value=high;originalCalculate();result=readResult();
    $('salary').value=saved.salary;$('tips').value=saved.tips;$('commissions').value=saved.commissions;$('otherIncome').value=saved.other;
    renderPeriod(result);
    if($('inverseGross')) $('inverseGross').textContent=format(result.gross/multiplier());
    return true;
  }

  window.calculate=function(){return selectedMode==='net-to-gross'?runNetToGross():runGrossToNet()};

  document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('input[name="period"]').forEach(input=>input.addEventListener('change',e=>{selectedPeriod=e.target.value;setPeriodLabels()}));
    document.querySelectorAll('input[name="mode"]').forEach(input=>input.addEventListener('change',e=>{selectedMode=e.target.value;setPeriodLabels()}));
    const form=$('payrollForm');
    if(form) form.addEventListener('reset',()=>syncOptionalIncomeRows());
    syncOptionalIncomeRows();
    setPeriodLabels();
  });
})();
