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
<li><a class="tabs-left"><span class="icons-cl icons-cl-arrowthick-1-w"></span>Move Left</a></li>
<li><a class="tabs-right"><span class="icons-cl icons-cl-arrowthick-1-e"></span>Move Right</a></li>
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
	    menu.click('.tabs-add', () => {
		    let dlg = new TabAddDlg(main.tabs);
		    dlg.open();
	    });

	    menu.click('.tabs-delete', () => {
            del();
	    });

	    menu.click('.tabs-properties', () => {
		    let dlg = new TabPropertiesDlg(main.tabs);
		    dlg.open();
	    });

	    menu.click('.tabs-left', () => {
		    const tabs = main.tabs;

		    if(main.model.circuits.moveLeft(tabs.active)) {
				tabs.sync();
		    }
	    });


	    menu.click('.tabs-right', () => {
		    const tabs = main.tabs;

		    if(main.model.circuits.moveRight(tabs.active)) {
			    tabs.sync();
		    }
	    });
    }

    /**
     * Called when menus are opening.
     * Set the state of the menu so it will be valid when shown.
     */
    this.opening = function() {
    	const tabs = main.tabs;
		const circuits = main.model.circuits;

	    menu.enable('.tabs-delete', circuits.canDelete(tabs.active));;
        menu.enable('.tabs-left', circuits.canMoveLeft(tabs.active));;
        menu.enable('.tabs-right', circuits.canMoveRight(tabs.active));;
    }

}
