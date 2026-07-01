// ================================================================
//  БАЗА ДАННЫХ (имитация)
// ================================================================

// Пользователи: владельцы, няни, админ
let users = [
    { id: 1, name: 'Анна Петрова', email: 'anna@mail.ru', password: '123456', role: 'owner', phone: '+7 999 123-45-67',
        avatar: 'А' },
    { id: 2, name: 'Дмитрий Крылов', email: 'dima@mail.ru', password: '123456', role: 'nanny', phone: '+7 916 222-33-44',
        avatar: 'Д' },
    { id: 3, name: 'Екатерина Ветрова', email: 'katya@mail.ru', password: '123456', role: 'nanny',
        phone: '+7 903 444-55-66', avatar: 'Е' },
    { id: 4, name: 'Максим Соколов', email: 'max@mail.ru', password: '123456', role: 'nanny', phone: '+7 925 777-88-99',
        avatar: 'М' },
    { id: 5, name: 'Алиса Морозова', email: 'alisa@mail.ru', password: '123456', role: 'nanny',
        phone: '+7 968 112-33-44', avatar: 'А' },
    { id: 6, name: 'Виталий Зайцев', email: 'vitaly@mail.ru', password: '123456', role: 'nanny',
        phone: '+7 915 666-55-22', avatar: 'В' },
    { id: 7, name: 'Администратор', email: 'admin@petbuddy.ru', password: 'admin123', role: 'admin', avatar: 'A' },
];

// Анкеты нянь (расширенные данные) - все точки в жилых районах Тольятти
let nannyProfiles = {
    2: { // Дмитрий Крылов - Центральный район
        specialization: ['собаки', 'кошки'],
        experience: 3,
        education: 'Ветеринарный колледж',
        price: 600,
        schedule: 'Пн-Вс 10:00-20:00',
        about: 'Люблю собак и кошек, есть опыт выгула.',
        video: '',
        photos: [],
        services: ['выгул'],
        city: 'Тольятти',
        district: 'Центральный',
        lat: 53.5075,
        lng: 49.4205,
        rating: 4.7,
        reviews: [
            { author: 'Елена', text: 'Пунктуальный, собака довольна', stars: 5 },
            { author: 'Алексей', text: 'Хороший выгул', stars: 4 }
        ]
    },
    3: { // Екатерина Ветрова - Центральный район (рядом с Дмитрием)
        specialization: ['кошки', 'грызуны'],
        experience: 5,
        education: 'Зоопсихолог',
        price: 1500,
        schedule: 'Круглосуточно',
        about: 'Передержка кошек и грызунов с любовью.',
        video: '',
        photos: [],
        services: ['передержка', 'уход'],
        city: 'Тольятти',
        district: 'Центральный',
        lat: 53.5100,
        lng: 49.4150,
        rating: 5.0,
        reviews: [
            { author: 'Ольга', text: 'Лучшая няня, котик в восторге', stars: 5 },
            { author: 'Павел', text: 'Профессионал', stars: 5 }
        ]
    },
    4: { // Максим Соколов - Центральный район (рядом с Дмитрием)
        specialization: ['собаки'],
        experience: 2,
        education: 'Кинолог',
        price: 550,
        schedule: 'Пн-Пт 08:00-19:00',
        about: 'Выгул собак любых пород.',
        video: '',
        photos: [],
        services: ['выгул'],
        city: 'Тольятти',
        district: 'Центральный',
        lat: 53.5050,
        lng: 49.4250,
        rating: 4.4,
        reviews: [
            { author: 'Дарья', text: 'Хорошо гуляет', stars: 4 },
            { author: 'Кирилл', text: 'Аккуратный', stars: 4.5 }
        ]
    },
    5: { // Алиса Морозова - Центральный район (рядом с Дмитрием)
        specialization: ['кошки', 'птицы'],
        experience: 4,
        education: 'Ветеринарный техник',
        price: 1300,
        schedule: 'Пн-Вс 09:00-21:00',
        about: 'Забота о кошках и птицах.',
        video: '',
        photos: [],
        services: ['передержка', 'кормление'],
        city: 'Тольятти',
        district: 'Центральный',
        lat: 53.5090,
        lng: 49.4280,
        rating: 4.8,
        reviews: [
            { author: 'Сергей', text: 'Очень заботливая', stars: 5 }
        ]
    },
    6: { // Виталий Зайцев - Центральный район (рядом с Дмитрием)
        specialization: ['собаки', 'кошки', 'грызуны'],
        experience: 6,
        education: 'Ветеринарный университет',
        price: 1100,
        schedule: 'Круглосуточно',
        about: 'Опыт работы в клинике, передержка и выгул.',
        video: '',
        photos: [],
        services: ['выгул', 'передержка', 'уход'],
        city: 'Тольятти',
        district: 'Центральный',
        lat: 53.5120,
        lng: 49.4220,
        rating: 4.6,
        reviews: [
            { author: 'Наталья', text: 'Профессионал', stars: 5 },
            { author: 'Артём', text: 'Отличный сервис', stars: 4 }
        ]
    }
};

