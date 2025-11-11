import { LitElement, css, html, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { bind } from '../decorators/bind';
import { ColorPallette } from './color-pallette';
import type { Brush } from '../brushes/Brush';
import { EraserBrush } from '../brushes/EraserBrush';
import { PixelBrush } from '../brushes/PixelBrush';
import { cache } from 'lit/directives/cache.js';

@customElement('image-editor')
export class ImageEditor extends LitElement {
    static popoverEditor(inputImage: string, width: number, height: number) {
        let editor = document.createElement('image-editor') as ImageEditor;
        document.body.appendChild(editor);
        editor.toggleAttribute('popover');
        editor.width = width;
        editor.height = height;
        editor.classList.add('popover-editor');
        editor.showPopover();
        editor.loadImage(inputImage);
        return editor;
    }

    static styles = css`
        :host {
            width: 100%;
        }

        :host(.popover-editor) {
            position: absolute;
            inset: 0;
            max-width: 1000px;
        }

        #canvasParent {
            display: block;
            margin-bottom: 30px;
            margin-top: 30px;
            position: relative;
        }

        canvas {
            background-color: #333333;
            image-rendering: pixelated;
            display: block;
        }

        #grid {
            background-image: url(/canvas-grid.svg);
            background-size: cover;
            position: absolute;
            inset: 0;
            display: block;
            width: 100%;
            pointer-events: none;
            background-repeat: no-repeat;
        }

        #bin {
            background-image: url(/bin.svg);
            width: 50px;
            height: 50px;
            background-size: contain;
        }

        color-pallette {
            margin: auto;
            width: fit-content;
        }

        .brush {
            width: 50px;
            height 50px;
        }

        .brush img {
            width: 100%;
            height: 100%;
            display: block;
        }

        .brush[selected] {
            border: 5px solid;
            border-image: conic-gradient(
                rgba(255, 0, 0, 1) 0%,
                rgba(255, 154, 0, 1) 10%,
                rgba(208, 222, 33, 1) 20%,
                rgba(79, 220, 74, 1) 30%,
                rgba(63, 218, 216, 1) 40%,
                rgba(47, 201, 226, 1) 50%,
                rgba(28, 127, 238, 1) 60%,
                rgba(95, 21, 242, 1) 70%,
                rgba(186, 12, 248, 1) 80%,
                rgba(251, 7, 217, 1) 90%,
                rgba(255, 0, 0, 1) 100%
            ) 1;solid;
        }
    `;

    @property({ type: Number })
    width: number = 64;

    @property({ type: Number })
    height: number = 32;

    @property({ type: Array })
    brushes: Brush[] = [new EraserBrush(), new PixelBrush()];

    @property({ type: Object })
    currentBrush: Brush | null = null;

    isMouseDown = false;
    isTouchDown = false;
    padding: number = 30;
    currentColor: string = 'white';
    originalImage: string = '';

    get scaledWidth(): number {
        return this.width * this.scale;
    }

    get scaledHeight(): number {
        return this.height * this.scale;
    }

    get scale(): number {
        let containerWidth = this.canvas.parentElement?.clientWidth ?? 300;
        return containerWidth / this.width;
    }

    get canvas(): HTMLCanvasElement {
        if (!this._canvas) {
            this._canvas = document.createElement('canvas');
            this._canvas.addEventListener('mousemove', this.onMouseMove);
            this._canvas.addEventListener('touchmove', this.onTouchMove);
            this._canvas.addEventListener('mousedown', this.onMouseDown);
            this._canvas.addEventListener('touchstart', this.onTouchDown);
            window.addEventListener('mouseup', this.onMouseUp);
            this._canvas.width = this.width;
            this._canvas.height = this.height;
            this._canvas.style.height = `${this.scaledHeight}px`;
            this._canvas.style.width = `${this.scaledWidth}px`;
        }

        return this._canvas;
    }

    get ctx(): CanvasRenderingContext2D {
        if (!this._ctx) {
            let ctx = this.canvas.getContext('2d');

            if (!ctx) {
                throw new Error('Failed to create canvas 2d rendering context!');
            }

            this._ctx = ctx;
            ctx.imageSmoothingEnabled = false;
            ctx.fillStyle = '#00000000';
            ctx.fillRect(0, 0, this.width * this.scale, this.height * this.scale);
        }

        return this._ctx;
    }

    get imageData() {
        if (!this._imageData) {
            this._imageData = this.ctx.createImageData(1, 1);
        }

        return this._imageData;
    }

    _canvas: HTMLCanvasElement | null = null;
    _ctx: CanvasRenderingContext2D | null = null;
    _imageData: ImageData | null = null;

    @bind
    onCanvasClicked(e: MouseEvent | TouchEvent) {
        let pageX: number, pageY: number;
        if (e instanceof TouchEvent) {
            pageX = e.touches[0].pageX;
            pageY = e.touches[0].pageY;
        } else {
            pageX = e.pageX;
            pageY = e.pageY;
        }

        let canvasRect = this.canvas.getBoundingClientRect();

        let x = pageX - canvasRect.x;
        let y = pageY - canvasRect.y;

        this.setPixel(Math.floor(x / this.scale), Math.floor(y / this.scale));
    }

    @bind
    onTouchMove(e: TouchEvent) {
        if (this.isTouchDown) {
            this.onCanvasClicked(e);
            e.preventDefault();
        }
    }

    @bind
    onTouchDown(e: TouchEvent) {
        this.isTouchDown = true;
        this.onCanvasClicked(e);
        e.preventDefault();
    }

    @bind
    onTouchUp() {
        this.isTouchDown = false;
    }

    @bind
    onMouseMove(e: MouseEvent) {
        if (this.isMouseDown) {
            this.onCanvasClicked(e);
        }
    }

    @bind
    onMouseDown(e: MouseEvent) {
        if (e.buttons !== 1) return;
        this.isMouseDown = true;
        this.onCanvasClicked(e);
    }

    @bind
    onMouseUp() {
        this.isMouseDown = false;
    }

    onColorInput(e: InputEvent) {
        this.currentColor = (e.target as ColorPallette).value;
    }

    @bind
    async onWindowResize() {
        let img = document.createElement('img');
        img.src = this.canvas.toDataURL();
        await new Promise((res) => img.addEventListener('load', res));

        this.canvas.style.height = `${this.scaledHeight}px`;
        this.canvas.style.width = `${this.scaledWidth}px`;
        this.canvas.width = this.width;
        this.canvas.height = this.height;

        this.ctx.drawImage(img, 0, 0);
    }

    @bind
    onBin() {
        this.ctx.clearRect(0, 0, this.width * this.scale, this.height * this.scale);
    }

    setPixel(x: number, y: number) {
        if (!this.currentBrush) return;

        this.currentBrush.paint(this.ctx, x, y);
    }

    erasePixel(x: number, y: number) {
        this.ctx.clearRect(x, y, 1, 1);
    }

    getImage() {
        return this.canvas.toDataURL();
    }

    async loadImage(image: string) {
        this.originalImage = image;
        let img = document.createElement('img');
        img.src = image;
        await new Promise((res) => img.addEventListener('load', res));
        await new Promise(requestAnimationFrame);
        this.ctx.drawImage(img, 0, 0);
    }

    onSaveClose() {
        this.dispatchEvent(new Event('close'));
    }

    onCancel() {
        this.loadImage(this.originalImage);
    }

    async waitForExit() {
        return new Promise((res) => this.addEventListener('close', res));
    }

    connectedCallback(): void {
        super.connectedCallback();

        window.addEventListener('resize', this.onWindowResize);
    }

    protected firstUpdated(_changedProperties: PropertyValues): void {
        this.onWindowResize();
    }

    render() {
        return html`
            <div id="canvasParent" style="margin-right: ${this.padding}px; margin-left: ${this.padding}px">
                ${this.canvas}
                <div id="grid"></div>
            </div>

            <div id="bin" @click="${this.onBin}"></div>
            <div @click="${this.onSaveClose}">Save</div>
            <div @click="${this.onCancel}">Cancel</div>

            ${this.brushes.map(
                (_) => html`
                    <div @click="${() => (this.currentBrush = _)}" class="brush" ?selected=${_ === this.currentBrush}>
                        <img src="${_.getIcon()}" />
                    </div>
                `
            )}
            ${cache(this.currentBrush?.renderBrushOptions())}
        `;
    }
}
