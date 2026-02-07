/**
 * ==============================================
 * TELEFONTOK TERVEZŐ - FŐ ALKALMAZÁS
 * ==============================================
 */

class PhoneCaseDesigner {
    constructor() {
        this.canvas = null;
        this.history = [];
        this.historyIndex = -1;
        this.maxHistoryLength = 50;
        this.selectedObject = null;
        this.currentPhoneModel = 'iphone-16-pro-max';

        this.init();
    }

    init() {
        this.initCanvas();
        this.bindEvents();
        this.bindPhoneModelSelector();
        this.saveState();
    }

    // ==========================================
    // CANVAS INICIALIZÁLÁS
    // ==========================================

    initCanvas() {
        const canvasElement = document.getElementById('designCanvas');
        const phoneFrame = document.querySelector('.phone-frame');

        // Canvas méret beállítása a telefon kerethez
        const width = phoneFrame.clientWidth - 16;
        const height = phoneFrame.clientHeight - 16;

        this.canvas = new fabric.Canvas('designCanvas', {
            width: width,
            height: height,
            backgroundColor: '#1a1a2e',
            selection: true,
            preserveObjectStacking: true
        });

        // Canvas stílus beállítása
        this.canvas.setDimensions({
            width: width,
            height: height
        });

        // Szelekció események
        this.canvas.on('selection:created', (e) => this.onObjectSelected(e.selected[0]));
        this.canvas.on('selection:updated', (e) => this.onObjectSelected(e.selected[0]));
        this.canvas.on('selection:cleared', () => this.onSelectionCleared());

        // Módosítás események
        this.canvas.on('object:modified', () => this.saveState());
        this.canvas.on('object:added', () => this.saveState());
        this.canvas.on('object:removed', () => this.saveState());
    }

    // ==========================================
    // ESEMÉNYEK KEZELÉSE
    // ==========================================

