/**
 * @file
 * File save dialog box for when the filename to save as is
 * already known.
 */

import Dialog from './Dialog.js';
import JsonAPI from '../Api/JsonAPI.js';

var SaveDialog = function(data, type, filename, options, toast) {
    Dialog.call(this);

    var that = this;

    this.buttonOk = null;
    
    this.open = function() {
        // Dialog box contents
        var dlg = '<p>Saving to server...</p>';

        this.contents(dlg, "Saving...");

        Dialog.prototype.open.call(this);

        var save = options.getAPI('save');

        $.ajax({
            url: save.url,
            data: Object.assign({cmd: "save", name: filename, data: data}, save.extra),
            method: "POST",
            dataType: 'json',
            success: (data) => {
                console.log(data);
                var json = new JsonAPI(data);
                if(!toast.jsonErrors(json)) {
                    that.close();
                    return;
                }
            },
            error: (xhr, status, error) => {
                console.log(xhr.responseText);
                toast.message('Unable to communicate with server: ' + error);
                this.close();
            }
        });
    }
}

SaveDialog.prototype = Object.create(Dialog.prototype);
SaveDialog.prototype.constructor = SaveDialog;

export default SaveDialog;
