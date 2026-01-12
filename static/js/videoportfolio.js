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
     * Update a single card's content (media, badges, labels) without affecting positioning
     */
    function updateCardContent(card, slide, state) {
        const isActive = state === 'active';
        const isPrev = state === 'prev';
        const isNext = state === 'next';
        
        // Update inner card border classes
        const innerCard = card.querySelector('div.relative.rounded-2xl, div.relative.rounded-3xl');
        if (innerCard) {
            innerCard.className = innerCard.className
                .replace(/border[^"'\s]*/g, '')
                .replace(/backdrop-blur-\w+/g, '')
                .replace(/\s+/g, ' ')
                .trim();
            
            const borderClasses = isActive 
                ? 'relative border border-white/20 backdrop-blur-sm rounded-2xl md:rounded-3xl overflow-hidden h-full'
                : 'relative border border-white/10 rounded-2xl md:rounded-3xl overflow-hidden h-full';
            innerCard.className = borderClasses;
        }
        
        // Update media element
        const mediaContainer = card.querySelector('.aspect-video');
        if (mediaContainer) {
            const newMediaSrc = slide.src;
            
            if (slide.type === 'video') {
                let video = mediaContainer.querySelector('video');
                if (!video) {
                    // Create video element if it doesn't exist
                    video = document.createElement('video');
                    video.className = 'w-full h-full object-cover';
                    video.loop = true;
                    video.muted = true;
                    video.playsInline = true;
                    const source = document.createElement('source');
                    source.type = 'video/mp4';
                    video.appendChild(source);
                    // Insert before gradient overlay
                    const gradient = mediaContainer.querySelector('.bg-gradient-to-t');
                    if (gradient) {
                        mediaContainer.insertBefore(video, gradient);
                    } else {
                        mediaContainer.insertBefore(video, mediaContainer.firstChild);
                    }
                }
                
                const source = video.querySelector('source');
                if (source) {
                    const currentSrc = source.getAttribute('src') || '';
                    if (currentSrc !== newMediaSrc) {
                        source.src = newMediaSrc;
                        video.load();
                    }
                }
                
                // Update autoplay
                if (isActive) {
                    video.setAttribute('autoplay', '');
                } else {
                    video.removeAttribute('autoplay');
                }
                
                // Remove img if it exists
                const img = mediaContainer.querySelector('img');
                if (img) img.remove();
            } else {
                let img = mediaContainer.querySelector('img');
                if (!img) {
                    img = document.createElement('img');
                    img.className = 'w-full h-full object-cover';
                    const gradient = mediaContainer.querySelector('.bg-gradient-to-t');
                    if (gradient) {
                        mediaContainer.insertBefore(img, gradient);
                    } else {
                        mediaContainer.insertBefore(img, mediaContainer.firstChild);
                    }
                }
                if (img.src !== newMediaSrc) {
                    img.src = newMediaSrc;
                    img.alt = slide.label || slide.badge || 'Portfolio item';
                }
                
                // Remove video if it exists
                const video = mediaContainer.querySelector('video');
                if (video) video.remove();
            }
        }
        
        // Update badge
        let badgeContainer = card.querySelector('.absolute.top-4.left-4');
        if (isActive && slide.badge) {
            if (!badgeContainer || !badgeContainer.querySelector('span')) {
                if (badgeContainer && !badgeContainer.querySelector('span')) badgeContainer.remove();
                if (!badgeContainer || !badgeContainer.querySelector('span')) {
                    badgeContainer = document.createElement('div');
                    badgeContainer.className = 'absolute top-4 left-4 z-10';
                    const span = document.createElement('span');
                    span.className = 'bg-white/10 backdrop-blur-md border border-white/20 text-white px-4 py-2 rounded-full text-sm font-semibold';
                    span.textContent = slide.badge;
                    badgeContainer.appendChild(span);
                    const innerCard = card.querySelector('div.relative.rounded-2xl, div.relative.rounded-3xl');
                    if (innerCard) innerCard.appendChild(badgeContainer);
                }
            } else {
                const span = badgeContainer.querySelector('span');
                if (span) span.textContent = slide.badge;
            }
        } else if (badgeContainer && badgeContainer.querySelector('span')) {
            badgeContainer.remove();
        }
        
        // Update tools
        let toolsContainer = card.querySelector('.absolute.bottom-4.left-4.flex');
        if (isActive && slide.tools && slide.tools.length > 0) {
            if (!toolsContainer) {
                toolsContainer = document.createElement('div');
                toolsContainer.className = 'absolute bottom-4 left-4 z-10 flex items-center gap-3';
                const innerCard = card.querySelector('div.relative.rounded-2xl, div.relative.rounded-3xl');
                if (innerCard) innerCard.appendChild(toolsContainer);
            }
            toolsContainer.innerHTML = slide.tools.map(tool => `
                <div class="flex items-center gap-2 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-white/10">
                    ${tool.icon ? `<img src="${tool.icon}" alt="${tool.name}" class="w-4 h-4">` : ''}
                    <span class="text-white text-xs font-medium">${tool.name}</span>
                </div>
            `).join('');
        } else if (toolsContainer) {
            toolsContainer.remove();
        }
        
        // Update label (for side cards)
        let labelContainer = card.querySelector('.absolute.bottom-4.left-1\\/2');
        if (!isActive && slide.label) {
            if (!labelContainer || !labelContainer.classList.contains('-translate-x-1/2')) {
                if (labelContainer) labelContainer.remove();
                labelContainer = document.createElement('div');
                labelContainer.className = 'absolute bottom-4 left-1/2 -translate-x-1/2 z-10';
                const span = document.createElement('span');
                span.className = 'text-white text-sm font-semibold';
                span.textContent = slide.label;
                labelContainer.appendChild(span);
                const innerCard = card.querySelector('div.relative.rounded-2xl, div.relative.rounded-3xl');
                if (innerCard) innerCard.appendChild(labelContainer);
            } else {
                const span = labelContainer.querySelector('span');
                if (span) span.textContent = slide.label;
            }
        } else if (labelContainer && labelContainer.classList.contains('-translate-x-1/2')) {
            labelContainer.remove();
        }
        
        // Update overlay for side cards
        const overlay = mediaContainer?.querySelector('.bg-black\\/40.pointer-events-none');
        if (isPrev || isNext) {
            if (!overlay) {
                const newOverlay = document.createElement('div');
                newOverlay.className = 'absolute inset-0 bg-black/40 pointer-events-none';
                if (mediaContainer) mediaContainer.appendChild(newOverlay);
            }
        } else if (overlay) {
            overlay.remove();
        }
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

        // Get existing cards
        const existingCards = Array.from(container.children);
        
        // Ensure we have exactly 3 cards with proper structure
        // Use actual slide data for initial creation
        while (container.children.length < 3) {
            const idx = container.children.length;
            const slide = slides[idx] || SLIDES[0];
            const state = states[idx] || 'prev';
            const slideIndex = slideIndices[idx] || 0;
            const cardHTML = createCardHTML(slide, state, slideIndex);
            container.insertAdjacentHTML('beforeend', cardHTML);
        }
        
        // Remove extra cards if any
        while (container.children.length > 3) {
            container.removeChild(container.lastChild);
        }
        
        // Phase 1: Update state attributes and positioning classes first
        // This triggers CSS transitions immediately
        slides.forEach((slide, i) => {
            const state = states[i];
            const index = slideIndices[i];
            const card = container.children[i];
            
            if (card) {
                // Update state attribute first (triggers CSS transitions)
                card.setAttribute('data-state', state);
                card.setAttribute('data-index', index);
                
                // Update positioning classes
                card.className = card.className.replace(/z-\d+/g, '');
                const zIndex = state === 'active' ? 'z-30' : (state === 'prev' ? 'z-10' : 'z-20');
                card.classList.add(zIndex);
                
                // Update opacity and width classes
                card.className = card.className.replace(/opacity-\d+/g, '');
                card.className = card.className.replace(/w-\[?\d+%?\]?/g, '');
                card.className = card.className.replace(/\bhidden\b/g, '');
                card.className = card.className.replace(/\bmd:block\b/g, '');
                const opacity = state === 'active' ? 'opacity-100' : 'opacity-60';
                const widthClasses = state === 'active' ? ['w-full', 'md:w-[45%]'] : ['w-[30%]', 'hidden', 'md:block'];
                card.classList.add(opacity, ...widthClasses);
            }
        });
        
        // Phase 2: Update card content in next frame (after transitions start)
        // Only update content if the slide index actually changed
        requestAnimationFrame(() => {
            slides.forEach((slide, i) => {
                const state = states[i];
                const index = slideIndices[i];
                const card = container.children[i];
                
                if (card) {
                    const currentIndex = parseInt(card.getAttribute('data-index') || '-1');
                    // Only update content if showing a different slide
                    if (currentIndex !== index) {
                        updateCardContent(card, slide, state);
                    }
                }
            });
        });

        // Play active video and pause others
        // Do this after content updates complete
        requestAnimationFrame(() => {
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
        });
    }

    /**
     * Navigate to a specific slide
     */
    function goToSlide(index, direction = 'next') {
        if (isTransitioning) return;
        
        isTransitioning = true;
        currentIndex = (index + SLIDES.length) % SLIDES.length;
        
        // Update cards - this will trigger CSS transitions smoothly
        renderCards();
        
        // Remove transition flag after animation completes
        setTimeout(() => {
            isTransitioning = false;
        }, REDUCED_MOTION ? 0 : 700);
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

        // Helper function to parse tools from comma-separated string
        function parseTools(toolsString) {
            if (!toolsString || toolsString.trim() === '') return [];
            return toolsString.split(',').map(tool => ({
                name: tool.trim(),
                icon: null
            }));
        }

        // Get video paths and tags from data attributes (set by Hugo template)
        const video1Path = carousel.getAttribute('data-video1') || '/videos/portfolio1.mp4';
        const video1Badge = carousel.getAttribute('data-video1-badge') || '';
        const video1Label = carousel.getAttribute('data-video1-label') || '';
        const video1Tools = parseTools(carousel.getAttribute('data-video1-tools') || '');

        const video2Path = carousel.getAttribute('data-video2') || '/videos/portfolio2.mp4';
        const video2Badge = carousel.getAttribute('data-video2-badge') || '';
        const video2Label = carousel.getAttribute('data-video2-label') || '';
        const video2Tools = parseTools(carousel.getAttribute('data-video2-tools') || '');

        const video3Path = carousel.getAttribute('data-video3') || '/videos/portfolio3.mp4';
        const video3Badge = carousel.getAttribute('data-video3-badge') || '';
        const video3Label = carousel.getAttribute('data-video3-label') || '';
        const video3Tools = parseTools(carousel.getAttribute('data-video3-tools') || '');

        // Configuration - Using available portfolio videos with tags
        // Update the outer scope SLIDES array
        SLIDES.length = 0; // Clear existing
        SLIDES.push(
            {
                id: 'portfolio1',
                label: video1Label || null,
                type: 'video',
                src: video1Path,
                poster: null,
                badge: video1Badge || null,
                tools: video1Tools
            },
            {
                id: 'portfolio2',
                label: video2Label || null,
                type: 'video',
                src: video2Path,
                poster: null,
                badge: video2Badge || null,
                tools: video2Tools
            },
            {
                id: 'portfolio3',
                label: video3Label || null,
                type: 'video',
                src: video3Path,
                poster: null,
                badge: video3Badge || null,
                tools: video3Tools
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
