import {Unique} from '../Utility/Unique';
import DOMPurify from 'dompurify';
import DialogCL from 'dialog-cl';
import {Tools} from '../DOM/Tools';

/**
 * Base object for general-purpose dialog boxes where the
 * functionality is assumed to be implemented in a derived object.
 * @param classes Classes to add to the dialog box
 * @constructor
 */
export const Dialog = function(classes) {
    this.classes = classes !== undefined ? 'cirsim ' + classes : 'cirsim';
    this.buttonOk = "Ok";
    this.buttonCancel = "Cancel";
    this.resize = 'none;'
    this.titleBarButtons = null;
}

/**
 * Set the dialog box contents
 * @param html HTML for the body
 * @param title Title for the title bar
 */
Dialog.prototype.contents = function( html, title) {
    this.html = html;
    this.title = title;
}

/**
 * Open the dialog box
 */
Dialog.prototype.open = function() {
    let form = document.createElement('form');
    let div = Tools.createClassedDiv('dialog-content');
    form.appendChild(div);

    let dlg = `${this.html}<p class="error"></p>
<input type="submit" tabindex="-1" style="position:absolute; top:-1000px">`;
    div.innerHTML = dlg;

    this.element = div;

    let buttons = [];
    if(this.buttonOk !== null) {
        buttons.push({
            contents: 'Ok',
            click: (dialog) => {
                this.ok();
            },
            focus: true
        });
    }

    if(this.buttonCancel !== null) {
        buttons.push({
            contents: 'Cancel',
            click: (dialog) => {
                dialog.close();
            }
        });
    }

    let dialog = new DialogCL({
        'addClass': this.classes,
        title: this.title,
        content: form,
        buttons: buttons,
        resize: this.resize,
        titleBarButtons: this.titleBarButtons
    });

    this.onOpen();

    this.close = function() {
        dialog.close();
    }

    form.addEventListener('submit', (event) => {
    	event.preventDefault();
    	this.ok();
    });
}

Dialog.prototype.ok = function() {
    this.close();
}


Dialog.prototype.error = function(msg) {
    if(msg !== undefined) {
        this.element.querySelector('.error').innerHTML = msg;
    }
}

Dialog.prototype.cancel = function() {}

Dialog.prototype.onOpen = function() {}

Dialog.prototype.enable = function(cls, enable) {
    if(enable) {
        this.element.parentNode.querySelector('.' + cls).removeAttribute('disabled');

    } else {
        this.element.parentNode.querySelector('.' + cls).setAttribute('disabled', 'disabled');
    }
}

/**
 * Sanitize text from user input to prevent XSS attacks.
 * @param text Text to sanitize
 * @returns Sanitized version
 */
Dialog.prototype.sanitize = function(text) {
    return DOMPurify.sanitize(text);
}

/**
 * Get a unique ID to use in dialog boxes
 */
Dialog.prototype.uniqueId = function() {
    return Unique.uniqueName();
}

export default Dialog;
