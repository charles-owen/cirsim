import {Dialog} from './Dialog';
import {HelpPresenter} from '../Graphics/HelpPresenter';

/**
 * The standard Help dialog box.
 * @constructor
 */
export const HelpDialog = function(main) {
    Dialog.call(this, "help");

    this.open = function(url) {
        this.buttonCancel = null;
        this.resize = 'both';

        // Dialog box contents
        const presenter = new HelpPresenter(main, this);
	    const dlg = presenter.html();

        this.contents(dlg, "Cirsim Help");

        this.titleBarButtons = [
            {
                type: 'custom',
                contents: '<span class="icons-cl icons-cl-arrowthick-1-w">',
                click: () => {
                    presenter.back();
                }
            },
            {
                type: 'custom',
                contents: '<span class="icons-cl icons-cl-home">',
                click: () =>
                {
                    presenter.home();
                }
            },
            {type: 'close'}
        ];

        Dialog.prototype.open.call(this);
        presenter.present(url);
    }
}

HelpDialog.prototype = Object.create(Dialog.prototype);
HelpDialog.prototype.constructor = HelpDialog;

