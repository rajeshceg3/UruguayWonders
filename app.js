document.addEventListener('DOMContentLoaded', () => {
    const attractions = [
        {
            name: 'Cabo Polonio',
            coords: [-34.408, -53.784],
            image: 'https://loremflickr.com/800/600/dunes,beach',
            description: 'A remote and rustic village known for its sand dunes, sea lion colony, and lack of electricity.',
            details: 'Step into a world where time stands still. Cabo Polonio is a protected area with no electricity or running water, accessible only by 4x4 trucks or a long hike. Famous for its shifting sand dunes, one of the largest sea lion colonies in South America, and a lighthouse that guides sailors through the treacherous waters. At night, the lack of light pollution offers one of the most spectacular starry skies you will ever witness.'
        },
        {
            name: 'Punta del Diablo',
            coords: [-34.047, -53.545],
            image: 'https://loremflickr.com/800/600/fishing,village',
            description: 'A picturesque fishing village with colorful houses, beautiful beaches, and a bohemian atmosphere.',
            details: 'Originally a small fishing village, Punta del Diablo has evolved into a vibrant summer destination while keeping its rustic charm. Colorful wooden cabins dot the rocky coastline, and fishing boats still launch from the beach every morning. It is a paradise for surfers, artisans, and those seeking a laid-back vibe with stunning ocean views and fresh seafood.'
        },
        {
            name: 'Santa Teresa National Park',
            coords: [-33.974, -53.55],
            image: 'https://loremflickr.com/800/600/forest,fort',
            description: 'A vast coastal park featuring a historic fortress, pristine beaches, and extensive forests.',
            details: 'Immerse yourself in history and nature. This 3,000-hectare park houses the impressive Fortaleza de Santa Teresa, a Portuguese fort built in 1762. Beyond the stone walls lies a massive reserve of native and exotic flora, camping grounds, and four pristine beaches—La Moza, Las Achiras, Playa del Barco, and Playa Grande—perfect for surfing and solitude.'
        },
        {
            name: 'Quebrada de los Cuervos',
            coords: [-32.94, -54.44],
            image: 'https://loremflickr.com/800/600/canyon,valley',
            description: 'A stunning subtropical canyon offering hiking trails through lush vegetation.',
            details: 'A hidden gem in the Treinta y Tres department, the "Gorge of the Crows" is a deep canyon carved by the Yerbal Chico stream. It is a protected landscape with a unique microclimate that supports abundant subtropical flora and fauna. Hiking trails take you to panoramic viewpoints and down to the river, offering an adventurous escape into the wild heart of Uruguay.'
        },
        {
            name: 'Esteros de Farrapos',
            coords: [-33.15, -58.1],
            image: 'https://loremflickr.com/800/600/wetlands,river',
            description: 'A national park and wetlands of international importance, home to rich birdlife.',
            details: 'Part of a National Park along the Uruguay River, these wetlands are a Ramsar site of international importance. It is a mosaic of islands, swamps, and river channels that serve as a sanctuary for biodiversity. Visitors can explore by boat to see carpinchos (capybaras), river otters, and over 200 bird species, including the elegant black-necked swan.'
        },
        {
            name: 'Laguna de Rocha',
            coords: [-34.61, -54.29],
            image: 'https://loremflickr.com/800/600/lagoon,sunset',
            description: 'A coastal lagoon separated from the Atlantic by a sandbar, a haven for migratory birds.',
            details: 'A breathtaking protected landscape where the fresh water of the lagoon meets the salt water of the ocean, separated only by a narrow sandbar. This dynamic ecosystem is a birdwatcher’s paradise, hosting thousands of flamingos, swans, and migratory birds. The lagoon is also home to traditional shrimp fishermen who work by lantern light, creating a magical scene at dusk.'
        }
    ];

    const sidebar = document.getElementById('sidebar');
    const attractionList = document.getElementById('attraction-list');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const preloader = document.getElementById('preloader');

    // Detail Panel Elements
    const detailPanel = document.getElementById('detail-panel');
    const detailImage = document.getElementById('detail-image');
    const detailTitle = document.getElementById('detail-title');
    const detailDesc = document.getElementById('detail-desc');
    const closeBtn = detailPanel.querySelector('.close-btn');

    function openDetailPanel(attraction) {
        detailImage.src = attraction.image;
        detailTitle.textContent = attraction.name;
        detailDesc.textContent = attraction.details || attraction.description;

        detailPanel.classList.add('active');

        // Mobile UX: Close sidebar if open
        if (window.innerWidth <= 768) {
            sidebar.classList.remove('show');
            sidebarToggle.classList.remove('active');
        }
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            detailPanel.classList.remove('active');
        });
    }

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
                introText.style.transform = 'translateY(0) scale(1)';
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

        // Create sidebar item
        const listItem = document.createElement('li');

        const thumb = document.createElement('img');
        thumb.src = attraction.image;
        thumb.alt = attraction.name;
        thumb.className = 'list-thumb';

        const textSpan = document.createElement('span');
        textSpan.textContent = attraction.name;

        listItem.appendChild(thumb);
        listItem.appendChild(textSpan);

        listItem.dataset.index = index;
        // Animation is handled via class and delay
        listItem.style.opacity = '0'; // Ensure hidden

        attractionList.appendChild(listItem);

        // Store references
        markers.push({ marker, listItem });

        // Apply Tilt Effect
        tiltEffect(listItem);

        // Spotlight Effect
        listItem.addEventListener('mousemove', (e) => {
            const rect = listItem.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            listItem.style.setProperty('--x', `${x}px`);
            listItem.style.setProperty('--y', `${y}px`);
        });

        // Event listeners
        listItem.addEventListener('click', () => {
            map.flyTo(attraction.coords, 13, {
                animate: true,
                duration: 2.5, // Slower, more serene flight
                easeLinearity: 0.25
            });
            openDetailPanel(attraction);
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
            openDetailPanel(attraction);
        });
    });

    function animateListItems() {
        const items = document.querySelectorAll('#attraction-list li');
        items.forEach((item, index) => {
            item.style.animation = `slideIn 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards`;
            item.style.animationDelay = `${index * 0.08}s`;
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

    // Detail Panel Parallax
    if (detailPanel && detailImage) {
        detailPanel.addEventListener('mousemove', (e) => {
            const rect = detailPanel.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const xPercent = (x / rect.width - 0.5) * 2; // -1 to 1
            const yPercent = (y / rect.height - 0.5) * 2;

            detailImage.style.transition = 'transform 0.1s ease-out';
            detailImage.style.transform = `scale(1.1) translate(${-xPercent * 15}px, ${-yPercent * 15}px)`;
        });

        detailPanel.addEventListener('mouseleave', () => {
            detailImage.style.transition = 'transform 0.8s cubic-bezier(0.2, 0.8, 0.2, 1)';
            detailImage.style.transform = 'scale(1.0) translate(0, 0)';
        });
    }

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
