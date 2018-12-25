import {Dialog} from './Dialog';

/**
 * The standard About dialog box.
 * @constructor
 */
export const AboutDialog = function(main) {
    Dialog.call(this, "about");


    this.open = function() {
        this.buttonCancel = null;

        // Dialog box contents
        let content = `<figure><img src="img/logo-icon.png" alt="Cirsim Logo"></figure>
<h1>Cirsim Circuit Simulator</h1>
<p>Version: ${main.cirsim.version}</p>
<p>Written by: Charles B. Owen</p>`;

        if(main.cirsim.root.indexOf('cirsim-dev') >= 0) {
            content += `<p class="gap">Running from the development site.</p>`;
        }

        this.contents(content, "About Cirsim");
        Dialog.prototype.open.call(this);
    }
}

AboutDialog.prototype = Object.create(Dialog.prototype);
AboutDialog.prototype.constructor = AboutDialog;

