document.addEventListener('DOMContentLoaded', () => {
    const attractions = [
        {
            name: 'Cabo Polonio',
            coords: [-34.408, -53.784],
            description: 'A remote and rustic village known for its sand dunes, sea lion colony, and lack of electricity, offering a unique off-the-grid experience.'
        },
        {
            name: 'Punta del Diablo',
            coords: [-34.047, -53.545],
            description: 'A picturesque fishing village with colorful houses, beautiful beaches, and a bohemian atmosphere, popular with surfers and artists.'
        },
        {
            name: 'Santa Teresa National Park',
            coords: [-33.974, -53.55],
            description: 'A vast coastal park featuring a historic fortress, pristine beaches, extensive forests, and well-maintained camping facilities.'
        },
        {
            name: 'Quebrada de los Cuervos',
            coords: [-32.94, -54.44],
            description: 'A stunning subtropical canyon and protected landscape, offering hiking trails through lush vegetation and unique geological formations.'
        },
        {
            name: 'Esteros de Farrapos',
            coords: [-33.15, -58.1],
            description: 'A national park and wetlands of international importance, home to a rich diversity of birdlife and aquatic ecosystems.'
        },
        {
            name: 'Laguna de Rocha',
            coords: [-34.61, -54.29],
            description: 'A coastal lagoon separated from the Atlantic by a sandbar, designated as a biosphere reserve and a haven for migratory birds.'
        }
    ];

    const sidebar = document.getElementById('sidebar');
    const attractionList = document.getElementById('attraction-list');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const preloader = document.getElementById('preloader');

    // Custom Cursor Logic
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    // Check if device has coarse pointer (touch) to avoid logic errors or weird visuals
    const isTouch = window.matchMedia("(pointer: coarse)").matches;

    if (!isTouch && cursorDot && cursorOutline) {
        let cursorX = 0, cursorY = 0;
        let outlineX = 0, outlineY = 0;

        window.addEventListener('mousemove', (e) => {
            cursorX = e.clientX;
            cursorY = e.clientY;

            // Dot follows immediately
            cursorDot.style.left = `${cursorX}px`;
            cursorDot.style.top = `${cursorY}px`;
        });

        // Loop for outline - uses requestAnimationFrame for performance
        function animateCursor() {
            // Smooth interpolation
            outlineX += (cursorX - outlineX) * 0.15;
            outlineY += (cursorY - outlineY) * 0.15;

            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;

            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        // Hover effects via delegation
        document.body.addEventListener('mouseover', (e) => {
            const target = e.target.closest('a, button, li, .leaflet-interactive, .map-control-btn');
            if (target) {
                cursorOutline.classList.add('cursor-hover');
                cursorDot.classList.add('cursor-hover');
            }
        });

        document.body.addEventListener('mouseout', (e) => {
            const target = e.target.closest('a, button, li, .leaflet-interactive, .map-control-btn');
            if (target) {
                cursorOutline.classList.remove('cursor-hover');
                cursorDot.classList.remove('cursor-hover');
            }
        });
    }

    // Preloader Logic
    window.addEventListener('load', () => {
        const introText = preloader.querySelector('.intro-text');

        // Step 1: Reveal Text
        setTimeout(() => {
            if (introText) {
                introText.style.opacity = '1';
                introText.style.transform = 'translateY(0)';
            }

            // Step 2: Fade Out Preloader
            setTimeout(() => {
                preloader.classList.add('fade-out');

                // Step 3: Remove from DOM & Animate List
                setTimeout(() => {
                    preloader.style.display = 'none';
                    animateListItems();

                    // Trigger sidebar entrance
                    setTimeout(() => {
                        sidebar.classList.add('show');
                        // Also show zoom controls if on desktop
                        if (window.innerWidth > 768) {
                            const controls = document.querySelector('.custom-map-controls');
                            if(controls) controls.style.opacity = '1';
                        }
                    }, 200);
                }, 800); // Match CSS transition time
            }, 2000); // Time to read the text
        }, 500);
    });

    const map = L.map('map', {
        zoomControl: false
    }).setView([-32.5228, -55.7658], 7);

    // Using a light, clean map style to match the pastel theme
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager_labels_under/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);

    // Custom Zoom Controls
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');

    if (zoomInBtn && zoomOutBtn) {
        zoomInBtn.addEventListener('click', () => map.zoomIn());
        zoomOutBtn.addEventListener('click', () => map.zoomOut());

        // Add Magnetic Effect to zoom controls too
        magneticEffect(zoomInBtn);
        magneticEffect(zoomOutBtn);
    }

    const markers = [];

    attractions.forEach((attraction, index) => {
        // Create marker
        const customIcon = L.divIcon({
            className: 'marker-beacon',
            html: '',
            iconSize: [20, 20],
            iconAnchor: [10, 10]
        });

        const marker = L.marker(attraction.coords, { icon: customIcon }).addTo(map);

        const popupContent = `
            <h3>${attraction.name}</h3>
            <p>${attraction.description}</p>
        `;
        marker.bindPopup(popupContent);

        // Create sidebar item
        const listItem = document.createElement('li');
        listItem.textContent = attraction.name;
        listItem.dataset.index = index;
        // Animation is handled via class and delay
        listItem.style.opacity = '0'; // Ensure hidden

        attractionList.appendChild(listItem);

        // Store references
        markers.push({ marker, listItem });

        // Apply Tilt Effect
        tiltEffect(listItem);

        // Event listeners
        listItem.addEventListener('click', () => {
            map.flyTo(attraction.coords, 13, {
                animate: true,
                duration: 2.5, // Slower, more serene flight
                easeLinearity: 0.25
            });
            setTimeout(() => {
                marker.openPopup();
            }, 2500);
            setActive(index);
        });

        listItem.addEventListener('mouseenter', () => {
            const markerEl = marker.getElement();
            if (markerEl) markerEl.classList.add('hover-active');
        });

        listItem.addEventListener('mouseleave', () => {
             const markerEl = marker.getElement();
             if (markerEl) markerEl.classList.remove('hover-active');
        });

        marker.on('click', () => {
            setActive(index);
            map.flyTo(attraction.coords, 13, {
                animate: true,
                duration: 2.0
            });
        });
    });

    function animateListItems() {
        const items = document.querySelectorAll('#attraction-list li');
        items.forEach((item, index) => {
            item.style.animation = `slideIn 0.5s ease forwards`;
            item.style.animationDelay = `${index * 0.1}s`;
        });
    }

    function setActive(index) {
        markers.forEach((item, i) => {
            const markerEl = item.marker.getElement();
            if (i === index) {
                item.listItem.classList.add('active');
                markerEl.classList.add('active');

                // Add bounce animation
                markerEl.classList.remove('bounce');
                void markerEl.offsetWidth; // Trigger reflow
                markerEl.classList.add('bounce');
            } else {
                item.listItem.classList.remove('active');
                markerEl.classList.remove('active');
                markerEl.classList.remove('bounce');
            }
        });
    }

    sidebarToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('show');
        sidebarToggle.classList.toggle('active');
    });

    map.on('click', () => {
        if (window.innerWidth <= 768 && sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
            sidebarToggle.classList.remove('active');
        }
    });

    // Apply Magnetic Effect to Sidebar Toggle
    magneticEffect(sidebarToggle);

    /* --- Visual Effect Helpers --- */

    function magneticEffect(element) {
        if (!element) return;

        let rect;

        // Cache rect on mouse enter to prevent layout thrashing
        element.addEventListener('mouseenter', () => {
            rect = element.getBoundingClientRect();
            element.style.transition = 'transform 0.1s ease-out';
        });

        element.addEventListener('mousemove', (e) => {
            if (!rect) rect = element.getBoundingClientRect(); // Fallback safety

            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Magnetic pull
            element.style.transform = `translate(${x * 0.4}px, ${y * 0.4}px) scale(1.1)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            element.style.transform = '';
            rect = null; // Clear cache
        });
    }

    function tiltEffect(element) {
        if (!element) return;

        let rect;

        element.addEventListener('mouseenter', () => {
            rect = element.getBoundingClientRect();
            // Remove transition for instant follow
            element.style.transition = 'none';
        });

        element.addEventListener('mousemove', (e) => {
            if (!rect) rect = element.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -8; // Max deg
            const rotateY = ((x - centerX) / centerX) * 8;

            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
            element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            rect = null;
        });
    }
});
