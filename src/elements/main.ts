import { LitElement, css, html } from 'lit';
import { customElement } from 'lit/decorators.js';

@customElement('component-main')
export class main extends LitElement {
    static styles = css`
        :host {
            display: block;
            width: 100%;
            height: 100%;
        }
    `;

    render() {
        return html`
            <div id="virtual-matrix">
                // TODO elements can be dragged into position here
            </div>
            <div id="elements">
                // TODO create elements, draw them and assign metadata
            </div>
            // TODO export ZIP button
            <br>
            // TODO upload button
        `;
    }
}
