<?php
header('Content-Type: application/json');
require_once 'config.php';
session_start();
$usuario_id = $_SESSION['usuario_id'] ?? 1; // fallback a 1 si no hay sesión

$termino = $_GET['q'] ?? '';
if (!$termino) {
    echo json_encode([]);
    exit;
}

$termino = "%$termino%";

$sql = "
    SELECT 
        c.id,
        c.titulo AS song_title,
        a.nombre AS artist_name,
        al.portada_url
    FROM canciones c
    JOIN albumes al ON c.id_album = al.id
    JOIN artistas a ON al.id_artista = a.id
    WHERE c.titulo LIKE ? OR a.nombre LIKE ?
";

$stmt = $pdo->prepare($sql);
$stmt->execute([$termino, $termino]);
$resultados = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($resultados);
?>