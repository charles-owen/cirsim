/**
 * @file
 * The standard Message dialog box.
 */

import Dialog from './Dialog.js';

var MessageDialog = function(title, body, height) {
    Dialog.call(this);


    /**
     * Open the dialog box.
     * @param ok Optional closure that will be called on OK
     * @param cancel Optional boolean - true indicates we include a cancel button
     */
    this.open = function(ok, cancel) {
        this.contents(body, title);

        if(cancel !== true) {
            this.buttonCancel = null;
        }

        this.ok = function() {
            if(ok !== undefined) {
                ok();
            }
            this.close();
        }

        Dialog.prototype.open.call(this);
    }


}

MessageDialog.prototype = Object.create(Dialog.prototype);
MessageDialog.prototype.constructor = MessageDialog;

export default MessageDialog;
