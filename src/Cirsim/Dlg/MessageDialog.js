import {Dialog} from './Dialog';


/**
 * The standard Message dialog box.
 * @param title Title text
 * @param body Body HTML
 * @param height Height of the box
 * @constructor
 */
export const MessageDialog = function(title, body, height) {
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
