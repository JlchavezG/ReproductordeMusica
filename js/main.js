const audioPlayer = document.getElementById('audio-player');
const playbackProgress = document.querySelector('.playback-progress');
const currentTimeEl = document.querySelector('.time-info span:first-child');
const durationEl = document.querySelector('.time-info span:last-child');
const volumeIcon = document.querySelector('.volume-container i');
const volumeProgress = document.querySelector('.volume-progress');
const volumeBar = document.querySelector('.volume-bar');
const playbackBar = document.querySelector('.playback-bar');
const playButtons = document.querySelectorAll('.play-btn, .player-buttons .play');
const prevButton = document.querySelector('.fa-step-backward');
const nextButton = document.querySelector('.fa-step-forward');
const searchInput = document.getElementById('search-input');
const createPlaylistBtn = document.getElementById('create-playlist-btn');
const sidebarCreate = document.getElementById('sidebar-create-playlist');
const sidebarLibrary = document.getElementById('sidebar-your-library');
const sidebarLiked = document.getElementById('sidebar-liked-songs');
const sidebarHome = document.getElementById('sidebar-home');
const playlistModal = document.getElementById('playlist-modal');
const closeBtn = document.querySelector('.close-btn');
const playlistsContainer = document.querySelector('.playlists');
const userProfile = document.querySelector('.user-profile');
const loginModal = document.getElementById('login-modal');
const closeLoginBtn = document.getElementById('close-login');
const loginForm = document.getElementById('login-form');

let currentSong = null;
let songQueue = [];
let currentView = 'home';

const formatTime = (seconds) => {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
};

async function fetchData(endpoint) {
    const res = await fetch(`api/${endpoint}.php`);
    if (!res.ok) throw new Error(`Error en ${endpoint}`);
    return await res.json();
}

function renderCards(canciones, container) {
    container.innerHTML = '';
    canciones.forEach(c => {
        const card = document.createElement('div');
        card.className = 'card';
        const portada = c.portada_url || 'https://placehold.co/180x180/333/FFFFFF?text=No+Image';
        card.innerHTML = `
            <img src="${portada}" class="card-img" alt="${c.album_title || 'Álbum'}">
            <div class="card-title">${c.song_title || 'Sin título'}</div>
            <div class="card-text">${c.artist_name || 'Artista'}</div>
        `;
        card.addEventListener('click', () => reproducirCancion(c, canciones));
        container.appendChild(card);
    });
}

function reproducirCancion(cancion, queue = songQueue) {
    if (!cancion.cancion_id || !cancion.archivo_url) return;

    currentSong = cancion;
    songQueue = queue;

    let src = cancion.archivo_url;
    if (src.startsWith('/')) src = src.substring(1);
    audioPlayer.src = src;
    audioPlayer.load();
    audioPlayer.play().catch(e => console.warn('Play error:', e));

    document.querySelector('.now-playing .song-name').textContent = cancion.song_title || 'Unknown';
    document.querySelector('.now-playing .artist-name').textContent = cancion.artist_name || 'Artist';
    document.querySelector('.playing-now .song-title').textContent = cancion.song_title || 'Unknown';
    document.querySelector('.playing-now .song-artist').textContent = cancion.artist_name || 'Artist';

    const img56 = (cancion.portada_url || '').replace(/180x180/, '56x56');
    const img60 = (cancion.portada_url || '').replace(/180x180/, '60x60');
    document.querySelector('.now-playing img').src = img56 || 'https://placehold.co/56x56/1DB954/FFFFFF?text=NP';
    document.querySelector('.playing-now img').src = img60 || 'https://placehold.co/60x60/1DB954/FFFFFF?text=Song';

    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.dataset.cancionId = cancion.cancion_id;
    });

    fetch('api/liked.php')
        .then(res => res.json())
        .then(likedSongs => {
            const isLiked = Array.isArray(likedSongs) && likedSongs.some(s => 
                String(s.cancion_id) === String(cancion.cancion_id)
            );
            document.querySelectorAll('.like-btn').forEach(btn => {
                if (isLiked) {
                    btn.classList.add('liked');
                } else {
                    btn.classList.remove('liked');
                }
            });
        });

    playButtons.forEach(btn => {
        btn.classList.remove('fa-play', 'fa-pause');
        btn.classList.add('fa-pause');
    });
}

