INSERT INTO reproductor_Music.artistas (nombre) VALUES 
('Heroes del silencio'), ('Caifanes'), ('CafeTacuva'), ('La Castañeda'),
('The Weeknd'), ('The Cure'), ('Coldplay'), ('HIM'),('SodaStereo');

INSERT INTO reproductor_Music.generos (nombre) VALUES 
('Pop'), ('Rock'), ('Rock en español'), ('Electronico');

INSERT INTO reproductor_Music.albumes (titulo, id_artista, portada_url, fecha_lanzamiento) VALUES
('El espiritu del vino', 1, 'https://placehold.co/180x180/1DB954/FFFFFF?text=AfterHours', '2020-03-20'),
('El Nervio del Volcan', 2, 'https://placehold.co/180x180/E94B3C/FFFFFF?text=FutureNostalgia', '2020-03-27');

INSERT INTO reproductor_Music.canciones (titulo, duracion, id_album, id_genero, archivo_url) VALUES
('Sirena varada', 200, 1, 3, '/assets/audio/sirena_varada.mp3'),
('Afuera', 183, 2, 1, '/assets/audio/afuera.mp3');

INSERT INTO reproductor_Music.playlists (nombre, descripcion) VALUES
('My Chill Mix', 'Música relajante'),
('Workout 2025', 'Para el gym');