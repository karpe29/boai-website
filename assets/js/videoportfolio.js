/**
 * VideoPortfolio Carousel
 * A smooth, keyboard and touch-enabled carousel for showcasing video portfolio items
 */

(function() {
    'use strict';

    const REDUCED_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // State
    let currentIndex = 1; // Start with middle slide (video)
    let isTransitioning = false;
    let touchStartX = 0;
    let touchEndX = 0;
    let SLIDES = []; // Will be initialized after DOM is ready - must be in outer scope

    /**
     * Get slide indices for prev, active, next
     */
    function getSlideIndices() {
        const total = SLIDES.length;
        const prev = (currentIndex - 1 + total) % total;
        const next = (currentIndex + 1) % total;
        return { prev, active: currentIndex, next };
    }

    /**
     * Create card HTML for a slide
     */
    function createCardHTML(slide, state, index) {
        const isActive = state === 'active';
        const isPrev = state === 'prev';
        const isNext = state === 'next';
        
        // Scale and opacity based on state
        const scale = isActive ? 'scale-100' : 'scale-[0.85]';
        const opacity = isActive ? 'opacity-100' : 'opacity-60';
        const width = isActive ? 'w-full md:w-[45%]' : 'w-[30%] hidden md:block';
        const shadow = isActive ? 'shadow-2xl shadow-black/50' : 'shadow-lg shadow-black/30';
        const border = isActive 
            ? 'border border-white/20 backdrop-blur-sm' 
            : 'border border-white/10';
        
        // Z-index: active on top, prev/next below (prev lower than next so it's more behind)
        const zIndex = isActive ? 'z-30' : (isPrev ? 'z-10' : 'z-20');
        
        // Media element
        const mediaHTML = slide.type === 'video'
            ? `<video 
                class="w-full h-full object-cover" 
                ${isActive ? 'autoplay' : ''} 
                loop 
                muted 
                playsinline
                ${slide.poster ? `poster="${slide.poster}"` : ''}
            >
                <source src="${slide.src}" type="video/mp4">
            </video>`
            : `<img 
                class="w-full h-full object-cover" 
                src="${slide.src}" 
                alt="${slide.label || slide.badge || 'Portfolio item'}"
                ${slide.poster ? `data-poster="${slide.poster}"` : ''}
            />`;

        // Badge (only for active card with badge)
        const badgeHTML = (isActive && slide.badge)
            ? `<div class="absolute top-4 left-4 z-10">
                <span class="bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    ${slide.badge}
                </span>
            </div>`
            : '';

        // Tools row (only for active card with tools)
        const toolsHTML = (isActive && slide.tools && slide.tools.length > 0)
            ? `<div class="absolute bottom-4 left-4 z-10 flex items-center gap-3">
                ${slide.tools.map(tool => `
                    <div class="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
                        ${tool.icon ? `<img src="${tool.icon}" alt="${tool.name}" class="w-4 h-4">` : ''}
                        <span class="text-white text-xs font-medium">${tool.name}</span>
                    </div>
                `).join('')}
            </div>`
            : '';

        // Label (for side cards)
        const labelHTML = (!isActive && slide.label)
            ? `<div class="absolute bottom-4 left-1/2 -translate-x-1/2 z-10">
                <span class="text-white text-sm font-semibold">${slide.label}</span>
            </div>`
            : '';

        // Build class string with proper Tailwind classes
        const cardClasses = [
            'videoportfolio-card',
            width,
            zIndex,
            opacity,
            shadow,
            'flex-shrink-0',
            REDUCED_MOTION ? '' : 'transition-all duration-700 ease-in-out'
        ].filter(Boolean).join(' ');

        return `
            <div 
                class="${cardClasses}" 
                data-state="${state}" 
                data-index="${index}"
            >
                <div class="relative ${border} rounded-2xl md:rounded-3xl overflow-hidden h-full">
                    <div class="aspect-video relative">
                        ${mediaHTML}
                        <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none"></div>
                        ${isPrev || isNext ? '<div class="absolute inset-0 bg-black/40 pointer-events-none"></div>' : ''}
                    </div>
                    ${badgeHTML}
                    ${toolsHTML}
                    ${labelHTML}
                </div>
            </div>
        `;
    }

    /**
     * Render all three cards (prev, active, next)
     */
    function renderCards() {
        // Use window.videoportfolio if available, otherwise use local scope
        const container = (window.videoportfolio && window.videoportfolio.container) 
            ? window.videoportfolio.container 
            : document.getElementById('videoportfolio-slides-container');
            
        if (!container) {
            console.warn('VideoPortfolio: Container not found');
            return;
        }
        
        if (!SLIDES || SLIDES.length === 0) {
            console.warn('VideoPortfolio: SLIDES array is empty', SLIDES);
            return;
        }
        
        const indices = getSlideIndices();
        const states = ['prev', 'active', 'next'];
        const slides = [SLIDES[indices.prev], SLIDES[indices.active], SLIDES[indices.next]];
        const slideIndices = [indices.prev, indices.active, indices.next];

        // Instead of replacing all HTML, update existing cards or create new ones for smooth transitions
        const existingCards = Array.from(container.children);
        
        slides.forEach((slide, i) => {
            const state = states[i];
            const index = slideIndices[i];
            const existingCard = existingCards[i];
            
            if (existingCard && existingCard.getAttribute('data-index') == index) {
                // Update existing card's state and classes
                existingCard.setAttribute('data-state', state);
                // Update z-index class
                existingCard.className = existingCard.className.replace(/z-\d+/g, '');
                const zIndex = state === 'active' ? 'z-30' : (state === 'prev' ? 'z-10' : 'z-20');
                existingCard.classList.add(zIndex);
            } else {
                // Create new card if needed
                if (existingCard) {
                    existingCard.outerHTML = createCardHTML(slide, state, index);
                } else {
                    container.insertAdjacentHTML('beforeend', createCardHTML(slide, state, index));
                }
            }
        });
        
        // Remove extra cards if any
        while (container.children.length > slides.length) {
            container.removeChild(container.lastChild);
        }

        // Play active video
        const activeCard = container.querySelector('[data-state="active"]');
        if (activeCard) {
            const video = activeCard.querySelector('video');
            if (video) {
                video.play().catch(err => {
                    console.log('Video autoplay prevented:', err);
                });
            }
        }

        // Pause other videos
        container.querySelectorAll('video').forEach(video => {
            if (video !== activeCard?.querySelector('video')) {
                video.pause();
            }
        });
    }

    /**
     * Navigate to a specific slide
     */
    function goToSlide(index, direction = 'next') {
        if (isTransitioning) return;
        
        isTransitioning = true;
        const oldIndex = currentIndex;
        currentIndex = (index + SLIDES.length) % SLIDES.length;
        
        // Add transition class to container for smooth sliding
        const container = document.getElementById('videoportfolio-slides-container');
        if (container) {
            container.classList.add('transitioning');
        }
        
        // Small delay before rendering to allow transition to start
        requestAnimationFrame(() => {
            renderCards();
            
            // Remove transition class after animation completes
            setTimeout(() => {
                if (container) {
                    container.classList.remove('transitioning');
                }
                isTransitioning = false;
            }, REDUCED_MOTION ? 0 : 700);
        });
    }

    /**
     * Navigate to next slide
     */
    function nextSlide() {
        goToSlide(currentIndex + 1, 'next');
    }

    /**
     * Navigate to previous slide
     */
    function prevSlide() {
        goToSlide(currentIndex - 1, 'prev');
    }

    /**
     * Handle keyboard navigation
     */
    function handleKeydown(e) {
        if (!window.videoportfolio || !window.videoportfolio.section) return;
        
        const section = window.videoportfolio.section;
        // Only handle if section is focused or visible
        if (!section || !document.contains(section)) return;
        
        const rect = section.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (!isVisible) return;

        if (e.key === 'ArrowLeft') {
            e.preventDefault();
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            e.preventDefault();
            nextSlide();
        }
    }

    /**
     * Handle touch events for swipe
     */
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
    }

    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    /**
     * Initialize carousel
     */
    function init() {
        // DOM Elements
        const section = document.getElementById('videoportfolio-section');
        const carousel = document.getElementById('videoportfolio-carousel');
        const container = document.getElementById('videoportfolio-slides-container');
        const prevBtn = document.getElementById('videoportfolio-prev');
        const nextBtn = document.getElementById('videoportfolio-next');

        if (!section || !container || !prevBtn || !nextBtn || !carousel) {
            console.warn('VideoPortfolio: Required DOM elements not found');
            return;
        }

        // Get video paths from data attributes (set by Hugo template)
        const video1Path = carousel.getAttribute('data-video1') || '/videos/portfolio1.mp4';
        const video2Path = carousel.getAttribute('data-video2') || '/videos/portfolio2.mp4';

        // Configuration - Using available portfolio videos
        // Update the outer scope SLIDES array
        SLIDES.length = 0; // Clear existing
        SLIDES.push(
            {
                id: 'portfolio1',
                label: 'AI VOICEOVER',
                type: 'video',
                src: video1Path,
                poster: null,
                badge: null,
                tools: []
            },
            {
                id: 'portfolio2',
                label: null,
                type: 'video',
                src: video2Path,
                poster: null,
                badge: 'AI VIDEO',
                tools: [
                    { name: 'Sora 2', icon: null },
                    { name: 'VEO 3.1', icon: null },
                    { name: 'Kling 2.5', icon: null },
                    { name: 'Seedance V1 Pro', icon: null }
                ]
            },
            {
                id: 'portfolio1-repeat',
                label: 'AI IMAGE',
                type: 'video',
                src: video1Path,
                poster: null,
                badge: null,
                tools: []
            }
        );

        // Render initial cards
        renderCards();

        // Event listeners
        prevBtn.addEventListener('click', prevSlide);
        nextBtn.addEventListener('click', nextSlide);
        document.addEventListener('keydown', handleKeydown);
        
        // Touch events
        container.addEventListener('touchstart', handleTouchStart, { passive: true });
        container.addEventListener('touchend', handleTouchEnd, { passive: true });

        // Make section focusable for keyboard navigation
        section.setAttribute('tabindex', '0');
        section.addEventListener('focus', () => {
            section.style.outline = 'none';
        });
        
        // Store references for use in other functions
        window.videoportfolio = {
            section,
            container,
            prevBtn,
            nextBtn
        };

        // Auto-advance (optional, can be disabled)
        // setInterval(nextSlide, 6000);
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
