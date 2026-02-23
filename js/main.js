import { SITE } from './data.js';

const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const $ = (sel, root=document) => root.querySelector(sel);

function parseDate(s){
  // Supports formats like 'Feb 22, 2026'
  const d = new Date(s);
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

function setText(id, value){ const el = $(id); if(el) el.textContent = value; }

function perViewDefault(){
  const w = window.innerWidth;
  if (w >= 1120) return 3;
  if (w >= 820) return 2;
  return 1;
}

function makeSlider({trackId, prevId, nextId, dotsId, perView=perViewDefault}){
  const track = $(trackId);
  const prev = $(prevId);
  const next = $(nextId);
  const dots = $(dotsId);
  if(!track) return { setItems(){}, refresh(){} };

  let page = 0;

  function pageCount(){
    const pv = perView();
    return Math.max(1, Math.ceil(track.children.length / pv));
  }

  function renderDots(){
    if(!dots) return;
    const pages = pageCount();
    dots.innerHTML = '';
    for(let i=0;i<pages;i++){
      const b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', `Go to page ${i+1}`);
      b.setAttribute('aria-current', i===page ? 'true' : 'false');
      b.addEventListener('click', ()=>{ page=i; apply(); });
      dots.appendChild(b);
    }
  }

  function stepPx(){
    const first = track.children[0];
    if(!first) return 0;
    const r = first.getBoundingClientRect();
    const gap = parseFloat(getComputedStyle(track).gap || '0');
    return r.width + gap;
  }

  // function apply(){
  //   const pv = perView();
  //   const pages = pageCount();
  //   page = Math.max(0, Math.min(page, pages-1));
  //   const dx = stepPx() * (page * pv);
  //   track.style.transform = `translateX(${-dx}px)`;
  //   if(prev) prev.disabled = page===0;
  //   if(next) next.disabled = page===pages-1;
  //   if(dots){
  //     [...dots.children].forEach((el,i)=>el.setAttribute('aria-current', i===page ? 'true':'false'));
  //   }
  // }

  function apply(){
    const pv = perView();
    const pages = pageCount();
    page = Math.max(0, Math.min(page, pages - 1));

    // ✅ Hide controls when there is only one page (no scrolling needed)
    const hideControls = pages <= 1;
    if (prev) prev.style.display = hideControls ? 'none' : 'grid';
    if (next) next.style.display = hideControls ? 'none' : 'grid';
    if (dots) dots.style.display = hideControls ? 'none' : 'flex';

    const dx = stepPx() * (page * pv);
    track.style.transform = `translateX(${-dx}px)`;

    if (prev) prev.disabled = page === 0;
    if (next) next.disabled = page === pages - 1;

    if (dots){
      [...dots.children].forEach((el, i) =>
       el.setAttribute('aria-current', i === page ? 'true' : 'false')
      );
    }
  }

  function bind(){
    if(prev) prev.addEventListener('click', ()=>{ page--; apply(); });
    if(next) next.addEventListener('click', ()=>{ page++; apply(); });
    window.addEventListener('resize', ()=>{ renderDots(); apply(); });
  }
  bind();

  return {
    setItems(){
      page = 0;
      renderDots();
      // allow layout settle
      requestAnimationFrame(()=>apply());
      setTimeout(()=>apply(), 120);
    },
    refresh(){
      renderDots();
      apply();
    }
  };
}
function setHref(id, value){ const el = $(id); if(el) el.href = value; }
function setSrc(id, value){ const el = $(id); if(el) el.src = value; }

function icon(path, label){
  const a = document.createElement('a');
  a.className = 'iconbtn';
  a.href = path.href;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.setAttribute('aria-label', label);
  const img = document.createElement('img');
  img.src = path.icon;
  img.alt = label;
  a.appendChild(img);
  return a;
}

function buildSocialBar(container){
  const icons = {
    linkedin: { icon: 'assets/img/logos/social/linkedin.svg', href: SITE.profile.social.linkedin, label:'LinkedIn' },
    medium: { icon: 'assets/img/logos/social/medium.svg', href: SITE.profile.social.medium, label:'Medium' },
    goodreads: { icon: 'assets/img/logos/social/goodreads.svg', href: SITE.profile.social.goodreads, label:'Goodreads' },
    instagram: { icon: 'assets/img/logos/social/instagram.svg', href: SITE.profile.social.instagram, label:'Instagram' },
    telegram: { icon: 'assets/img/logos/social/telegram.svg', href: SITE.profile.social.telegram, label:'Telegram' }
  };
  container.innerHTML = '';
  Object.values(icons).forEach(i => container.appendChild(icon(i, i.label)));
}

function renderHero(){
  
  setText('#heroName', SITE.profile.name);
  setText('#heroRole', SITE.profile.designation);
  setText('#heroTagline', SITE.profile.tagline);
  setText('#heroLocation', SITE.profile.location);
  setSrc('#heroPhoto', SITE.profile.photo);

  const resumeA = $('#resumeBtn');
  resumeA.href = SITE.profile.resume;
  // resumeA.setAttribute('download', '');
  resumeA.target = '_blank';
  resumeA.rel = 'noopener noreferrer';

  buildSocialBar($('#heroSocial'));
}

function renderAbout(){
  const gr = $('#goodreadsLink');
  if(gr){ gr.href = SITE.profile.social.goodreads; }

  setText('#aboutText', SITE.about.intro);
  setText('#readingTitle', SITE.about.reading.title);
  setText('#readingAuthor', `by ${SITE.about.reading.author}`);
  setSrc('#readingImage', SITE.about.reading.image);
}


function renderJourney(){
  const track = $('#journeyTrack');
  if(!track) return;
  track.innerHTML = '';

  SITE.journey.forEach(j => {
    const card = document.createElement('article');
    card.className = 'journey-card';
    const company = (j.company ?? j.org ?? '');
const role = (j.role ?? '');
const location = (j.location ?? j.place ?? '');
const dates = (j.dates ?? ((j.start || j.end) ? `${j.start || ''}${(j.start && j.end) ? ' — ' : ''}${j.end || ''}` : ''));
const logo = (j.logo ?? '');
const meta = (location || dates)
  ? `<div class="journey-meta">${location ? `<div>${location}</div>` : ''}${dates ? `<div>${dates}</div>` : ''}</div>`
  : '';
card.innerHTML = `
  <div class="journey-top">
    <div class="journey-logo">${logo ? `<img src="${logo}" alt="${company} logo" onerror="this.style.display='none'">` : ''}</div>
    <div>
      <h3 class="journey-role">${role}</h3>
      <div class="journey-company">${company}</div>
    </div>
  </div>
  ${meta}
`;
    track.appendChild(card);
  });

  const slider = makeSlider({
    trackId: '#journeyTrack',
    prevId: '#journeyPrev',
    nextId: '#journeyNext',
    dotsId: '#journeyDots',
    perView: ()=> (window.innerWidth >= 920 ? 2 : 1)
  });
  slider.setItems();
}

// function renderStack(){
//   const root = $('#stackRoot');
//   if(!root) return;
//   root.innerHTML = '';
//   Object.entries(SITE.stack).forEach(([group, items]) => {
//     const textOnly = (group || '').toLowerCase() === 'ai/ml ecosystem'.toLowerCase();
//     const box = document.createElement('div');
//     box.className = 'card stack-group';
//     box.innerHTML = `<h3>${group}</h3>`;

//     const grid = document.createElement('div');
//     grid.className = 'icon-grid';

//     (items || []).forEach(t => {
//       const el = document.createElement('div');
//       const hasIcon = Boolean(t && t.icon) && !textOnly;
//       el.className = `tech${hasIcon ? '' : ' noicon'}`;

//       const imgHtml = hasIcon
//         ? `<img src="${t.icon}" alt="${t.name} icon" onerror="this.style.display='none'">`
//         : '';

//       el.innerHTML = `${imgHtml}<span>${t.name}</span>`;
//       grid.appendChild(el);
//     });

//     box.appendChild(grid);
//     root.appendChild(box);
//   });
// }
function renderStack(){
  const tabsRoot = $('#stackTabs');
  const panel = $('#stackPanel');
  if(!tabsRoot || !panel) return;

  const groups = Object.entries(SITE.stack);
  if(!groups.length) return;

  tabsRoot.innerHTML = '';

  function renderGroup(groupName, items){
    const textOnly = (groupName || '').toLowerCase() === 'ai/ml ecosystem'.toLowerCase();

    panel.innerHTML = `<h3>${groupName}</h3>`;
    const grid = document.createElement('div');
    grid.className = 'icon-grid';

    (items || []).forEach(t => {
      const el = document.createElement('div');
      const hasIcon = Boolean(t && t.icon) && !textOnly;
      el.className = `tech${hasIcon ? '' : ' noicon'}`;

      const imgHtml = hasIcon
        ? `<img src="${t.icon}" alt="${t.name} icon" onerror="this.style.display='none'">`
        : '';

      el.innerHTML = `${imgHtml}<span>${t.name}</span>`;
      grid.appendChild(el);
    });

    panel.appendChild(grid);
  }

  function setActive(btn){
    [...tabsRoot.querySelectorAll('.stack-tab')].forEach(b => {
      b.setAttribute('aria-selected', b === btn ? 'true' : 'false');
      b.tabIndex = b === btn ? 0 : -1;
    });
  }

  groups.forEach(([groupName, items], idx) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'stack-tab';
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
    btn.tabIndex = idx === 0 ? 0 : -1;
    btn.textContent = groupName;

    btn.addEventListener('click', () => {
      setActive(btn);
      renderGroup(groupName, items);
    });

    tabsRoot.appendChild(btn);
  });

  // Initial render
  const [firstName, firstItems] = groups[0];
  renderGroup(firstName, firstItems);
}

