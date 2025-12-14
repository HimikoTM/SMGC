<?php
header('Content-Type: application/json; charset=utf-8');

$input = json_decode(file_get_contents('php://input'), true);
$email    = $input['email'] ?? '';
$password = $input['password'] ?? '';
$species  = $input['species'] ?? '';

if (empty($email) || empty($password)) {
    http_response_code(400);
    echo json_encode(['type' => 'error', 'message' => 'Email и пароль обязательны']);
    exit;
}

$db = pg_connect("host=127.0.0.1 port=5432 dbname=bottle user=postgres password=");
if (!$db) {
    http_response_code(500);
    echo json_encode(['type' => 'error', 'message' => 'Ошибка подключения к БД']);
    exit;
}

if ($species === 'register') {
    $res = pg_query_params($db, "SELECT 1 FROM auth WHERE email = $1", [$email]);
    if (pg_num_rows($res) > 0) {
        pg_close($db);
        http_response_code(409);
        echo json_encode(['type' => 'email_exists', 'message' => 'Email уже используется']);
        exit;
    }

    pg_query_params($db, "INSERT INTO auth (email, password) VALUES ($1, $2)", [$email, $password]);
    pg_close($db);

    http_response_code(201);
    echo json_encode(['type' => 'register_success', 'message' => 'Регистрация успешна']);
    exit;
}

if ($species === 'login') {
    $res = pg_query_params($db, "SELECT password FROM auth WHERE email = $1", [$email]);
    if (pg_num_rows($res) === 0) {
        pg_close($db);
        http_response_code(401);
        echo json_encode(['type' => 'auth_failed', 'message' => 'Неверный email или пароль']);
        exit;
    }

    $row = pg_fetch_assoc($res);
    if ($row['password'] !== $password) {
        pg_close($db);
        http_response_code(401);
        echo json_encode(['type' => 'auth_failed', 'message' => 'Неверный email или пароль']);
        exit;
    }

    pg_close($db);
    http_response_code(200);
    echo json_encode(['type' => 'login_success', 'message' => 'Вход выполнен']);
    exit;
}
http_response_code(400);
echo json_encode(['type' => 'error', 'message' => 'Неизвестный тип запроса']);
exit;