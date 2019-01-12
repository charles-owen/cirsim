import {Dialog} from './Dialog';
import {JsonAPI} from '../Utility/JsonAPI';
import {FileExistsDialog} from './FileExistsDialog';
import {Ajax} from '../Utility/Ajax';

/**
 * Base object for both FileSaveDialog and FileSaveDialog
 */
export const FileDialog = function(open, options, toast) {
    Dialog.call(this);

    var that = this;

    const files = options.getAPI('files');

    // List of existing filenames. Null until set
    // by the directory listing.
    let existing = null;

    let callback = null;

    // Filename
    this.filename = '';


    // Ids for the filename and list
    const nameId = this.uniqueId();
    const listId = this.uniqueId();
    var nameSel = '#' + nameId;
    var listSel = '#' + listId;

    this.open = function(callback_) {
        callback = callback_;

        var label = open ? 'Available' : 'Existing';

        // Dialog box contents
        var dlg = '<div class="control"><label for="' + listId + '">' + label + '</label>' +
            '<select class="files" id="' + listId + '" name="' + listId + '" size="5">' +
            '</select><div class="notice">Querying Server...</div></div>' +
            '<div class="control"><label for="' + nameId + '">Name</label>' +
            '<input type="text" name="' + nameId + '" id="' + nameId + '" value="' + this.filename + '" spellcheck="false" class="text ui-widget-content ui-corner-all">' +
            '</div>';

        if(open) {
            this.contents(dlg, "File Open");
        } else {
            dlg += '<p>Enter a name to save your circuit on the server as.</p>';
            this.contents(dlg, "File Save");
        }

        Dialog.prototype.open.call(this);

        const listElement = document.getElementById(listId);
        const nameElement = document.getElementById(nameId);

        listElement.addEventListener('click', (event) => {
            nameElement.value = listElement.value;
        });

        nameElement.select();

        queryFiles(listSel, nameSel);

        if(!open) {
            this.buttonOk().setAttribute('disabled', 'true');
        }

    }

    /**
     * Call back on a press of the OK button.
     * Must call either close or error
     */
    this.ok = function() {
        //
        // Obtain and validate the name
        //
	    const listElement = document.getElementById(listId);
	    const nameElement = document.getElementById(nameId);

        // Trim
        this.filename = this.sanitize(nameElement.value)
            .replace(/^\s+|\s+$/gm,'');

        if(this.filename.length === 0) {
            nameElement.focus();
            this.error("Must supply a file name");
            return;
        }

        // Test for valid names
        var letters = /^[0-9a-zA-Z\.\-\+ ]+$/;
        if(!letters.test(this.filename)) {
	        nameElement.focus();
            this.error("Names can contain a-z, A-Z, 0-9, ., -, +, and space");
            return;
        }

        // Append .cirsim
        if(this.filename.length < 8 || this.filename.substr(this.filename.length-7, 7) !== '.cirsim') {
            this.filename += '.cirsim';
        }

        if(open) {
            this.read(this.filename, callback);
        } else {
            if(existing.indexOf(this.filename) >= 0) {
                var dlg = new FileExistsDialog(this.filename);
                dlg.open((save)=> {
                    if(save) {
                        this.write(this.filename, callback);
                    }
                })
            } else {
                this.write(this.filename, callback);
            }
        }
    }

    /**
     * Query the server for all existing files.
     */
    const queryFiles = () => {
        Ajax.do({
            url: files.url,
            data: Object.assign({cmd: "files"}, files.extra),
            method: "GET",
            dataType: 'json',
            success: (data) => {
                var json = new JsonAPI(data);
                if(toast.jsonErrors(json)) {
                    that.close();
                    return;
                }

                const files = json.getData('files');

	            const listElement = document.getElementById(listId);
	            const nameElement = document.getElementById(nameId);

	            const notice = listElement.parentNode.querySelector('.notice');
	            if(notice !== null) {
	                notice.parentNode.removeChild(notice);
                }

                existing = [];
                files.attributes.forEach((item) => {
                    const option = document.createElement('option');
                    option.value = item.name;
                    option.innerText = item.name;
                    listElement.appendChild(option);
                    existing.push(item.name);
                });

	            this.buttonOk().removeAttribute('disabled');
            },
            error: function(xhr, status, error) {
                console.log(xhr.responseText);
                toast.message('Unable to communicate with server: ' + error);
                that.close();
            }
        });
    }
}

FileDialog.prototype = Object.create(Dialog.prototype);
FileDialog.prototype.constructor = FileDialog;
