import {Dialog} from './Dialog';
import '../Vendor/Blob.js';
import saveAs from '../Vendor/FileSaver.js';

/**
 * File export dialog box
 * @param view View we are exporting
 * @constructor
 */
export const ExportPNGDlg = function(view) {
    Dialog.call(this);

    // A unique ID for the input control
    const id = this.uniqueId();

    this.open = function() {
        // Create the dialog box form
        var dlg = `<div class="control"><label for="${id}">Name</label>
<input type="text" id="${id}" value="circuit" class="text ui-widget-content ui-corner-all">
</div>
<p>Enter a name for the exported .png file.</p>`;

        this.buttonOk = 'Export';
        this.contents(dlg, "Cirsim Export PNG");
        Dialog.prototype.open.call(this);
        document.getElementById(id).select();
    }


    /**
     * Export the current view as a PNG file.
     * Call by this.export below when Export pressed on the dialog box.
     */
    this.ok = function() {
        // Get name.
        // Trim spaces on either end
        // Remove extension
        let name = this.sanitize(document.getElementById(id).value)
            .replace(/^\s+|\s+$/gm,'')
            .replace(/\.[^/.]+$/, "");

        if(name.length === 0) {
            // Invalid name
            this.error("You must supply a name");
        } else {
            this.close();

            if(!name.endsWith('.png')) {
                name += ".png";
            }

            // Create a temporary canvas to use
            const circuit = view.circuit;
            const canvas = document.createElement('canvas');
            const bounds = circuit.bounds();
            const wid = bounds.right - bounds.left + 2;
            const hit = bounds.bottom - bounds.top + 2;
            canvas.style.width = wid + 'px';
            canvas.style.height = hit + 'px';
            canvas.width = wid;
            canvas.height = hit;

            const ctx = canvas.getContext("2d");
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.translate(1-bounds.left, 1-bounds.top);

            circuit.draw(ctx, view);

            canvas.toBlob((blob) => {
                saveAs(blob, name);
            });
        }
    }

};

ExportPNGDlg.prototype = Object.create(Dialog.prototype);
ExportPNGDlg.prototype.constructor = ExportPNGDlg;
