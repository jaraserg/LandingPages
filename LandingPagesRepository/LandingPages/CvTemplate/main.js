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

  function escapeHtml(str) {
    return String(str || '').replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
  }

  function applyConfig(cfg) {
    setText('page-title', cfg.name ? `${cfg.name} — ${cfg.role || ''}` : 'Portfolio');
    setText('page-desc', cfg.summary || 'Portfolio profesional.');
    document.title = cfg.name ? `${cfg.name} — ${cfg.role || 'Portfolio'}` : 'Portfolio';

    setText('logo-text', cfg.name ? cfg.name.replace(/[^A-Z0-9]/g, '').slice(0, 12).toUpperCase() : 'CV');

    setText('name-text', cfg.name || '');
    setText('role-text', cfg.role || '');
    setText('summary-text', cfg.summary || '');

    if (cfg.avatar || cfg.hero_image) setAttr('hero-bg', 'style', `background-image: url('${cfg.avatar || cfg.hero_image || ''}');`);

    setText('location', cfg.location || '');
    setHref('email-link', cfg.email ? `mailto:${cfg.email}` : '#');
    setText('email-link', cfg.email || '');

    const phoneClean = (cfg.phone || '').replace(/[^0-9+]/g, '');
    setHref('contact-phone', phoneClean ? `tel:${phoneClean}` : '#');
    setText('contact-phone', cfg.phone || '');

    const skillsEl = document.getElementById('skills-grid');
    if (skillsEl && Array.isArray(cfg.skills)) {
      skillsEl.innerHTML = cfg.skills.map(s => `<span class="skill">${escapeHtml(s)}</span>`).join('');
    }

    const timelineEl = document.getElementById('timeline');
    if (timelineEl && Array.isArray(cfg.experience)) {
      timelineEl.innerHTML = cfg.experience.map(item => `
        <div class="timeline-item">
          <div class="timeline-header">
            <div>
              <h3>${escapeHtml(item.title || '')}</h3>
              <div class="timeline-company">${escapeHtml(item.company || '')}</div>
            </div>
            <div class="timeline-period">${escapeHtml(item.period || '')}</div>
          </div>
          <p class="timeline-desc">${escapeHtml(item.description || '')}</p>
        </div>
      `).join('');
    }

    const projectsEl = document.getElementById('projects-grid');
    if (projectsEl && Array.isArray(cfg.projects)) {
      projectsEl.innerHTML = cfg.projects.map(item => `
        <div class="project-card">
          ${item.image ? `<img alt="${escapeHtml(item.name)}" src="${escapeHtml(item.image)}" loading="lazy"/>` : ''}
          <div class="project-body">
            <h3>${escapeHtml(item.name || '')}</h3>
            <p>${escapeHtml(item.description || '')}</p>
            ${item.url ? `<a class="project-link" href="${escapeHtml(item.url)}" target="_blank" rel="noopener">Ver proyecto →</a>` : ''}
          </div>
        </div>
      `).join('');
    }

    const links = cfg.links || {};
    setHref('contact-linkedin', links.linkedin || '#');
    setHref('contact-github', links.github || '#');
    setText('contact-email', cfg.email || '');
    setText('contact-phone', cfg.phone || '');

    if (cfg.resume_pdf_url) {
      const resumeBtn = document.getElementById('resume-btn');
      if (resumeBtn) resumeBtn.href = cfg.resume_pdf_url;
    } else {
      const resumeBtn = document.getElementById('resume-btn');
      if (resumeBtn) resumeBtn.style.display = 'none';
    }

    const form = document.getElementById('contact-form');
    const note = document.getElementById('form-note');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (note) { note.textContent = ''; note.className = 'form-note'; }
        const data = {
          name: (form.querySelector('#name') || {}).value || '',
          email: (form.querySelector('#email') || {}).value || '',
          message: (form.querySelector('#message') || {}).value || ''
        };
        if (!data.name || !data.email || !data.message) {
          if (note) { note.textContent = 'Completa nombre, email y mensaje.'; note.className = 'form-note error'; }
          return;
        }
        const subject = encodeURIComponent(`Consulta portfolio ${cfg.name || 'web'}`);
        const body = encodeURIComponent(`${data.message}\n\n${data.name}\n${data.email}`);
        window.location.href = `mailto:${cfg.email || ''}?subject=${subject}&body=${body}`;
        if (note) { note.textContent = 'Se abrió tu correo para enviar la consulta.'; note.className = 'form-note ok'; form.reset(); }
      });
    }
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
