document.addEventListener('DOMContentLoaded', function () {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function () {
            const isOpen = navLinks.style.display === 'flex';
            navLinks.style.display = isOpen ? 'none' : 'flex';
            navLinks.style.flexDirection = 'column';
            navLinks.style.position = 'absolute';
            navLinks.style.top = '100%';
            navLinks.style.left = '0';
            navLinks.style.right = '0';
            navLinks.style.background = 'rgba(255, 255, 255, 0.95)';
            navLinks.style.backdropFilter = 'blur(20px)';
            navLinks.style.padding = '20px';
            navLinks.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        });
    }

    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', function () {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 60) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    });

    // --- Gliding nav pill on hover ---
    const navPill = document.getElementById('navPill');
    const navLinksEl = document.getElementById('navLinks');
    if (navPill && navLinksEl) {
        const allNavAnchors = navLinksEl.querySelectorAll('a');

        function movePillTo(linkEl) {
            const cr = navLinksEl.getBoundingClientRect();
            const lr = linkEl.getBoundingClientRect();
            navPill.style.left = (lr.left - cr.left) + 'px';
            navPill.style.width = lr.width + 'px';
            navPill.style.opacity = '1';
        }

        allNavAnchors.forEach(function (link) {
            link.addEventListener('mouseenter', function () { movePillTo(link); });
        });

        navLinksEl.addEventListener('mouseleave', function () {
            const active = navLinksEl.querySelector('a.nav-active');
            if (active) { movePillTo(active); } else { navPill.style.opacity = '0'; }
        });
    }

    // --- Active section highlight via scroll ---
    const sectionIds = ['about', 'services', 'menu', 'testimonials', 'recipe-game'];
    const sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                document.querySelectorAll('.nav-links a').forEach(function (a) {
                    a.classList.toggle('nav-active', a.getAttribute('href') === '#' + id);
                });
                if (navPill && navLinksEl) {
                    const activeLink = document.querySelector('.nav-links a[href="#' + id + '"]');
                    if (activeLink) {
                        var cr = navLinksEl.getBoundingClientRect();
                        var lr = activeLink.getBoundingClientRect();
                        navPill.style.left = (lr.left - cr.left) + 'px';
                        navPill.style.width = lr.width + 'px';
                        navPill.style.opacity = '1';
                    }
                }
            }
        });
    }, { threshold: 0.4 });

    sectionIds.forEach(function (id) {
        var el = document.getElementById(id);
        if (el) sectionObserver.observe(el);
    });

    const navLinksItems = document.querySelectorAll('.nav-links a');
    navLinksItems.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const headerHeight = header.offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.feature-card, .service-card, .menu-day, .testimonial-card, .game-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Recipe Game Logic
    const selectedIngredients = {
        protein: null,
        vegetable: null,
        carb: null
    };

    const mealType = {
        current: 'desayuno',
        names: {
            desayuno: 'Desayuno',
            almuerzo: 'Almuerzo',
            cena: 'Cena'
        }
    };

    const ingredientNames = {
        // Proteins
        huevo: 'Huevo',
        pollo: 'Pollo',
        salmon: 'Salmón',
        tofu: 'Tofu',
        lentejas: 'Lentejas',
        pavo: 'Pavo',
        // Vegetables (both accented & plain forms to avoid undefined)
        'espinacas': 'Espinacas',
        'brócoli': 'Brócoli',
        'brocoli': 'Brócoli',
        'aguacate': 'Aguacate',
        'zucchini': 'Zucchini',
        'pimientos': 'Pimientos',
        'tomates': 'Tomates',
        // Carbs
        quinoa: 'Quinoa',
        arroz: 'Arroz Integral',
        avena: 'Avena',
        batata: 'Batata',
        pan: 'Pan Integral',
        pasta: 'Pasta Integral'
    };

    // Helper: resolve ingredient key safely (strips accents as fallback)
    function resolveName(key) {
        if (!key) return '?';
        if (ingredientNames[key]) return ingredientNames[key];
        // Normalise accents and try again
        const plain = key.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        return ingredientNames[plain] || key;
    }

    const recipes = {
        desayuno: [
            "Revuelto de {protein} con {vegetable} y {carb}",
            "Tostada de {vegetable} con {protein} y {carb}",
            "Bowl de {protein} con {vegetable} y {carb}",
            "Parfait de {protein} con {vegetable} y {carb}",
            "Omelette de {protein} y {vegetable} con {carb}"
        ],
        almuerzo: [
            "Ensalada de {protein} con {vegetable} y {carb}",
            "Bowl de {protein} con {vegetable} y {carb}",
            "{protein} a la plancha con {vegetable} y {carb}",
            "Sopa de {vegetable} con {protein} y {carb}",
            "Wrap de {protein} con {vegetable} y {carb}"
        ],
        cena: [
            "{protein} al horno con {vegetable} y {carb}",
            "{protein} a la parrilla con {vegetable} y {carb}",
            "Salteado de {protein} con {vegetable} y {carb}",
            "{protein} en salsa de {vegetable} con {carb}",
            "Bowl de {protein} con {vegetable} y {carb}"
        ]
    };

    // Meal type buttons
    const mealBtns = document.querySelectorAll('.meal-btn');
    mealBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            mealBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            mealType.current = this.dataset.meal;
        });
    });

    // Ingredient buttons
    const ingredientBtns = document.querySelectorAll('.ingredient-btn');
    ingredientBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            const ingredient = this.dataset.ing;
            const category = this.closest('.game-card').querySelector('h3').textContent;

            let type;
            if (category.includes('Proteína')) {
                type = 'protein';
            } else if (category.includes('Vegetales')) {
                type = 'vegetable';
            } else {
                type = 'carb';
            }

            // Deselect previous in same category
            const parentGrid = this.closest('.ingredients-grid');
            parentGrid.querySelectorAll('.ingredient-btn').forEach(b => b.classList.remove('selected'));

            // Select new
            this.classList.add('selected');
            selectedIngredients[type] = ingredient;

            updateSelectedDisplay();
        });
    });

    function updateSelectedDisplay() {
        const container = document.getElementById('selectedIngredients');
        container.innerHTML = '';

        Object.entries(selectedIngredients).forEach(([type, ingredient]) => {
            if (ingredient && ingredientNames[ingredient]) {
                const tag = document.createElement('span');
                tag.className = 'selected-tag';
                tag.innerHTML = `<span>${ingredientNames[ingredient]}</span>`;
                container.appendChild(tag);
            }
        });
    }

    // Cooking animation steps per meal type
    const cookingSteps = {
        desayuno: [
            { emoji: '🌅', text: 'Calentando la sartén...' },
            { emoji: '🥣', text: 'Mezclando ingredientes...' },
            { emoji: '🍳', text: 'Cocinando a fuego medio...' },
            { emoji: '☕', text: 'Preparando bebida caliente...' },
            { emoji: '🍽️', text: '¡Listo para servir!' }
        ],
        almuerzo: [
            { emoji: '🔪', text: 'Cortando ingredientes frescos...' },
            { emoji: '🍳', text: 'Sofritando en aceite de oliva...' },
            { emoji: '⏲️', text: 'Cocinando a temperatura perfecta...' },
            { emoji: '🌿', text: 'Añadiendo hierbas aromáticas...' },
            { emoji: '🍽️', text: '¡Tu almuerzo está servido!' }
        ],
        cena: [
            { emoji: '🔥', text: 'Precalentando el horno...' },
            { emoji: '🧄', text: 'Preparando la marinada...' },
            { emoji: '🍲', text: 'Cocinando a fuego lento...' },
            { emoji: '✨', text: 'Toque final del chef...' },
            { emoji: '🍽️', text: '¡Cena lista para disfrutar!' }
        ]
    };

    // Generate recipe
    const generateBtn = document.getElementById('generateRecipe');
    if (generateBtn) {
        generateBtn.addEventListener('click', function () {
            const resultDish = document.getElementById('resultDish');

            if (!selectedIngredients.protein || !selectedIngredients.vegetable || !selectedIngredients.carb) {
                resultDish.innerHTML = `
                    <span class="dish-emoji">⚠️</span>
                    <p>Por favor selecciona al menos un ingrediente de cada categoría</p>
                `;
                resultDish.style.animation = 'none';
                resultDish.offsetHeight; // reflow
                resultDish.style.animation = 'recipeShake 0.4s ease';
                return;
            }

            const recipeTemplates = recipes[mealType.current];
            const randomRecipe = recipeTemplates[Math.floor(Math.random() * recipeTemplates.length)];
            const finalRecipe = randomRecipe
                .replace('{protein}', resolveName(selectedIngredients.protein))
                .replace('{vegetable}', resolveName(selectedIngredients.vegetable))
                .replace('{carb}', resolveName(selectedIngredients.carb));

            // Disable button during animation
            generateBtn.disabled = true;
            generateBtn.textContent = 'Cocinando...';
            generateBtn.style.opacity = '0.7';

            const steps = cookingSteps[mealType.current];
            let stepIndex = 0;

            function showStep() {
                const step = steps[stepIndex];
                resultDish.style.animation = 'none';
                resultDish.offsetHeight; // force reflow
                resultDish.style.animation = 'cookStep 0.8s ease';
                resultDish.innerHTML = `
                    <span class="dish-emoji cooking-spin">${step.emoji}</span>
                    <p class="cooking-text">${step.text}</p>
                    <div class="cooking-progress">
                        <div class="cooking-bar" style="width:${((stepIndex + 1) / steps.length) * 100}%"></div>
                    </div>
                `;
                stepIndex++;

                if (stepIndex < steps.length) {
                    setTimeout(showStep, 1200);
                } else {
                    // Final reveal — give user a moment to read the last step
                    setTimeout(function () {
                        resultDish.style.animation = 'none';
                        resultDish.offsetHeight;
                        resultDish.style.animation = 'recipePop 0.7s cubic-bezier(0.175,0.885,0.32,1.275)';
                        resultDish.innerHTML = `
                            <span class="dish-emoji">🍽️</span>
                            <p style="font-size:18px;font-weight:700;color:var(--text-dark);margin-top:8px;">${mealType.names[mealType.current]}</p>
                            <p style="font-size:16px;font-weight:600;color:var(--primary-dark);margin-top:4px;">${finalRecipe}</p>
                            <p style="font-size:13px;color:var(--text-light);margin-top:8px;">¡Una comida nutritiva y deliciosa! 🌿</p>
                        `;
                        generateBtn.disabled = false;
                        generateBtn.textContent = 'Generar Receta';
                        generateBtn.style.opacity = '1';
                    }, 1200);
                }
            }

            showStep();
        });
    }
});
