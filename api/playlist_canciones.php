<?php
require_once 'config.php';
if ($_SERVER['REQUEST_METHOD'] !== 'GET') exit;

$id_playlist = $_GET['id'] ?? null;
if (!$id_playlist) exit;

$stmt = $pdo->prepare("
    SELECT c.id AS cancion_id, c.titulo AS song_title, c.archivo_url, c.duracion,
           al.titulo AS album_title, al.portada_url, a.nombre AS artist_name
    FROM playlist_canciones pc
    JOIN canciones c ON pc.id_cancion = c.id
    JOIN albumes al ON c.id_album = al.id
    JOIN artistas a ON al.id_artista = a.id
    WHERE pc.id_playlist = ?
");
$stmt->execute([$id_playlist]);
echo json_encode($stmt->fetchAll());
?>