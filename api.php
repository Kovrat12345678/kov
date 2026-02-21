<?php
header('Content-Type: application/json');

$file = 'products.json';

// Handle GET request to load products
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($file)) {
        echo file_get_contents($file);
    }
    else {
        echo json_encode([]);
    }
    exit;
}

// Handle POST request to save products
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);

    if ($data !== null) {
        if (file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE))) {
            echo json_encode(['success' => true, 'message' => 'Termékek elmentve!']);
        }
        else {
            http_response_code(500);
            echo json_encode(['success' => false, 'message' => 'Hiba a fájl mentésekor.']);
        }
    }
    else {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Érvénytelen JSON adat.']);
    }
    exit;
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
?>