function linkedinButton(){
  const a = document.createElement('a');
  a.className = 'btn primary linkedin-btn';
  a.href = SITE.credentials.linkedinCerts;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.innerHTML = `<img src="assets/img/logos/social/linkedin.svg" alt="LinkedIn"> View on LinkedIn`;
  return a;
}

function renderCredentials(){
  const slot = $('#credentialsSlot');
  slot.innerHTML = '';
  slot.appendChild(linkedinButton());
}

function renderTalks(){
  const track = $('#talksTrack');
  if(!track) return;
  track.innerHTML = '';

  // setText('#talksCount', SITE.talks.length);
  const talksCount = $('#talksCount');
  if (talksCount){
    const v = talksCount.querySelector('.counter-value');
    if (v) v.textContent = SITE.talks.length;
  }

  SITE.talks.forEach(t => {
    const card = document.createElement('article');
    card.className = 'card media-card';
    const canEmbed = t.embed && t.embed.includes('http');
    card.innerHTML = `
      <div class="media-cover">
        ${canEmbed ? `<iframe class="media-embed" src="${t.embed}" title="${t.title}" loading="lazy" referrerpolicy="no-referrer" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>` : `<img src="${t.cover}" alt="${t.title} cover">`}
      </div>
      <div class="media-body">
        <h3 class="media-title">${t.title}</h3>
        <div class="meta">${t.hostedBy}</div>
        <div class="meta">${t.date}</div>
        <a class="btn" href="${t.link}" target="_blank" rel="noreferrer">Open Event</a>
      </div>
    `;
    track.appendChild(card);
  });

  const slider = makeSlider({ trackId:'#talksTrack', prevId:'#talksPrev', nextId:'#talksNext', dotsId:'#talksDots' });
  slider.setItems();
}

