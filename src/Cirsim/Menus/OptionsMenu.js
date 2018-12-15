import {Tools} from '../DOM/Tools';

/**
 * The Options menu
 * @param menu
 * @param main
 * @constructor
 */
export const OptionsMenu = function(menu, main) {

    this.html = function() {
        return `<li><a>Options</a>
<ul class="option-menu">
<li><a class="option-showoutputstates">Show Output States<img></a></li>
</ul></li>`;
    }

    /**
     * Activate the menu, installing all handlers
     */
    this.activate = function() {
	    menu.click('.option-showoutputstates', (event) => {
		    main.model.circuits.showOutputStates = !main.model.circuits.showOutputStates;
		    main.currentView().draw();
	    });
    }

    /**
     * Called when menus are opening.
     * Set the state of the menu so it will be valid when shown.
     */
    this.opening = function() {
        if(main.model.circuits.showOutputStates) {
            Tools.addClass(menu.find('.option-showoutputstates img'), 'check');
        } else {
	        Tools.removeClass(menu.find('.option-showoutputstates img'), 'check');
        }
    }
}
