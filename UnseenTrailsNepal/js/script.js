/* =========================================================
   Unseen Trails — script.js
   Live search · Scroll effects · Nav · Reveal animations
   ========================================================= */

'use strict';

/* ── Destination data for live search ── */
const DESTINATIONS = [
  {
    slug: 'ilam',
    name: 'Ilam',
    region: 'Province No. 1 · Eastern Nepal',
    tag: 'Tea Gardens',
    image: 'https://images.unsplash.com/photo-1559628233-100c798642d0?w=120&q=70',
    keywords: ['tea','gardens','eastern','hills','mist','himalaya']
  },
  {
    slug: 'janakpur',
    name: 'Janakpur',
    region: 'Madhesh Province · Southern Nepal',
    tag: 'Sacred City',
    image: 'https://images.unsplash.com/photo-1604608672516-5b1e94df3f2e?w=120&q=70',
    keywords: ['temple','culture','mithila','art','sacred','religion']
  },
  {
    slug: 'koshi-tappu',
    name: 'Koshi Tappu',
    region: 'Province No. 1 · Wetlands',
    tag: 'Wildlife Reserve',
    image: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?w=120&q=70',
    keywords: ['wildlife','birds','wetland','safari','buffalo','river']
  },
  {
    slug: 'kanchenjunga',
    name: 'Kanchenjunga',
    region: 'Province No. 1 · Far Eastern Nepal',
    tag: 'Mountain Trek',
    image: 'https://images.unsplash.com/photo-1533130061792-64b345e4a833?w=120&q=70',
    keywords: ['mountain','trek','adventure','peak','himalaya','glacier']
  }
];

/* ════════════════════════════════════════════
   DOM READY
   ════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroSearch();
  initCardSearch();
  initScrollReveal();
  initCardAnimations();
  initMapSection();
});

/* ════════════════════════════════════════════
   NAVBAR
   ════════════════════════════════════════════ */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  const burger = document.querySelector('.nav-burger');
  const mobileMenu = document.querySelector('.nav-mobile');
  if (!navbar) return;

  /* Scroll shadow */
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Hamburger */
  if (burger && mobileMenu) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    /* Close when link clicked */
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* Active link highlighting based on current page */
  const page = window.location.pathname.split('/').pop() || 'index.php';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href === page || (page === '' && href === 'index.php')) {
      a.classList.add('active');
    } else {
      a.classList.remove('active');
    }
  });
}

/* ════════════════════════════════════════════
   HERO SEARCH (dropdown autocomplete)
   ════════════════════════════════════════════ */
function initHeroSearch() {
  const input = document.getElementById('hero-search-input');
  const btn   = document.getElementById('hero-search-btn');
  const dropdown = document.getElementById('search-dropdown');
  if (!input || !dropdown) return;

  let selected = null;

  const renderDropdown = (query) => {
    const q = query.toLowerCase().trim();
    if (!q) { closeDropdown(); return; }

    const results = DESTINATIONS.filter(d =>
      d.name.toLowerCase().includes(q) ||
      d.region.toLowerCase().includes(q) ||
      d.tag.toLowerCase().includes(q) ||
      d.keywords.some(k => k.includes(q))
    );

    if (results.length === 0) {
      dropdown.innerHTML = `<div class="search-no-results">No destinations found for "<strong>${escHtml(query)}</strong>"</div>`;
    } else {
      dropdown.innerHTML = results.map(d => `
        <div class="search-result-item" data-slug="${d.slug}" role="option" tabindex="0">
          <img class="search-result-img" src="${d.image}" alt="${escHtml(d.name)}" loading="lazy">
          <div>
            <div class="search-result-name">${d.name}</div>
            <div class="search-result-sub">${d.tag} · ${d.region}</div>
          </div>
        </div>
      `).join('');

      dropdown.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
          window.location.href = `destination.php?place=${item.dataset.slug}`;
        });
        item.addEventListener('keydown', e => {
          if (e.key === 'Enter') window.location.href = `destination.php?place=${item.dataset.slug}`;
        });
      });
    }
    openDropdown();
  };

  input.addEventListener('input', () => renderDropdown(input.value));
  input.addEventListener('focus', () => { if (input.value) renderDropdown(input.value); });

  document.addEventListener('click', e => {
    if (!e.target.closest('.hero-search-wrapper')) closeDropdown();
  });

  if (btn) {
    btn.addEventListener('click', () => {
      const q = input.value.trim().toLowerCase();
      const match = DESTINATIONS.find(d =>
        d.name.toLowerCase().includes(q) || d.tag.toLowerCase().includes(q)
      );
      if (match) window.location.href = `destination.php?place=${match.slug}`;
      else if (q) {
        /* Scroll to card section and filter */
        const section = document.getElementById('destinations-section');
        if (section) { section.scrollIntoView({ behavior: 'smooth' }); filterCards(q); }
      }
    });
  }

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter') btn && btn.click();
  });

  function openDropdown()  { dropdown.classList.add('open'); }
  function closeDropdown() { dropdown.classList.remove('open'); }
}

