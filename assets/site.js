(() => {
  const trigger = document.querySelector('.command-trigger');
  const dialog = document.querySelector('#command-palette');
  if (!trigger || !dialog || typeof dialog.showModal !== 'function') { if(trigger) trigger.hidden=true; return; }
  const input = dialog.querySelector('input');
  const links = [...dialog.querySelectorAll('.palette-results a')];
  const empty = dialog.querySelector('.palette-empty');
  const filter = () => { const q=input.value.trim().toLowerCase(); links.forEach(a=>a.hidden=!a.textContent.toLowerCase().includes(q)); empty.hidden=links.some(a=>!a.hidden); };
  const open = () => { if(dialog.open) return; input.value=''; filter(); dialog.showModal(); input.focus(); };
  trigger.addEventListener('click',open);
  dialog.querySelector('.palette-close').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('click',event=>{if(event.target===dialog){const r=dialog.getBoundingClientRect(); if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)dialog.close();}});
  input.addEventListener('input',filter);
  input.addEventListener('keydown',event=>{if(event.key==='ArrowDown'||event.key==='Enter'){const first=links.find(a=>!a.hidden);if(first){event.preventDefault();if(event.key==='Enter')first.click();else first.focus();}}});
  dialog.addEventListener('keydown',event=>{if(!['ArrowDown','ArrowUp'].includes(event.key)||event.target===input)return; const visible=links.filter(a=>!a.hidden);const index=visible.indexOf(document.activeElement);if(index<0)return;event.preventDefault();const next=index+(event.key==='ArrowDown'?1:-1);if(next<0)input.focus();else visible[next%visible.length].focus();});
  document.addEventListener('keydown',event=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'){event.preventDefault();dialog.open?dialog.close():open();}});
})();