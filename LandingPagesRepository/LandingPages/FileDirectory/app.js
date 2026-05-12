// ===========================
// DATA MODEL & STATE
// ===========================

let landingPages = [];
let currentFilter = 'all';
let selectedCategory = 'business'; // Default category for form
let selectedStatus = 'ready'; // Default status for form (changed from draft)
let currentTags = [];

// ===========================
// NEON GRID ANIMATION
// ===========================

const canvas = document.getElementById('neonGrid');
const ctx = canvas.getContext('2d');
let mouseX = 0;
let mouseY = 0;
let targetMouseX = 0;
let targetMouseY = 0;

// Neon color palette
const neonColors = [
  '#00ff00', // Neon green
  '#00ffff', // Cyan
  '#ff00ff', // Magenta
  '#ffff00', // Yellow
  '#ff0080', // Pink
  '#00ff80', // Teal
];

function initNeonGrid() {
  // Set canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Track mouse position with smoothing
  document.addEventListener('mousemove', (e) => {
    targetMouseX = e.clientX;
    targetMouseY = e.clientY;
  });

  // Animate the grid with refined glowing effect and edge fade-out
  function animate() {
    // Smooth mouse movement
    mouseX += (targetMouseX - mouseX) * 0.1;
    mouseY += (targetMouseY - mouseY) * 0.1;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const gridSize = 50;
    const influenceRadius = 200; // Only 200px around cursor
    const edgeFadeDistance = 150; // Fade-out distance from edges

    // Calculate edge fade factor for cursor position
    const distToEdgeX = Math.min(mouseX, canvas.width - mouseX);
    const distToEdgeY = Math.min(mouseY, canvas.height - mouseY);
    const cursorEdgeFactor = Math.min(
      distToEdgeX / edgeFadeDistance,
      distToEdgeY / edgeFadeDistance,
      1
    );

    // Draw vertical lines with layered glow and edge fade
    for (let x = 0; x < canvas.width; x += gridSize) {
      const distX = Math.abs(x - mouseX);
      if (distX < influenceRadius) {
        const intensity = Math.pow(1 - (distX / influenceRadius), 2); // Quadratic fade

        // Calculate edge fade for this line
        const lineEdgeDistX = Math.min(x, canvas.width - x);
        const lineEdgeFactor = Math.min(lineEdgeDistX / edgeFadeDistance, 1);
        const finalAlpha = cursorEdgeFactor * lineEdgeFactor;

        const colorIndex = Math.floor((x / gridSize) % neonColors.length);
        const color = neonColors[colorIndex];

        // Outer glow layer
        ctx.strokeStyle = color;
        ctx.globalAlpha = intensity * 0.25 * finalAlpha;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();

        // Middle glow layer
        ctx.globalAlpha = intensity * 0.4 * finalAlpha;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();

        // Inner bright line (thin)
        ctx.globalAlpha = intensity * 0.9 * finalAlpha;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
    }

    // Draw horizontal lines with layered glow and edge fade
    for (let y = 0; y < canvas.height; y += gridSize) {
      const distY = Math.abs(y - mouseY);
      if (distY < influenceRadius) {
        const intensity = Math.pow(1 - (distY / influenceRadius), 2); // Quadratic fade

        // Calculate edge fade for this line
        const lineEdgeDistY = Math.min(y, canvas.height - y);
        const lineEdgeFactor = Math.min(lineEdgeDistY / edgeFadeDistance, 1);
        const finalAlpha = cursorEdgeFactor * lineEdgeFactor;

        const colorIndex = Math.floor((y / gridSize) % neonColors.length);
        const color = neonColors[colorIndex];

        // Outer glow layer
        ctx.strokeStyle = color;
        ctx.globalAlpha = intensity * 0.25 * finalAlpha;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();

        // Middle glow layer
        ctx.globalAlpha = intensity * 0.4 * finalAlpha;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();

        // Inner bright line (thin)
        ctx.globalAlpha = intensity * 0.9 * finalAlpha;
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }

    // Draw intersection glow points with edge fade
    for (let x = 0; x < canvas.width; x += gridSize) {
      for (let y = 0; y < canvas.height; y += gridSize) {
        const dist = Math.sqrt(Math.pow(x - mouseX, 2) + Math.pow(y - mouseY, 2));
        if (dist < influenceRadius) {
          const intensity = Math.pow(1 - (dist / influenceRadius), 2);

          // Calculate edge fade for this point
          const pointEdgeDistX = Math.min(x, canvas.width - x);
          const pointEdgeDistY = Math.min(y, canvas.height - y);
          const pointEdgeFactor = Math.min(
            pointEdgeDistX / edgeFadeDistance,
            pointEdgeDistY / edgeFadeDistance,
            1
          );
          const finalAlpha = cursorEdgeFactor * pointEdgeFactor;

          const colorIndex = Math.floor(((x + y) / gridSize) % neonColors.length);
          const color = neonColors[colorIndex];

          // Outer glow
          ctx.fillStyle = color;
          ctx.globalAlpha = intensity * 0.15 * finalAlpha;
          ctx.beginPath();
          ctx.arc(x, y, 6 + intensity * 4, 0, Math.PI * 2);
          ctx.fill();

          // Middle glow
          ctx.globalAlpha = intensity * 0.3 * finalAlpha;
          ctx.beginPath();
          ctx.arc(x, y, 3, 0, Math.PI * 2);
          ctx.fill();

          // Inner bright point
          ctx.globalAlpha = intensity * 0.8 * finalAlpha;
          ctx.beginPath();
          ctx.arc(x, y, 1, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  animate();
}

// ===========================
// INITIALIZATION
// ===========================

document.addEventListener('DOMContentLoaded', () => {
  initNeonGrid();
  loadData();
  initializeEventListeners();
  renderPages();
  updateCounts();
});

// ===========================
// LOCAL STORAGE MANAGEMENT
// ===========================

function loadData() {
  const stored = localStorage.getItem('landingPages');
  if (stored) {
    landingPages = JSON.parse(stored);
  }
}

function saveData() {
  localStorage.setItem('landingPages', JSON.stringify(landingPages));
}

// ===========================
// EVENT LISTENERS
// ===========================

function initializeEventListeners() {
  // View Navigation
  document.getElementById('backToDirectory').addEventListener('click', () => switchView('directory'));

  // New Page Button (Admin Only)
  const newPageBtn = document.getElementById('newPageBtn');
  if (newPageBtn) newPageBtn.addEventListener('click', openCreateModal);
  document.getElementById('newPageBtnManagement').addEventListener('click', openCreateModal);

  // Modal Controls
  document.getElementById('cancelBtn').addEventListener('click', closeCreateModal);
  document.getElementById('createBtn').addEventListener('click', createLandingPage);
  document.getElementById('createModal').addEventListener('click', (e) => {
    if (e.target.id === 'createModal') closeCreateModal();
  });

  // Preview Modal Controls
  document.getElementById('closePreviewBtn').addEventListener('click', closePreview);
  document.getElementById('previewModal').addEventListener('click', (e) => {
    if (e.target.id === 'previewModal') closePreview();
  });

  // Filter Cards
  document.querySelectorAll('.filter-card').forEach(card => {
    card.addEventListener('click', () => {
      const category = card.dataset.category;
      setFilter(category);
    });
  });

  // Category Toggle Buttons
  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.toggle-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedCategory = btn.dataset.category;
    });
  });

  // Status Pill Buttons
  document.querySelectorAll('.pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.pill-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedStatus = btn.dataset.status;
    });
  });

  // Tag Management
  document.getElementById('addTagBtn').addEventListener('click', addTag);
  document.getElementById('tagInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  });
}

// ===========================
// VIEW MANAGEMENT
// ===========================

function switchView(viewName) {
  document.querySelectorAll('.view').forEach(view => view.classList.remove('active'));

  if (viewName === 'directory') {
    document.getElementById('directoryView').classList.add('active');
  } else if (viewName === 'management') {
    document.getElementById('managementView').classList.add('active');
    renderManagementPages();
  }
}

// ===========================
// MODAL MANAGEMENT
// ===========================

function openCreateModal() {
  document.getElementById('createModal').classList.add('active');
  resetForm();
}

function closeCreateModal() {
  document.getElementById('createModal').classList.remove('active');
  resetForm();
}

function resetForm() {
  document.getElementById('pageTitle').value = '';
  document.getElementById('pageDescription').value = '';
  document.getElementById('pageUrl').value = '';
  document.getElementById('thumbnailUrl').value = '';
  document.getElementById('tagInput').value = '';
  currentTags = [];
  renderTagsList();

  // Reset to defaults
  selectedCategory = 'business';
  selectedStatus = 'ready';

  document.querySelectorAll('.toggle-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.category === 'business');
  });

  document.querySelectorAll('.pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.status === 'ready');
  });
}

