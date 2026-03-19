// ===================================================================
//  HACK.JS – Matrix hack interface with sound & real-time messages
// ===================================================================

(function () {
    'use strict';

    // Log visit immediately
    try {
        fetch('api.php?action=visit', { method: 'POST' }).catch(() => {});
    } catch (e) {}

    // ===== SOUND ENGINE (Web Audio API) =====
    const SoundEngine = {
        ctx: null,
        muted: false,

        init() {
            try {
                this.ctx = new (window.AudioContext || window.webkitAudioContext)();
            } catch (e) {
                console.warn('Web Audio API not supported');
            }
        },

        resume() {
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        },

        playKeystroke() {
            if (this.muted || !this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(800 + Math.random() * 600, this.ctx.currentTime);
            gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);
            osc.start(this.ctx.currentTime);
            osc.stop(this.ctx.currentTime + 0.05);
        },

        playBeep() {
            if (this.muted || !this.ctx) return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
            osc.frequency.setValueAtTime(800, this.ctx.currentTime + 0.1);
            gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
            osc.start(this.ctx.currentTime);
            osc.stop(this.ctx.currentTime + 0.2);
        },

        playAlert() {
            if (this.muted || !this.ctx) return;
            const now = this.ctx.currentTime;
            for (let i = 0; i < 3; i++) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(600, now + i * 0.15);
                osc.frequency.setValueAtTime(900, now + i * 0.15 + 0.07);
                gain.gain.setValueAtTime(0.06, now + i * 0.15);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.12);
                osc.start(now + i * 0.15);
                osc.stop(now + i * 0.15 + 0.12);
            }
        },

        playSuccess() {
            if (this.muted || !this.ctx) return;
            const now = this.ctx.currentTime;
            const notes = [523, 659, 784];
            notes.forEach((freq, i) => {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, now + i * 0.12);
                gain.gain.setValueAtTime(0.07, now + i * 0.12);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.12 + 0.25);
                osc.start(now + i * 0.12);
                osc.stop(now + i * 0.12 + 0.25);
            });
        },

        playWarning() {
            if (this.muted || !this.ctx) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(440, now);
            osc.frequency.linearRampToValueAtTime(220, now + 0.3);
            gain.gain.setValueAtTime(0.08, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
            osc.start(now);
            osc.stop(now + 0.4);
        },

        playDataStream() {
            if (this.muted || !this.ctx) return;
            const now = this.ctx.currentTime;
            for (let i = 0; i < 8; i++) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.type = 'square';
                osc.frequency.setValueAtTime(200 + Math.random() * 2000, now + i * 0.03);
                gain.gain.setValueAtTime(0.02, now + i * 0.03);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.03 + 0.03);
                osc.start(now + i * 0.03);
                osc.stop(now + i * 0.03 + 0.03);
            }
        },

        playAlarm() {
            if (this.muted || !this.ctx) return;
            const now = this.ctx.currentTime;
            for (let i = 0; i < 6; i++) {
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(i % 2 === 0 ? 800 : 400, now + i * 0.25);
                gain.gain.setValueAtTime(0.1, now + i * 0.25);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.25 + 0.2);
                osc.start(now + i * 0.25);
                osc.stop(now + i * 0.25 + 0.2);
            }
        },

        playBlackoutStatic() {
            if (this.muted || !this.ctx) return;
            const now = this.ctx.currentTime;
            const bufferSize = this.ctx.sampleRate * 2;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                data[i] = (Math.random() * 2 - 1) * 0.08;
            }
            const source = this.ctx.createBufferSource();
            source.buffer = buffer;
            const gain = this.ctx.createGain();
            source.connect(gain);
            gain.connect(this.ctx.destination);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.linearRampToValueAtTime(0, now + 4.5);
            source.start(now);
            source.stop(now + 5);
        },

        playBSODSound() {
            if (this.muted || !this.ctx) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'square';
            osc.frequency.setValueAtTime(100, now);
            osc.frequency.linearRampToValueAtTime(50, now + 1.5);
            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 1.5);
            osc.start(now);
            osc.stop(now + 1.5);
        },

        playExplosion() {
            if (this.muted || !this.ctx) return;
            const now = this.ctx.currentTime;
            
            // Low thud
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(100, now);
            osc.frequency.exponentialRampToValueAtTime(0.01, now + 2);
            gain.gain.setValueAtTime(0.3, now);
            gain.gain.linearRampToValueAtTime(0, now + 2);
            osc.start(now);
            osc.stop(now + 2);

            // White noise burst
            const bufferSize = this.ctx.sampleRate * 2;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
            
            const noise = this.ctx.createBufferSource();
            noise.buffer = buffer;
            const noiseGain = this.ctx.createGain();
            noise.connect(noiseGain);
            noiseGain.connect(this.ctx.destination);
            noiseGain.gain.setValueAtTime(0.2, now);
            noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
            noise.start(now);
            noise.stop(now + 1.5);
        }
    };

    // ===== MATRIX RAIN =====
    const MatrixRain = {
        canvas: null,
        ctx: null,
        columns: [],
        fontSize: 14,
        chars: 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>{}[]|/\\',

        init() {
            this.canvas = document.getElementById('matrix-canvas');
            this.ctx = this.canvas.getContext('2d');
            this.resize();
            window.addEventListener('resize', () => this.resize());
            this.animate();
        },

        resize() {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            const colCount = Math.floor(this.canvas.width / this.fontSize);
            this.columns = Array(colCount).fill(0).map(() => Math.random() * this.canvas.height / this.fontSize);
        },

        animate() {
            this.ctx.fillStyle = 'rgba(10, 10, 10, 0.06)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.font = this.fontSize + 'px monospace';

            for (let i = 0; i < this.columns.length; i++) {
                const char = this.chars[Math.floor(Math.random() * this.chars.length)];
                const x = i * this.fontSize;
                const y = this.columns[i] * this.fontSize;

                const brightness = Math.random();
                if (brightness > 0.95) {
                    this.ctx.fillStyle = '#ffffff';
                } else if (brightness > 0.8) {
                    this.ctx.fillStyle = '#00aaff';
                } else {
                    this.ctx.fillStyle = 'rgba(0, 170, 255, 0.5)';
                }

                this.ctx.fillText(char, x, y);

                if (y > this.canvas.height && Math.random() > 0.975) {
                    this.columns[i] = 0;
                }
                this.columns[i]++;
            }

            requestAnimationFrame(() => this.animate());
        }
    };

    // ===== TERMINAL =====
    const Terminal = {
        body: document.getElementById('terminalBody'),
        window: document.getElementById('terminalWindow'),
        lastMsgId: 0,
        pollInterval: null,
        typeQueue: [],
        isTyping: false,
        isFirstFetch: true,

        addLine(text, className = '', usePrompt = true) {
            const line = document.createElement('div');
            line.className = 'terminal-line ' + className;
            if (usePrompt) {
                line.innerHTML = '<span class="prompt">&gt;</span>' + this.escapeHtml(text);
            } else {
                line.innerHTML = this.escapeHtml(text);
            }
            this.body.appendChild(line);
            this.scrollToBottom();
            return line;
        },

        addHtmlLine(html, className = '') {
            const line = document.createElement('div');
            line.className = 'terminal-line ' + className;
            line.innerHTML = html;
            this.body.appendChild(line);
            this.scrollToBottom();
            return line;
        },

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        },

        async typeText(text, className = '', speed = 35) {
            return new Promise((resolve) => {
                const line = document.createElement('div');
                line.className = 'terminal-line ' + className;
                const prompt = '<span class="prompt">&gt;</span>';
                line.innerHTML = prompt;
                this.body.appendChild(line);

                const cursor = document.createElement('span');
                cursor.className = 'cursor-blink';
                line.appendChild(cursor);

                let i = 0;
                const interval = setInterval(() => {
                    if (i < text.length) {
                        const charSpan = document.createTextNode(text[i]);
                        line.insertBefore(charSpan, cursor);
                        SoundEngine.playKeystroke();
                        i++;
                        this.scrollToBottom();
                    } else {
                        clearInterval(interval);
                        cursor.remove();
                        resolve();
                    }
                }, speed);
            });
        },

        addProgressBar() {
            const container = document.createElement('div');
            container.className = 'progress-bar-container';
            container.innerHTML = '<div class="progress-bar-fill"></div><div class="progress-bar-text">0%</div>';
            this.body.appendChild(container);
            this.scrollToBottom();
            return container;
        },

        async animateProgress(container, duration = 2000) {
            return new Promise((resolve) => {
                const fill = container.querySelector('.progress-bar-fill');
                const text = container.querySelector('.progress-bar-text');
                let progress = 0;
                const step = 16;
                const increment = 100 / (duration / step);

                const interval = setInterval(() => {
                    progress = Math.min(100, progress + increment + (Math.random() * 2 - 1));
                    fill.style.width = progress + '%';
                    text.textContent = Math.floor(progress) + '%';

                    if (Math.random() > 0.85) SoundEngine.playDataStream();

                    if (progress >= 100) {
                        clearInterval(interval);
                        text.textContent = '100% COMPLETE';
                        SoundEngine.playSuccess();
                        resolve();
                    }
                }, step);
            });
        },

        glitch() {
            this.window.classList.add('glitch');
            setTimeout(() => this.window.classList.remove('glitch'), 300);
        },

        flash(color = 'green') {
            const flashEl = document.createElement('div');
            flashEl.className = 'screen-flash ' + color;
            document.body.appendChild(flashEl);
            setTimeout(() => flashEl.remove(), 600);
        },

        scrollToBottom() {
            this.body.scrollTop = this.body.scrollHeight;
        },

        // Queue messages so they don't overlap typing
        queueMessage(msg) {
            this.typeQueue.push(msg);
            if (!this.isTyping) this.processQueue();
        },

        async processQueue() {
            if (this.typeQueue.length === 0) {
                this.isTyping = false;
                return;
            }
            this.isTyping = true;
            const msg = this.typeQueue.shift();

            // Handle special types
            if (msg.type === 'blackout') {
                this.doBlackout();
                await this.sleep(5500);
                this.processQueue();
                return;
            }

            if (msg.type === 'ransom') {
                this.doRansom(msg.text);
                await this.sleep(1000);
                this.processQueue();
                return;
            }

            if (msg.type === 'files') {
                await this.doFileExplorer();
                this.processQueue();
                return;
            }

            if (msg.type === 'camera') {
                await this.doCameraAccess();
                this.processQueue();
                return;
            }

            if (msg.type === 'bsod') {
                this.doBSOD();
                return;
            }

            if (msg.type === 'voice') {
                await this.doVoice(msg.text);
                this.processQueue();
                return;
            }

            if (msg.type === 'tts') {
                this.doTTS(msg.text);
                this.processQueue();
                return;
            }

            if (msg.type === 'bank_card') {
                await this.doBankCard();
                this.processQueue();
                return;
            }

            if (msg.type === 'nearby_devices') {
                await this.doNearbyDevices();
                this.processQueue();
                return;
            }



            if (msg.type === 'keyboard') {
                this.doKeyboard();
                this.processQueue();
                return;
            }




            if (msg.type === 'ip_theft') {
                await this.doIPTheft();
                this.processQueue();
                return;
            }

            if (msg.type === 'social_hack') {
                await this.doSocialHack();
                this.processQueue();
                return;
            }

            let className = '';
            let sound = 'beep';
            switch (msg.type) {
                case 'alert':
                    className = 'alert';
                    sound = 'alert';
                    this.glitch();
                    this.flash('red');
                    break;
                case 'warning':
                    className = 'warning';
                    sound = 'warning';
                    break;
                case 'system':
                    className = 'system';
                    sound = 'beep';
                    break;
                case 'big':
                    className = 'big success';
                    sound = 'success';
                    this.flash('green');
                    break;
                default:
                    className = 'success';
                    sound = 'beep';
            }

            // Play appropriate sound
            switch (sound) {
                case 'alert': SoundEngine.playAlert(); break;
                case 'warning': SoundEngine.playWarning(); break;
                case 'success': SoundEngine.playSuccess(); break;
                default: SoundEngine.playBeep();
            }

            await this.typeText(msg.text, className, 30);
            await this.sleep(300);
            this.processQueue();
        },

        // ===== BLACKOUT EFFECT =====
        doBlackout() {
            SoundEngine.playBlackoutStatic();
            const overlay = document.createElement('div');
            overlay.className = 'blackout-overlay';
            overlay.innerHTML = '<div class="blackout-text">SIGNAL LOST</div>';
            document.body.appendChild(overlay);
            // Fade in
            requestAnimationFrame(() => {
                overlay.style.opacity = '1';
            });
            // Remove after 5s
            setTimeout(() => {
                overlay.style.opacity = '0';
                setTimeout(() => {
                    overlay.remove();
                    this.glitch();
                    this.addLine('Kapcsolat visszaállítva...', 'system', true);
                    SoundEngine.playBeep();
                }, 800);
            }, 4200);
        },

        // ===== RANSOM EFFECT =====
        doRansom(text) {
            SoundEngine.playAlarm();
            this.flash('red');
            this.glitch();
            // Red pulsing border
            this.window.style.borderColor = '#ff0040';
            this.window.style.boxShadow = '0 0 60px rgba(255,0,64,0.7), inset 0 0 40px rgba(255,0,64,0.1)';
            
            // Skull + ransom text
            this.addHtmlLine('<span style="font-size:70px;display:block;text-align:center;margin:20px 0;filter:drop-shadow(0 0 15px #ff0040)">💀</span>', 'alert');
            this.addHtmlLine('<span class="ransom-title">' + this.escapeHtml(text) + '</span>', 'alert');
            
            // Countdown timer
            let timeLeft = 86400;
            const timerLine = this.addHtmlLine('<span class="ransom-timer">⏰ 23:59:59</span>', 'alert');
            
            const timerInterval = setInterval(() => {
                timeLeft -= Math.floor(Math.random() * 60 + 30);
                if (timeLeft < 0) timeLeft = 0;
                const h = Math.floor(timeLeft / 3600);
                const m = Math.floor((timeLeft % 3600) / 60);
                const s = timeLeft % 60;
                timerLine.innerHTML = '<span class="ransom-timer">⏰ ' + String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0') + '</span>';
                if (timeLeft <= 0) clearInterval(timerInterval);
                this.scrollToBottom();
            }, 1000);

            // Reset style after 20s
            setTimeout(() => {
                this.window.style.borderColor = '';
                this.window.style.boxShadow = '';
                clearInterval(timerInterval);
            }, 20000);
        },

        // ===== FILE EXPLORER =====
        async doFileExplorer() {
            SoundEngine.playBeep();
            this.addLine('Szkennelés folyamatban: /Users/Internal/', 'system', true);
            await this.sleep(800);
            
            const fileList = document.createElement('div');
            fileList.className = 'file-list';
            this.body.appendChild(fileList);

            const files = [
                '📁 Private_Documents',
                '📄 bank_passwords.txt',
                '📄 browser_history.log',
                '📁 Photos_Backup',
                '🔒 secret_vault.enc',
                '📄 messages_dump.json',
                '📄 system_config_override.sh'
            ];

            for (const file of files) {
                const item = document.createElement('div');
                item.className = 'file-item';
                item.innerHTML = '<span>' + file + '</span>';
                fileList.appendChild(item);
                SoundEngine.playKeystroke();
                await this.sleep(200);
                this.scrollToBottom();
            }

            await this.sleep(500);
            this.addLine('Fájlok sikeresen indexelve. Áthelyezés távoli szerverre...', 'success', true);
            SoundEngine.playDataStream();
            await this.sleep(800);
        },

        // ===== CAMERA ACCESS =====
        async doCameraAccess() {
            SoundEngine.playBeep();
            await this.typeText('Kezdeményezett kamera-hozzáférés...', 'warning', 30);
            await this.sleep(1000);
            
            this.addLine('Kapcsolódás az elülső kamerához...', 'system', true);
            await this.sleep(1200);
            
            this.addLine('KÉP KÉSZÍTÉSE ÉS ELEMZÉSE...', 'alert', true);
            await this.sleep(500);
            
            // Flash effect
            const flash = document.createElement('div');
            flash.className = 'camera-flash animate-flash';
            document.body.appendChild(flash);
            SoundEngine.playSuccess();
            
            setTimeout(() => flash.remove(), 1000);
            
            await this.sleep(800);
            this.addLine('Kép sikeresen elmentve: face_id_capture.jpg', 'success', true);
            this.addLine('Elemzés: [TÁRGY AZONOSÍTVA]', 'system', true);
        },

        // ===== BSOD (Blue Screen of Death) =====
        doBSOD() {
            SoundEngine.playBSODSound();
            
            // Create BSOD overlay if it doesn't exist
            let bsod = document.querySelector('.bsod-overlay');
            if (!bsod) {
                bsod = document.createElement('div');
                bsod.className = 'bsod-overlay';
                bsod.innerHTML = `
                    <div class="bsod-title">WINDOWS SYSTEM ERROR</div>
                    <div class="bsod-text">
                        A problem has been detected and the system has been shut down to prevent damage to your computer.
                        <br><br>
                        ERROR_CODE: 0x0000001E (KMODE_EXCEPTION_NOT_HANDLED)
                        <br><br>
                        If this is the first time you've seen this stop error screen, restart your computer. If this screen appears again, follow these steps:
                        <br><br>
                        Check to be sure you have adequate disk space. If a driver is identified in the stop message, disable the driver or check with the manufacturer for driver updates.
                        <br><br>
                        Technical information:
                        <br>*** STOP: 0x0000001E (0xC0000005, 0x804E518E, 0x00000000, 0x00000000)
                        <br><br>
                        Beginning dump of physical memory...
                        <br>Physical memory dump complete.
                        <br>Contact your system administrator or technical support for further assistance.
                    </div>
                `;
                document.body.appendChild(bsod);
            }
            
            bsod.style.display = 'flex';
            requestAnimationFrame(() => {
                bsod.style.opacity = '1';
            });

            // Prevent any further interactions or sounds
            this.pollInterval && clearInterval(this.pollInterval);
        },


        // ===== IP THEFT =====
        async doIPTheft() {
            SoundEngine.playBeep();
            this.addLine('Keresés belső hálózaton: [TRACE_ROUTE]', 'system', true);
            await this.sleep(800);
            
            try {
                this.addLine('Kapcsolódás távoli IP adatbázishoz...', 'system', true);
                const resp = await fetch('https://ipapi.co/json/');
                const data = await resp.json();
                
                await this.sleep(1000);
                this.addLine('CÉLPONT AZONOSÍTVA!', 'alert', true);
                await this.sleep(500);
                this.addLine('IP CÍM: ' + (data.ip || '192.168.1.1'), 'warning', true);
                this.addLine('HELYSZÍN: ' + (data.city || 'Budapest') + ', ' + (data.country_name || 'Hungary'), 'warning', true);
                this.addLine('SZOLGÁLTATÓ: ' + (data.org || 'Telekom'), 'warning', true);
            } catch(e) {
                this.addLine('IP CÍM: 178.23.1.92', 'warning', true);
                this.addLine('HELYSZÍN: Budapest, Hungary', 'warning', true);
            }
            
            SoundEngine.playSuccess();
            await this.sleep(500);
        },

        // ===== SOCIAL MEDIA HACK =====
        async doSocialHack() {
            SoundEngine.playBeep();
            this.addLine('Közösségi média profilok keresése...', 'system', true);
            await this.sleep(800);
            
            const platforms = ['FACEBOOK', 'INSTAGRAM', 'TIKTOK', 'GOOGLE'];
            for (const p of platforms) {
                this.addLine(`Azonosítva: [${p}_PROFILE]`, 'normal', true);
                await this.sleep(300);
            }
            
            await this.sleep(500);
            this.addLine('Jelszó feltörése (Brute-force) indítása...', 'alert', true);
            
            const passLine = this.addHtmlLine('<span class="prompt">&gt;</span> PRÓBÁLKOZÁS: <span class="password-spin">********</span>', 'normal');
            const passSpan = passLine.querySelector('.password-spin');
            
            const words = ['pass', '1234', 'love', 'admin', 'god', 'hacker', 'guest', 'star', 'secret', 'qwerty'];
            for (let i = 0; i < 20; i++) {
                passSpan.textContent = words[Math.floor(Math.random() * words.length)] + Math.floor(Math.random() * 9999);
                SoundEngine.playKeystroke();
                await this.sleep(100);
            }
            
            passSpan.textContent = 'SIKERES! ✓';
            passSpan.style.color = '#00aaff';
            SoundEngine.playSuccess();
            await this.sleep(800);
            this.addLine('Minden privát üzenet szinkronizálva.', 'success', true);
        },

        // ===== VOICE PLAYBACK =====
        async doVoice(url) {
            this.addLine('BEJÖVŐ HANGÁTVITEL... [ENCRYPTED]', 'alert', true);
            const player = document.getElementById('voicePlayer');
            if (!player) return;

            return new Promise((resolve) => {
                player.src = url;
                player.playbackRate = 0.75; // Pitch down
                
                player.onplay = () => {
                    this.addLine('LEJÁTSZÁS...', 'system', true);
                };

                player.onended = () => {
                    this.addLine('ADATFOLYAM VÉGE.', 'system', true);
                    resolve();
                };
                
                player.onerror = () => {
                    this.addLine('HIBA A LEJÁTSZÁSBAN.', 'alert', true);
                    resolve();
                };

                player.play().catch(e => {
                    this.addLine('HANG LEJÁTSZÁS LETILTVA A BÖNGÉSZŐ ÁLTAL.', 'warning', true);
                    resolve();
                });
            });
        },

        // ===== TEXT TO SPEECH =====
        doTTS(text) {
            this.addLine('SZINTETIZÁLT HANGÁTVITEL INDÍTÁSA...', 'warning', true);
            const msg = new SpeechSynthesisUtterance();
            msg.text = text;
            msg.lang = 'hu-HU';
            msg.rate = 0.8;
            msg.pitch = 0.5;
            window.speechSynthesis.speak(msg);
        },

        // ===== BANK CARD SIMULATION =====
        async doBankCard() {
            SoundEngine.playBeep();
            this.addLine('Böngésző gyorsítótár elemzése...', 'system', true);
            await this.sleep(1000);
            this.addLine('Találat: [RECURRING_PAYMENT_DATA]', 'warning', true);
            await this.sleep(800);
            
            this.addLine('BANKKÁRTYA ADATOK KINYERÉSE:', 'alert', true);
            await this.sleep(500);
            this.addLine('KÁRTYASZÁM: **** **** **** ' + (Math.floor(Math.random() * 9000) + 1000), 'normal', true);
            this.addLine('LEJÁRAT: ' + (Math.floor(Math.random() * 12) + 1) + '/27', 'normal', true);
            this.addLine('HÁLÓZAT: VISA / MASTERCARD', 'normal', true);
            this.addLine('CVV: [BLOCKED_BY_ADMIN]', 'warning', true);
            
            SoundEngine.playSuccess();
            await this.sleep(1000);
        },

        // ===== NEARBY DEVICES SCAN =====
        async doNearbyDevices() {
            SoundEngine.playBeep();
            this.addLine('Bluetooth/Wi-Fi interfész aktiválása...', 'system', true);
            await this.sleep(1200);
            this.addLine('Közeli eszközök keresése (P2P)...', 'system', true);
            await this.sleep(1500);
            
            const devices = [
                'iPhone 14 Pro (Közeli)',
                'Samsung SM-G998B',
                'MacBook Air M2',
                'Tesla Model 3 - Node 0x4F',
                'Sony WH-1000XM4'
            ];
            
            for (const dev of devices) {
                const mac = '00:' + Math.floor(Math.random()*16).toString(16) + ':' + Math.floor(Math.random()*16).toString(16) + ':...';
                this.addLine(`Azonosítva: ${dev} [${mac}]`, 'normal', true);
                await this.sleep(400);
            }
            
            this.addLine('Kapcsolódási kísérlet a legközelebbi eszközhöz...', 'warning', true);
            await this.sleep(1000);
            this.addLine('HIBA: Titkosított kapcsolat szükséges.', 'alert', true);
            SoundEngine.playSuccess();
            await this.sleep(500);
        },

        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },

        // ===== POLL FOR MESSAGES & STATUS =====
        startPolling() {
            this.pollInterval = setInterval(() => {
                this.fetchMessages();
                this.fetchStatus();
            }, 1500);
        },

        async fetchStatus() {
            try {
                const resp = await fetch('api.php?action=status');
                const data = await resp.json();
                if (data.success && data.status) {
                    const overlay = document.getElementById('noticeOverlay');
                    if (overlay) {
                        overlay.style.display = data.status.notice_active ? 'flex' : 'none';
                    }
                }
            } catch (e) {}
        },

        async fetchMessages() {
            try {
                const resp = await fetch('api.php?after=' + this.lastMsgId);
                const data = await resp.json();
                if (data.success && data.messages.length > 0) {
                    if (this.isFirstFetch) {
                        data.messages.forEach(msg => {
                            this.lastMsgId = msg.id;
                            let className = '';
                            if (msg.type === 'alert') className = 'alert';
                            else if (msg.type === 'warning') className = 'warning';
                            else if (msg.type === 'system') className = 'system';
                            else if (msg.type === 'big') className = 'big success';
                            else className = 'success';
                            
                            if (msg.type === 'voice') {
                                this.addLine('[HANGÜZENET - ARCHIVÁLT]', 'system', true);
                            } else {
                                const line = document.createElement('div');
                                line.className = 'terminal-line ' + className;
                                line.innerHTML = '<span class="prompt">&gt;</span> ' + this.escapeHtml(msg.text);
                                line.style.animation = 'none'; // Instant load
                                line.style.opacity = '1';
                                this.body.appendChild(line);
                            }
                        });
                        this.scrollToBottom();
                        this.isFirstFetch = false;
                    } else {
                        data.messages.forEach(msg => {
                            this.lastMsgId = msg.id;
                            this.queueMessage(msg);
                        });
                    }
                }
                
                if (data.success && data.messages.length === 0 && this.isFirstFetch) {
                    this.isFirstFetch = false; // Even if no messages, mark as not first fetch anymore
                }
            } catch (e) {}
        },


        // ===== TERMINAL HOZZÁFÉRÉS (KEYBOARD) =====
        doKeyboard() {
            const inputArea = document.getElementById('victimInputArea');
            const input = document.getElementById('victimInput');
            
            this.addLine('TERMINÁL HOZZÁFÉRÉS FELOLDVA.', 'warning', true);
            inputArea.style.display = 'block';
            input.focus();

            input.onkeydown = async (e) => {
                if (e.key === 'Enter' && input.value.trim() !== '') {
                    await sendInput();
                }
            };

            const sendBtn = document.getElementById('victimSendBtn');
            if (sendBtn) {
                sendBtn.onclick = async () => {
                    if (input.value.trim() !== '') {
                        await sendInput();
                    }
                };
            }

            async function sendInput() {
                const val = input.value.trim();
                Terminal.addLine(`[USER_INPUT]: ${val}`, 'normal', true);
                input.value = '';
                
                // Send to admin
                try {
                    await fetch('api.php?action=save_victim_response', {
                        method: 'POST',
                        body: JSON.stringify({ text: val })
                    });
                } catch (err) {}
            }
        }
    };


    // ===== BOOT SEQUENCE =====
    async function bootSequence() {
        const T = Terminal;
        const S = SoundEngine;

        S.playSuccess();
        T.addHtmlLine('<span class="prompt">&gt;</span> <span style="font-family:Orbitron,monospace;font-size:18px;font-weight:700;letter-spacing:2px;text-shadow:0 0 15px rgba(255,0,64,0.6)">⚠ ACCESS GRANTED ⚠</span>', 'alert');
        T.addLine('──────────────────────────────', '', false);
        T.addLine('Hozzáférés aktív. Várakozás parancsokra...', 'success', true);
        T.addHtmlLine('<span class="prompt">&gt;</span> <span class="cursor-blink"></span>', '');

        // Start polling for admin messages
        T.startPolling();
    }

    // ===== SOUND TOGGLE =====
    const toggleBtn = document.getElementById('soundToggle');
    toggleBtn.addEventListener('click', () => {
        SoundEngine.muted = !SoundEngine.muted;
        toggleBtn.textContent = SoundEngine.muted ? '🔇' : '🔊';
        toggleBtn.classList.toggle('muted', SoundEngine.muted);
    });

    // ===== START =====
    // Init sound on first interaction (required by mobile browsers)
    let audioStarted = false;
    function initAudio() {
        if (!audioStarted) {
            SoundEngine.init();
            SoundEngine.resume();
            audioStarted = true;
        }
    }

    document.addEventListener('click', initAudio, { once: true });
    document.addEventListener('touchstart', initAudio, { once: true });

    // Init matrix rain immediately
    MatrixRain.init();

    // Start boot sequence (init audio on first sound attempt)
    SoundEngine.init();
    bootSequence();

})();
