import {FileDialog} from './FileDialog';
import {JsonAPI} from '../Utility/JsonAPI';
import {Ajax} from '../Utility/Ajax';


/**
 * File system save dialog box
 * @param options
 * @param toast
 * @constructor
 */
export const FileOpenDialog = function(options, toast) {
    FileDialog.call(this, true, options, toast);
    
    const open = options.getAPI('open');

    /**
     * Read the file.
     */
    this.read = function(name, callback) {
        Ajax.do({
            url: open.url,
            data: Object.assign({cmd: "open", name: name}, open.extra),
            method: "GET",
            dataType: 'json',
            success: (data) => {
                const json = new JsonAPI(data);
                if(!toast.jsonErrors(json)) {
                    var file = data.data[0].attributes.data;
                    callback(name, file);
                    this.close();
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
