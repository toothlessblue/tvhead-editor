import { LitElement, css, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import type { MatrixElementData } from '../utils/matrix-element-data';
import { createRef, ref } from 'lit/directives/ref.js';
import type { Vec2 } from '../utils/vec2';
import { keyed } from 'lit/directives/keyed.js';
import type { PreviewMatrixElement } from './preview-matrix-element';
import { bind } from '../decorators/bind';

const INVISIBLE_DIV = document.createElement('div');
document.body.appendChild(INVISIBLE_DIV);
INVISIBLE_DIV.style.position = 'absolute';
INVISIBLE_DIV.style.pointerEvents = 'none';

@customElement('virtual-matrix')
export class VirtualMatrix extends LitElement {
    readonly PIXEL_WIDTH = 64;
    readonly PIXEL_HEIGHT = 32;

    @property({ type: Array })
    elementDatas: MatrixElementData[] = [];

    draggingElement!: HTMLDivElement;
    virtualGrid = createRef<HTMLDivElement>();
    dragOffset: Vec2 = {x: 0, y: 0};

    static styles = css`
        :host {
            display: block;
        }

        #virtual-matrix-grid {
            max-width: 1000px;
            aspect-ratio: 2;
            width: 100%;
            background-color: black;
            margin: auto;
            position: relative;
            overflow: hidden;
        }

        .element-container {
            padding: 5px;
            border-radius: 5px;
            background-color: #00000050;
            width: fit-content;
        }

        .element-container + .element-container {
            margin-top: 5px;
        }

        #elements-list {
            display: flex;
            flex-wrap: wrap;
        }

        .virtual-element {
            position: absolute;
            background-color: #ffffff22;
        }

        preview-matrix-element {
            width: 100%;
            height: 100%;
        }
    `;

    get scale(): number {
        return (this.virtualGrid.value?.getBoundingClientRect().width ?? 0) / this.PIXEL_WIDTH;
    }

    onNewElement() {
        this.elementDatas.push({
            x: 0,
            y: 0,
            width: 32,
            height: 32,
            tags: [],
            images: [
                'data:image/png;base64,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',
            ],
            fps: 10,
        });
        this.requestUpdate('elementDatas');
    }

    deleteElement(element: MatrixElementData) {
        let index = this.elementDatas.findIndex((_) => _ === element);
        if (index === -1) {
            console.error('invalid index', index, element);
            return;
        }
        this.elementDatas.splice(index, 1);
        this.requestUpdate('elementDatas');
    }

    onDragStart(e: DragEvent) {
        this.draggingElement = e.target as any;
        let draggingElementRect = this.draggingElement.getBoundingClientRect();
        this.dragOffset = {
            x: e.clientX - draggingElementRect.x,
            y: e.clientY - draggingElementRect.y,
        };
        e.dataTransfer?.setDragImage(INVISIBLE_DIV, 0, 0);
    }

    onVirtualElementDragged(e: DragEvent) {
        let data = (this.draggingElement as any).elementData as MatrixElementData;
        let gridRect = this.virtualGrid.value?.getBoundingClientRect();

        if (!gridRect) {
            console.warn("Failed to get gridRect while dragging, shouldn't ever happen");
            return;
        }

        let pixelPos = this.screenPosToPixel({
            x: e.clientX - this.dragOffset.x - gridRect.x,
            y: e.clientY - this.dragOffset.y - gridRect.y,
        });

        data.x = pixelPos.x;
        data.y = pixelPos.y;

        this.requestUpdate('elementDatas');
    }

    pixelPosToScreen(pixelPos: Vec2): Vec2 {
        return {
            x: pixelPos.x * this.scale,
            y: pixelPos.y * this.scale,
        };
    }

    screenPosToPixel(screenPos: Vec2): Vec2 {
        return {
            x: Math.floor(screenPos.x / this.scale),
            y: Math.floor(screenPos.y / this.scale),
        };
    }

    @bind
    onAnyImageChanged() {
        let previewElements = Array.from(this.shadowRoot?.querySelectorAll('preview-matrix-element') ?? []) as PreviewMatrixElement[];
        for (let element of previewElements) {
            element.requestUpdate('data');
        }
    }

    connectedCallback(): void {
        super.connectedCallback();
        window.addEventListener('resize', () => this.requestUpdate());
    }

    render() {
        return html`
            <div ${ref(this.virtualGrid)} id="virtual-matrix-grid" @dragover="${this.onVirtualElementDragged}">
                ${this.elementDatas.map((_) => {
                    let screenPos = this.pixelPosToScreen({ x: _.x, y: _.y });
                    let dimensions = this.pixelPosToScreen({ x: _.width, y: _.height });
                    return html`
                        <div
                            @dragstart="${this.onDragStart}"
                            .elementData="${_}"
                            draggable="true"
                            class="virtual-element"
                            style="left: ${screenPos.x}px; top: ${screenPos.y}px; width: ${dimensions.x}px; height: ${dimensions.y}px">
                            <preview-matrix-element .data="${_}"></preview-matrix-element>
                        </div>
                    `;
                })}
            </div>
            <button @click="${this.onNewElement}">Create element</button>
            <div id="elements-list">
                ${this.elementDatas.map(
                    (_) => html`
                        <div class="element-container">
                            <button @click="${() => this.deleteElement(_)}">Delete Element</button>
                            <matrix-element
                                @image-changed="${this.onAnyImageChanged}"
                                .data="${_}"></matrix-element>
                        </div>
                    `
                )}
            </div>
        `;
    }
}
