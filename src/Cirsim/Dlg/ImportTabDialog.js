import {Dialog} from './Dialog';
import {JsonAPI} from '../Utility/JsonAPI';
import {Ajax} from '../Utility/Ajax';

/**
 * Dialog box for importing tabs from an existing file.
 * @constructor
 */
export const ImportTabDialog = function(importer, options, toast) {
    Dialog.call(this);

    this.buttonOk = null;
    
    this.open = function(callback) {
        // Dialog box contents
        const body = '<p>Loading tab from server...</p>';
        this.contents(body, "Loading tab...");

        Dialog.prototype.open.call(this);

        const open = options.getAPI('import');
        const extra = {};
        Object.assign(extra, open.extra);
        Object.assign(extra, importer.extra);

        if(open !== null) {
	        Ajax.do({
		        url: open.url,
		        data: Object.assign({cmd: "open", name: importer.name}, extra),
		        method: "GET",
		        dataType: 'json',
		        success: (data) => {
			        const json = new JsonAPI(data);
			        if (!toast.jsonErrors(json)) {
				        const load = data.data[0].attributes.data;
				        callback(load);
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
}

ImportTabDialog.prototype = Object.create(Dialog.prototype);
ImportTabDialog.prototype.constructor = ImportTabDialog;
