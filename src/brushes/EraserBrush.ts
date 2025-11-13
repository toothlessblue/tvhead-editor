import { html } from 'lit';
import { Brush } from './Brush';
import { bind } from '../decorators/bind';
import brushIcon from '../assets/eraser-brush-icon.svg';

export class EraserBrush extends Brush {
    radius: number = 1;

    getIcon(): string {
        return brushIcon;
    }

    renderBrushOptions() {
        return html` <input min="1" type="number" @input="${this.onRadiusInput}" value="${this.radius}" /> `;
    }

    @bind
    onRadiusInput(e: InputEvent) {
        this.radius = parseInt((e.target as HTMLInputElement).value);
    }

    paint(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        ctx.clearRect(x, y, 1, 1);
    }
}