function renderWritings(){
  const track = $('#writingsTrack');
  if(!track) return;
  track.innerHTML = '';

  const sorted = SITE.writings.slice().sort((a,b)=>parseDate(b.date)-parseDate(a.date));
  // setText('#writingsCount', sorted.length);
  const writingsCount = $('#writingsCount');
  if (writingsCount){
    const v = writingsCount.querySelector('.counter-value');
    if (v) v.textContent = sorted.length;
  }

  sorted.forEach(w => {
    const card = document.createElement('article');
    card.className = 'card media-card';
    card.innerHTML = `
      <div class="media-cover"><img src="${w.cover}" alt="${w.title} cover"></div>
      <div class="media-body">
        <h3 class="media-title">${w.title}</h3>
        <div class="meta">${w.date}</div>
        <a class="btn" href="${w.link}" target="_blank" rel="noreferrer">Read</a>
      </div>
    `;
    track.appendChild(card);
  });

  const slider = makeSlider({ trackId:'#writingsTrack', prevId:'#writingsPrev', nextId:'#writingsNext', dotsId:'#writingsDots' });
  slider.setItems();
}

function renderBuilds(){
  const track = $('#buildTrack');
  if(!track) return;
  track.innerHTML = '';

  const items = (SITE.builds && SITE.builds.length) ? SITE.builds : [{
    name: 'Projects coming soon…',
    desc: 'Meanwhile, I’m iterating on a few agentic workflows and LLM-powered tools. This space is reserved for polished releases.',
    stack: ['TBD'],
    link: '#'
  }];

  // setText('#buildsCount', items.length);
  const buildsCount = $('#buildsCount');
  if (buildsCount){
    const v = buildsCount.querySelector('.counter-value');
    if (v) v.textContent = items.length;
  }

  items.forEach(p => {
    const card = document.createElement('article');
    card.className = 'card media-card';
    card.innerHTML = `
      <div class="media-body">
        <h3 class="media-title">${p.name}</h3>
        <div class="meta">${p.desc}</div>
        <div class="chips">${(p.stack||[]).map(s=>`<span class="chip">${s}</span>`).join('')}</div>
        <a class="btn" href="${p.link}" target="_blank" rel="noreferrer">Link</a>
      </div>
    `;
    track.appendChild(card);
  });

  const slider = makeSlider({ trackId:'#buildTrack', prevId:'#buildPrev', nextId:'#buildNext', dotsId:'#buildDots' });
  slider.setItems();
}