// ===========================
// TAG MANAGEMENT
// ===========================

function addTag() {
  const input = document.getElementById('tagInput');
  const tag = input.value.trim();

  if (tag && !currentTags.includes(tag)) {
    currentTags.push(tag);
    renderTagsList();
    input.value = '';
  }
}

function removeTag(tag) {
  currentTags = currentTags.filter(t => t !== tag);
  renderTagsList();
}

function renderTagsList() {
  const tagsList = document.getElementById('tagsList');
  tagsList.innerHTML = currentTags.map(tag => `
    <div class="tag-item">
      <span>${tag}</span>
      <span class="tag-remove" onclick="removeTag('${tag}')">×</span>
    </div>
  `).join('');
}

// ===========================
// CRUD OPERATIONS
// ===========================

async function createLandingPage() {
  const title = document.getElementById('pageTitle').value.trim();
  const description = document.getElementById('pageDescription').value.trim();
  const url = document.getElementById('pageUrl').value.trim();
  const thumbnail = document.getElementById('thumbnailUrl').value.trim();

  // File inputs
  const htmlFile = document.getElementById('htmlFile').files[0];
  const cssFile = document.getElementById('cssFile').files[0];
  const jsFile = document.getElementById('jsFile').files[0];

  // Validation
  if (!title) {
    alert('Por favor ingresa un nombre para la página de aterrizaje');
    return;
  }

  if (!description) {
    alert('La descripción es obligatoria');
    return;
  }

  // Tags validation (Mandatory)
  if (currentTags.length === 0) {
    alert('Las etiquetas son obligatorias. Por favor añade al menos una.');
    return;
  }

  // File validation (Mandatory)
  const hasFiles = !!(htmlFile || cssFile || jsFile);
  if (!hasFiles) {
    alert('Los archivos del proyecto (HTML, CSS, JS) son obligatorios.');
    return;
  }

  if (!thumbnail) {
    alert('Por favor ingresa una URL de imagen de vista previa');
    return;
  }

  // Read file contents if they exist
  let files = { html: null, css: null, js: null };

  try {
    if (htmlFile) files.html = await readFileContent(htmlFile);
    if (cssFile) files.css = await readFileContent(cssFile);
    if (jsFile) files.js = await readFileContent(jsFile);
  } catch (error) {
    alert('Error al leer archivos: ' + error.message);
    return;
  }

  // Create new landing page object
  const newPage = {
    id: Date.now().toString(),
    title,
    description,
    url, // Keeping URL field but files are primary
    category: selectedCategory,
    status: selectedStatus,
    tags: [...currentTags],
    thumbnail: thumbnail,
    files: files,
    hasFiles: hasFiles,
    createdAt: new Date().toISOString()
  };

  // Add to array
  landingPages.push(newPage);

  // Save to localStorage
  try {
    saveData();
  } catch (e) {
    alert('Error de almacenamiento: El proyecto es demasiado grande para guardar localmente. Intenta reducir el tamaño de los archivos.');
    landingPages.pop(); // Remove failed item
    return;
  }

  // Update UI
  renderPages();
  updateCounts();
  closeCreateModal();
}

