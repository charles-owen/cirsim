/**
 * @file
 * Dialog box for adding a named tab.
 */

import Dialog from './Dialog.js';

var TabAddDlg = function(tabs) {
    Dialog.call(this);

    const MaxName = 8;
    var sel;

    this.open = function() {

        // Dialog box contents
        var id = this.uniqueId();
        sel = '#' + id;

        var dlg = `<div class="control1 center"><label for="${id}">New tab name: </label>
<input class="tabname" type="text" id="${id}" spellcheck="false"></div>
<p>Enter the name for the new tab.</p>`;

        this.contents(dlg, "New Tab");
        Dialog.prototype.open.call(this);
        $(sel).focus();
    }

    this.ok = function() {
        var name = $(sel).val();
        name = name.replace(/^\s+|\s+$/gm,'');
        name = this.sanitize(name);
        if(name.length < 1) {
            this.error('Must provide a tab name');
            $(sel).select();
            return;
        }

        if(name.length > MaxName) {
            this.error('Name must be no longer than ' + MaxName + ' characters');
            $(sel).select();
            return;
        }

        //
        // Ensure name does not already exist
        //
        let val = tabs.validateName(name);
        if(val !== null) {
            this.error(val);
            $(sel).select();
            return;
        }

        tabs.add(name);
        this.close();
    }

}

TabAddDlg.prototype = Object.create(Dialog.prototype);
TabAddDlg.prototype.constructor = TabAddDlg;

export default TabAddDlg;
