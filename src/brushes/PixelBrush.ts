import { html } from 'lit';
import { Brush } from './Brush';
import { bind } from '../decorators/bind';
import type { ColorPallette } from '../elements/color-pallette';
import brushIcon from '../assets/pixel-brush-icon.svg';

export class PixelBrush extends Brush {
    radius: number = 1;
    color: string = '#ffffff';
    pallette: ColorPallette;

    constructor() {
        super();
        this.pallette = document.createElement('color-pallette') as ColorPallette;
    }

    getIcon(): string {
        return brushIcon;
    }

    @bind
    onColorInput(e: InputEvent) {
        this.color = (e.target as ColorPallette).value;
    }

    @bind
    onRadiusInput(e: InputEvent) {
        this.radius = parseInt((e.target as HTMLInputElement).value);
    }

    renderBrushOptions() {
        return html`
            <color-pallette @input="${this.onColorInput}"></color-pallette>
            <input min="1" type="number" @input="${this.onRadiusInput}" value="${this.radius}" />
        `;
    }

    paint(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(x, y, 1, 1);
        ctx.beginPath();
        ctx.arc(x, y, this.radius - 1, 0, Math.PI * 2);
        ctx.fill();
    }
}
