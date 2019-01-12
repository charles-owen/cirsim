import {FileDialog} from './FileDialog';
import {JsonAPI} from '../Utility/JsonAPI';
import {Ajax} from '../Utility/Ajax';

/**
 * File system save dialog box
 * @param data Data to save
 * @param type Data mime type
 * @param options The Cirsim options object
 * @param toast The Toast object
 * @constructor
 */
export const FileSaveDialog = function(data, type, options, toast) {
    FileDialog.call(this, false, options, toast);

    const save = options.getAPI('save');

    /**
     * Write the file. This is called only if we
     * know for sure the file does not exist.
     */
    this.write = function(name, callback) {
        Ajax.do({
            url: save.url,
            data: Object.assign({cmd: "save", name: name, data: data}, save.extra),
            method: "POST",
            dataType: 'json',
            success: (data) => {
                var json = new JsonAPI(data);
                if(!toast.jsonErrors(json)) {
                    this.close();
                    callback(name);
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