function renderAcademics(){
  const root = $('#academicsRoot');
  root.innerHTML = '';
  SITE.academics.forEach(a => {
    const item = document.createElement('div');
    item.className = 'edu-item';
    item.innerHTML = `
      <div class="card edu-card">
        <div class="edu-card-grid">
          <div class="edu-years">
            <div class="year-pill">${a.start} — ${a.end}</div>
          </div>
          <div class="edu-main">
            <div class="edu-logo"><img src="${a.logo}" alt="${a.school} logo"></div>
            <div class="edu-text">
              <h4>${a.school}</h4>
              <div class="meta">${a.degree} • ${a.spec}</div>
              <div class="meta">${a.place}</div>
            </div>
          </div>
        </div>
      </div>
    `;
    root.appendChild(item);
  });
}



function renderContact(){
  const email = SITE.profile.email;
  const phoneRaw = SITE.profile.phone;

  const emailLink = $('#emailLink');
  const phoneLink = $('#phoneLink');
  const callBtn = $('#callBtn');

  if(emailLink){
    emailLink.textContent = email;
    emailLink.href = `mailto:${email}`;
  }
  const tel = `tel:${phoneRaw.replace(/[^\d+]/g,'')}`;
  if(phoneLink){
    phoneLink.textContent = phoneRaw;
    phoneLink.href = tel;
  }
  if(callBtn){
    callBtn.href = tel;
  }

  // mailto form: include "Source: From portfolio" in body
  const form = $('#contactForm');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#cName').value.trim();
    const fromEmail = $('#cEmail').value.trim();
    const msg = $('#cMsg').value.trim();

    const subject = encodeURIComponent(`Portfolio Contact — ${name || 'Visitor'}`);
    const body = encodeURIComponent(
      `Source: From portfolio\nName: ${name}\nEmail: ${fromEmail}\n\nMessage:\n${msg}`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  });
}

