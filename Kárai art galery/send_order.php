<?php
/**
 * Order Form Handler
 * Sends order notification to owner and confirmation to user.
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

if (!$data || !isset($data['email']) || !isset($data['name'])) {
    echo json_encode(['success' => false, 'message' => 'Név és email megadása kötelező.']);
    exit;
}

$userName = filter_var($data['name'], FILTER_SANITIZE_STRING);
$userEmail = filter_var($data['email'], FILTER_SANITIZE_EMAIL);
$userPhone = isset($data['phone']) ? filter_var($data['phone'], FILTER_SANITIZE_STRING) : 'Nincs megadva';
$userAddress = isset($data['address']) ? filter_var($data['address'], FILTER_SANITIZE_STRING) : 'Nincs megadva';
$paintingName = filter_var($data['painting'], FILTER_SANITIZE_STRING);
$paymentMethod = isset($data['payment']) ? filter_var($data['payment'], FILTER_SANITIZE_STRING) : 'Nincs megadva';
$userMessage = filter_var($data['message'], FILTER_SANITIZE_STRING);

// Map payment keys to readable text
$paymentNames = [
    'keszpenz' => 'Készpénz (átvételkor)',
    'kartya' => 'Bankkártya (Online)',
    'utalas' => 'Banki átutalás'
];
$readablePayment = isset($paymentNames[$paymentMethod]) ? $paymentNames[$paymentMethod] : $paymentMethod;

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

    // --- 1. Send Order to Owner ---
    $mail->setFrom($config['from_email'], $config['from_name']);
    $mail->addAddress($config['owner_email'], $config['owner_name']);
    $mail->addReplyTo($userEmail, $userName);

    $mail->isHTML(true);
    $mail->Subject = 'ÚJ RENDELÉS ÉRKEZETT! - ' . $userName;

    $mail->Body = "
    <div style='font-family: Arial, sans-serif; padding: 25px; border: 2px solid #c5a059; border-radius: 12px; max-width: 600px;'>
        <h2 style='color: #c5a059; border-bottom: 1px solid #c5a059; padding-bottom: 10px;'>Új Rendelési Igény</h2>
        <p><strong>Megrendelő neve:</strong> $userName</p>
        <p><strong>Email címe:</strong> $userEmail</p>
        <p><strong>Telefonszám:</strong> $userPhone</p>
        <p><strong>Lakcím:</strong> $userAddress</p>
        <p><strong>Kiválasztott festmény/Igény:</strong> <span style='color: #c5a059; font-weight: bold;'>$paintingName</span></p>
        <p><strong>Fizetési mód:</strong> $readablePayment</p>
        <p><strong>Megjegyzés:</strong></p>
        <div style='background: #fdfdfd; padding: 15px; border-radius: 8px; border: 1px solid #eee; font-style: italic;'>
            " . nl2br($userMessage) . "
        </div>
        <p style='margin-top: 20px; font-size: 11px; color: #888;'>Ez az üzenet automatikusan generálódott a Kárai Art Gallery weboldaláról.</p>
    </div>";

    $mail->AltBody = "ÚJ RENDELÉS!\nNév: $userName\nEmail: $userEmail\nTelefon: $userPhone\nCím: $userAddress\nFestmény: $paintingName\nFizetés: $readablePayment\nMegjegyzés: $userMessage";

    $mail->send();

    // --- 2. Send confirmation to User ---
    $mail->clearAddresses();
    $mail->addAddress($userEmail, $userName);
    $mail->Subject = 'Rendelési igényét rögzítettük - Kárai Art Gallery';

    $mail->Body = "
    <div style='font-family: \"Playfair Display\", serif, Arial, sans-serif; background-color: #0e0e11; color: #fdfdfd; padding: 40px; border-radius: 12px; max-width: 600px; margin: auto; border: 1px solid #c5a059;'>
        <div style='text-align: center; margin-bottom: 30px;'>
            <h1 style='color: #c5a059; margin: 0; font-size: 28px; letter-spacing: 2px;'>KÁRAI ART GALLERY</h1>
            <div style='width: 50px; height: 2px; background: #c5a059; margin: 15px auto;'></div>
        </div>
        
        <h2 style='font-size: 22px; text-align: center;'>Köszönöm a megrendelését!</h2>
        <p style='font-size: 16px; line-height: 1.6; color: #ddd;'>
            Kedves $userName!<br><br>
            Sikeresen rögzítettem a rendelési igényét a következőre: <br>
            <strong style='color: #c5a059;'>$paintingName</strong><br><br>
            <strong>A megadott adatok:</strong><br>
            📧 Email: $userEmail<br>
            📱 Telefon: $userPhone<br>
            🏠 Cím: $userAddress<br>
            💳 Fizetési mód: $readablePayment<br><br>
            Hamarosan felveszem Önnel a kapcsolatot a részletek egyeztetése végett.
        </p>
        
        <div style='background: rgba(197, 160, 89, 0.1); padding: 20px; border-radius: 8px; margin-top: 30px; text-align: center; border: 1px dashed #c5a059;'>
            <p style='margin: 0; color: #c5a059; font-weight: bold;'>Köszönöm a bizalmat!</p>
        </div>
        
        <div style='margin-top: 40px; padding-top: 20px; border-top: 1px solid #333; font-size: 12px; color: #888; text-align: center;'>
            <p>© 2026 Kárai Art Gallery. Minden jog fenntartva.</p>
        </div>
    </div>";

    $mail->AltBody = "Kedves $userName! Köszönöm a rendelési igényét ($paintingName). Hamarosan felveszem Önnel a kapcsolatot a részletekkel. Üdvözlettel, Kárai Art Gallery";

    $mail->send();

    echo json_encode(['success' => true, 'message' => 'Rendelés sikeresen továbbítva!']);

}
catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => "Hiba történt: {$mail->ErrorInfo}"]);
}
