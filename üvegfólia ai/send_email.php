<?php
/**
 * Contact Form Email Handler
 * PHPMailer + Gmail SMTP
 */

// Disable error display, log instead
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set headers for JSON response
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed']);
    exit();
}

// Load PHPMailer
require_once __DIR__ . '/PHPMailer/src/Exception.php';
require_once __DIR__ . '/PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Load config
$config = require __DIR__ . '/email_config.php';

// Get POST data
$rawInput = file_get_contents('php://input');
$data = json_decode($rawInput, true);

// Check if JSON parsing failed
if (json_last_error() !== JSON_ERROR_NONE) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Invalid JSON data']);
    exit();
}

// Validate required fields
if (empty($data['name']) || empty($data['email'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Név és Email megadása kötelező!']);
    exit();
}

$type = isset($data['type']) ? $data['type'] : 'contact';
$name = htmlspecialchars(strip_tags(trim($data['name'])));
$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$phone = isset($data['phone']) ? htmlspecialchars(strip_tags(trim($data['phone']))) : 'Nincs megadva';
$address = isset($data['address']) ? htmlspecialchars(strip_tags(trim($data['address']))) : '';
$message = isset($data['message']) ? htmlspecialchars(strip_tags(trim($data['message']))) : '';
$cart = isset($data['cart']) ? $data['cart'] : [];
$total = isset($data['total']) ? $data['total'] : 0;

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Érvénytelen email cím!']);
    exit();
}

// Format items for logs and plain text
$itemsText = "";
$itemsHtml = "";
if (!empty($cart)) {
    foreach ($cart as $item) {
        $priceFormatted = number_format($item['price'], 0, ',', ' ') . " Ft";
        $itemsText .= "- {$item['brand']} {$item['model']}: {$item['name']} ($priceFormatted)\n";
        $itemsHtml .= "
        <tr>
            <td style='padding: 8px; border-bottom: 1px solid #eee;'>{$item['brand']} {$item['model']}</td>
            <td style='padding: 8px; border-bottom: 1px solid #eee;'>{$item['name']}</td>
            <td style='padding: 8px; border-bottom: 1px solid #eee; text-align: right;'>$priceFormatted</td>
        </tr>";
    }
}

// Save to log file (backup)
$timestamp = date('Y-m-d H:i:s');
$logContent = "\n=== Új " . ($type === 'order' ? 'RENDELÉS' : 'üzenet') . ": $timestamp ===\n";
$logContent .= "Név: $name\nEmail: $email\nTelefon: $phone\n";
if ($type === 'order') {
    $logContent .= "Cím: $address\nTermékek:\n$itemsText Összesen: " . number_format($total, 0, ',', ' ') . " Ft\n";
}
else {
    $logContent .= "Üzenet: $message\n";
}
file_put_contents(__DIR__ . '/messages.log', $logContent, FILE_APPEND | LOCK_EX);

// Send email with PHPMailer
$mail = new PHPMailer(true);

try {
    // SMTP configuration
    $mail->isSMTP();
    $mail->Host = $config['smtp_host'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['smtp_username'];
    $mail->Password = str_replace(' ', '', $config['smtp_password']);
    $mail->SMTPSecure = $config['smtp_secure'];
    $mail->Port = $config['smtp_port'];
    $mail->CharSet = 'UTF-8';

    // Recipients
    $mail->setFrom($config['smtp_username'], $config['from_name']);
    $mail->addAddress($config['recipient_email'], $config['recipient_name']);
    $mail->addReplyTo($email, $name);

    // Content
    $mail->isHTML(true);
    $mail->Subject = ($type === 'order' ? "Új RENDELÉS: $name" : "Új üzenet: $name");

    // HTML email body
    $bodyTitle = $type === 'order' ? "Új Rendelés Érkezett" : "Új Üzenet Érkezett";
    $totalFormatted = number_format($total, 0, ',', ' ') . " Ft";

    $mail->Body = "
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 10px; overflow: hidden;'>
        <div style='background-color: #6366f1; padding: 25px; text-align: center;'>
            <h2 style='color: #ffffff; margin: 0; font-size: 24px;'>🛡️ ScreenShield Pro</h2>
            <p style='color: #ffffff; opacity: 0.9; margin: 5px 0 0;'>$bodyTitle</p>
        </div>
        <div style='background-color: #ffffff; padding: 25px;'>
            <table style='width: 100%; border-collapse: collapse;'>
                <tr>
                    <td style='padding: 10px 0; border-bottom: 1px solid #eee; width: 30%;'><strong>Név:</strong></td>
                    <td style='padding: 10px 0; border-bottom: 1px solid #eee;'>$name</td>
                </tr>
                <tr>
                    <td style='padding: 10px 0; border-bottom: 1px solid #eee;'><strong>Email:</strong></td>
                    <td style='padding: 10px 0; border-bottom: 1px solid #eee;'><a href='mailto:$email'>$email</a></td>
                </tr>
                <tr>
                    <td style='padding: 10px 0; border-bottom: 1px solid #eee;'><strong>Telefon:</strong></td>
                    <td style='padding: 10px 0; border-bottom: 1px solid #eee;'>$phone</td>
                </tr>";

    if ($type === 'order') {
        $mail->Body .= "
                <tr>
                    <td style='padding: 10px 0; border-bottom: 1px solid #eee;'><strong>Cím:</strong></td>
                    <td style='padding: 10px 0; border-bottom: 1px solid #eee;'>$address</td>
                </tr>
            </table>
            <div style='margin-top: 20px;'>
                <h4 style='color: #6366f1; margin-bottom: 10px;'>Termékek:</h4>
                <table style='width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05);'>
                    <thead>
                        <tr style='background: #f1f1f1;'>
                            <th style='padding: 10px; text-align: left; font-size: 13px;'>Modell</th>
                            <th style='padding: 10px; text-align: left; font-size: 13px;'>Termék</th>
                            <th style='padding: 10px; text-align: right; font-size: 13px;'>Ár</th>
                        </tr>
                    </thead>
                    <tbody>
                        $itemsHtml
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan='2' style='padding: 15px; text-align: right;'><strong>Összesen:</strong></td>
                            <td style='padding: 15px; text-align: right; font-weight: 700; color: #ec4899;'>$totalFormatted</td>
                        </tr>
                    </tfoot>
                </table>
            </div>";
    }
    else {
        $mail->Body .= "
            </table>
            <div style='margin-top: 20px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #6366f1;'>
                <strong>Üzenet:</strong>
                <p style='margin: 10px 0 0; white-space: pre-wrap;'>$message</p>
            </div>";
    }

    $mail->Body .= "
            <p style='margin-top: 20px; color: #666; font-size: 12px;'>Küldve: $timestamp</p>
        </div>
    </div>";

    // Plain text version
    $mail->AltBody = "ScreenShield Pro - " . ($type === 'order' ? 'Rendelés' : 'Üzenet') . "\n\n";
    $mail->AltBody .= "Név: $name\nEmail: $email\nTelefon: $phone\n";
    if ($type === 'order') {
        $mail->AltBody .= "Cím: $address\n\nTermékek:\n$itemsText\nÖsszesen: $totalFormatted";
    }
    else {
        $mail->AltBody .= "\nÜzenet:\n$message";
    }

    $mail->send();

    // ==========================================
    // Auto-reply to visitor
    // ==========================================

    $mail->clearAddresses();
    $mail->clearReplyTos();
    $mail->addAddress($email, $name);

    if ($type === 'order') {
        $mail->Subject = "Rendelés visszaigazolása - ScreenShield Pro";
        $replyHeader = "Rendelését Sikeresen Megkaptuk!";
        $replyMessage = "Köszönjük rendelését! Megkaptuk az adatait és hamarosan felvesszük Önnel a kapcsolatot a szállítás részleteivel kapcsolatban.";
    }
    else {
        $mail->Subject = "Visszaigazolás: Megkaptuk üzenetét - ScreenShield Pro";
        $replyHeader = "Üzenetét Sikeresen Megkaptuk!";
        $replyMessage = "Köszönjük megkeresését! Üzenetét sikeresen megkaptuk, kollégáink hamarosan felveszik Önnel a kapcsolatot.";
    }

    $mail->Body = "
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e1e1e1; border-radius: 10px; overflow: hidden;'>
        <div style='background-color: #6366f1; padding: 25px; text-align: center;'>
            <h2 style='color: #ffffff; margin: 0; font-size: 24px;'>🛡️ ScreenShield Pro</h2>
            <p style='color: #ffffff; opacity: 0.9; margin: 5px 0 0;'>$replyHeader</p>
        </div>
        <div style='background-color: #ffffff; padding: 25px;'>
            <p>Kedves <strong>$name</strong>!</p>
            <p>$replyMessage</p>";

    if ($type === 'order') {
        $mail->Body .= "
            <div style='margin-top: 25px;'>
                <h4 style='color: #6366f1; margin-bottom: 10px;'>A rendelésed adatai:</h4>
                <div style='background: white; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #6366f1;'>
                    <p style='margin: 5px 0;'><strong>Szállítási cím:</strong> $address</p>
                    <p style='margin: 5px 0;'><strong>Telefonszám:</strong> $phone</p>
                </div>

                <table style='width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05);'>
                    <thead>
                        <tr style='background: #f1f1f1;'>
                            <th style='padding: 10px; text-align: left; font-size: 13px;'>Modell</th>
                            <th style='padding: 10px; text-align: left; font-size: 13px;'>Termék</th>
                            <th style='padding: 10px; text-align: right; font-size: 13px;'>Ár</th>
                        </tr>
                    </thead>
                    <tbody>
                        $itemsHtml
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan='2' style='padding: 15px; text-align: right;'><strong>Összesen:</strong></td>
                            <td style='padding: 15px; text-align: right; font-weight: 700; color: #ec4899;'>$totalFormatted</td>
                        </tr>
                    </tfoot>
                </table>
            </div>";
    }
    else {
        $mail->Body .= "
            <div style='margin-top: 20px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #6366f1;'>
                <strong>Az üzeneted másolata:</strong>
                <p style='margin: 10px 0 0; white-space: pre-wrap; font-style: italic;'>$message</p>
            </div>";
    }

    $mail->Body .= "
            <p style='margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px; color: #666; font-size: 12px; text-align: center;'>
                Ez egy automatikus visszaigazolás, kérjük ne válaszoljon rá.<br>
                &copy; " . date('Y') . " ScreenShield Pro
            </p>
        </div>
    </div>";

    $mail->AltBody = "Kedves $name!\n\n$replyMessage\n\n" . ($type === 'order' ? "Rendelés adatai:\nCím: $address\nTelefon: $phone\n\nTermékek:\n$itemsText\nÖsszesen: $totalFormatted" : "Üzeneted másolata:\n$message");

    $mail->send();

    // Success response
    echo json_encode(['success' => true, 'message' => ($type === 'order' ? 'Rendelés elküldve!' : 'Üzenet elküldve!')]);

}
catch (Exception $e) {
    // Log detailed error
    $errorMessage = "PHPMailer Error: " . $mail->ErrorInfo;
    error_log($errorMessage);

    // Return error to frontend for debugging
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Hiba történt a küldéskor: ' . $mail->ErrorInfo,
        'debug' => $errorMessage
    ]);
}
?>