/* ════════════════════════════════════════════
   CARD SEARCH / LIVE FILTER
   ════════════════════════════════════════════ */
function initCardSearch() {
  const filterInput = document.getElementById('filter-input');
  if (!filterInput) return;
  filterInput.addEventListener('input', () => filterCards(filterInput.value));
}

function filterCards(query) {
  const q = query.toLowerCase().trim();
  const cards = document.querySelectorAll('.dest-card[data-keywords]');
  let visible = 0;

  cards.forEach(card => {
    const kw = card.dataset.keywords || '';
    const matches = !q || kw.toLowerCase().includes(q);
    card.style.display = matches ? '' : 'none';
    if (matches) visible++;
  });

  const noRes = document.getElementById('no-results');
  if (noRes) noRes.style.display = visible === 0 ? '' : 'none';
}

/* ════════════════════════════════════════════
   SCROLL REVEAL
   ════════════════════════════════════════════ */
function initScrollReveal() {
  const els = document.querySelectorAll('.reveal, .reveal-left');
  if (!els.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        /* Stagger siblings in same parent */
        const siblings = [...e.target.parentElement.querySelectorAll('.reveal,.reveal-left')];
        const idx = siblings.indexOf(e.target);
        setTimeout(() => e.target.classList.add('visible'), idx * 80);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
}

/* ════════════════════════════════════════════
   CARD MICRO-ANIMATIONS (stagger on page load)
   ════════════════════════════════════════════ */
function initCardAnimations() {
  const cards = document.querySelectorAll('.dest-card');
  cards.forEach((card, i) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(24px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease, box-shadow 0.35s ease, border-color 0.35s ease';
    setTimeout(() => {
      card.style.opacity = '1';
      card.style.transform = 'translateY(0)';
    }, 120 + i * 90);
  });
}

/* ════════════════════════════════════════════
   MAP SECTION
   ════════════════════════════════════════════ */
function initMapSection() {
  /* Map on destination page (Leaflet) */
  const destMapEl = document.getElementById('dest-map');
  if (destMapEl && typeof L !== 'undefined') {
    const slug = destMapEl.dataset.slug;
    initLeafletMap(destMapEl, slug);
  }

  /* Place filter buttons on homepage — pan Google Map to selected place */
  document.querySelectorAll('.map-place-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.map-place-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      /* Pan Google Map to selected place if available */
      if (window._googleMap && window._googleMapMarkers) {
        const slug = btn.dataset.slug;
        const marker = window._googleMapMarkers[slug];
        if (marker) {
          window._googleMap.panTo(marker.getPosition());
          window._googleMap.setZoom(10);
          /* Close any open info windows then open this one */
          Object.values(window._googleMapMarkers).forEach(m => {
            if (m.googleInfoWindow) m.googleInfoWindow.close();
          });
          marker.googleInfoWindow && marker.googleInfoWindow.open(window._googleMap, marker);
        }
      }
    });
  });
}