async function toggleLike() {
    const cancionId = currentSong?.cancion_id;
    if (!cancionId) return;

    const res = await fetch('api/liked.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_cancion: cancionId })
    });
    const data = await res.json();

    document.querySelectorAll('.like-btn').forEach(btn => {
        btn.classList.toggle('liked', data.liked);
    });
}

function clearMainContent() {
    document.querySelectorAll('.cards-container').forEach(c => c.innerHTML = '');
}

async function cargarHome() {
    currentView = 'home';
    clearMainContent();
    const canciones = await fetchData('canciones');
    const containers = document.querySelectorAll('.cards-container');
    if (containers[0]) renderCards(canciones.slice(0, 4), containers[0]);
    if (containers[1]) renderCards(canciones.slice(0, 4), containers[1]);
    if (containers[2]) renderCards(canciones.slice(0, 4), containers[2]);
}

async function cargarYourLibrary() {
    currentView = 'library';
    setActiveNav(sidebarLibrary);
    clearMainContent();
    const liked = await fetchData('liked');
    const container = document.querySelector('.cards-container');
    const h3 = document.createElement('h3');
    h3.textContent = 'Liked Songs';
    h3.className = 'text-white';
    container.appendChild(h3);
    if (liked.length > 0) {
        renderCards(liked, container);
        songQueue = liked;
    } else {
        container.innerHTML += '<p class="text-secondary">No liked songs yet.</p>';
    }
}

async function cargarLikedSongs() {
    currentView = 'liked';
    setActiveNav(sidebarLiked);
    clearMainContent();
    const liked = await fetchData('liked');
    const container = document.querySelector('.cards-container');
    const h3 = document.createElement('h3');
    h3.textContent = 'Liked Songs';
    h3.className = 'text-white';
    container.appendChild(h3);
    renderCards(liked, container);
    songQueue = liked;
}

async function cargarPlaylists() {
    const playlists = await fetchData('playlists');
    playlistsContainer.innerHTML = '';
    playlists.forEach(p => {
        const el = document.createElement('div');
        el.className = 'playlist-item';
        el.textContent = p.nombre;
        el.dataset.id = p.id;
        el.addEventListener('click', () => cargarPlaylist(p.id));
        playlistsContainer.appendChild(el);
    });
}

async function cargarPlaylist(id) {
    if (id == 999) {
        cargarLikedSongs();
        return;
    }
    const canciones = await fetch(`api/playlist_canciones.php?id=${id}`).then(r => r.json());
    clearMainContent();
    const container = document.querySelector('.cards-container');
    const h3 = document.createElement('h3');
    h3.textContent = 'Playlist';
    h3.className = 'text-white';
    container.appendChild(h3);
    renderCards(canciones, container);
    songQueue = canciones;
}

function setActiveNav(el) {
    document.querySelectorAll('.nav-link').forEach(n => n.classList.remove('active'));
    el.classList.add('active');
}

function togglePlayPause() {
    if (audioPlayer.paused || audioPlayer.ended) {
        if (!currentSong) {
            alert('Select a song first.');
            return;
        }
        audioPlayer.play();
        playButtons.forEach(btn => {
            btn.classList.remove('fa-play');
            btn.classList.add('fa-pause');
        });
    } else {
        audioPlayer.pause();
        playButtons.forEach(btn => {
            btn.classList.remove('fa-pause');
            btn.classList.add('fa-play');
        });
    }
}

playButtons.forEach(btn => btn.addEventListener('click', togglePlayPause));
document.querySelectorAll('.like-btn').forEach(btn => btn.addEventListener('click', toggleLike));

prevButton.addEventListener('click', () => {
    if (!currentSong || songQueue.length === 0) return;
    if (audioPlayer.currentTime > 3) {
        audioPlayer.currentTime = 0;
    } else {
        const idx = songQueue.findIndex(s => s.cancion_id == currentSong.cancion_id);
        if (idx > 0) reproducirCancion(songQueue[idx - 1]);
    }
});

nextButton.addEventListener('click', () => {
    if (!currentSong || songQueue.length === 0) return;
    const idx = songQueue.findIndex(s => s.cancion_id == currentSong.cancion_id);
    if (idx < songQueue.length - 1) {
        reproducirCancion(songQueue[idx + 1]);
    }
});

