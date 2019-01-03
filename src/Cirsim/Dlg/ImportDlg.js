/**
 * File import dialog box
 */

import Dialog from './Dialog.js';
import '../Vendor/Blob.js';
import Unique from '../Utility/Unique.js';
import saveAs from '../Vendor/FileSaver.js';

export const ImportDlg = function(main, model) {
    Dialog.call(this);

    var that = this;

    // A unique ID for the input control
    var id = Unique.uniqueName();

    // Create the dialog box
    var dlg = '<div class="control gap"><input class="file" type="file" id="' + id + '" />' +
        '<br><span id="import-error" class="error"></span></div>' +
        '<p>Choose a file to import into Cirsim.</p>';

    this.ok = function() {
        const files = document.getElementById(id).files;
        if(files.length < 1) {
            return;
        }

        var file = files[0];

        var reader = new FileReader();

        // Closure to capture the file information.
        reader.onload = function(e) {
            model.fmJSON(e.target.result);

            that.close();
            main.reload();
        };

        reader.onerror = function(e) {
            that.error("Error reading circuits file");
        };

        reader.onabort = function(e) {
            that.error("Circuits file read aborted");
        };

        // Read in the file
        reader.readAsText(file);
    }

    this.buttonOk = 'Import';
    this.contents(dlg, "Cirsim Import");
};

ImportDlg.prototype = Object.create(Dialog.prototype);
ImportDlg.prototype.constructor = ImportDlg;
