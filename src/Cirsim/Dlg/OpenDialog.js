/**
 * @file
 * File open dialog box for when the filename to load is
 * already known.
 */

import Dialog from './Dialog.js';
import JsonAPI from '../Api/JsonAPI.js';

var OpenDialog = function(name, options, toast) {
    Dialog.call(this);

    var that = this;

    this.buttonOk = null;
    
    this.open = function(callback) {
        // Dialog box contents
        var dlg = '<p>Loading from server...</p>';

        this.contents(dlg, "Loading...");

        Dialog.prototype.open.call(this);

        var open = options.getAPI('open');

        $.ajax({
            url: open.url,
            data: Object.assign({cmd: "open", name: name}, open.extra),
            method: "GET",
            dataType: 'json',
            success: (data) => {
                var json = new JsonAPI(data);
                if(!toast.jsonErrors(json)) {
                    var json = data.data[0].attributes.data;
                    callback(name, json);
                }

                this.close();
            },
            error: (xhr, status, error) => {
                console.log(xhr.responseText);
                toast.message('Unable to communicate with server: ' + error);
                this.close();
            }
        });

    }
}

OpenDialog.prototype = Object.create(Dialog.prototype);
OpenDialog.prototype.constructor = OpenDialog;

export default OpenDialog;