/* ── ALL destination coordinates for Leaflet maps on destination pages ── */
function initLeafletMap(el, mode) {
  const places = {
    'ilam':           { lat: 26.9115, lng: 87.9272, label: 'Ilam',               desc: 'Tea Gardens' },
    'janakpur':       { lat: 26.7288, lng: 85.9250, label: 'Janakpur',            desc: 'Sacred City' },
    'koshi-tappu':    { lat: 26.6318, lng: 87.0036, label: 'Koshi Tappu',         desc: 'Wildlife Reserve' },
    'kanchenjunga':   { lat: 27.7025, lng: 88.1475, label: 'Kanchenjunga',        desc: 'Mountain Trek' },
    'rara-lake':      { lat: 29.5258, lng: 82.0823, label: 'Rara Lake',           desc: 'Alpine Lake' },
    'khaptad':        { lat: 29.3167, lng: 81.2500, label: 'Khaptad NP',          desc: 'Sacred Plateau' },
    'tsho-rolpa':     { lat: 27.8702, lng: 86.4708, label: 'Tsho Rolpa Lake',     desc: 'Glacial Lake' },
    'bardia':         { lat: 28.3167, lng: 81.4833, label: 'Bardia NP',           desc: 'Jungle Safari' },
    'upper-mustang':  { lat: 29.1773, lng: 83.9597, label: 'Upper Mustang',       desc: 'Forbidden Kingdom' },
    'dolpo':          { lat: 29.1500, lng: 82.9500, label: 'Dolpo',               desc: 'Hidden Valley' },
    'phoksundo-lake': { lat: 29.1800, lng: 82.9400, label: 'Phoksundo Lake',      desc: 'Deepest Lake' },
    'gosaikunda':     { lat: 28.0947, lng: 85.4167, label: 'Gosaikunda Lake',     desc: 'Sacred Lake' },
    'pathibhara':     { lat: 27.7167, lng: 87.8333, label: 'Pathibhara Temple',   desc: 'Hilltop Shrine' },
    'manaslu':        { lat: 28.5500, lng: 84.5597, label: 'Manaslu Circuit',     desc: 'Mountain Circuit' },
    'shey-phoksundo': { lat: 29.0800, lng: 82.9700, label: 'Shey Phoksundo NP',  desc: 'Snow Leopard Country' },
    'api-himal':      { lat: 30.0000, lng: 80.9167, label: 'Api Himal',           desc: 'Untouched Peaks' },
    'sinja-valley':   { lat: 29.0500, lng: 82.1700, label: 'Sinja Valley',        desc: 'Ancient Capital' },
    'tsum-valley':    { lat: 28.7167, lng: 85.0667, label: 'Tsum Valley',         desc: 'Hidden Sacred Valley' },
    'nar-phu':        { lat: 28.7000, lng: 84.1333, label: 'Nar Phu Valley',      desc: 'Restricted Valley' },
    'rolwaling':      { lat: 27.8700, lng: 86.4800, label: 'Rolwaling Valley',    desc: 'Glacial Valley' },
    'halesi-mahadev': { lat: 27.4500, lng: 86.6000, label: 'Halesi Mahadev',      desc: 'Sacred Caves' },
    'bandipurr':      { lat: 27.9333, lng: 84.4167, label: 'Bandipur',            desc: 'Hilltop Town' },
    'sundarijal':     { lat: 27.7667, lng: 85.4333, label: 'Sundarijal',          desc: 'Watershed Trek' },
    'dhorpatan':      { lat: 28.5000, lng: 83.0833, label: 'Dhorpatan',           desc: 'Hunting Reserve' },
  };

  /* If the slug has no coordinates yet, fall back to centre of Nepal */
  const target = places[mode];
  if (!target) {
    /* Unknown slug: show full Nepal overview */
    const map = L.map(el, { zoomControl: false, attributionControl: false, scrollWheelZoom: false });
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { maxZoom: 18 }).addTo(map);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    map.setView([28.3, 84.1], 7);
    return;
  }

  /* Custom tile layer — CartoDB Voyager (no API key needed) */
  const map = L.map(el, {
    zoomControl: false,
    attributionControl: false,
    scrollWheelZoom: false,
  });

  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    maxZoom: 18,
  }).addTo(map);

  L.control.zoom({ position: 'bottomright' }).addTo(map);

  /* Custom green marker icon */
  const icon = L.divIcon({
    className: '',
    html: `
      <div style="
        background:#1a6b4a;
        color:#fff;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        width:36px;height:36px;
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 4px 16px rgba(26,107,74,0.45);
        border:2.5px solid #fff;
      ">
        <svg style="transform:rotate(45deg)" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
      </div>`,
    iconSize:    [36, 36],
    iconAnchor:  [18, 36],
    popupAnchor: [0, -40],
  });

  const marker = L.marker([target.lat, target.lng], { icon }).addTo(map);

  marker.bindPopup(`
    <div style="font-family:Poppins,sans-serif;min-width:140px;padding:0.3rem 0">
      <div style="font-size:0.88rem;font-weight:700;color:#1a1f2e;margin-bottom:2px">${target.label}</div>
      <div style="font-size:0.72rem;color:#8892a4">${target.desc}</div>
      <a href="destination.php?place=${mode}" style="
        display:inline-block;margin-top:8px;
        background:#1a6b4a;color:#fff;
        font-size:0.72rem;font-weight:600;
        padding:4px 12px;border-radius:20px;text-decoration:none;
      ">Explore →</a>
    </div>`, { maxWidth: 200 });

  map.setView([target.lat, target.lng], 11);

  /* Open popup after a short delay so the map finishes rendering */
  setTimeout(() => marker.openPopup(), 600);
}

