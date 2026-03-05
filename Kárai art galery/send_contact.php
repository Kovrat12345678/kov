<?php
/**
 * Contact Form Handler
 * Sends inquiry email to owner and auto-reply to user.
 */

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require 'PHPMailer/src/Exception.php';
require 'PHPMailer/src/PHPMailer.php';
require 'PHPMailer/src/SMTP.php';

header('Content-Type: application/json; charset=utf-8');

// Load configuration
$config = require 'config.php';

// Get request body
$input = file_get_contents('php://input');
$data = json_decode($input, true);

if (!$data || !isset($data['email']) || !isset($data['name']) || !isset($data['message'])) {
    echo json_encode(['success' => false, 'message' => 'Minden mező kitöltése kötelező.']);
    exit;
}

$userName = filter_var($data['name'], FILTER_SANITIZE_STRING);
$userEmail = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$userMessage = filter_var($data['message'], FILTER_SANITIZE_STRING);

if (!filter_var($userEmail, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Érvénytelen email cím.']);
    exit;
}

$mail = new PHPMailer(true);

try {
    // Server settings
    $mail->CharSet = 'UTF-8';
    $mail->isSMTP();
    $mail->Host = $config['smtp_host'];
    $mail->SMTPAuth = true;
    $mail->Username = $config['smtp_username'];
    $mail->Password = $config['smtp_password'];
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Port = $config['smtp_port'];

    // --- 1. Send inquiry to Owner ---
    $mail->setFrom($config['from_email'], $config['from_name']);
    $mail->addAddress($config['owner_email'], $config['owner_name']);
    $mail->addReplyTo($userEmail, $userName);

    $mail->isHTML(true);
    $mail->Subject = 'Új érdeklődés festmény iránt! - ' . $userName;

    $mail->Body = "
    <div style='font-family: Arial, sans-serif; padding: 20px; border: 1px solid #c5a059; border-radius: 8px;'>
        <h2 style='color: #c5a059;'>Új üzenet érkezett a weboldalról</h2>
        <p><strong>Név:</strong> $userName</p>
        <p><strong>Email:</strong> $userEmail</p>
        <p><strong>Üzenet:</strong></p>
        <div style='background: #f9f9f9; padding: 15px; border-radius: 5px; border-left: 4px solid #c5a059;'>
            " . nl2br($userMessage) . "
        </div>
    </div>";

    $mail->AltBody = "Új üzenet érkezett a weboldalról.\nNév: $userName\nEmail: $userEmail\nÜzenet:\n$userMessage";

    $mail->send();

    // --- 2. Send auto-reply to User ---
    $mail->clearAddresses();
    $mail->addAddress($userEmail, $userName);
    $mail->Subject = 'Köszönjük az érdeklődést! - Kárai Art Gallery';

    $mail->Body = "
    <div style='font-family: \"Playfair Display\", serif, Arial, sans-serif; background-color: #0e0e11; color: #fdfdfd; padding: 40px; border-radius: 12px; max-width: 600px; margin: auto; border: 1px solid #c5a059;'>
        <div style='text-align: center; margin-bottom: 30px;'>
            <h1 style='color: #c5a059; margin: 0; font-size: 28px; letter-spacing: 2px;'>KÁRAI ART GALLERY</h1>
            <div style='width: 50px; height: 2px; background: #c5a059; margin: 15px auto;'></div>
        </div>
        
        <h2 style='font-size: 20px; text-align: center;'>Kedves $userName!</h2>
        <p style='font-size: 16px; line-height: 1.6; color: #ddd;'>
            Köszönöm az érdeklődésedet! Megkaptam az üzenetedet, és hamarosan felveszem veled a kapcsolatot a megadott e-mail címen.
        </p>
        
        <div style='background: rgba(197, 160, 89, 0.1); padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px dashed #c5a059;'>
            <p style='margin: 0; color: #c5a059; font-style: italic;'>\"A művészet lemossa a lélekről a mindennapok porát.\" - Pablo Picasso</p>
        </div>
        
        <div style='margin-top: 40px; padding-top: 20px; border-top: 1px solid #333; font-size: 12px; color: #888; text-align: center;'>
            <p>© 2026 Kárai Art Gallery. Minden jog fenntartva.</p>
        </div>
    </div>";

    $mail->AltBody = "Kedves $userName! Köszönöm az érdeklődésedet! Hamarosan felveszem veled a kapcsolatot. Üdv, Kárai Art Gallery";

    $mail->send();

    echo json_encode(['success' => true, 'message' => 'Üzenet sikeresen elküldve!']);

}
catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => "Hiba történt: {$mail->ErrorInfo}"]);
}