// Заказы (история)
let orders = [];

// Текущий авторизованный пользователь
let currentUser = null;

// Состояние фильтров
let filterState = {
    animal: 'all',
    service: 'all',
    maxPrice: 3000,
    rating: 0,
    location: '',
    searchQuery: ''
};

let map, mapMarkers = [];
let userLat = null,
    userLng = null;
let currentFilteredNannies = [];

// ================================================================
//  ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ================================================================

function getNannyList() {
    // Собираем всех нянь с их профилями
    return users
        .filter(u => u.role === 'nanny')
        .map(u => {
            const profile = nannyProfiles[u.id] || {};
            return {
                id: u.id,
                name: u.name,
                phone: u.phone,
                avatar: u.avatar,
                ...profile,
                rating: profile.rating || 4.0,
                reviews: profile.reviews || [],
                price: profile.price || 800,
                services: profile.services || ['выгул'],
                specialization: profile.specialization || ['собаки', 'кошки'],
                city: profile.city || 'Тольятти',
                district: profile.district || 'Центральный',
                lat: profile.lat || 53.5201 + (Math.random() - 0.5) * 0.05,
                lng: profile.lng || 49.3890 + (Math.random() - 0.5) * 0.05,
                about: profile.about || 'Опытная зооняня.',
                experience: profile.experience || 2,
                education: profile.education || 'Опыт работы с животными',
                schedule: profile.schedule || 'По договорённости',
            };
        });
}

