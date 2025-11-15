CREATE DATABASE reproductor_Music;
USE reproductor_Music;

-- Tabla: artistas
CREATE TABLE artistas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL
);

-- Tabla: generos
CREATE TABLE generos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL UNIQUE
);

-- Tabla: categorias (ej. "Chill", "Workout", "Focus", etc.)
CREATE TABLE categorias (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT
);

-- Tabla: albumes
CREATE TABLE albumes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    id_artista INT NOT NULL,
    portada_url VARCHAR(255),
    fecha_lanzamiento DATE,
    FOREIGN KEY (id_artista) REFERENCES artistas(id) ON DELETE CASCADE
);

-- Tabla: canciones
CREATE TABLE canciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(150) NOT NULL,
    duracion INT NOT NULL, -- en segundos
    id_album INT NOT NULL,
    id_genero INT,
    archivo_url VARCHAR(255) NOT NULL, -- URL del archivo de audio (puede ser local o CDN)
    FOREIGN KEY (id_album) REFERENCES albumes(id) ON DELETE CASCADE,
    FOREIGN KEY (id_genero) REFERENCES generos(id) ON DELETE SET NULL
);

-- Tabla: playlists (listas de reproducción)
CREATE TABLE playlists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(150) NOT NULL,
    descripcion TEXT,
    id_usuario INT DEFAULT 1, -- asumimos un solo usuario por ahora
    fecha_creacion DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: playlist_canciones (relación muchos a muchos)
CREATE TABLE playlist_canciones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_playlist INT NOT NULL,
    id_cancion INT NOT NULL,
    FOREIGN KEY (id_playlist) REFERENCES playlists(id) ON DELETE CASCADE,
    FOREIGN KEY (id_cancion) REFERENCES canciones(id) ON DELETE CASCADE
);

-- Tabla: categorias_playlists (relación muchos a muchos)
CREATE TABLE categorias_playlists (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_categoria INT NOT NULL,
    id_playlist INT NOT NULL,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id) ON DELETE CASCADE,
    FOREIGN KEY (id_playlist) REFERENCES playlists(id) ON DELETE CASCADE
);