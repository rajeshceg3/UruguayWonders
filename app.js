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

    const map = L.map('map', {
        zoomControl: false // We'll add it in a different position
    }).setView([-32.5228, -55.7658], 7);

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
        attractionList.appendChild(listItem);

        // Store references
        markers.push({ marker, listItem });

        // Event listeners
        listItem.addEventListener('click', () => {
            map.flyTo(attraction.coords, 13, {
                animate: true,
                duration: 1.5
            });
            setTimeout(() => {
                marker.openPopup();
            }, 1000); // Open popup after flying
            setActive(index);
        });

        marker.on('click', () => {
            setActive(index);
        });
    });

    function setActive(index) {
        markers.forEach((item, i) => {
            if (i === index) {
                item.listItem.classList.add('active');
                item.marker.getElement().classList.add('active');
            } else {
                item.listItem.classList.remove('active');
                item.marker.getElement().classList.remove('active');
            }
        });
    }

    sidebarToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        sidebar.classList.toggle('show');
        sidebarToggle.classList.toggle('active');
        // Adjust toggle button position when sidebar is open for mobile
        if (window.innerWidth <= 768) {
            if (sidebar.classList.contains('show')) {
                sidebarToggle.style.left = `calc(100% - 55px)`;
            } else {
                sidebarToggle.style.left = '15px';
            }
        }
    });

    map.on('click', () => {
        if (sidebar.classList.contains('show')) {
            sidebar.classList.remove('show');
            sidebarToggle.classList.remove('active');
            if (window.innerWidth <= 768) {
                sidebarToggle.style.left = '15px';
            }
        }
        markers.forEach(item => {
            item.listItem.classList.remove('active');
            item.marker.getElement().classList.remove('active');
        });
    });
});
