<?php
require_once 'config.php';
$usuario_id = $_SESSION['usuario_id'] ?? 1;

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->prepare("
        SELECT c.id AS cancion_id, c.titulo AS song_title, c.archivo_url, c.duracion,
               al.titulo AS album_title, al.portada_url, a.nombre AS artist_name
        FROM liked_songs ls
        JOIN canciones c ON ls.id_cancion = c.id
        JOIN albumes al ON c.id_album = al.id
        JOIN artistas a ON al.id_artista = a.id
        WHERE ls.id_usuario = :usuario_id
    ");
    $stmt->execute([':usuario_id' => $usuario_id]);
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id_cancion = (int)($data['id_cancion'] ?? 0);
    if (!$id_cancion) {
        http_response_code(400);
        echo json_encode(['error' => 'ID de canción requerido']);
        exit;
    }

    $existe = $pdo->prepare("SELECT 1 FROM liked_songs WHERE id_cancion = ? AND id_usuario = ?");
    $existe->execute([$id_cancion, $usuario_id]);
    
    if ($existe->fetch()) {
        $pdo->prepare("DELETE FROM liked_songs WHERE id_cancion = ? AND id_usuario = ?")->execute([$id_cancion, $usuario_id]);
        echo json_encode(['liked' => false]);
    } else {
        $pdo->prepare("INSERT INTO liked_songs (id_usuario, id_cancion) VALUES (?, ?)")->execute([$usuario_id, $id_cancion]);
        echo json_encode(['liked' => true]);
    }
    exit;
}
?>