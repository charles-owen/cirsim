/**
 * @file
 * File system file exists dialog box
 */

import Dialog from './Dialog.js';

var FileExistsDialog = function(filename) {
    Dialog.call(this);


    this.open = function(done) {
        this.done = done;

        // Dialog box contents
        var dlg = '<p>File ' + filename + ' exists. Are you sure you want to overwrite?';

        this.contents(dlg, "Overwrite?");
        Dialog.prototype.open.call(this);
    }

    /**
     * Call back on a press of the OK button.
     * Must call either close or error
     */
    this.ok = function() {
        this.close();
        this.done(true);
    }

    this.cancel = function() {
        //this.close();
        this.done(false);
    }
}

FileExistsDialog.prototype = Object.create(Dialog.prototype);
FileExistsDialog.prototype.constructor = FileExistsDialog;

export default FileExistsDialog;
