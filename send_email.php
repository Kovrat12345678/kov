<?php
/**
 * Itthoni Bolt - Foglalás Email Kezelő
 * PHPMailer + Gmail SMTP
 */

error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

require_once __DIR__ . '/PHPMailer/src/Exception.php';
require_once __DIR__ . '/PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$config = require __DIR__ . '/email_config.php';

// Get POST data
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON']);
    exit();
}

if (empty($data['name']) || empty($data['email']) || empty($data['product_name'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Név, email és termék megadása kötelező!']);
    exit();
}

$name = htmlspecialchars(strip_tags(trim($data['name'])));
$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$phone = isset($data['phone']) ? htmlspecialchars(strip_tags(trim($data['phone']))) : 'Nincs megadva';
$productName = htmlspecialchars(strip_tags(trim($data['product_name'])));
$productPrice = isset($data['product_price']) ? htmlspecialchars(strip_tags(trim($data['product_price']))) : '';
$selectedTime = isset($data['selected_time']) ? htmlspecialchars(strip_tags(trim($data['selected_time']))) : 'Nincs megadva';
$message = isset($data['message']) ? htmlspecialchars(strip_tags(trim($data['message']))) : '';

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Érvénytelen email cím!']);
    exit();
}

// Log
$timestamp = date('Y-m-d H:i:s');
$logContent = "\n=== Új FOGLALÁS: $timestamp ===\n";
$logContent .= "Név: $name\nEmail: $email\nTelefon: $phone\n";
$logContent .= "Termék: $productName ($productPrice)\nIdőpont: $selectedTime\n";
if ($message)
    $logContent .= "Megjegyzés: $message\n";
file_put_contents(__DIR__ . '/reservations.log', $logContent, FILE_APPEND | LOCK_EX);

$mail = new PHPMailer(true);

try {
    // SMTP
    $mail->isSMTP();
    $mail->Host = $config['smtp_host'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['smtp_username'];
    $mail->Password = str_replace(' ', '', $config['smtp_password']);
    $mail->SMTPSecure = $config['smtp_secure'];
    $mail->Port = $config['smtp_port'];
    $mail->CharSet = 'UTF-8';

    // ========================
    // 1. EMAIL NEKED (tulaj)
    // ========================
    $mail->setFrom($config['smtp_username'], $config['from_name']);
    $mail->addAddress($config['recipient_email'], $config['recipient_name']);
    $mail->addReplyTo($email, $name);

    $mail->isHTML(true);
    $mail->Subject = "🛍️ Új foglalás: $productName – $name";

    $mail->Body = "
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 12px; overflow: hidden;'>
        <div style='background: linear-gradient(135deg, #8b5cf6, #ec4899); padding: 30px; text-align: center;'>
            <h2 style='color: #ffffff; margin: 0; font-size: 24px;'>🛍️ Itthoni Bolt</h2>
            <p style='color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;'>Új Foglalás Érkezett!</p>
        </div>
        <div style='background-color: #ffffff; padding: 30px;'>
            <div style='background: #f8f4ff; border-radius: 10px; padding: 20px; margin-bottom: 20px; border-left: 4px solid #8b5cf6;'>
                <h3 style='color: #8b5cf6; margin: 0 0 5px;'>$productName</h3>
                <p style='color: #666; margin: 0; font-size: 18px; font-weight: 700;'>$productPrice</p>
            </div>
            <table style='width: 100%; border-collapse: collapse;'>
                <tr>
                    <td style='padding: 12px 0; border-bottom: 1px solid #eee; width: 35%; color: #666;'><strong>👤 Foglaló neve:</strong></td>
                    <td style='padding: 12px 0; border-bottom: 1px solid #eee;'>$name</td>
                </tr>
                <tr>
                    <td style='padding: 12px 0; border-bottom: 1px solid #eee; color: #666;'><strong>📧 Email:</strong></td>
                    <td style='padding: 12px 0; border-bottom: 1px solid #eee;'><a href='mailto:$email' style='color: #8b5cf6;'>$email</a></td>
                </tr>
                <tr>
                    <td style='padding: 12px 0; border-bottom: 1px solid #eee; color: #666;'><strong>📱 Telefon:</strong></td>
                    <td style='padding: 12px 0; border-bottom: 1px solid #eee;'>$phone</td>
                </tr>
                <tr>
                    <td style='padding: 12px 0; border-bottom: 1px solid #eee; color: #666;'><strong>🕐 Átvétel ideje:</strong></td>
                    <td style='padding: 12px 0; border-bottom: 1px solid #eee; font-weight: 700; color: #8b5cf6;'>$selectedTime</td>
                </tr>" .
        ($message ? "
                <tr>
                    <td style='padding: 12px 0; color: #666;'><strong>💬 Megjegyzés:</strong></td>
                    <td style='padding: 12px 0;'>$message</td>
                </tr>" : "") . "
            </table>
            <p style='margin-top: 20px; color: #999; font-size: 12px;'>Küldve: $timestamp</p>
        </div>
    </div>";

    $mail->AltBody = "Itthoni Bolt - Új Foglalás\n\nTermék: $productName ($productPrice)\nNév: $name\nEmail: $email\nTelefon: $phone\nIdőpont: $selectedTime\n" . ($message ? "Megjegyzés: $message\n" : "");

    $mail->send();

    // ========================
    // 2. VISSZAIGAZOLÁS A VEVŐNEK
    // ========================
    $mail->clearAddresses();
    $mail->clearReplyTos();
    $mail->addAddress($email, $name);

    $mail->Subject = "Foglalás visszaigazolása – Itthoni Bolt";

    $mail->Body = "
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 12px; overflow: hidden;'>
        <div style='background: linear-gradient(135deg, #8b5cf6, #ec4899); padding: 30px; text-align: center;'>
            <h2 style='color: #ffffff; margin: 0; font-size: 24px;'>🛍️ Itthoni Bolt</h2>
            <p style='color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 16px;'>Foglalásod Megerősítve!</p>
        </div>
        <div style='background-color: #ffffff; padding: 30px;'>
            <p style='font-size: 16px;'>Kedves <strong>$name</strong>!</p>
            <p>Köszönjük a foglalásodat! Sikeresen rögzítettük az alábbi adatokat:</p>

            <div style='background: #f8f4ff; border-radius: 10px; padding: 20px; margin: 20px 0; border-left: 4px solid #8b5cf6;'>
                <h3 style='color: #8b5cf6; margin: 0 0 5px;'>$productName</h3>
                <p style='color: #666; margin: 0; font-size: 18px; font-weight: 700;'>$productPrice</p>
            </div>

            <table style='width: 100%; border-collapse: collapse; margin-bottom: 20px;'>
                <tr>
                    <td style='padding: 10px 0; border-bottom: 1px solid #eee; color: #666;'><strong>🕐 Átvétel időpontja:</strong></td>
                    <td style='padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 700; color: #8b5cf6;'>$selectedTime</td>
                </tr>
                <tr>
                    <td style='padding: 10px 0; color: #666;'><strong>📱 Telefonszámod:</strong></td>
                    <td style='padding: 10px 0;'>$phone</td>
                </tr>
            </table>

            <p style='color: #666;'>Hamarosan felvesszük veled a kapcsolatot a részletekkel kapcsolatban. Ha bármilyen kérdésed van, válaszolj erre az emailre!</p>

            <p style='margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; color: #999; font-size: 12px; text-align: center;'>
                Ez egy automatikus visszaigazolás.<br>
                &copy; " . date('Y') . " Itthoni Bolt
            </p>
        </div>
    </div>";

    $mail->AltBody = "Kedves $name!\n\nKöszönjük a foglalásodat!\n\nTermék: $productName ($productPrice)\nÁtvétel: $selectedTime\n\nHamarosan felvesszük veled a kapcsolatot!\n\nItthoni Bolt";

    $mail->send();

    echo json_encode(['success' => true, 'message' => 'Foglalás sikeresen elküldve!']);

}
catch (Exception $e) {
    error_log("PHPMailer Error: " . $mail->ErrorInfo);
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Hiba történt a küldéskor: ' . $mail->ErrorInfo
    ]);
}
?>
