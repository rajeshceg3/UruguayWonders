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

    // Preloader Logic
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
                // Trigger list animations after preloader is gone
                animateListItems();
            }, 500);
        }, 800);
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

    L.control.zoom({
        position: 'bottomright'
    }).addTo(map);

    const markers = [];

    attractions.forEach((attraction, index) => {
        // Create marker
        const customIcon = L.divIcon({
            className: 'custom-marker',
            html: '',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
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

        // Event listeners
        listItem.addEventListener('click', () => {
            map.flyTo(attraction.coords, 13, {
                animate: true,
                duration: 2.0, // Slower, more serene flight
                easeLinearity: 0.25
            });
            setTimeout(() => {
                marker.openPopup();
            }, 2000);
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
        // Optional: Deselect items when clicking map
        // markers.forEach(item => {
        //     item.listItem.classList.remove('active');
        //     item.marker.getElement().classList.remove('active');
        // });
    });
});
