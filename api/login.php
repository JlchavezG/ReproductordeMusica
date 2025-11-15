<?php
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    if (!$email || !$password) {
        http_response_code(400);
        echo json_encode(['error' => 'Email y contraseña requeridos']);
        exit;
    }

    $stmt = $pdo->prepare("SELECT id, nombre, password_hash FROM usuarios WHERE email = ?");
    $stmt->execute([$email]);
    $usuario = $stmt->fetch();

    if ($usuario && password_verify($password, $usuario['password_hash'])) {
        $_SESSION['usuario_id'] = $usuario['id'];
        $_SESSION['usuario_nombre'] = $usuario['nombre'];
        echo json_encode([
            'success' => true,
            'usuario' => ['id' => $usuario['id'], 'nombre' => $usuario['nombre']]
        ]);
    } else {
        http_response_code(401);
        echo json_encode(['error' => 'Credenciales inválidas']);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_SESSION['usuario_id'])) {
        echo json_encode([
            'logged_in' => true,
            'usuario' => [
                'id' => $_SESSION['usuario_id'],
                'nombre' => $_SESSION['usuario_nombre']
            ]
        ]);
    } else {
        echo json_encode(['logged_in' => false]);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    session_destroy();
    echo json_encode(['success' => true]);
    exit;
}
?>