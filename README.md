# Itthoni Bolt - Foglalási Rendszer

Modern, sötét dizájnos e-commerce weboldal kisboltok számára, készletkezeléssel és email értesítéssel.

## Funkciók
- **Termékkezelés**: Hozzáadás, szerkesztés, törlés (admin panel).
- **Készletkezelés**: Automata készletmódosítás foglaláskor.
- **Email értesítés**: PHPMailer alapú, egyedi dizájnos visszaigazolások.
- **Eszközök közötti szinkron**: JSON alapú szerver-oldali tárolás.
- **Reszponzív**: Mobilra és PC-re optimalizálva.

## Telepítés
1. Másold be a fájlokat egy PHP-t támogató szerverre (pl. XAMPP).
2. Másold le az `email_config.example.php` fájlt `email_config.php` néven.
3. Állítsd be a SMTP adataidat az `email_config.php`-ban.
4. Biztosítsd, hogy a PHP-nek legyen írási joga a mappában (a `products.json` mentéséhez).

## Admin Belépés
- Gomb a láblécben: **🔐 Admin**
- Gyorsbillentyű: `Ctrl + Shift + A`
- Alapértelmezett jelszó: `admin2011`
