-- Crear playlist especial: Liked Songs (ID fijo = 0 o 999)
INSERT INTO reproductor_Music.playlists (id, nombre, descripcion) 
VALUES (999, 'Liked Songs', 'Tus canciones favoritas')
ON DUPLICATE KEY UPDATE nombre = 'Liked Songs';