
import {Dialog} from './Dialog';

/**
 * File system file exists dialog box
 * @param filename The filename that exists
 * @constructor
 */
export const FileExistsDialog = function(filename) {
    Dialog.call(this);

	/**
	 * Open the dialog box
	 * @param done Callback that is called with the true/false depending on ok/cancel button press
	 */
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

	/**
	 * Call back on the press of the Cancel button
	 */
	this.cancel = function() {
        this.done(false);
    }
}

FileExistsDialog.prototype = Object.create(Dialog.prototype);
FileExistsDialog.prototype.constructor = FileExistsDialog;
