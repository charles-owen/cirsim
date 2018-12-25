
import Dialog from './Dialog.js';

/**
 * Dialog box for adding a named tab.
 * @property tabs Tabs object
 * @constructor
 */
export const TabAddDlg = function(tabs) {
    Dialog.call(this);

    const MaxName = 8;
    let id;

    this.open = function() {

        // Dialog box contents
        id = this.uniqueId();

        var dlg = `<div class="control1 center"><label for="${id}">New tab name: </label>
<input class="tabname" type="text" id="${id}" spellcheck="false"></div>
<p>Enter the name for the new tab.</p>`;

        this.contents(dlg, "New Tab");
        Dialog.prototype.open.call(this);
        document.getElementById(id).select();
    }

    this.ok = function() {
        var name = document.getElementById(id).value;
        name = name.replace(/^\s+|\s+$/gm,'');
        name = this.sanitize(name);
        if(name.length < 1) {
            this.error('Must provide a tab name');
	        document.getElementById(id).select();
            return;
        }

        if(name.length > MaxName) {
            this.error('Name must be no longer than ' + MaxName + ' characters');
	        document.getElementById(id).select();
            return;
        }

        //
        // Ensure name does not already exist
        //
        let val = tabs.validateName(name);
        if(val !== null) {
            this.error(val);
	        document.getElementById(id).select();
            return;
        }

        tabs.add(name);
        this.close();
    }

}

TabAddDlg.prototype = Object.create(Dialog.prototype);
TabAddDlg.prototype.constructor = TabAddDlg;
