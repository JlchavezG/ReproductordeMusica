CREATE TABLE IF NOT EXISTS reproductor_Music.liked_songs (
    id_usuario INT DEFAULT 1,
    id_cancion INT,
    fecha_like DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id_usuario, id_cancion),
    FOREIGN KEY (id_cancion) REFERENCES canciones(id) ON DELETE CASCADE
);