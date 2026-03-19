// ===================================================================
//  ADMIN.JS – Admin control panel for the hack prank app
// ===================================================================

(function () {
    'use strict';

    // ===== DOM ELEMENTS =====
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const clearBtn = document.getElementById('clearBtn');
    const messageLog = document.getElementById('messageLog');
    const noMessages = document.getElementById('noMessages');
    const msgCount = document.getElementById('msgCount');
    const quickMessages = document.getElementById('quickMessages');
    const typeBtns = document.querySelectorAll('.type-btn');

    let selectedType = 'normal';
    let allMessages = [];
    let lastVoiceUrl = null;

    // ===== MATRIX RAIN (subtle background) =====
    const canvas = document.getElementById('matrix-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        const chars = '01';
        let columns = [];
        const fontSize = 14;

        function resizeCanvas() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            const colCount = Math.floor(canvas.width / fontSize);
            columns = Array(colCount).fill(0).map(() => Math.random() * canvas.height / fontSize);
        }

        function animateMatrix() {
            ctx.fillStyle = 'rgba(10, 10, 10, 0.08)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.font = fontSize + 'px monospace';
            ctx.fillStyle = 'rgba(0, 170, 255, 0.15)';

            for (let i = 0; i < columns.length; i++) {
                const char = chars[Math.floor(Math.random() * chars.length)];
                ctx.fillText(char, i * fontSize, columns[i] * fontSize);
                if (columns[i] * fontSize > canvas.height && Math.random() > 0.98) columns[i] = 0;
                columns[i]++;
            }
            requestAnimationFrame(animateMatrix);
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        animateMatrix();
    }

    // ===== TYPE SELECTOR =====
    typeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            typeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            selectedType = btn.dataset.type;
        });
    });

    // ===== SEND MESSAGE =====
    async function sendMessage(text, type) {
        if (!text.trim()) return;

        try {
            const resp = await fetch('api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text: text.trim(), type: type })
            });
            const data = await resp.json();

            if (data.success) {
                allMessages.push(data.message);
                renderMessages();
                messageInput.value = '';
                messageInput.focus();

                // Animate send button
                sendBtn.textContent = '✓';
                sendBtn.style.borderColor = '#00aaff';
                setTimeout(() => {
                    sendBtn.textContent = 'KÜLDÉS';
                    sendBtn.style.borderColor = '';
                }, 500);
            }
        } catch (e) {
            console.error('Hiba az üzenet küldésekor:', e);
            sendBtn.textContent = '✗';
            sendBtn.style.borderColor = '#ff0040';
            setTimeout(() => {
                sendBtn.textContent = 'KÜLDÉS';
                sendBtn.style.borderColor = '';
            }, 1000);
        }
    }

    sendBtn.addEventListener('click', () => {
        sendMessage(messageInput.value, selectedType);
    });

    messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage(messageInput.value, selectedType);
        }
    });

    // ===== QUICK MESSAGES =====
    quickMessages.addEventListener('click', (e) => {
        const btn = e.target.closest('.quick-btn');
        if (!btn) return;

        const msg = btn.dataset.msg;
        const type = btn.dataset.type || 'normal';

        sendMessage(msg, type);

        // Button feedback
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => btn.style.transform = '', 150);
    });

    // ===== CLEAR ALL =====
    clearBtn.addEventListener('click', async () => {
        if (!confirm('Biztosan törlöd az összes üzenetet?')) return;

        try {
            await fetch('api.php', { method: 'DELETE' });
            allMessages = [];
            renderMessages();
        } catch (e) {
            console.error('Hiba a törléskor:', e);
        }
    });

    // ===== RENDER MESSAGES =====
    function renderMessages() {
        if (allMessages.length === 0) {
            messageLog.innerHTML = '<div class="no-messages">Még nincs üzenet. Küldj valamit!</div>';
        } else {
            messageLog.innerHTML = '';
            allMessages.forEach(msg => {
                const item = document.createElement('div');
                item.className = 'message-item type-' + (msg.type || 'normal');
                item.innerHTML =
                    '<div class="msg-time">' + formatTime(msg.timestamp) + ' | ' + getTypeLabel(msg.type) + '</div>' +
                    '<div>' + escapeHtml(msg.text) + '</div>';
                messageLog.appendChild(item);
            });
            messageLog.scrollTop = messageLog.scrollHeight;
        }
        msgCount.textContent = allMessages.length + ' üzenet';
    }

    function getTypeLabel(type) {
        switch (type) {
            case 'alert': return '⚠ ALERT';
            case 'warning': return '⚡ WARNING';
            case 'system': return 'SYSTEM';
            case 'big': return '★ BIG';
            default: return 'NORMAL';
        }
    }

    function formatTime(ts) {
        if (!ts) return '';
        const d = new Date(ts.replace(' ', 'T'));
        return d.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ===== FETCH ALL MESSAGES ON LOAD =====
    async function loadMessages() {
        try {
            const resp = await fetch('api.php');
            const data = await resp.json();
            if (data.success) {
                allMessages = data.messages;
                renderMessages();
            }
        } catch (e) {
            console.error('Hiba az üzenetek betöltésekor:', e);
        }
    }

    // ===== VISITOR STATUS POLLING =====
    const statusBadge = document.querySelector('.status-badge');
    let lastVisitTime = null;

    async function checkStatus() {
        try {
            const resp = await fetch('api.php?action=status');
            const data = await resp.json();
            if (data.success && data.status) {
                const status = data.status;

                // Update badge text if online (last visit < 15s ago)
                const now = new Date();
                const lastVisit = status.last_visit ? new Date(status.last_visit.replace(' ', 'T')) : null;
                const isOnline = lastVisit && (now - lastVisit < 15000);

                if (isOnline) {
                    statusBadge.textContent = 'KEZELT KAPCSOLAT: AKTÍV';
                    statusBadge.style.color = '#00aaff';
                    statusBadge.style.borderColor = '#00aaff';
                } else {
                    statusBadge.textContent = 'VÁRAKOZÁS KAPCSOLATRA...';
                    statusBadge.style.color = 'rgba(0, 170, 255, 0.5)';
                    statusBadge.style.borderColor = 'rgba(0, 170, 255, 0.2)';
                }

                // New visitor notification
                if (status.new_visitor) {
                    playNotificationSound();
                    showNotification('ÚJ KAPCSOLAT ÉSZLELVE!');
                }

                // Update notice toggle if changed externally
                const noticeToggle = document.getElementById('noticeToggle');
                if (noticeToggle && status.notice_active !== undefined) {
                    noticeToggle.checked = status.notice_active;
                }

                // Update terminal toggle if changed externally
                const terminalToggle = document.getElementById('terminalToggle');
                if (terminalToggle && status.terminal_active !== undefined) {
                    terminalToggle.checked = status.terminal_active;
                }
            }
        } catch (e) { /* silent */ }
    }

    // ===== NOTICE TOGGLE =====
    const noticeToggle = document.getElementById('noticeToggle');
    if (noticeToggle) {
        noticeToggle.addEventListener('change', async (e) => {
            const isActive = e.target.checked;
            try {
                await fetch('api.php?action=toggle_notice', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ active: isActive })
                });
                if (isActive) {
                    showNotification('Hamarosan JELENTKEZÉS: BEKAPCSOLVA');
                } else {
                    showNotification('HamarosanJELENTKEZÉS: KIKAPCSOLVA');
                }
            } catch (err) {
                console.error('Failed to toggle notice:', err);
                e.target.checked = !isActive; // revert on fail
            }
        });
    }

    // ===== TERMINAL TOGGLE =====
    const terminalToggle = document.getElementById('terminalToggle');
    if (terminalToggle) {
        terminalToggle.addEventListener('change', async (e) => {
            const isActive = e.target.checked;
            try {
                await fetch('api.php?action=toggle_terminal', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ active: isActive })
                });
                if (isActive) {
                    showNotification('TERMINÁL HOZZÁFÉRÉS: BEKAPCSOLVA');
                } else {
                    showNotification('TERMINÁL HOZZÁFÉRÉS: KIKAPCSOLVA');
                }
            } catch (err) {
                console.error('Failed to toggle terminal:', err);
                e.target.checked = !isActive; // revert on fail
            }
        });
    }

    function playNotificationSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.5);
            gain.gain.setValueAtTime(0.1, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
        } catch (e) { }
    }

    function showNotification(text) {
        const toast = document.createElement('div');
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 0, 64, 0.9);
            color: white;
            padding: 10px 20px;
            border-radius: 4px;
            font-family: 'Orbitron', monospace;
            font-size: 14px;
            z-index: 10000;
            box-shadow: 0 0 20px rgba(255, 0, 64, 0.5);
            animation: slideDown 0.3s ease-out;
        `;
        toast.textContent = text;
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s ease';
            setTimeout(() => toast.remove(), 500);
        }, 3000);
    }

    // Add CSS for notification
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideDown {
            from { transform: translate(-50%, -50px); opacity: 0; }
            to { transform: translate(-50%, 0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);

    // ===== POLL for changes =====
    setInterval(async () => {
        // Poll messages
        try {
            const resp = await fetch('api.php');
            const data = await resp.json();
            if (data.success) {
                if (data.messages.length !== allMessages.length) {
                    allMessages = data.messages;
                    renderMessages();
                }
            }
        } catch (e) { /* silent */ }

        // Poll status
        checkStatus();
    }, 3000);

    // Initial check
    checkStatus();

    // ===== VICTIM MESSAGES =====
    const victimResponses = document.getElementById('victimResponses');
    const clearVictimBtn = document.getElementById('clearVictimBtn');

    async function fetchVictimResponses() {
        try {
            const resp = await fetch('api.php?action=get_victim_responses');
            const data = await resp.json();
            if (data.success && data.responses.length > 0) {
                victimResponses.innerHTML = data.responses.map(r => `
                    <div class="victim-msg">
                        <span class="time">[${r.time}]</span> ${r.text}
                    </div>
                `).join('');
            } else {
                victimResponses.innerHTML = 'Még nincs válasz az áldozattól.';
            }
        } catch (e) { }
    }

    if (clearVictimBtn) {
        clearVictimBtn.addEventListener('click', async () => {
            const resp = await fetch('api.php?action=clear_responses');
            const data = await resp.json();
            if (data.success) fetchVictimResponses();
        });
    }

    setInterval(fetchVictimResponses, 3000);

    // ===== VOICE RECORDING =====
    let mediaRecorder;
    let audioChunks = [];
    const recordBtn = document.getElementById('recordBtn');

    if (recordBtn) {
        // Request permissions early
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                mediaRecorder = new MediaRecorder(stream);

                mediaRecorder.addEventListener("dataavailable", event => {
                    audioChunks.push(event.data);
                });

                mediaRecorder.addEventListener("stop", async () => {
                    recordBtn.textContent = 'FELDOLGOZÁS...';
                    recordBtn.classList.remove('recording');

                    const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
                    const formData = new FormData();
                    formData.append('audio', audioBlob);

                    try {
                        const response = await fetch('api.php?action=upload_voice', {
                            method: 'POST',
                            body: formData
                        });
                        const data = await response.json();

                        if (data.success) {
                            // Send voice message command
                            await fetch('api.php', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ type: 'voice', text: data.filename })
                            });

                            recordBtn.textContent = 'Sikeres küldés ✓';
                            setTimeout(() => {
                                recordBtn.textContent = '🎤 HANGÜZENET (TARTSD NYOMVA)';
                            }, 2000);

                            loadMessages();
                        }
                    } catch (e) {
                        recordBtn.textContent = 'Hiba történt ❌';
                        setTimeout(() => {
                            recordBtn.textContent = '🎤 HANGÜZENET (TARTSD NYOMVA)';
                        }, 2000);
                    }

                    audioChunks = [];
                });
            })
            .catch(err => {
                recordBtn.textContent = 'Nincs mikrofon engedély ❌';
                recordBtn.disabled = true;
            });

        // Touch / Mouse events for recording
        const startRecording = (e) => {
            e.preventDefault(); // prevent scroll/click issues
            if (mediaRecorder && mediaRecorder.state === 'inactive') {
                audioChunks = [];
                mediaRecorder.start();
                recordBtn.classList.add('recording');
                recordBtn.textContent = '🔴 FELVÉTEL... (ENGEDD EL A KÜLDÉSHEZ)';
            }
        };

        const stopRecording = (e) => {
            e.preventDefault();
            if (mediaRecorder && mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
            }
        };

        recordBtn.addEventListener('mousedown', startRecording);
        recordBtn.addEventListener('touchstart', startRecording);
        window.addEventListener('mouseup', stopRecording);
        window.addEventListener('touchend', stopRecording);
    }

    // ===== INIT =====

    loadMessages();
    messageInput.focus();

})();
