import { html } from 'lit';
import { Brush } from './Brush';


export class EraserBrush extends Brush {
    getIcon(): string {
        return '/eraser-brush-icon.svg';
    }

    renderBrushOptions() {
        return html` <input type="number" /> `;
    }

    paint(ctx: CanvasRenderingContext2D, x: number, y: number): void {
        ctx.clearRect(x, y, 1, 1);
    }
}