function readFileContent(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e);
    reader.readAsText(file);
  });
}

function deletePage(id) {
  if (confirm('¿Estás seguro de que deseas eliminar esta página de aterrizaje?')) {
    landingPages = landingPages.filter(page => page.id !== id);
    saveData();
    renderPages();
    renderManagementPages();
    updateCounts();
  }
}

// ===========================
// PREVIEW SYSTEM
// ===========================

function showProjectPreview(pageId) {
  const page = landingPages.find(p => p.id === pageId);
  if (!page) return;

  const modal = document.getElementById('previewModal');
  const iframe = document.getElementById('projectFrame');

  if (page.hasFiles && page.files) {
    // Generate preview from stored files
    const htmlContent = page.files.html || '<!-- No HTML content -->';
    const cssContent = page.files.css ? `<style>${page.files.css}</style>` : '';
    const jsContent = page.files.js ? `<script>${page.files.js}<\/script>` : '';

    // Create complete document
    const fullDocument = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${page.title}</title>
        ${cssContent}
        <style>body { margin: 0; font-family: sans-serif; }</style>
      </head>
      <body>
        ${htmlContent}
        ${jsContent}
      </body>
      </html>
    `;

    iframe.srcdoc = fullDocument;
  } else if (page.url) {
    // Fallback to URL
    iframe.src = page.url;
  }

  modal.classList.add('active');
}

function closePreview() {
  const modal = document.getElementById('previewModal');
  const iframe = document.getElementById('projectFrame');
  modal.classList.remove('active');

  // Clear iframe to stop audio/video
  setTimeout(() => {
    iframe.srcdoc = '';
    iframe.src = '';
  }, 300);
}

// ===========================
// FILTERING
// ===========================

function setFilter(category) {
  currentFilter = category;

  // Update active filter card
  document.querySelectorAll('.filter-card').forEach(card => {
    card.classList.toggle('active', card.dataset.category === category);
  });

  // Render filtered pages
  renderPages();
}

function getFilteredPages() {
  if (currentFilter === 'all') {
    return landingPages;
  }
  return landingPages.filter(page => page.category === currentFilter);
}

// ===========================
// RENDERING
// ===========================

function renderPages() {
  const grid = document.getElementById('pagesGrid');
  const emptyState = document.getElementById('emptyState');
  const label = document.getElementById('allDesignsLabel');

  const filteredPages = getFilteredPages();

  if (filteredPages.length === 0) {
    grid.style.display = 'none';
    emptyState.style.display = 'block';
    label.textContent = `TODOS LOS DISEÑOS (0)`;
  } else {
    grid.style.display = 'grid';
    emptyState.style.display = 'none';
    label.textContent = `TODOS LOS DISEÑOS (${filteredPages.length})`;

    grid.innerHTML = filteredPages.map(page => createPageCard(page)).join('');
  }
}

function renderManagementPages() {
  const grid = document.getElementById('pagesGridManagement');
  const emptyState = document.getElementById('emptyStateManagement');
  const pageCount = document.getElementById('pageCountManagement');

  pageCount.textContent = `${landingPages.length} páginas`;

  if (landingPages.length === 0) {
    grid.style.display = 'none';
    emptyState.style.display = 'block';
  } else {
    grid.style.display = 'grid';
    emptyState.style.display = 'none';
    grid.innerHTML = landingPages.map(page => createPageCard(page, true)).join('');
  }
}

function createPageCard(page, showDelete = false) {
  const thumbnailContent = page.thumbnail
    ? `<img src="${page.thumbnail}" alt="${page.title}">`
    : 'No Preview';

  const tagsHtml = page.tags.map(tag =>
    `<span class="badge badge-tag">${tag}</span>`
  ).join('');

  const deleteBtn = showDelete
    ? `<button class="btn btn-secondary" onclick="deletePage('${page.id}'); event.stopPropagation();" style="margin-top: 1rem; width: 100%;">Eliminar</button>`
    : '';

  const statusMap = { 'draft': 'Borrador', 'ready': 'Listo', 'selected': 'Destacado' };
  const statusLabel = statusMap[page.status] || page.status;
  const isFeatured = page.status === 'selected' ? ' style="color: #00ff00; font-weight: 600;"' : '';

  // Determine click action
  let cardAction = '';
  let metaExtras = '';

  if (page.hasFiles) {
    cardAction = `onclick="showProjectPreview('${page.id}')"`;
    metaExtras = `<span class="file-badge">📁 Archivos</span>`;
  } else if (page.url) {
    cardAction = `onclick="window.open('${page.url}', '_blank')"`;
    metaExtras = `<span class="file-badge" style="border-color: var(--color-white); color: var(--color-white);">🔗 Link</span>`;
  }

  const cursorStyle = 'cursor: pointer;';

  return `
    <div class="page-card" ${cardAction} style="${cursorStyle}">
      <div class="page-card-thumbnail">${thumbnailContent}</div>
      <div class="page-card-content">
        <div class="page-card-header">
          <h3 class="page-card-title">${page.title}</h3>
          ${metaExtras}
        </div>
        <p class="page-card-description">${page.description || 'Haz clic para ver esta opción de página de aterrizaje'}</p>
        <div class="page-card-meta">
          <span class="badge badge-category">${page.category === 'personal' ? '👤 Personal' : '🏢 Negocios'}</span>
          <span class="badge badge-status"${isFeatured}>${statusLabel}</span>
          ${tagsHtml}
        </div>
        ${deleteBtn}
      </div>
    </div>
  `;
}

function updateCounts() {
  const allCount = landingPages.length;
  const personalCount = landingPages.filter(p => p.category === 'personal').length;
  const businessCount = landingPages.filter(p => p.category === 'business').length;

  document.getElementById('countAll').textContent = allCount;
  document.getElementById('countPersonal').textContent = personalCount;
  document.getElementById('countBusiness').textContent = businessCount;
}

// ===========================
// UTILITY FUNCTIONS
// ===========================

// Make removeTag global for inline onclick
window.removeTag = removeTag;
window.deletePage = deletePage;