    bindEvents() {
        // Kép hozzáadása
        document.getElementById('addImageBtn').addEventListener('click', () => {
            document.getElementById('imageInput').click();
        });

        document.getElementById('imageInput').addEventListener('change', (e) => {
            this.handleImageUpload(e.target.files);
        });

        // Szöveg hozzáadása
        document.getElementById('addTextBtn').addEventListener('click', () => {
            this.addText();
        });

        // Matricák
        document.querySelectorAll('.sticker-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.addSticker(btn.dataset.sticker);
            });
        });

        // Háttérszín
        document.getElementById('bgColorPicker').addEventListener('input', (e) => {
            this.setBackgroundColor(e.target.value);
        });

        // Gradiens háttér
        document.getElementById('applyGradientBtn').addEventListener('click', () => {
            const color1 = document.getElementById('gradientColor1').value;
            const color2 = document.getElementById('gradientColor2').value;
            this.setGradientBackground(color1, color2);
        });

        // Előre beállított gradiensek
        document.querySelectorAll('.gradient-preset').forEach(btn => {
            btn.addEventListener('click', () => {
                this.setPresetGradient(btn.dataset.gradient);
            });
        });

        // Undo/Redo
        document.getElementById('undoBtn').addEventListener('click', () => this.undo());
        document.getElementById('redoBtn').addEventListener('click', () => this.redo());

        // Billentyűzet parancsok
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'z') {
                e.preventDefault();
                this.undo();
            }
            if (e.ctrlKey && e.key === 'y') {
                e.preventDefault();
                this.redo();
            }
            if (e.key === 'Delete' || e.key === 'Backspace') {
                if (document.activeElement.tagName !== 'INPUT') {
                    this.deleteSelected();
                }
            }
        });

        // Törlés gomb
        document.getElementById('deleteSelectedBtn').addEventListener('click', () => {
            this.deleteSelected();
        });

        // Letöltés
        document.getElementById('downloadBtn').addEventListener('click', () => {
            this.downloadDesign();
        });

        // Drag & Drop képfeltöltés
        const canvasArea = document.querySelector('.canvas-area');
        canvasArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            canvasArea.style.background = 'rgba(102, 126, 234, 0.1)';
        });

        canvasArea.addEventListener('dragleave', () => {
            canvasArea.style.background = '';
        });

        canvasArea.addEventListener('drop', (e) => {
            e.preventDefault();
            canvasArea.style.background = '';
            if (e.dataTransfer.files.length > 0) {
                this.handleImageUpload(e.dataTransfer.files);
            }
        });
    }

    // ==========================================
    // KÉP KEZELÉS
    // ==========================================

    // ==========================================
    // TELEFON MODELL KEZELÉS
    // ==========================================

    bindPhoneModelSelector() {
        const phoneModelSelect = document.getElementById('phoneModelSelect');
        const phoneFrame = document.getElementById('phoneFrame');

        phoneModelSelect.addEventListener('change', (e) => {
            const selectedOption = e.target.selectedOptions[0];
            const model = e.target.value;
            const width = parseInt(selectedOption.dataset.width);
            const height = parseInt(selectedOption.dataset.height);
            const radius = parseInt(selectedOption.dataset.radius);
            const cameraStyle = selectedOption.dataset.camera;

            this.currentPhoneModel = model;

            // Telefon keret frissítése
            phoneFrame.style.width = `${width}px`;
            phoneFrame.style.height = `${height}px`;
            phoneFrame.style.borderRadius = `${radius}px`;
            phoneFrame.setAttribute('data-camera', cameraStyle);
            phoneFrame.setAttribute('data-model', model);

            // Canvas átméretezése
            this.resizeCanvas(width - 16, height - 16, radius - 8);
        });
    }

    resizeCanvas(width, height, radius) {
        // Meglévő objektumok mentése
        const objects = this.canvas.getObjects();
        const bgColor = this.canvas.backgroundColor;

        // Canvas átméretezése
        this.canvas.setDimensions({ width, height });

        // Objektumok visszaállítása
        this.canvas.setBackgroundColor(bgColor, () => {
            this.canvas.renderAll();
        });

        // Canvas border-radius frissítése
        const canvasEl = document.getElementById('designCanvas');
        if (canvasEl) {
            const upperCanvas = canvasEl.parentNode.querySelector('.upper-canvas');
            const lowerCanvas = canvasEl.parentNode.querySelector('.lower-canvas');
            if (upperCanvas) upperCanvas.style.borderRadius = `${radius}px`;
            if (lowerCanvas) lowerCanvas.style.borderRadius = `${radius}px`;
        }

        this.saveState();
    }

    handleImageUpload(files) {
        Array.from(files).forEach(file => {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    this.addImage(e.target.result);
                };
                reader.readAsDataURL(file);
            }
        });
    }

    addImage(imageUrl) {
        fabric.Image.fromURL(imageUrl, (img) => {
            // Kép átméretezése, hogy beleférjen a canvasba
            const maxSize = Math.min(this.canvas.width, this.canvas.height) * 0.6;
            const scale = Math.min(maxSize / img.width, maxSize / img.height);

            img.set({
                left: this.canvas.width / 2,
                top: this.canvas.height / 2,
                originX: 'center',
                originY: 'center',
                scaleX: scale,
                scaleY: scale,
                cornerColor: '#667eea',
                cornerStrokeColor: '#ffffff',
                cornerSize: 12,
                transparentCorners: false,
                borderColor: '#667eea',
                borderScaleFactor: 2
            });

            this.canvas.add(img);
            this.canvas.setActiveObject(img);
            this.canvas.renderAll();
        }, { crossOrigin: 'anonymous' });
    }

    // ==========================================
    // SZÖVEG KEZELÉS
    // ==========================================

    addText() {
        const text = new fabric.IText('Szöveg', {
            left: this.canvas.width / 2,
            top: this.canvas.height / 2,
            originX: 'center',
            originY: 'center',
            fontFamily: 'Inter',
            fontSize: 32,
            fill: '#ffffff',
            fontWeight: 'normal',
            fontStyle: 'normal',
            underline: false,
            cornerColor: '#667eea',
            cornerStrokeColor: '#ffffff',
            cornerSize: 12,
            transparentCorners: false,
            borderColor: '#667eea',
            borderScaleFactor: 2
        });

        this.canvas.add(text);
        this.canvas.setActiveObject(text);
        this.canvas.renderAll();
    }

    // ==========================================
    // MATRICÁK
    // ==========================================

    addSticker(emoji) {
        const text = new fabric.Text(emoji, {
            left: this.canvas.width / 2,
            top: this.canvas.height / 2,
            originX: 'center',
            originY: 'center',
            fontSize: 60,
            cornerColor: '#667eea',
            cornerStrokeColor: '#ffffff',
            cornerSize: 12,
            transparentCorners: false,
            borderColor: '#667eea',
            borderScaleFactor: 2
        });

        this.canvas.add(text);
        this.canvas.setActiveObject(text);
        this.canvas.renderAll();
    }

    // ==========================================
    // HÁTTÉR KEZELÉS
    // ==========================================

    setBackgroundColor(color) {
        this.canvas.setBackgroundColor(color, () => {
            this.canvas.renderAll();
            this.saveState();
        });
    }

    setGradientBackground(color1, color2) {
        const gradient = new fabric.Gradient({
            type: 'linear',
            coords: {
                x1: 0,
                y1: 0,
                x2: this.canvas.width,
                y2: this.canvas.height
            },
            colorStops: [
                { offset: 0, color: color1 },
                { offset: 1, color: color2 }
            ]
        });

        this.canvas.setBackgroundColor(gradient, () => {
            this.canvas.renderAll();
            this.saveState();
        });
    }

    setPresetGradient(gradientCSS) {
        // CSS gradiens értelmezése
        const match = gradientCSS.match(/linear-gradient\((\d+)deg,\s*([^\s]+)\s+\d+%,\s*([^\s]+)\s+\d+%\)/);
        if (match) {
            const angle = parseInt(match[1]);
            const color1 = match[2];
            const color2 = match[3];

            // Szög átszámítása koordinátákra
            const angleRad = (angle - 90) * Math.PI / 180;
            const x2 = this.canvas.width * (0.5 + Math.cos(angleRad) * 0.5);
            const y2 = this.canvas.height * (0.5 + Math.sin(angleRad) * 0.5);
            const x1 = this.canvas.width - x2;
            const y1 = this.canvas.height - y2;

            const gradient = new fabric.Gradient({
                type: 'linear',
                coords: { x1, y1, x2, y2 },
                colorStops: [
                    { offset: 0, color: color1 },
                    { offset: 1, color: color2 }
                ]
            });

            this.canvas.setBackgroundColor(gradient, () => {
                this.canvas.renderAll();
                this.saveState();
            });
        }
    }

    // ==========================================
    // TULAJDONSÁGOK PANEL
    // ==========================================

    onObjectSelected(obj) {
        this.selectedObject = obj;
        const panelContent = document.getElementById('panelContent');

        if (obj.type === 'i-text' || obj.type === 'text') {
            // Szöveg tulajdonságok megjelenítése
            const template = document.getElementById('textPropertiesTemplate');
            panelContent.innerHTML = '';
            panelContent.appendChild(template.content.cloneNode(true));

            this.bindTextProperties(obj);
        } else if (obj.type === 'image') {
            // Kép tulajdonságok megjelenítése
            const template = document.getElementById('imagePropertiesTemplate');
            panelContent.innerHTML = '';
            panelContent.appendChild(template.content.cloneNode(true));

            this.bindImageProperties(obj);
        }
    }

    onSelectionCleared() {
        this.selectedObject = null;
        document.getElementById('panelContent').innerHTML = `
            <div class="empty-state">
                <p>Válassz ki egy elemet a szerkesztéshez</p>
            </div>
        `;
    }

    bindTextProperties(textObj) {
        // Szöveg tartalom
        const textContent = document.getElementById('textContent');
        textContent.value = textObj.text;
        textContent.addEventListener('input', (e) => {
            textObj.set('text', e.target.value);
            this.canvas.renderAll();
        });
        textContent.addEventListener('change', () => this.saveState());

        // Betűtípus
        const fontFamily = document.getElementById('fontFamily');
        fontFamily.value = textObj.fontFamily;
        fontFamily.addEventListener('change', (e) => {
            textObj.set('fontFamily', e.target.value);
            this.canvas.renderAll();
            this.saveState();
        });

        // Betűméret
        const fontSize = document.getElementById('fontSize');
        const fontSizeValue = document.getElementById('fontSizeValue');
        fontSize.value = textObj.fontSize;
        fontSizeValue.textContent = `${textObj.fontSize}px`;
        fontSize.addEventListener('input', (e) => {
            const size = parseInt(e.target.value);
            textObj.set('fontSize', size);
            fontSizeValue.textContent = `${size}px`;
            this.canvas.renderAll();
        });
        fontSize.addEventListener('change', () => this.saveState());

        // Szín
        const textColor = document.getElementById('textColor');
        textColor.value = textObj.fill;
        textColor.addEventListener('input', (e) => {
            textObj.set('fill', e.target.value);
            this.canvas.renderAll();
        });
        textColor.addEventListener('change', () => this.saveState());

        // Stílus gombok
        const boldBtn = document.getElementById('boldBtn');
        const italicBtn = document.getElementById('italicBtn');
        const underlineBtn = document.getElementById('underlineBtn');

        if (textObj.fontWeight === 'bold') boldBtn.classList.add('active');
        if (textObj.fontStyle === 'italic') italicBtn.classList.add('active');
        if (textObj.underline) underlineBtn.classList.add('active');

        boldBtn.addEventListener('click', () => {
            const isBold = textObj.fontWeight === 'bold';
            textObj.set('fontWeight', isBold ? 'normal' : 'bold');
            boldBtn.classList.toggle('active');
            this.canvas.renderAll();
            this.saveState();
        });

        italicBtn.addEventListener('click', () => {
            const isItalic = textObj.fontStyle === 'italic';
            textObj.set('fontStyle', isItalic ? 'normal' : 'italic');
            italicBtn.classList.toggle('active');
            this.canvas.renderAll();
            this.saveState();
        });

        underlineBtn.addEventListener('click', () => {
            textObj.set('underline', !textObj.underline);
            underlineBtn.classList.toggle('active');
            this.canvas.renderAll();
            this.saveState();
        });
    }

    bindImageProperties(imgObj) {
        // Átlátszóság
        const imageOpacity = document.getElementById('imageOpacity');
        const opacityValue = document.getElementById('opacityValue');
        imageOpacity.value = imgObj.opacity * 100;
        opacityValue.textContent = `${Math.round(imgObj.opacity * 100)}%`;

        imageOpacity.addEventListener('input', (e) => {
            const opacity = parseInt(e.target.value) / 100;
            imgObj.set('opacity', opacity);
            opacityValue.textContent = `${e.target.value}%`;
            this.canvas.renderAll();
        });
        imageOpacity.addEventListener('change', () => this.saveState());

        // Réteg kezelés
        document.getElementById('bringForwardBtn').addEventListener('click', () => {
            this.canvas.bringForward(imgObj);
            this.canvas.renderAll();
            this.saveState();
        });

        document.getElementById('sendBackwardBtn').addEventListener('click', () => {
            this.canvas.sendBackwards(imgObj);
            this.canvas.renderAll();
            this.saveState();
        });
    }

    // ==========================================
    // UNDO / REDO
    // ==========================================

    saveState() {
        // Aktuális állapot utáni előzmények törlése
        if (this.historyIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.historyIndex + 1);
        }

        // Új állapot mentése
        const state = JSON.stringify(this.canvas.toJSON());
        this.history.push(state);

        // Maximum hossz ellenőrzése
        if (this.history.length > this.maxHistoryLength) {
            this.history.shift();
        } else {
            this.historyIndex++;
        }

        this.updateUndoRedoButtons();
    }

    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            this.loadState(this.history[this.historyIndex]);
        }
    }

    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            this.loadState(this.history[this.historyIndex]);
        }
    }

    loadState(state) {
        this.canvas.loadFromJSON(state, () => {
            this.canvas.renderAll();
            this.updateUndoRedoButtons();
        });
    }

    updateUndoRedoButtons() {
        document.getElementById('undoBtn').disabled = this.historyIndex <= 0;
        document.getElementById('redoBtn').disabled = this.historyIndex >= this.history.length - 1;
    }

    // ==========================================
    // TÖRLÉS
    // ==========================================

    deleteSelected() {
        const activeObject = this.canvas.getActiveObject();
        if (activeObject) {
            this.canvas.remove(activeObject);
            this.canvas.discardActiveObject();
            this.canvas.renderAll();
            this.onSelectionCleared();
        }
    }

    // ==========================================
    // LETÖLTÉS
    // ==========================================

    downloadDesign() {
        // Szelekció elrejtése letöltés előtt
        this.canvas.discardActiveObject();
        this.canvas.renderAll();

        // Canvas exportálása
        const dataURL = this.canvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 2 // Nagyobb felbontás
        });

        // Letöltés
        const link = document.createElement('a');
        link.download = 'telefontok-terv.png';
        link.href = dataURL;
        link.click();
    }
}

// Alkalmazás indítása
document.addEventListener('DOMContentLoaded', () => {
    window.designer = new PhoneCaseDesigner();
});
