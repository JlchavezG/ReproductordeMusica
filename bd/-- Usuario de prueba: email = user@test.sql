-- Usuario de prueba: email = user@test.com, password = 123456
INSERT INTO reproductor_Music.usuarios (nombre, email, password_hash)
VALUES ('Usuario de Prueba', 'user@test.com', '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
ON DUPLICATE KEY UPDATE nombre = 'Usuario de Prueba';