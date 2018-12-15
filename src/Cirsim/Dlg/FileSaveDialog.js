/**
 * @file
 * File system save dialog box
 */

import FileDialog from './FileDialog.js';
import JsonAPI from '../Api/JsonAPI.js';

var FileSaveDialog = function(data, type, options, toast) {
    FileDialog.call(this, false, options, toast);

    var save = options.getAPI('save');

    /**
     * Write the file. This is called only if we
     * know for sure the file does not exist.
     */
    this.write = function(name, callback) {
        $.ajax({
            url: save.url,
            data: Object.assign({cmd: "save", name: name, data: data}, save.extra),
            method: "POST",
            dataType: 'json',
            success: (data) => {
                var json = new JsonAPI(data);
                if(!toast.jsonErrors(json)) {
                    this.close();
                    callback(name);
                    return;
                }
            },
            error: (xhr, status, error) => {
                console.log(xhr.responseText);
                toast.message('Unable to communicate with server: ' + error);
                this.close();
            }
        });
    };

};

FileSaveDialog.prototype = Object.create(FileDialog.prototype);
FileSaveDialog.prototype.constructor = FileSaveDialog;

export default FileSaveDialog;

