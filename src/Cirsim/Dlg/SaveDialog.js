import {Dialog} from './Dialog';
import {JsonAPI} from '../Utility/JsonAPI';
import {Ajax} from '../Utility/Ajax';

/**
 * File save dialog box for when the filename to save as is
 * already known.
 * @param data Data to save
 * @param type Type (usually application/json)
 * @param filename Name to save as
 * @param options The Options object
 * @param toast The Toast object
 * @constructor
 */
export const SaveDialog = function(data, type, filename, options, toast) {
    Dialog.call(this);

    var that = this;

    this.buttonOk = null;
    
    this.open = function() {
        // Dialog box contents
        var dlg = '<p>Saving to server...</p>';

        this.contents(dlg, "Saving...");

        Dialog.prototype.open.call(this);

        var save = options.getAPI('save');

        Ajax.do({
            url: save.url,
            data: Object.assign({cmd: "save", name: filename, data: data}, save.extra),
            method: "POST",
            dataType: 'json',
            success: (data) => {
                var json = new JsonAPI(data);
                if(!toast.jsonErrors(json)) {
                    that.close();
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
