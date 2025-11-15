<?php
require_once 'config.php';
$stmt = $pdo->query("
    SELECT c.id AS cancion_id, c.titulo AS song_title, c.archivo_url, c.duracion,
           al.titulo AS album_title, al.portada_url, a.nombre AS artist_name
    FROM canciones c
    JOIN albumes al ON c.id_album = al.id
    JOIN artistas a ON al.id_artista = a.id
    ORDER BY c.titulo
");
echo json_encode($stmt->fetchAll());
?>