<?php
require_once 'config.php';
$usuario_id = $_SESSION['usuario_id'] ?? 1;

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->prepare("SELECT id, nombre FROM playlists WHERE id_usuario = ? ORDER BY fecha_creacion DESC");
    $stmt->execute([$usuario_id]);
    echo json_encode($stmt->fetchAll());
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $nombre = trim($data['nombre'] ?? '');
    $descripcion = trim($data['descripcion'] ?? '');

    if (!$nombre) {
        http_response_code(400);
        echo json_encode(['error' => 'Nombre requerido']);
        exit;
    }

    $pdo->beginTransaction();
    try {
        $stmt = $pdo->prepare("INSERT INTO playlists (nombre, descripcion, id_usuario) VALUES (?, ?, ?)");
        $stmt->execute([$nombre, $descripcion, $usuario_id]);
        $playlist_id = $pdo->lastInsertId();

        $canciones = $pdo->query("SELECT id FROM canciones LIMIT 5")->fetchAll(PDO::FETCH_COLUMN);
        foreach ($canciones as $id_cancion) {
            $pdo->prepare("INSERT INTO playlist_canciones (id_playlist, id_cancion) VALUES (?, ?)")
                 ->execute([$playlist_id, $id_cancion]);
        }

        $pdo->commit();
        echo json_encode(['id' => (int)$playlist_id, 'nombre' => $nombre]);
    } catch (Exception $e) {
        $pdo->rollback();
        http_response_code(500);
        echo json_encode(['error' => 'Error al crear playlist']);
    }
    exit;
}
?>