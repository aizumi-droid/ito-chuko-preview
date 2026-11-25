/* Motion Prompt references: #074, #079, #082, #086, #145 and #150.
   Native DOM implementation, no animation dependency or scroll interception. */
window.ItoPolish=(()=>{
  let observer=null, history=null, historyRows=[], navItems=[], progress=null;
  const preference=window.matchMedia('(prefers-reduced-motion: reduce)');
  const clamp=n=>Math.max(0,Math.min(1,n));
  function init(){
    observer?.disconnect();
    history=null;historyRows=[];navItems=[];progress=null;
    const root=document.querySelector('#main');
    const selectors='.interior-mast-row,.interior-heading,.lp-section-head,.lp-about-copy,.lp-learning-copy,.interview-section-heading,.lp-outline-heading,.lp-entry-top,.catalogue-resource-card';
    root.querySelectorAll(selectors).forEach(el=>el.classList.add('reveal'));
    ['.featured-products','.interview-grid','.locations-grid'].forEach(selector=>{
      root.querySelectorAll(`${selector}>*`).forEach((el,i)=>{
        el.classList.add('reveal');el.style.setProperty('--reveal-delay',`${i%4*65}ms`);
      });
    });
    root.querySelectorAll('.machining-photo,.people-photo,.lp-team-photo,.lp-training-photo,.custom-consultation-photo').forEach(el=>{
      el.classList.remove('reveal');el.classList.add('photo-reveal');
    });
    const targets=[...root.querySelectorAll('.reveal,.photo-reveal')];
    if(!preference.matches&&'IntersectionObserver' in window){
      observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
        if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target);}
      }),{threshold:0,rootMargin:'0px 0px -32px 0px'});
      targets.forEach(el=>{
        // Already visible content renders immediately; only below-fold content enters.
        if(el.getBoundingClientRect().top<window.innerHeight-32)el.classList.add('visible');
        el.classList.add('motion-ready');observer.observe(el);
      });
    }else targets.forEach(el=>el.classList.add('visible'));
    history=root.querySelector('.history-editorial');
    if(history){
      const line=document.createElement('span');line.className='history-track';line.setAttribute('aria-hidden','true');history.prepend(line);
      historyRows=[...history.querySelectorAll('article')];
    }
    const header=root.querySelector('.lp-header');
    if(header){
      progress=document.createElement('span');progress.className='lp-reading-progress';progress.setAttribute('aria-hidden','true');header.append(progress);
      navItems=[...header.querySelectorAll('[data-scroll]')].map(link=>({link,section:document.getElementById(link.dataset.scroll)})).filter(x=>x.section);
    }
    update();
    document.fonts?.ready.then(update);
  }
  function update(){
    if(history&&historyRows.length){
      // The rule starts and ends at marker centers, independent of copy height.
      const rect=history.getBoundingClientRect();
      const markerCenter=parseFloat(getComputedStyle(history).getPropertyValue('--history-dot-center'));
      const centers=historyRows.map(el=>el.getBoundingClientRect().top-rect.top+markerCenter);
      const start=centers[0];
      const length=Math.max(0,centers.at(-1)-start);
      const position=window.innerHeight*.64-rect.top;
      history.style.setProperty('--history-track-top',`${start}px`);
      history.style.setProperty('--history-track-height',`${length}px`);
      history.style.setProperty('--history-progress',preference.matches?'1':String(clamp((position-start)/Math.max(1,length))));
      historyRows.forEach((el,i)=>el.classList.toggle('is-passed',preference.matches||centers[i]<=position));
    }
    if(progress){
      const total=document.documentElement.scrollHeight-window.innerHeight;
      progress.style.setProperty('--reading-progress',String(clamp(window.scrollY/Math.max(1,total))));
      const sections=[...new Set(navItems.map(x=>x.section))].sort((a,b)=>a.offsetTop-b.offsetTop);
      const active=sections.filter(el=>el.getBoundingClientRect().top<window.innerHeight*.4).at(-1);
      navItems.forEach(({link,section})=>{if(section===active)link.setAttribute('aria-current','location');else link.removeAttribute('aria-current');});
    }
  }
  preference.addEventListener('change',()=>{
    if(preference.matches){observer?.disconnect();document.querySelectorAll('.motion-ready').forEach(el=>el.classList.add('visible'));}
    update();
  });
  return{init,update};
})();
