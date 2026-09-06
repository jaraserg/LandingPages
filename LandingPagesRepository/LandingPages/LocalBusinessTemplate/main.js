(function () {
  'use strict';

  const CONFIG_URL = 'config.json';

  async function loadConfig() {
    try {
      const res = await fetch(CONFIG_URL, { cache: 'no-store' });
      if (!res.ok) throw new Error('No se pudo cargar config.json');
      return await res.json();
    } catch (e) {
      console.error(e);
      return null;
    }
  }

  function setText(id, text) {
    const el = document.getElementById(id);
    if (el && text != null) el.textContent = text;
  }

  function setHref(id, url) {
    const el = document.getElementById(id);
    if (el && url) el.href = url;
  }

  function setAttr(id, attr, value) {
    const el = document.getElementById(id);
    if (el && value != null) el.setAttribute(attr, value);
  }

  function applyConfig(cfg) {
    // Meta / title
    setText('page-title', cfg.business_name || 'Mi Negocio');
    setText('page-desc', cfg.description || '');
    document.title = cfg.business_name || document.title;

    // Branding
    setText('logo-text', cfg.business_name ? cfg.business_name.replace(/[^A-Z0-9]/g, '').slice(0, 12).toUpperCase() : 'MI NEGOCIO');

    // Hero
    setText('hero-title', cfg.tagline || '');
    setText('hero-desc', cfg.description || '');
    if (cfg.hero_image) setAttr('hero-bg', 'style', `background-image: url('${cfg.hero_image}');`);

    // Meta
    setText('address', cfg.address || '');
    setText('hours', cfg.hours || '');
    const phoneClean = (cfg.phone || '').replace(/[^0-9+]/g, '');
    setHref('phone-link', phoneClean ? `tel:${phoneClean}` : '#');
    setText('phone-link', cfg.phone || '');

    // Gallery
    const galleryGrid = document.getElementById('gallery-grid');
    if (galleryGrid && Array.isArray(cfg.gallery)) {
      galleryGrid.innerHTML = cfg.gallery.map((item, i) => `
        <div class="gallery-item">
          <img alt="${escapeHtml(item.caption || 'Imagen')}" src="${escapeHtml(item.url)}" loading="lazy"/>
          <span class="gallery-caption">${escapeHtml(item.caption || '')}</span>
        </div>
      `).join('');
    }

    // Menu
    const menuList = document.getElementById('menu-list');
    if (menuList && Array.isArray(cfg.menu)) {
      menuList.innerHTML = cfg.menu.map(item => `
        <div class="menu-card">
          <div class="menu-header"><h3>${escapeHtml(item.name)}</h3><span class="price">${escapeHtml(item.price || '')}</span></div>
          <p>${escapeHtml(item.desc || '')}</p>
        </div>
      `).join('');
    }

    // Contact
    setHref('contact-phone', phoneClean ? `tel:${phoneClean}` : '#');
    setText('contact-phone', cfg.phone || '');
    setHref('contact-email', cfg.email ? `mailto:${cfg.email}` : '#');
    setText('contact-email', cfg.email || '');
    setText('contact-address', cfg.address || '');

    // Social
    const socials = cfg.socials || {};
    const wa = document.querySelector('.social-btn.whatsapp');
    const ig = document.querySelector('.social-btn.instagram');
    const fb = document.querySelector('.social-btn.facebook');
    if (wa) wa.href = socials.whatsapp || '#';
    if (ig) ig.href = socials.instagram || '#';
    if (fb) fb.href = socials.facebook || '#';

    // Map
    const mapWrap = document.getElementById('map-wrap');
    if (mapWrap) {
      const iframe = mapWrap.querySelector('iframe');
      if (iframe && cfg.google_maps_url) {
        iframe.src = cfg.google_maps_url;
      }
    }

    // Form
    const form = document.getElementById('contact-form');
    const note = document.getElementById('form-note');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (note) { note.textContent = ''; note.className = 'form-note'; }
        const data = {
          name: (form.querySelector('#name') || {}).value || '',
          phone: (form.querySelector('#phone') || {}).value || '',
          email: (form.querySelector('#email') || {}).value || '',
          message: (form.querySelector('#message') || {}).value || ''
        };
        if (!data.name || !data.phone || !data.message) {
          if (note) { note.textContent = 'Completa nombre, teléfono y mensaje.'; note.className = 'form-note error'; }
          return;
        }
        if (cfg.form_endpoint) {
          fetch(cfg.form_endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
            .then(r => r.ok ? Promise.resolve() : Promise.reject())
            .then(() => { if (note) { note.textContent = 'Mensaje enviado. Te contactaremos pronto.'; note.className = 'form-note ok'; form.reset(); } })
            .catch(() => { if (note) { note.textContent = 'No se pudo enviar. Intenta por WhatsApp o teléfono.'; note.className = 'form-note error'; } });
        } else {
          const subject = encodeURIComponent(`Consulta ${cfg.business_name || 'web'}`);
          const body = encodeURIComponent(`${data.message}\n\n${data.name}\n${data.phone}\n${data.email}`);
          window.location.href = `mailto:${cfg.email || ''}?subject=${subject}&body=${body}`;
          if (note) { note.textContent = 'Se abrió tu correo para enviar la consulta.'; note.className = 'form-note ok'; form.reset(); }
        }
      });
    }
  }

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  function toggleMenu() {
    document.querySelector('.nav-links')?.classList.toggle('open');
  }

  document.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('year').textContent = String(new Date().getFullYear());
    const cfg = await loadConfig();
    if (cfg) applyConfig(cfg);
  });
})();
