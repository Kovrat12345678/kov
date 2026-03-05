<?php
/**
 * Kárai Art Gallery — API
 * Simple PHP API for managing paintings (JSON file storage)
 */

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$dataFile = __DIR__ . '/data/paintings.json';

// Ensure data file exists
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, '[]');
}

function readPaintings()
{
    global $dataFile;
    $json = file_get_contents($dataFile);
    return json_decode($json, true) ?: [];
}

function writePaintings($paintings)
{
    global $dataFile;
    file_put_contents($dataFile, json_encode($paintings, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

function getNextId($paintings)
{
    if (empty($paintings))
        return 1;
    return max(array_column($paintings, 'id')) + 1;
}

$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

try {
    switch ($method) {
        case 'GET':
            if ($action === 'list') {
                // List all paintings
                echo json_encode(readPaintings(), JSON_UNESCAPED_UNICODE);
            }
            else {
                echo json_encode(['error' => 'Unknown action'], JSON_UNESCAPED_UNICODE);
            }
            break;

        case 'POST':
            if ($action === 'add') {
                // Add new painting
                $paintings = readPaintings();

                $newPainting = [
                    'id' => getNextId($paintings),
                    'title_hu' => $_POST['title_hu'] ?? '',
                    'title_en' => $_POST['title_en'] ?? '',
                    'category' => $_POST['category'] ?? 'tajkep',
                    'details_hu' => $_POST['details_hu'] ?? '',
                    'details_en' => $_POST['details_en'] ?? '',
                    'price' => $_POST['price'] ?? '',
                    'image' => '',
                    'description_hu' => $_POST['description_hu'] ?? '',
                    'description_en' => $_POST['description_en'] ?? '',
                    'sold' => isset($_POST['sold']) && $_POST['sold'] === 'true'
                ];

                // Handle image upload
                if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                    $uploadDir = __DIR__ . '/images/';
                    if (!is_dir($uploadDir))
                        mkdir($uploadDir, 0755, true);

                    $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
                    $filename = 'painting_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
                    $targetPath = $uploadDir . $filename;

                    if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
                        $newPainting['image'] = 'images/' . $filename;
                    }
                }

                $paintings[] = $newPainting;
                writePaintings($paintings);

                echo json_encode(['success' => true, 'painting' => $newPainting], JSON_UNESCAPED_UNICODE);

            }
            elseif ($action === 'update') {
                // Update existing painting
                $paintings = readPaintings();
                $id = intval($_POST['id'] ?? 0);
                $found = false;

                foreach ($paintings as &$p) {
                    if ($p['id'] === $id) {
                        $p['title_hu'] = $_POST['title_hu'] ?? $p['title_hu'];
                        $p['title_en'] = $_POST['title_en'] ?? $p['title_en'];
                        $p['category'] = $_POST['category'] ?? $p['category'];
                        $p['details_hu'] = $_POST['details_hu'] ?? $p['details_hu'];
                        $p['details_en'] = $_POST['details_en'] ?? $p['details_en'];
                        $p['price'] = $_POST['price'] ?? $p['price'];
                        $p['description_hu'] = $_POST['description_hu'] ?? $p['description_hu'];
                        $p['description_en'] = $_POST['description_en'] ?? $p['description_en'];
                        $p['sold'] = isset($_POST['sold']) && $_POST['sold'] === 'true';

                        // Handle image upload (optional)
                        if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
                            $uploadDir = __DIR__ . '/images/';
                            $ext = pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION);
                            $filename = 'painting_' . time() . '_' . rand(1000, 9999) . '.' . $ext;
                            $targetPath = $uploadDir . $filename;

                            if (move_uploaded_file($_FILES['image']['tmp_name'], $targetPath)) {
                                $p['image'] = 'images/' . $filename;
                            }
                        }

                        $found = true;
                        break;
                    }
                }

                if ($found) {
                    writePaintings($paintings);
                    echo json_encode(['success' => true], JSON_UNESCAPED_UNICODE);
                }
                else {
                    echo json_encode(['error' => 'Painting not found'], JSON_UNESCAPED_UNICODE);
                }

            }
            elseif ($action === 'delete') {
                // Delete painting
                $paintings = readPaintings();
                $id = intval($_POST['id'] ?? 0);
                $paintings = array_values(array_filter($paintings, fn($p) => $p['id'] !== $id));
                writePaintings($paintings);
                echo json_encode(['success' => true], JSON_UNESCAPED_UNICODE);

            }
            elseif ($action === 'toggle-sold') {
                // Toggle sold status
                $paintings = readPaintings();
                $id = intval($_POST['id'] ?? 0);

                foreach ($paintings as &$p) {
                    if ($p['id'] === $id) {
                        $p['sold'] = !$p['sold'];
                        break;
                    }
                }

                writePaintings($paintings);
                echo json_encode(['success' => true], JSON_UNESCAPED_UNICODE);

            }
            else {
                echo json_encode(['error' => 'Unknown action'], JSON_UNESCAPED_UNICODE);
            }
            break;

        default:
            echo json_encode(['error' => 'Method not allowed'], JSON_UNESCAPED_UNICODE);
    }
}
catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
