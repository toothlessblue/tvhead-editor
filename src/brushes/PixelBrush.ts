import { html } from 'lit';
import { Brush } from './Brush';
import { bind } from '../decorators/bind';
import type { ColorPallette } from '../elements/color-pallette';

export class PixelBrush extends Brush {
    color: string = '#ffffff';
    pallette: ColorPallette;

    constructor() {
        super();
        this.pallette = document.createElement('color-pallette') as ColorPallette;
    }

    getIcon(): string {
        return '/pixel-brush-icon.svg';
    }

    @bind
    onColorInput(e: InputEvent) {
        this.color = (e.target as ColorPallette).value;
    }

    renderBrushOptions() {
        return html`
            <color-pallette @input="${this.onColorInput}"></color-pallette>
            <input type="number" />
        `;
    }

    paint(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        ctx.fillStyle = this.color;
        ctx.fillRect(x, y, 1, 1);
    }
}
