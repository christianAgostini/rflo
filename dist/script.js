const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('nav');menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Cerrar menú':'Abrir menú')});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));document.getElementById('legal-open').addEventListener('click',()=>document.getElementById('legal-dialog').showModal());document.querySelectorAll('dialog').forEach(d=>{d.querySelector('.close').addEventListener('click',()=>d.close());d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)d.close()}})});document.getElementById('contact-form').addEventListener('submit',e=>{e.preventDefault();const data=new FormData(e.currentTarget);const body=`Nombre: ${data.get('name')}\nTeléfono: ${data.get('phone')||'No indicado'}\nCorreo: ${data.get('email')}\n\n${data.get('message')}`;window.location.href=`mailto:cservice@orf-law.com?subject=${encodeURIComponent('Consulta desde el website de RFLO')}&body=${encodeURIComponent(body)}`;document.getElementById('form-status').textContent='Mensaje preparado. Revise su aplicación de correo y pulse Enviar. Si no se abre, escriba a cservice@orf-law.com.'});document.getElementById('year').textContent=new Date().getFullYear();

// Progressive enhancement: content stays visible if animation is unavailable.
(() => {
  const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!('IntersectionObserver' in window) || !Element.prototype.animate) return;

  const targets = document.querySelectorAll([
    '.hero-copy > .eyebrow',
    '.hero-copy > h1',
    '.hero-copy > .intro',
    '.hero-art',
    '.about > div',
    '.section-heading',
    '.service-grid > article',
    '.statement > p',
    '.statement > span',
    '.team-grid > article',
    '.payments-heading',
    '.contact-details > .eyebrow',
    '.contact-details > h2',
    '.addresses > div'
  ].join(', '));
  const activeAnimations = new Set();
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(({ target, isIntersecting }) => {
      if (!isIntersecting) return;
      observer.unobserve(target);
      if (motionPreference.matches || target.contains(document.activeElement)) return;

      const grid = target.parentElement;
      const isGridCard = grid.matches('.service-grid, .team-grid');
      const columnCount = window.innerWidth <= 760 ? 1 : grid.matches('.team-grid') ? 3 : 2;
      const column = isGridCard ? Array.from(grid.children).indexOf(target) % columnCount : 0;
      const animation = target.animate([
        { opacity: 0, transform: 'translateY(24px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], {
        duration: 950,
        delay: column * 140,
        easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        fill: 'backwards'
      });
      activeAnimations.add(animation);
      const revealOnFocus = () => animation.cancel();
      target.addEventListener('focusin', revealOnFocus);
      const cleanUp = () => {
        activeAnimations.delete(animation);
        target.removeEventListener('focusin', revealOnFocus);
      };
      animation.onfinish = cleanUp;
      animation.oncancel = cleanUp;
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -24px 0px' });

  targets.forEach((target) => observer.observe(target));
  motionPreference.addEventListener('change', ({ matches }) => {
    if (matches) activeAnimations.forEach((animation) => animation.cancel());
  });
})();