function renderFooter(){
  buildSocialBar($('#footerSocial'));
  setText('#year', String(new Date().getFullYear()));
}

function setupNav(){
  const btn = $('#menuBtn');
  const links = $('#navLinks');

  btn.addEventListener('click', () => links.classList.toggle('open'));

  // close on click (mobile)
  $$('#navLinks a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));

  // active section highlighting
  const sections = $$('main section');
  const map = new Map(sections.map(s => [s.id, $(`.nav-links a[href="#${s.id}"]`)]));

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      const a = map.get(en.target.id);
      if(!a) return;
      if(en.isIntersecting){
        $$('.nav-links a').forEach(x => x.classList.remove('active'));
        a.classList.add('active');
      }
    });
  }, { rootMargin: `-${Math.floor(window.innerHeight*0.65)}px 0px -${Math.floor(window.innerHeight*0.25)}px 0px`, threshold: 0.02 });

  sections.forEach(s => obs.observe(s));
}

function setupBackToTop(){
  const b = $('#toTop');
  const toggle = () => {
    if(window.scrollY > 240) b.style.display = 'inline-flex';
    else b.style.display = 'none';
  };
  window.addEventListener('scroll', toggle, { passive:true });
  toggle();
  b.addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));
}

function setupCarousels(){
  $$('.carousel').forEach(car => {
    const scroller = $('.scroller', car);
    const prev = $('.ctrl[data-dir="prev"]', car);
    const next = $('.ctrl[data-dir="next"]', car);

    const step = () => Math.min(520, scroller.clientWidth * 0.9);

    const update = () => {
      const max = scroller.scrollWidth - scroller.clientWidth - 2;
      prev.disabled = scroller.scrollLeft <= 2;
      next.disabled = scroller.scrollLeft >= max;
    };

    const scrollBy = (dir) => scroller.scrollBy({ left: dir * step(), behavior:'smooth' });

    prev?.addEventListener('click', () => scrollBy(-1));
    next?.addEventListener('click', () => scrollBy(1));

    // mouse drag for desktop
    let isDown=false, startX=0, startScroll=0;
    scroller.addEventListener('mousedown', (e) => {
      isDown=true; startX=e.pageX; startScroll=scroller.scrollLeft;
      scroller.style.scrollBehavior = 'auto';
    });
    window.addEventListener('mouseup', () => { 
      if(!isDown) return;
      isDown=false; scroller.style.scrollBehavior = 'smooth'; 
    });
    window.addEventListener('mousemove', (e) => {
      if(!isDown) return;
      const dx = e.pageX - startX;
      scroller.scrollLeft = startScroll - dx;
      update();
    });

    scroller.addEventListener('scroll', update, { passive:true });
    window.addEventListener('resize', update, { passive:true });
    update();
  });
}

/* LinkedIn embedding is restricted; most event pages will not allow iframe embeds.
   We only embed when a safe, direct video URL is provided in the data file. */
function canEmbedLinkedIn(url){
  return false;
}
function linkedInEmbed(url){
  return null;
}

function boot(){
  renderHero();
  renderAbout();
  renderJourney();
  renderStack();
  renderCredentials();
  renderTalks();
  renderWritings();
  renderBuilds();
  renderAcademics();
  renderContact();
  renderFooter();

  setupNav();
  setupBackToTop();
  setupCarousels();
}

boot();
