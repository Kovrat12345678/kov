<?php
/**
 * Email Configuration
 * 
 * FONTOS: Állítsd be a saját Gmail adataidat!
 * 
 * Gmail App Password létrehozása:
 * 1. Menj a https://myaccount.google.com/security oldalra
 * 2. Engedélyezd a "2-Step Verification"-t (kétlépcsős hitelesítés)
 * 3. Keresd meg az "App passwords" opciót
 * 4. Hozz létre egy új App Password-öt "Mail" típussal
 * 5. Másold be ide a kapott 16 karakteres jelszót (szóközök nélkül)
 */

return [
    // Gmail SMTP beállítások
    'smtp_host' => 'smtp.gmail.com',
    'smtp_port' => 587,
    'smtp_secure' => 'tls',

    // Gmail bejelentkezési adatok
    'smtp_username' => 'byekovrat@gmail.com', // A Gmail címed
    'smtp_password' => 'b c t m z i z x x r f d k z l e', // App Password (16 karakter, szóközök nélkül!)

    // Címzett beállítások
    'recipient_email' => 'byekovrat@gmail.com', // Ide érkeznek az üzenetek
    'recipient_name' => 'ScreenShield Pro',

    // Feladó neve (megjelenik az emailben)
    'from_name' => 'ScreenShield Pro Weboldal'
];
