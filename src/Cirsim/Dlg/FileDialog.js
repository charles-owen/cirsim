import {Dialog} from './Dialog';
import {JsonAPI} from '../Api/JsonAPI';
import {FileExistsDialog} from './FileExistsDialog';

/**
 * Base object for both FileSaveDialog and FileSaveDialog
 */
var FileDialog = function(open, options, toast) {
    Dialog.call(this);

    var that = this;

    var files = options.getAPI('files');

    // List of existing filenames. Null until set
    // by the directory listing.
    var existing = null;

    var callback = null;

    // Filename
    this.filename = '';


    // Ids for the filename and list
    var nameId = this.uniqueId();
    var listId = this.uniqueId();
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

        $(listSel).click(function(event) {
            $(nameSel).val($(listSel).val());
        });
        $(nameSel).select();

        queryFiles(listSel, nameSel);

        if(!open) {
            this.enable('ok', false);
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
        var name = $('#' + nameId);

        // Trim
        this.filename = this.sanitize(name.val())
            .replace(/^\s+|\s+$/gm,'');

        if(this.filename.length == 0) {
            name.focus();
            this.error("Must supply a file name");
            return;
        }

        // Test for valid names
        var letters = /^[0-9a-zA-Z\.\-\+ ]+$/;
        if(!letters.test(this.filename)) {
            name.focus();
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
     * @param listId ID for the select list
     * @param id ID for the file name control
     */
    function queryFiles() {
        $.ajax({
            url: files.url,
            data: Object.assign({cmd: "files"}, files.extra),
            method: "GET",
            dataType: 'json',
            success: function(data) {
                var json = new JsonAPI(data);
                if(toast.jsonErrors(json)) {
                    that.close();
                    return;
                }

                var files = json.fetch('file');
                $(listSel).parent().find('.notice').remove();

                existing = [];
                var html = '';
                files.forEach((item) => {
                    html += '<option value="' + item.attributes.name + '">' +
                        item.attributes.name + '</option>';

                    existing.push(item.attributes.name);
                });

                $(listSel).append(html);

                that.enable('ok', true);
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

export default FileDialog;

