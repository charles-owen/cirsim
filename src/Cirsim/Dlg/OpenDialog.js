import {Dialog} from './Dialog';
import {JsonAPI} from '../Utility/JsonAPI';
import {Ajax} from '../Utility/Ajax';

/**
 * File open dialog box for when the filename to load is
 * already known.
 * @constructor
 */
export const OpenDialog = function(name, options, toast) {
    Dialog.call(this);

    this.buttonOk = null;
    
    this.open = function(callback) {
        // Dialog box contents
        const body = '<p>Loading from server...</p>';

        this.contents(body, "Loading...");

        Dialog.prototype.open.call(this);

        const open = options.getAPI('open');
        if(open !== null) {
	        Ajax.do({
		        url: open.url,
		        data: Object.assign({cmd: "open", name: name}, open.extra),
		        method: "GET",
		        dataType: 'json',
		        success: (data) => {
			        const json = new JsonAPI(data);
			        if (!toast.jsonErrors(json)) {
				        const load = data.data[0].attributes.data;
				        callback(name, load);
			        }

			        this.close();
		        },
		        error: (xhr, status, error) => {
			        toast.message('Unable to communicate with server: ' + error);
			        this.close();
		        }
	        });
        }
    }
}

OpenDialog.prototype = Object.create(Dialog.prototype);
OpenDialog.prototype.constructor = OpenDialog;
