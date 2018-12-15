/**
 * File export dialog box
 */

import Dialog from './Dialog.js';
import '../Vendor/Blob.js';
import Unique from '../Utility/Unique.js';
import saveAs from '../Vendor/FileSaver.js';

var ExportDlg = function(model) {
    Dialog.call(this);

    // A unique ID for the input control
    var id = this.uniqueId();
    var sel = '#' + id;

    this.open = function() {
        // Create the dialog box form
        var dlg = `<div class="control"><label for="${id}">Name</label>
<input type="text" id="${id}" value="circuit" class="text ui-widget-content ui-corner-all">
</div>
<p>Enter a name for the exported .cirsim file.</p>`;

        this.buttonOk = 'Export';
        this.contents(dlg, "Cirsim Export");
        Dialog.prototype.open.call(this);
        $(sel).select();
    }


    /**
     * Export the circuits as a file.
     * Call by this.export below when Export pressed on the dialog box.
     */
    this.ok = function() {
        // Get name.
        // Trim spaces on either end
        // Remove extension
        let jName = $(sel);
        let name = this.sanitize(jName.val())
            .replace(/^\s+|\s+$/gm,'')
            .replace(/\.[^/.]+$/, "");

        if(name.length === 0) {
            // Invalid name
            jName.addClass("ui-state-error");
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

export default ExportDlg;
