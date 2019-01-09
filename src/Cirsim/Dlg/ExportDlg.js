import {Dialog} from './Dialog';
import '../Vendor/Blob.js';
import Unique from '../Utility/Unique.js';
import saveAs from '../Vendor/FileSaver.js';

/**
 * File export dialog box
 * @param model Model object for the currently active model
 * @constructor
 */
export const ExportDlg = function(model) {
    Dialog.call(this);

    // A unique ID for the input control
    const id = this.uniqueId();

    this.open = function() {
        // Create the dialog box form
        var dlg = `<div class="control"><label for="${id}">Name</label>
<input type="text" id="${id}" value="circuit" class="text ui-widget-content ui-corner-all">
</div>
<p>Enter a name for the exported .cirsim file.</p>`;

        this.buttonOk = 'Export';
        this.contents(dlg, "Cirsim Export");
        Dialog.prototype.open.call(this);
        document.getElementById(id).select();
    }


    /**
     * Export the circuits as a file.
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

            if(!name.endsWith('.cirsim')) {
                name += ".cirsim";
            }

            // See: https://eligrey.com/blog/saving-generated-files-on-the-client-side/
            let json = model.toJSON();
            saveAs(new Blob([json], {type: "application/json"}), name);
        }
    }

};

ExportDlg.prototype = Object.create(Dialog.prototype);
ExportDlg.prototype.constructor = ExportDlg;
