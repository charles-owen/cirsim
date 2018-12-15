/**
 * @file
 * File system save dialog box
 */

import FileDialog from './FileDialog.js';
import JsonAPI from '../Api/JsonAPI.js';

var FileOpenDialog = function(options, toast) {
    FileDialog.call(this, true, options, toast);
    
    var open = options.getAPI('open');

    /**
     * Read the file.
     */
    this.read = function(name, callback) {
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
                    this.close();
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

FileOpenDialog.prototype = Object.create(FileDialog.prototype);
FileOpenDialog.prototype.constructor = FileOpenDialog;

export default FileOpenDialog;

