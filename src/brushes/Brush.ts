import type { TemplateResult } from "lit";
import type { TemplateResultType } from "lit/directive-helpers.js";

export abstract class Brush {
    abstract getIcon(): string;
    abstract renderBrushOptions(): TemplateResult;
    abstract paint(ctx: CanvasRenderingContext2D, x: number, y: number): void;
}
