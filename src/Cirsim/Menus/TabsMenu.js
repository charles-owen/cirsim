import {TabAddDlg} from '../Dlg/TabAddDlg';
import {MessageDialog} from '../Dlg/MessageDialog';
import {TabPropertiesDlg} from '../Dlg/TabPropertiesDlg';

/**
 * The Tabs menu
 * @param menu
 * @param main
 * @constructor
 */
export const TabsMenu = function(menu, main) {

    this.html = function() {
        return `<li><a>Tabs</a>
<ul class="tabs-menu">
<li><a class="tabs-properties"><span class="icons-cl icons-cl-wrench"></span>Properties...</a></li>
<li><a class="tabs-add"><span class="icons-cl icons-cl-play"></span>Add...</a></li>
<li><a class="tabs-delete"><span class="icons-cl icons-cl-close"></span>Delete...</a></li>
</ul>
</li>`;
    }

    const del = () => {
        let current = main.tabs.currentCircuit();
        if(current === null) {
            return;
        }

        let dlg = new MessageDialog("Are you sure?", '<p class="large">Are you sure you want to ' +
         'delete the tab <em>' + current.getName() + '</em>?</p>', 200);
        dlg.open(() => {
            main.tabs.delActive();
        }, true);
    }


    this.activate = function() {
	    menu.click('.tabs-add', (event) => {
		    let dlg = new TabAddDlg(main.tabs);
		    dlg.open();
	    });

	    menu.click('.tabs-delete', (event) => {
            del();
	    });

	    menu.click('.tabs-properties', (event) => {
		    let dlg = new TabPropertiesDlg(main.tabs);
		    dlg.open();
	    });
    }

    /**
     * Called when menus are opening.
     * Set the state of the menu so it will be valid when shown.
     */
    this.opening = function() {
        menu.enable('.tabs-delete', main.tabs.active > 0);
    }

}