function computeDistance(lat1, lng1, lat2, lng2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function getNanniesWithDistance(nannies) {
    if (userLat === null || userLng === null) {
        return nannies.map(n => ({ ...n, distance: null }));
    }
    return nannies.map(n => {
        const dist = computeDistance(userLat, userLng, n.lat, n.lng);
        return { ...n, distance: dist };
    });
}

function filterNannies(nannies, filters) {
    return nannies.filter(n => {
        // Поисковый запрос
        if (filters.searchQuery) {
            const q = filters.searchQuery.toLowerCase();
            const matchName = n.name.toLowerCase().includes(q);
            const matchService = n.services.some(s => s.includes(q));
            const matchSpec = n.specialization.some(s => s.includes(q));
            if (!matchName && !matchService && !matchSpec) return false;
        }
        // Тип животного
        if (filters.animal !== 'all') {
            if (!n.specialization.some(s => s.includes(filters.animal))) return false;
        }
        // Услуга
        if (filters.service !== 'all') {
            if (!n.services.some(s => s.includes(filters.service))) return false;
        }
        // Цена
        if (n.price > filters.maxPrice) return false;
        // Рейтинг
        if (filters.rating > 0 && n.rating < filters.rating) return false;
        // Локация (грубо)
        if (filters.location) {
            const loc = filters.location.toLowerCase();
            const matchCity = n.city && n.city.toLowerCase().includes(loc);
            const matchDistrict = n.district && n.district.toLowerCase().includes(loc);
            if (!matchCity && !matchDistrict) return false;
        }
        return true;
    });
}

// ================================================================
//  ОБНОВЛЕНИЕ UI (карта + список)
// ================================================================

function updateUI() {
    let nannies = getNannyList();
    let filtered = filterNannies(nannies, filterState);
    filtered = getNanniesWithDistance(filtered);
    // Сортировка по рейтингу (по умолчанию)
    filtered.sort((a, b) => b.rating - a.rating);
    currentFilteredNannies = filtered;

    // Обновляем список
    const container = document.getElementById('nanniesListContainer');
    const countSpan = document.getElementById('nannyCount');
    const countDisplay = document.getElementById('nannyCountDisplay');
    countSpan.textContent = filtered.length;
    countDisplay.textContent = `Найдено: ${filtered.length}`;

    if (filtered.length === 0) {
        container.innerHTML =
        `<div style="padding:2rem;text-align:center;color:var(--text-light);">Нет нянь по выбранным фильтрам</div>`;
    } else {
        let html = '';
        filtered.forEach(n => {
            const stars = '★'.repeat(Math.floor(n.rating)) + (n.rating % 1 >= 0.5 ? '½' : '');
            const distText = n.distance !== null ? ` • ${n.distance.toFixed(1)} км` : '';
            const specText = n.specialization.join(', ');
            const serviceTags = n.services.map(s =>
                `<span class="service-tag">${s}</span>`
            ).join('');
            const reviewCount = n.reviews.length;
            html += `
                <div class="nanny-card" data-id="${n.id}">
                    <div class="nanny-header">
                        <div>
                            <span class="nanny-name">${n.name}</span>
                            <span class="nanny-spec">${specText}</span>
                        </div>
                        <span class="rating-badge">${n.rating} ${stars}</span>
                    </div>
                    <div class="services-tags">${serviceTags}</div>
                    <div style="display:flex; gap:0.8rem; flex-wrap:wrap; margin:4px 0;">
                        <span class="price-tag">${n.price} руб/сутки</span>
                        <span style="font-size:0.8rem; color:var(--text-light);">${reviewCount} отзывов</span>
                    </div>
                    <div class="nanny-footer">
                        <span class="nanny-distance">${n.city || 'Тольятти'}, ${n.district || 'Центральный'}${distText}</span>
                        <button class="hire-btn-small" data-id="${n.id}">Нанять</button>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;

        // Обработчики для карточек
        container.querySelectorAll('.nanny-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.classList.contains('hire-btn-small')) return;
                const id = parseInt(card.dataset.id);
                const nanny = currentFilteredNannies.find(n => n.id === id);
                if (nanny && map) {
                    map.setView([nanny.lat, nanny.lng], 15);
                    openPopupForNanny(nanny);
                }
            });
        });
        container.querySelectorAll('.hire-btn-small').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = parseInt(btn.dataset.id);
                const nanny = currentFilteredNannies.find(n => n.id === id);
                if (!nanny) return;
                if (!currentUser) {
                    alert('Пожалуйста, войдите в систему, чтобы оставить заявку.');
                    openModal('login');
                    return;
                }
                if (currentUser.role === 'nanny') {
                    alert('Няни не могут оставлять заявки на свои же услуги. Переключитесь на роль владельца.');
                    return;
                }
                // Создаём заявку
                orders.push({
                    id: Date.now(),
                    userId: currentUser.id,
                    nannyId: nanny.id,
                    nannyName: nanny.name,
                    date: new Date().toLocaleDateString(),
                    status: 'ожидает',
                    service: nanny.services[0] || 'выгул',
                    price: nanny.price,
                    message: 'Заявка через сайт'
                });
                alert(`Заявка няне ${nanny.name} отправлена! Проверьте историю заказов.`);
            });
        });
    }

    updateMapMarkers(filtered);
}

// ================================================================
//  КАРТА
// ================================================================

function initMap() {
    map = L.map('map').setView([53.5201, 49.3890], 12); // Тольятти, центр
    L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> & CartoDB',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(map);
    updateUI();
}

function updateMapMarkers(nannies) {
    if (!map) return;
    mapMarkers.forEach(m => map.removeLayer(m));
    mapMarkers = [];

    nannies.forEach(n => {
        const popupContent = `
            <b>${n.name}</b><br>
            ${n.rating} (${n.reviews.length} отзывов)<br>
            ${n.specialization.join(', ')}<br>
            ${n.price} руб/сутки<br>
            ${n.phone || 'не указан'}<br>
            <button id="popupHire_${n.id}" style="background:#4a7c59; color:white; border:none; padding:6px 18px; border-radius:40px; margin-top:6px; cursor:pointer; font-weight:600;">Нанять</button>
        `;
        const marker = L.marker([n.lat, n.lng]).addTo(map);
        marker.bindPopup(popupContent);
        marker.on('popupopen', () => {
            const btn = document.getElementById(`popupHire_${n.id}`);
            if (btn) {
                btn.onclick = () => {
                    if (!currentUser) {
                        alert('Войдите в систему, чтобы оставить заявку.');
                        openModal('login');
                        return;
                    }
                    alert(`Заявка няне ${n.name} отправлена! (демо)`);
                };
            }
        });
        mapMarkers.push(marker);
    });
}

function openPopupForNanny(nanny) {
    mapMarkers.forEach(m => {
        const latlng = m.getLatLng();
        if (Math.abs(latlng.lat - nanny.lat) < 0.0001 && Math.abs(latlng.lng - nanny.lng) < 0.0001) {
            m.openPopup();
        }
    });
}

function getUserLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                userLat = pos.coords.latitude;
                userLng = pos.coords.longitude;
                map.setView([userLat, userLng], 14);
                if (window.userMarker) map.removeLayer(window.userMarker);
                const icon = L.divIcon({ className: 'user-location-marker', html: '📍', iconSize: [24, 24] });
                window.userMarker = L.marker([userLat, userLng], { icon }).addTo(map);
                window.userMarker.bindPopup('Вы здесь').openPopup();
                updateUI();
            },
            () => {
                alert('Не удалось определить геолокацию. Проверьте разрешения в браузере.');
            }
        );
    } else {
        alert('Геолокация не поддерживается вашим браузером.');
    }
}

// ================================================================
//  МОДАЛЬНЫЕ ОКНА (аутентификация, профиль, админ)
// ================================================================

function openModal(type, data = null) {
    const overlay = document.getElementById('modalOverlay');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');

    overlay.classList.add('active');

    if (type === 'login') {
        title.textContent = 'Вход';
        body.innerHTML = `
            <form id="loginForm">
                <label>Email</label>
                <input type="email" id="loginEmail" placeholder="email@example.ru" value="admin@petbuddy.ru" />
                <label>Пароль</label>
                <input type="password" id="loginPassword" placeholder="••••••••" value="admin123" />
                <button type="submit" class="btn-submit">Войти</button>
                <p style="text-align:center; margin-top:1rem; font-size:0.9rem; color:var(--text-light);">
                    Нет аккаунта? <a href="#" id="switchToRegister" style="color:var(--primary); font-weight:600;">Зарегистрироваться</a>
                </p>
            </form>
        `;
        document.getElementById('loginForm').addEventListener('submit', handleLogin);
        document.getElementById('switchToRegister').addEventListener('click', (e) => {
            e.preventDefault();
            openModal('register');
        });
    } else if (type === 'register') {
        title.textContent = 'Регистрация';
        body.innerHTML = `
            <form id="registerForm">
                <label>Имя</label>
                <input type="text" id="regName" placeholder="Иван Иванов" required />
                <label>Email</label>
                <input type="email" id="regEmail" placeholder="email@example.ru" required />
                <label>Телефон</label>
                <input type="text" id="regPhone" placeholder="+7 999 123-45-67" />
                <label>Пароль</label>
                <input type="password" id="regPassword" placeholder="минимум 6 символов" required />
                <label>Роль</label>
                <div class="role-selector">
                    <label><input type="radio" name="regRole" value="owner" checked /> Владелец</label>
                    <label><input type="radio" name="regRole" value="nanny" /> Зооняня</label>
                </div>
                <button type="submit" class="btn-submit">Зарегистрироваться</button>
                <p style="text-align:center; margin-top:1rem; font-size:0.9rem; color:var(--text-light);">
                    Уже есть аккаунт? <a href="#" id="switchToLogin" style="color:var(--primary); font-weight:600;">Войти</a>
                </p>
            </form>
        `;
        document.getElementById('registerForm').addEventListener('submit', handleRegister);
        document.getElementById('switchToLogin').addEventListener('click', (e) => {
            e.preventDefault();
            openModal('login');
        });
    } else if (type === 'profile') {
        if (!currentUser) { openModal('login'); return; }
        title.textContent = 'Личный кабинет';
        const isNanny = currentUser.role === 'nanny';
        const profile = nannyProfiles[currentUser.id] || {};
        body.innerHTML = `
            <form id="profileForm">
                <label>Имя</label>
                <input type="text" id="profName" value="${currentUser.name}" />
                <label>Телефон</label>
                <input type="text" id="profPhone" value="${currentUser.phone || ''}" />
                <label>Email</label>
                <input type="email" id="profEmail" value="${currentUser.email}" disabled style="background:#f0f0f0;" />
                <label>Роль: <strong>${currentUser.role === 'owner' ? 'Владелец' : currentUser.role === 'nanny' ? 'Зооняня' : 'Администратор'}</strong></label>
                ${isNanny ? `
                    <hr style="margin:1rem 0; border-color:var(--border-light);" />
                    <h3 style="color:var(--primary-dark);">Анкета няни</h3>
                    <label>Специализация (через запятую)</label>
                    <input type="text" id="profSpec" value="${(profile.specialization || []).join(', ')}" />
                    <label>Опыт (лет)</label>
                    <input type="number" id="profExp" value="${profile.experience || 0}" />
                    <label>Образование</label>
                    <input type="text" id="profEdu" value="${profile.education || ''}" />
                    <label>Цена (руб/сутки)</label>
                    <input type="number" id="profPrice" value="${profile.price || 800}" />
                    <label>График работы</label>
                    <input type="text" id="profSchedule" value="${profile.schedule || ''}" />
                    <label>О себе</label>
                    <textarea id="profAbout">${profile.about || ''}</textarea>
                    <label>Город</label>
                    <input type="text" id="profCity" value="${profile.city || 'Тольятти'}" />
                    <label>Район</label>
                    <input type="text" id="profDistrict" value="${profile.district || 'Центральный'}" />
                ` : ''}
                <button type="submit" class="btn-submit">Сохранить изменения</button>
                ${currentUser.role === 'admin' ? `<button type="button" id="openAdminBtn" class="btn-submit" style="background:var(--accent); margin-top:0.8rem;">Админ-панель</button>` : ''}
                <button type="button" id="logoutBtn" class="btn-submit" style="background:#e74c3c; margin-top:0.5rem;">Выйти</button>
            </form>
        `;
        document.getElementById('profileForm').addEventListener('submit', handleProfileUpdate);
        document.getElementById('logoutBtn').addEventListener('click', handleLogout);
        const adminBtn = document.getElementById('openAdminBtn');
        if (adminBtn) adminBtn.addEventListener('click', () => openModal('admin'));
    } else if (type === 'orders') {
        if (!currentUser) { openModal('login'); return; }
        title.textContent = 'Мои заказы';
        const userOrders = orders.filter(o => o.userId === currentUser.id);
        let html = `
            <div style="max-height:400px; overflow-y:auto;">
                ${userOrders.length === 0 ? '<p style="color:var(--text-light);">У вас пока нет заказов.</p>' : ''}
                ${userOrders.map(o => `
                    <div style="background:var(--bg-soft); padding:0.8rem 1.2rem; border-radius:var(--radius-sm); margin-bottom:0.6rem; border-left:4px solid ${o.status === 'завершён' ? 'var(--primary)' : 'var(--accent)'};">
                        <strong>${o.nannyName}</strong> — ${o.service}
                        <br /><small>Дата: ${o.date} • Статус: ${o.status} • ${o.price} руб</small>
                        ${o.status === 'ожидает' ? `<button class="btn-danger" style="padding:0.2rem 1rem; border-radius:30px; font-size:0.7rem; margin-left:0.5rem;" onclick="cancelOrder(${o.id})">Отменить</button>` : ''}
                    </div>
                `).join('')}
            </div>
            <p style="margin-top:0.8rem; font-size:0.8rem; color:var(--text-light);">Всего заказов: ${userOrders.length}</p>
        `;
        body.innerHTML = html;
    } else if (type === 'admin') {
        if (!currentUser || currentUser.role !== 'admin') {
            alert('Доступ запрещён. Только для администратора.');
            closeModal();
            return;
        }
        title.textContent = 'Админ-панель';
        renderAdminPanel(body);
    }
}

function closeModal() {
    document.getElementById('modalOverlay').classList.remove('active');
}

// ================================================================
//  ОБРАБОТЧИКИ АУТЕНТИФИКАЦИИ
// ================================================================

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) {
        alert('Неверный email или пароль.');
        return;
    }
    currentUser = user;
    closeModal();
    updateAuthUI();
    updateUI();
    alert(`Добро пожаловать, ${user.name}! (роль: ${user.role})`);
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('regName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const password = document.getElementById('regPassword').value;
    const role = document.querySelector('input[name="regRole"]:checked').value;

    if (!name || !email || password.length < 6) {
        alert('Заполните все поля. Пароль минимум 6 символов.');
        return;
    }
    if (users.find(u => u.email === email)) {
        alert('Пользователь с таким email уже существует.');
        return;
    }

    const newUser = {
        id: users.length + 1,
        name,
        email,
        password,
        role,
        phone,
        avatar: name.charAt(0).toUpperCase(),
    };
    users.push(newUser);
    if (role === 'nanny') {
        nannyProfiles[newUser.id] = {
            specialization: ['собаки', 'кошки'],
            experience: 0,
            education: '',
            price: 800,
            schedule: 'По договорённости',
            about: '',
            services: ['выгул'],
            city: 'Тольятти',
            district: 'Центральный',
            lat: 53.5201 + (Math.random() - 0.5) * 0.05,
            lng: 49.3890 + (Math.random() - 0.5) * 0.05,
            rating: 4.0,
            reviews: [],
        };
    }
    currentUser = newUser;
    closeModal();
    updateAuthUI();
    updateUI();
    alert(`Регистрация успешна! Добро пожаловать, ${name}!`);
}

function handleLogout() {
    currentUser = null;
    closeModal();
    updateAuthUI();
    updateUI();
    alert('Вы вышли из системы.');
}

function handleProfileUpdate(e) {
    e.preventDefault();
    if (!currentUser) return;
    const name = document.getElementById('profName').value.trim();
    const phone = document.getElementById('profPhone').value.trim();

    currentUser.name = name;
    currentUser.phone = phone;

    // Обновляем профиль няни
    if (currentUser.role === 'nanny') {
        const profile = nannyProfiles[currentUser.id] || {};
        profile.specialization = document.getElementById('profSpec').value.split(',').map(s => s.trim()).filter(Boolean);
        profile.experience = parseInt(document.getElementById('profExp').value) || 0;
        profile.education = document.getElementById('profEdu').value.trim();
        profile.price = parseInt(document.getElementById('profPrice').value) || 800;
        profile.schedule = document.getElementById('profSchedule').value.trim();
        profile.about = document.getElementById('profAbout').value.trim();
        profile.city = document.getElementById('profCity').value.trim() || 'Тольятти';
        profile.district = document.getElementById('profDistrict').value.trim() || 'Центральный';
        nannyProfiles[currentUser.id] = profile;
    }

    // Обновляем пользователя в массиве
    const idx = users.findIndex(u => u.id === currentUser.id);
    if (idx !== -1) users[idx] = currentUser;

    updateAuthUI();
    updateUI();
    alert('Профиль обновлён!');
    closeModal();
}

function cancelOrder(orderId) {
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx !== -1) {
        orders.splice(idx, 1);
        openModal('orders');
        alert('Заказ отменён.');
    }
}

// ================================================================
//  АДМИН-ПАНЕЛЬ
// ================================================================

function renderAdminPanel(container) {
    let html = `
        <div class="admin-tabs">
            <button class="active" data-tab="users">Пользователи</button>
            <button data-tab="nannies">Анкеты</button>
            <button data-tab="reviews">Отзывы</button>
            <button data-tab="orders">Заказы</button>
        </div>
        <div id="adminTabContent">
            ${renderAdminUsers()}
        </div>
    `;
    container.innerHTML = html;

    container.querySelectorAll('.admin-tabs button').forEach(btn => {
        btn.addEventListener('click', () => {
            container.querySelectorAll('.admin-tabs button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const tab = btn.dataset.tab;
            const content = document.getElementById('adminTabContent');
            if (tab === 'users') content.innerHTML = renderAdminUsers();
            else if (tab === 'nannies') content.innerHTML = renderAdminNannies();
            else if (tab === 'reviews') content.innerHTML = renderAdminReviews();
            else if (tab === 'orders') content.innerHTML = renderAdminOrders();
        });
    });
}

function renderAdminUsers() {
    let html = `<div class="admin-list">`;
    users.forEach(u => {
        html += `
            <div class="admin-item">
                <span><strong>${u.name}</strong> (${u.role}) — ${u.email}</span>
                <div>
                    <button class="btn-warn" onclick="adminAction('promote', ${u.id})">Повысить</button>
                    <button class="btn-danger" onclick="adminAction('deleteUser', ${u.id})">Удалить</button>
                </div>
            </div>
        `;
    });
    html += `</div>`;
    return html;
}

function renderAdminNannies() {
    const nannies = users.filter(u => u.role === 'nanny');
    let html = `<div class="admin-list">`;
    nannies.forEach(u => {
        const p = nannyProfiles[u.id] || {};
        html += `
            <div class="admin-item">
                <span><strong>${u.name}</strong> — ${p.specialization ? p.specialization.join(', ') : 'нет спец.'} (${p.price || 0} руб)</span>
                <div>
                    <button class="btn-approve" onclick="adminAction('editNanny', ${u.id})">Редактировать</button>
                    <button class="btn-danger" onclick="adminAction('deleteNanny', ${u.id})">Удалить</button>
                </div>
            </div>
        `;
    });
    html += `</div>`;
    return html;
}

function renderAdminReviews() {
    let allReviews = [];
    Object.keys(nannyProfiles).forEach(id => {
        const p = nannyProfiles[id];
        if (p.reviews) {
            p.reviews.forEach(r => {
                allReviews.push({ ...r, nannyId: id, nannyName: users.find(u => u.id == id)?.name || 'Няня' });
            });
        }
    });
    let html = `<div class="admin-list">`;
    if (allReviews.length === 0) {
        html += `<p style="color:var(--text-light);">Нет отзывов для модерации.</p>`;
    } else {
        allReviews.forEach((r, i) => {
            html += `
                <div class="admin-item">
                    <span><strong>${r.author}</strong> → ${r.nannyName}: "${r.text}" (${r.stars})</span>
                    <div>
                        <button class="btn-warn" onclick="adminAction('deleteReview', ${i})">Удалить</button>
                    </div>
                </div>
            `;
        });
    }
    html += `</div>`;
    return html;
}

function renderAdminOrders() {
    let html = `<div class="admin-list">`;
    if (orders.length === 0) {
        html += `<p style="color:var(--text-light);">Нет заказов.</p>`;
    } else {
        orders.forEach(o => {
            html += `
                <div class="admin-item">
                    <span><strong>${o.nannyName}</strong> — ${o.service} (${o.status})</span>
                    <div>
                        <button class="btn-approve" onclick="adminAction('completeOrder', ${o.id})">Завершить</button>
                        <button class="btn-danger" onclick="adminAction('deleteOrder', ${o.id})">Удалить</button>
                    </div>
                </div>
            `;
        });
    }
    html += `</div>`;
    return html;
}

// Глобальные админ-экшены
window.adminAction = function(action, id) {
    if (action === 'deleteUser') {
        if (!confirm('Удалить пользователя?')) return;
        users = users.filter(u => u.id !== id);
        delete nannyProfiles[id];
        openModal('admin');
        updateUI();
    } else if (action === 'promote') {
        const user = users.find(u => u.id === id);
        if (user && user.role !== 'admin') {
            user.role = 'admin';
            alert(`${user.name} теперь администратор!`);
            openModal('admin');
        }
    } else if (action === 'deleteNanny') {
        if (!confirm('Удалить анкету няни?')) return;
        delete nannyProfiles[id];
        const user = users.find(u => u.id === id);
        if (user) user.role = 'owner';
        openModal('admin');
        updateUI();
    } else if (action === 'editNanny') {
        alert('Редактирование анкеты: перейдите в профиль няни (в разработке).');
    } else if (action === 'deleteReview') {
        if (!confirm('Удалить отзыв?')) return;
        // Удаляем первый найденный отзыв (упрощённо)
        for (let key in nannyProfiles) {
            const p = nannyProfiles[key];
            if (p.reviews && p.reviews.length > 0) {
                p.reviews.pop();
                break;
            }
        }
        openModal('admin');
        updateUI();
    } else if (action === 'completeOrder') {
        const order = orders.find(o => o.id === id);
        if (order) order.status = 'завершён';
        openModal('admin');
        updateUI();
    } else if (action === 'deleteOrder') {
        orders = orders.filter(o => o.id !== id);
        openModal('admin');
        updateUI();
    }
};

// ================================================================
//  ОБНОВЛЕНИЕ UI АУТЕНТИФИКАЦИИ
// ================================================================

function updateAuthUI() {
    const authBtns = document.getElementById('authButtons');
    const avatar = document.getElementById('userAvatar');
    const navAdmin = document.getElementById('navAdmin');
    const navProfile = document.getElementById('navProfile');
    const navOrders = document.getElementById('navOrders');

    if (currentUser) {
        authBtns.style.display = 'none';
        avatar.style.display = 'flex';
        avatar.textContent = currentUser.avatar || currentUser.name.charAt(0).toUpperCase();
        avatar.title = currentUser.name;
        if (currentUser.role === 'admin') {
            navAdmin.style.display = 'inline';
        } else {
            navAdmin.style.display = 'none';
        }
        navProfile.style.display = 'inline';
        navOrders.style.display = 'inline';
    } else {
        authBtns.style.display = 'flex';
        avatar.style.display = 'none';
        navAdmin.style.display = 'none';
        navProfile.style.display = 'none';
        navOrders.style.display = 'none';
    }
}

// ================================================================
//  НАВИГАЦИЯ
// ================================================================

document.querySelectorAll('.nav a').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const page = link.dataset.page;
        document.querySelectorAll('.nav a').forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        if (page === 'home') {
            document.getElementById('heroSection').scrollIntoView({ behavior: 'smooth' });
        } else if (page === 'search') {
            document.getElementById('searchSection').scrollIntoView({ behavior: 'smooth' });
        } else if (page === 'profile') {
            openModal('profile');
        } else if (page === 'orders') {
            openModal('orders');
        } else if (page === 'admin') {
            if (currentUser && currentUser.role === 'admin') {
                openModal('admin');
            } else {
                alert('Доступ запрещён. Только для администратора.');
            }
        }
    });
});

// ================================================================
//  ОБРАБОТЧИКИ СОБЫТИЙ UI
// ================================================================

document.getElementById('closeModalBtn').addEventListener('click', closeModal);
document.getElementById('modalOverlay').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeModal();
});

// Кнопки входа/регистрации
document.getElementById('loginBtn').addEventListener('click', () => openModal('login'));
document.getElementById('registerBtn').addEventListener('click', () => openModal('register'));
document.getElementById('userAvatar').addEventListener('click', () => openModal('profile'));

// Поиск в hero
document.getElementById('heroSearchBtn').addEventListener('click', () => {
    const query = document.getElementById('heroSearchInput').value.trim();
    filterState.searchQuery = query;
    updateUI();
    document.getElementById('searchSection').scrollIntoView({ behavior: 'smooth' });
});
document.getElementById('heroSearchInput').addEventListener('keyup', (e) => {
    if (e.key === 'Enter') document.getElementById('heroSearchBtn').click();
});

// Быстрые категории
document.querySelectorAll('.cat-item').forEach(el => {
    el.addEventListener('click', () => {
        document.querySelectorAll('.cat-item').forEach(c => c.classList.remove('active'));
        el.classList.add('active');
        const val = el.dataset.filter;
        if (val === 'all') {
            filterState.animal = 'all';
            filterState.service = 'all';
        } else if (['собаки', 'кошки', 'грызуны', 'птицы', 'рептилии'].includes(val)) {
            filterState.animal = val;
            filterState.service = 'all';
        } else if (['выгул', 'передержка', 'уход', 'кормление'].includes(val)) {
            filterState.service = val;
            filterState.animal = 'all';
        }
        document.getElementById('filterAnimal').value = filterState.animal;
        document.getElementById('filterService').value = filterState.service;
        updateUI();
    });
});

// Фильтры
document.getElementById('applyFiltersBtn').addEventListener('click', () => {
    filterState.animal = document.getElementById('filterAnimal').value;
    filterState.service = document.getElementById('filterService').value;
    filterState.maxPrice = parseInt(document.getElementById('priceRange').value);
    filterState.rating = parseFloat(document.getElementById('filterRating').value);
    filterState.location = document.getElementById('filterLocation').value.trim();
    updateUI();
});

// Ценовой диапазон
document.getElementById('priceRange').addEventListener('input', (e) => {
    document.getElementById('priceDisplay').textContent = `до ${e.target.value} руб`;
});

// Геолокация
document.getElementById('getLocationBtn').addEventListener('click', getUserLocation);
document.getElementById('resetMapBtn').addEventListener('click', () => {
    if (map) map.setView([53.5201, 49.3890], 12); // Тольятти
    userLat = null;
    userLng = null;
    if (window.userMarker) {
        map.removeLayer(window.userMarker);
        window.userMarker = null;
    }
    updateUI();
});

// ================================================================
//  ЗАПУСК
// ================================================================

// Инициализация карты после загрузки
window.addEventListener('load', () => {
    initMap();
    // Автоматический запрос геолокации с задержкой
    setTimeout(() => {
        if (confirm('Разрешить геолокацию для поиска нянь рядом с вами?')) {
            getUserLocation();
        }
    }, 600);
    // Проверяем, есть ли сохранённый пользователь (для демо оставляем)
    updateAuthUI();
});

// Добавим пару заказов для демонстрации
orders.push({ id: 1001, userId: 1, nannyId: 3, nannyName: 'Екатерина Ветрова', date: '2026-01-15', status: 'завершён',
    service: 'передержка', price: 1500, message: '' });
orders.push({ id: 1002, userId: 1, nannyId: 2, nannyName: 'Дмитрий Крылов', date: '2026-01-20', status: 'ожидает',
    service: 'выгул', price: 600, message: '' });

console.log('Pet Buddy загружена!');
console.log('Тестовые пользователи:', users.map(u => `${u.name} (${u.role})`));
console.log('admin@petbuddy.ru / admin123');
console.log('anna@mail.ru / 123456 (владелец)');
console.log('dima@mail.ru / 123456 (няня)');