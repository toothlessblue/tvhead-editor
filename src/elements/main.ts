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

        #virtual-matrix-container {
            padding: 30px;
        }

        #virtual-matrix {
            background-color: red;
            height: 100%;
            width: 100%;
        }
    `;

    render() {
        return html`
            <div id="virtual-matrix-container">
                <virtual-matrix></virtual-matrix>
            </div>
        `;
    }
}
