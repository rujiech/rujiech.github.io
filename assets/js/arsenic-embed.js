const frame=document.querySelector('.portfolio-map');
window.addEventListener('message',event=>{if(event.origin!==location.origin||event.source!==frame.contentWindow||event.data?.type!=='arsenic-map-height')return;const height=Number(event.data.height);if(Number.isFinite(height)&&height>=500&&height<=5000)frame.style.height=height+'px';});
