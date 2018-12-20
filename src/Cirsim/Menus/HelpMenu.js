import {AboutDialog} from '../Dlg/AboutDialog';
import {HelpDialog} from '../Dlg/HelpDialog';
import {Tools} from "../DOM/Tools";

/**
 * The help menu
 * @param menu
 * @param main
 * @constructor
 */
export const HelpMenu = function(menu, main) {

    this.html = function() {
        return '<li><a>Help</a>' +
            '<ul class="help-menu">' +
            '<li><a class="help-help">Help</a></li>' +
            '<li><a class="help-docked-help">Docked Help<img></a></li>' +
            '<li><a class="help-about">About...</a></li>' +
            '</ul>' +
            '</li>';
    }

    this.componentHelp = function(helper) {
        helper = 'cirsim/help/' + helper + '.html';
        if(!main.isHelpDocked()) {
            var dlg = new HelpDialog(main);
            dlg.open(helper);
        } else {
            main.help.url(helper);
        }
    }


    this.activate = function() {
	    menu.click('.help-about', (event) => {
		    var dlg = new AboutDialog(main);
		    dlg.open();
	    });

	    menu.click('.help-help', (event) => {
		    if(!main.isHelpDocked()) {
			    var dlg = new HelpDialog(main);
			    dlg.open('');
		    } else {
			    main.help.home();
		    }
	    });

	    menu.click('.help-docked-help', (event) => {
		    main.dockedHelp(!main.isHelpDocked());
	    });
    }

    this.opening = function() {
        if(main.isHelpDocked()) {
	        Tools.addClass(menu.find('.help-docked-help img'), 'check');
        } else {
	        Tools.removeClass(menu.find('.help-docked-help img'), 'check');
        }
    }
}