/* ════════════════════════════════════════════
   BOOKING FORM (page-level)
   ════════════════════════════════════════════ */
function initBookingForm() {
  const form    = document.getElementById('booking-form');
  const success = document.getElementById('booking-success');
  const errorEl = document.getElementById('form-error');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError();

    const btn = form.querySelector('.btn-submit');
    setLoading(btn, true);

    /* Client-side validation */
    const name  = form.querySelector('[name="name"]').value.trim();
    const email = form.querySelector('[name="email"]').value.trim();
    const dest  = form.querySelector('[name="destination"]').value;
    const date  = form.querySelector('[name="travel_date"]').value;

    if (!name || name.length < 2) return showError('Please enter your full name.', btn);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return showError('Please enter a valid email address.', btn);
    if (!dest) return showError('Please select a destination.', btn);
    if (!date || new Date(date) < new Date(new Date().toDateString())) return showError('Please choose a travel date from today or later.', btn);

    /* Submit via fetch to PHP */
    try {
      const formData = new FormData(form);
      const res = await fetch('booking.php', { method: 'POST', body: formData });
      const text = await res.text();

      if (text.trim() === 'SUCCESS') {
        /* Show success */
        document.getElementById('success-name').textContent = name;
        document.getElementById('success-dest').textContent = dest;
        document.getElementById('success-date').textContent = formatDate(date);
        document.getElementById('success-email').textContent = email;
        form.style.display = 'none';
        success.style.display = 'block';
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      } else {
        showError('Something went wrong. Please try again.', btn);
      }
    } catch {
      showError('Connection error. Please check your internet and try again.', btn);
    }
  });

  function setLoading(btn, on) {
    btn.classList.toggle('loading', on);
    btn.innerHTML = on
      ? `<div class="spinner"></div> Processing…`
      : `Reserve My Journey <svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>`;
  }
  function showError(msg, btn) {
    setLoading(btn, false);
    if (errorEl) { errorEl.innerHTML = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>${escHtml(msg)}`; errorEl.style.display = 'flex'; }
  }
  function hideError() { if (errorEl) errorEl.style.display = 'none'; }
  function formatDate(d) {
    const dt = new Date(d + 'T00:00:00');
    return dt.toLocaleDateString('en-US', { weekday:'short', year:'numeric', month:'short', day:'numeric' });
  }
}
document.addEventListener('DOMContentLoaded', initBookingForm);

/* ════════════════════════════════════════════
   HELPERS
   ════════════════════════════════════════════ */
function escHtml(str) {
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
