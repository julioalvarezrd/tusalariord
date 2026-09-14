(()=>{
  const $=id=>document.getElementById(id);
  const parseMoney=text=>Number(String(text||'').replace(/[^0-9.-]/g,''))||0;
  const format=n=>n.toLocaleString('es-DO',{style:'currency',currency:'DOP'});
  const originalCalculate=window.calculate;
  const moneyIds=['net','gross','rSalary','rTips','rCommissions','rOther','afp','sfs','isr','deductions','tssBase','isrBase','fortnight'];
  const optionalIncomeRows=['rCommissions','rTips','rOther'];
  let selectedMode='gross-to-net';

  function setLabels(){
    $('salaryLabel').textContent=selectedMode==='net-to-gross'?'Neto mensual deseado':'Salario base mensual';
    $('resultPeriod').textContent='mensual';
    $('calculateButton').textContent=selectedMode==='net-to-gross'?'Calcular salario bruto':'Calcular salario neto';
    $('extraIncomeFields').hidden=selectedMode==='net-to-gross';
    $('inverseHint').hidden=selectedMode!=='net-to-gross';
  }

  function readResult(){return Object.fromEntries(moneyIds.map(id=>[id,parseMoney($(id)?.textContent)]))}

  function syncOptionalIncomeRows(values={}){
    optionalIncomeRows.forEach(id=>{
      const value=Number(values[id]||0),row=$(id)?.closest('p');
      if(!row)return;
      const hide=value<=0;
      row.classList.toggle('optional-income-hidden',hide);
      row.hidden=hide;
      row.setAttribute('aria-hidden',hide?'true':'false');
    });
  }

  function render(values){
    moneyIds.forEach(id=>{if($(id)&&id!=='fortnight')$(id).textContent=format(values[id]||0)});
    if($('fortnight'))$('fortnight').textContent=format((values.net||0)/2);
    syncOptionalIncomeRows(values);
    const gross=values.gross||0,net=values.net||0,deductions=values.deductions||0;
    const netPct=gross>0?Math.max(0,Math.min(100,net/gross*100)):0,dedPct=gross>0?Math.max(0,Math.min(100,deductions/gross*100)):0;
    if($('netBar'))$('netBar').style.width=`${netPct}%`;
    if($('deductionsBar'))$('deductionsBar').style.width=`${dedPct}%`;
    if($('grossPercent'))$('grossPercent').textContent=`${netPct.toFixed(1)}% neto`;
    if($('deductionPercent'))$('deductionPercent').textContent=`${dedPct.toFixed(1)}% descuentos`;
    if($('afpBase'))$('afpBase').textContent=format(Math.min(values.tssBase||0,464460));
    if($('sfsBase'))$('sfsBase').textContent=format(Math.min(values.tssBase||0,232230));
  }

  function runGrossToNet(){
    const ok=originalCalculate();
    if(ok)render(readResult());
    return ok;
  }

  function runNetToGross(){
    const target=Number(String($('salary').value||0).replace(/,/g,''))||0;
    if(target<=0){$('salary').focus();return false}
    const saved={salary:$('salary').value,tips:$('tips').value,commissions:$('commissions').value,other:$('otherIncome').value};
    $('tips').value=0;$('commissions').value=0;$('otherIncome').value=0;
    let low=0,high=Math.max(target*2,1000),result=null;
    for(let guard=0;guard<20;guard++){$('salary').value=high;originalCalculate();if(parseMoney($('net').textContent)>=target)break;high*=2}
    for(let i=0;i<42;i++){const mid=(low+high)/2;$('salary').value=mid;originalCalculate();parseMoney($('net').textContent)<target?low=mid:high=mid}
    $('salary').value=high;originalCalculate();result=readResult();
    $('salary').value=saved.salary;$('tips').value=saved.tips;$('commissions').value=saved.commissions;$('otherIncome').value=saved.other;
    render(result);
    if($('inverseGross'))$('inverseGross').textContent=format(result.gross);
    return true;
  }

  window.calculate=function(){return selectedMode==='net-to-gross'?runNetToGross():runGrossToNet()};
  document.addEventListener('DOMContentLoaded',()=>{
    document.querySelectorAll('input[name="mode"]').forEach(input=>input.addEventListener('change',e=>{selectedMode=e.target.value;setLabels()}));
    const form=$('payrollForm');if(form)form.addEventListener('reset',()=>syncOptionalIncomeRows());
    syncOptionalIncomeRows();setLabels();
  });
})();