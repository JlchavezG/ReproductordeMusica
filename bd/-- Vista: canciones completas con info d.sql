-- Vista: canciones completas con info de artista y álbum
CREATE OR REPLACE VIEW reproductor_music.vista_canciones AS
SELECT 
    c.id AS cancion_id,
    c.titulo AS song_title,
    c.duracion,
    c.archivo_url,
    al.titulo AS album_title,
    al.portada_url,
    a.nombre AS artist_name
FROM reproductor_music.canciones c
JOIN reproductor_music.albumes al ON c.id_album = al.id
JOIN reproductor_music.artistas a ON al.id_artista = a.id;