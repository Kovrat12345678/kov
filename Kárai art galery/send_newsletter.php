<?php
/**
 * Newsletter Subscription Handler
 * Sends confirmation email to user and notification to owner.
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

if (!$data || !isset($data['email'])) {
    echo json_encode(['success' => false, 'message' => 'Érvénytelen adatok.']);
    exit;
}

$userEmail = filter_var($data['email'], FILTER_SANITIZE_EMAIL);

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

    // --- 1. Send confirmation to User ---
    $mail->setFrom($config['from_email'], $config['from_name']);
    $mail->addAddress($userEmail);
    $mail->addReplyTo($config['from_email'], $config['from_name']);

    $mail->isHTML(true);
    $mail->Subject = 'Köszönjük a feliratkozást! - Kárai Art Gallery';

    $mail->Body = '
    <div style="font-family: \'Playfair Display\', serif, Arial, sans-serif; background-color: #0e0e11; color: #fdfdfd; padding: 40px; border-radius: 12px; max-width: 600px; margin: auto; border: 1px solid #c5a059;">
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #c5a059; margin: 0; font-size: 28px; letter-spacing: 2px;">KÁRAI ART GALLERY</h1>
            <div style="width: 50px; height: 2px; background: #c5a059; margin: 15px auto;"></div>
        </div>
        
        <h2 style="font-size: 22px; margin-bottom: 20px; text-align: center;">Köszönjük a feliratkozást!</h2>
        
        <p style="font-size: 16px; line-height: 1.6; color: #ddd; margin-bottom: 25px;">
            Örömmel értesítünk, hogy sikeresen feliratkoztál a hírlevelünkre. Elsőként fogsz értesülni a legújabb festményeimről, kiállításaimról és az egyedi művészeti ajánlatokról.
        </p>
        
        <div style="background: rgba(197, 160, 89, 0.1); padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: center; border: 1px dashed #c5a059;">
            <p style="margin: 0; color: #c5a059; font-weight: bold;">Művészet és inspiráció közvetlenül a postaládádba!</p>
        </div>
        
        <div style="text-align: center;">
            <a href="http://localhost/Kárai%20art%20galery/" style="background-color: #c5a059; color: #000; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Galéria Megtekintése</a>
        </div>
        
        <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #333; font-size: 12px; color: #888; text-align: center;">
            <p>© 2026 Kárai Art Gallery. Minden jog fenntartva.</p>
        </div>
    </div>';

    $mail->AltBody = "Köszönjük a feliratkozást a Kárai Art Gallery hírlevelére! Látogass el hozzánk: http://localhost/Kárai%20art%20galery/";

    $mail->send();

    // --- 2. Send notification to Owner ---
    $mail->clearAddresses();
    $mail->addAddress($config['owner_email'], $config['owner_name']);
    $mail->Subject = 'Új hírlevél feliratkozó! - ' . $userEmail;
    $mail->Body = "Szia!<br><br>Új érdeklődő iratkozott fel a hírlevélre: <b>$userEmail</b><br><br>Üdv,<br>Kárai Art Gallery Rendszer";
    $mail->AltBody = "Új hírlevél feliratkozó: $userEmail";

    $mail->send();

    echo json_encode(['success' => true, 'message' => 'Sikeres feliratkozás!']);

}
catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => "Hiba történt: {$mail->ErrorInfo}"]);
}
