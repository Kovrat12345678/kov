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
if (empty($data['name']) || empty($data['email']) || empty($data['message'])) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Minden mező kitöltése kötelező!']);
    exit();
}

// Sanitize inputs
$name = htmlspecialchars(strip_tags(trim($data['name'])));
$email = filter_var(trim($data['email']), FILTER_SANITIZE_EMAIL);
$message = htmlspecialchars(strip_tags(trim($data['message'])));

// Validate email format
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode(['success' => false, 'message' => 'Érvénytelen email cím!']);
    exit();
}

// Save to log file (backup)
$timestamp = date('Y-m-d H:i:s');
$logContent = "\n=== Új üzenet: $timestamp ===\nNév: $name\nEmail: $email\nÜzenet: $message\n";
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
    $mail->Subject = "Új üzenet: $name";

    // HTML email body
    $mail->Body = "
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
        <div style='background: linear-gradient(135deg, #6366f1, #ec4899); padding: 20px; border-radius: 10px 10px 0 0;'>
            <h2 style='color: white; margin: 0;'>🛡️ ScreenShield Pro</h2>
            <p style='color: rgba(255,255,255,0.8); margin: 5px 0 0;'>Új üzenet érkezett</p>
        </div>
        <div style='background: #f8f9fa; padding: 25px; border-radius: 0 0 10px 10px;'>
            <table style='width: 100%;'>
                <tr>
                    <td style='padding: 10px 0; border-bottom: 1px solid #eee;'>
                        <strong>Név:</strong>
                    </td>
                    <td style='padding: 10px 0; border-bottom: 1px solid #eee;'>
                        $name
                    </td>
                </tr>
                <tr>
                    <td style='padding: 10px 0; border-bottom: 1px solid #eee;'>
                        <strong>Email:</strong>
                    </td>
                    <td style='padding: 10px 0; border-bottom: 1px solid #eee;'>
                        <a href='mailto:$email'>$email</a>
                    </td>
                </tr>
            </table>
            <div style='margin-top: 20px; padding: 15px; background: white; border-radius: 8px; border-left: 4px solid #6366f1;'>
                <strong>Üzenet:</strong>
                <p style='margin: 10px 0 0; white-space: pre-wrap;'>$message</p>
            </div>
            <p style='margin-top: 20px; color: #666; font-size: 12px;'>
                Küldve: $timestamp
            </p>
        </div>
    </div>
    ";

    // Plain text version
    $mail->AltBody = "Új üzenet a ScreenShield Pro weboldalról\n\nNév: $name\nEmail: $email\n\nÜzenet:\n$message\n\nKüldve: $timestamp";

    $mail->send();

    // ==========================================
    // Auto-reply to visitor
    // ==========================================

    // Clear recipients for the second email
    $mail->clearAddresses();
    $mail->clearReplyTos();

    // Send to the visitor
    $mail->addAddress($email, $name);
    $mail->Subject = "Visszaigazolás: Megkaptuk üzenetét - ScreenShield Pro";

    $mail->Body = "
    <div style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;'>
        <div style='background: linear-gradient(135deg, #6366f1, #ec4899); padding: 20px; border-radius: 10px 10px 0 0;'>
            <h2 style='color: white; margin: 0;'>🛡️ ScreenShield Pro</h2>
        </div>
        <div style='background: #f8f9fa; padding: 25px; border-radius: 0 0 10px 10px;'>
            <p>Kedves $name!</p>
            <p>Köszönjük megkeresését! Üzenetét sikeresen megkaptuk, és kollégáink hamarosan felveszik Önnel a kapcsolatot.</p>
            
            <div style='margin-top: 20px; padding: 15px; background: white; border-radius: 8px; border: 1px solid #eee;'>
                <strong>Az elküldött üzenet:</strong>
                <p style='margin: 10px 0 0; color: #555; white-space: pre-wrap;'>$message</p>
            </div>
            
            <p style='margin-top: 20px; color: #666; font-size: 12px;'>
                Ez egy automatikus üzenet, kérjük ne válaszoljon rá.
            </p>
        </div>
    </div>
    ";

    $mail->AltBody = "Kedves $name!\n\nKöszönjük megkeresését! Üzenetét sikeresen megkaptuk, és kollégáink hamarosan felveszik Önnel a kapcsolatot.\n\nAz elküldött üzenet:\n$message";

    $mail->send();

    // Success response
    echo json_encode(['success' => true, 'message' => 'Üzenet sikeresen elküldve! (Visszaigazolást is küldtünk)']);


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
