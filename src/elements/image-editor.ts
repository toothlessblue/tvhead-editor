import { LitElement, css, html, type PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { bind } from '../decorators/bind';
import { ColorPallette } from './color-pallette';
import {ref, createRef} from 'lit/directives/ref.js';

@customElement('image-editor')
export class ImageEditor extends LitElement {
    static styles = css`
        :host {
            width: 100%;
        }

        #canvasParent {
            display: block;
            margin-bottom: 30px;
            margin-top: 30px;
        }

        #canvasSubParent {
            position: relative;
        }

        canvas {
            background-color: #880088;
            position: relative;
        }

        #bin {
            background-image: url(/bin.svg);
            width: 50px;
            height: 50px;
            background-size: contain;
        }

        color-pallette {
            margin: auto;
            width: min-content;
        }
    `;

    @property({ type: Number })
    width: number = 64;

    @property({ type: Number })
    height: number = 32;

    isMouseDown = false;
    padding: number = 30;

    colorPallette = createRef<ColorPallette>();

    get scaledWidth(): number {
        return this.width * this.scale;
    }

    get scaledHeight(): number {
        return this.height * this.scale;
    }

    get scale(): number {
        let containerWidth = (this.canvas.parentElement?.clientWidth ?? 300) - this.padding * 2;
        return containerWidth / this.width;
    }

    get canvas(): HTMLCanvasElement {
        if (!this._canvas) {
            this._canvas = document.createElement('canvas');
            this._canvas.addEventListener('mousemove', this.onMouseMove);
            this._canvas.addEventListener('mousedown', this.onMouseDown);
            window.addEventListener('mouseup', this.onMouseUp);
            this._canvas.width = this.scaledWidth;
            this._canvas.height = this.scaledHeight;
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
            ctx.scale(this.scale, this.scale);
            ctx.imageSmoothingEnabled = false;
            ctx.fillStyle = 'black';
            ctx.fillRect(0, 0, this.width * this.scale, this.height * this.scale);
        }

        return this._ctx;
    }

    _canvas: HTMLCanvasElement | null = null;
    _ctx: CanvasRenderingContext2D | null = null;

    @bind
    onCanvasClicked(e: MouseEvent) {
        let canvasRect = this.canvas.getBoundingClientRect();

        var x = e.pageX - canvasRect.x;
        var y = e.pageY - canvasRect.y;

        this.setPixel(Math.floor(x / this.scale), Math.floor(y / this.scale));
    }

    @bind
    onMouseMove(e: MouseEvent) {
        if (this.isMouseDown) {
            this.onCanvasClicked(e);
        }
    }

    @bind
    onMouseUp() {
        this.isMouseDown = false;
    }

    @bind
    onMouseDown(e: MouseEvent) {
        this.isMouseDown = true;
        this.onCanvasClicked(e);
    }

    onColorInput(e: InputEvent) {
        this.ctx.fillStyle = (e.target as HTMLInputElement).value;
    }

    @bind
    onWindowResize() {
        this.canvas.width = this.scaledWidth;
        this.canvas.height = this.scaledHeight;
        this.ctx.setTransform(1, 0, 0, 1, 0, 0);
        this.ctx.scale(this.scale, this.scale);

        this.ctx.fillStyle = this.colorPallette.value?.value ?? 'white';
    }

    @bind
    onBin() {
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.width * this.scale, this.height * this.scale);
        this.ctx.fillStyle = this.colorPallette.value?.value ?? 'white';
    }

    setPixel(x: number, y: number) {
        this.ctx.fillRect(x, y, 1, 1);
    }

    getImage() {
        return {
            width: this.canvas.width,
            height: this.canvas.height,
            pixelWidth: this.width,
            pixelHeight: this.height,
            imageData: this.canvas.toDataURL(),
        }
    }

    connectedCallback(): void {
        super.connectedCallback();

        // Resizing canvas causes it to clear.
        // While possible to prevent this by copying it to an image and back,
        // it distorts and blurs the image. I'm not sure how to solve this, and given
        // it's intended to be run on a mobile device, whose screen size can only change orientation,
        // I'm not worried about it for now.
        //
        //window.addEventListener('resize', this.onWindowResize);
    }

    protected firstUpdated(_changedProperties: PropertyValues): void {
        this.onWindowResize()
        this.ctx.fillStyle = 'black';
        this.ctx.fillRect(0, 0, this.width, this.height);
        this.ctx.fillStyle = 'white';
    }

    render() {
        return html`
            <div id="canvasParent" style="padding: 0 ${this.padding}px">
                ${this.canvas}
                <div id="bin" @click="${this.onBin}"></div>
            </div>
            <color-pallette ${ref(this.colorPallette)} @input="${this.onColorInput}"></color-pallette>
        `;
    }
}