volumeBar.addEventListener('click', (e) => {
    const width = volumeBar.clientWidth;
    const clickX = e.offsetX;
    const vol = Math.max(0, Math.min(1, clickX / width));
    audioPlayer.volume = vol;
    volumeProgress.style.width = `${vol * 100}%`;
    if (vol === 0) volumeIcon.className = 'fas fa-volume-mute';
    else if (vol < 0.5) volumeIcon.className = 'fas fa-volume-down';
    else volumeIcon.className = 'fas fa-volume-up';
});

playbackBar.addEventListener('click', (e) => {
    if (audioPlayer.duration) {
        const width = playbackBar.clientWidth;
        const clickX = e.offsetX;
        audioPlayer.currentTime = (clickX / width) * audioPlayer.duration;
    }
});

audioPlayer.addEventListener('timeupdate', () => {
    if (audioPlayer.duration) {
        const pct = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        playbackProgress.style.width = `${pct}%`;
        currentTimeEl.textContent = formatTime(audioPlayer.currentTime);
    }
});

audioPlayer.addEventListener('loadedmetadata', () => {
    durationEl.textContent = formatTime(audioPlayer.duration);
});

audioPlayer.addEventListener('ended', () => {
    const idx = songQueue.findIndex(s => s.cancion_id == currentSong.cancion_id);
    if (idx < songQueue.length - 1) {
        reproducirCancion(songQueue[idx + 1]);
    } else {
        playButtons.forEach(btn => {
            btn.classList.remove('fa-pause');
            btn.classList.add('fa-play');
        });
    }
});

sidebarHome.addEventListener('click', (e) => { e.preventDefault(); cargarHome(); setActiveNav(sidebarHome); });
sidebarLibrary.addEventListener('click', (e) => { e.preventDefault(); cargarYourLibrary(); });
sidebarLiked.addEventListener('click', (e) => { e.preventDefault(); cargarLikedSongs(); });
createPlaylistBtn.addEventListener('click', () => playlistModal.style.display = 'flex');
sidebarCreate.addEventListener('click', (e) => { e.preventDefault(); playlistModal.style.display = 'flex'; });

closeBtn.addEventListener('click', () => playlistModal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === playlistModal) playlistModal.style.display = 'none';
});

document.querySelector('.playlist-form')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nombre = e.target[0].value.trim();
    const desc = e.target[1].value.trim();

    const res = await fetch('api/playlists.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion: desc })
    });
    const data = await res.json();
    alert(`Playlist "${data.nombre}" created!`);
    e.target.reset();
    playlistModal.style.display = 'none';
    cargarPlaylists();
});

searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    document.querySelectorAll('.card').forEach(card => {
        const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
        const artist = card.querySelector('.card-text')?.textContent.toLowerCase() || '';
        card.style.display = (title.includes(term) || artist.includes(term)) ? 'block' : 'none';
    });
});

// === Login ===
userProfile.addEventListener('click', (e) => {
    e.stopPropagation();
    fetch('api/login.php')
        .then(res => res.json())
        .then(data => {
            if (data.logged_in) {
                if (confirm('¿Cerrar sesión?')) {
                    fetch('api/login.php', { method: 'DELETE' })
                        .then(() => location.reload());
                }
            } else {
                loginModal.style.display = 'flex';
            }
        });
});

closeLoginBtn?.addEventListener('click', () => loginModal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === loginModal) loginModal.style.display = 'none';
});

loginForm?.addEventListener('submit', (e) => {
    e.preventDefault(); // ← ¡ESTO ES CLAVE!
    const email = loginForm.querySelector('input[type="email"]').value;
    const password = loginForm.querySelector('input[type="password"]').value;

    fetch('api/login.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            alert('¡Bienvenido, ' + data.usuario.nombre + '!');
            loginModal.style.display = 'none';
            location.reload();
        } else {
            alert('Error: ' + (data.error || 'Credenciales inválidas'));
        }
    });
});

document.addEventListener('DOMContentLoaded', async () => {
    audioPlayer.volume = 0.7;
    volumeProgress.style.width = '70%';
    volumeIcon.className = 'fas fa-volume-up';

    const userRes = await fetch('api/login.php');
    const userData = await userRes.json();
    if (userData.logged_in) {
        document.querySelector('.user-profile span').textContent = userData.usuario.nombre;
    }

    try {
        await cargarPlaylists();
        await cargarHome();
        setActiveNav(sidebarHome);
    } catch (err) {
        console.error('Error al iniciar:', err);
    }
});