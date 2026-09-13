(()=>{
let promptEvent=null;
const key='tusalariord-install-dismissed-until';
const installed=()=>window.matchMedia('(display-mode: standalone)').matches||window.navigator.standalone===true;
const ios=()=>/iphone|ipad|ipod/i.test(navigator.userAgent);
const hidden=()=>Number(localStorage.getItem(key)||0)>Date.now();
function closePrompt(){localStorage.setItem(key,String(Date.now()+7*86400000));document.getElementById('installBanner')?.remove();}
window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();promptEvent=e;setTimeout(showPrompt,1800);});
window.addEventListener('appinstalled',()=>document.getElementById('installBanner')?.remove());
async function installApp(){if(promptEvent){promptEvent.prompt();await promptEvent.userChoice.catch(()=>null);promptEvent=null;document.getElementById('installBanner')?.remove();return;}const help=document.getElementById('iosInstallHelp');if(help)help.hidden=false;}
function showPrompt(){if(installed()||hidden()||document.getElementById('installBanner'))return;const box=document.createElement('aside');box.id='installBanner';box.className='install-banner';box.innerHTML='<div class="install-copy"><strong>Instala Tu Salario RD</strong><p>Ten la calculadora disponible como una app desde tu pantalla de inicio.</p><p id="iosInstallHelp" class="ios-install-help" hidden>En iPhone o iPad: toca Compartir y luego Añadir a pantalla de inicio.</p></div><div class="install-actions"><button id="installAppButton" class="install-primary" type="button">Instalar</button><button id="installLaterButton" class="install-later" type="button">Ahora no</button></div>';document.body.appendChild(box);document.getElementById('installAppButton').onclick=installApp;document.getElementById('installLaterButton').onclick=closePrompt;}
document.addEventListener('DOMContentLoaded',()=>{if(ios()&&!installed()&&!hidden())setTimeout(showPrompt,2200);});
})();
