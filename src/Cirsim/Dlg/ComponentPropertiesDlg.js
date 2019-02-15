import {Dialog} from './Dialog';
import {Unique} from '../Utility/Unique';
import {Tools} from '../DOM/Tools';

/**
 * Component properties dialog box
 * @constructor
 */
export const ComponentPropertiesDlg = function(component, main) {
    Dialog.call(this, 'component');

    this.resize = 'both';

    // A unique ID for the component name input control
    let nameId = null;

    let extraHTML = '';
    let extraCreate = function() {};
    let extraValidate = function() {return null;};
    let extraTake = function() {return null;};

    this.open = () => {
        // Create the dialog box form
        let description = '';
        if('help' in component.constructor) {
            description += '<a class="helper">help</a>';
        }

        if('description' in component.constructor) {
            description += '<div class="description">';
            description += component.constructor.description + '</div>';
        }


        // Does this component have a naming?
        let name = '';
        if(component.naming !== null) {
            name = component.naming;
        } else {
            if(component.prefix !== null) {
                // Does not have a name. Create one
                for(let i=1; ; i++) {
                    name = component.prefix + i;
                    let existing = component.circuit.getComponentByNaming(name);
                    if(existing === null) {
                        break;
                    }
                }
            }
        }


        let dlg = '';

        if(component.prefix !== null) {
            nameId = Unique.uniqueName();
            dlg += '<div class="control1 center gap"><label for="' + nameId + '">Name: </label>' +
                '<input type="text" name="' + nameId + '" id="' + nameId + '" value="' + name + '" spellcheck="false" class="compname text ui-widget-content ui-corner-all">' +
                '</div>';
        }

        dlg += extraHTML + description;

        this.contents(dlg, "Cirsim Component Properties");

        Dialog.prototype.open.call(this);

        extraCreate();

        if(nameId !== null) {
	        document.getElementById(nameId).select();
        }

        const helper = this.element.querySelector('a.helper');
        if(helper !== null) {
        	helper.addEventListener('click', (event) => {
		        event.preventDefault();
		        let helper = component.constructor.help;
		        main.menu.helpMenu.componentHelp(helper);
	        });
        }
    }

    this.ok = () => {
        // Get name.
        // Trim spaces on either end
	    let name = '';

        if(component.prefix !== null) {
        	const nameElement = document.getElementById(nameId);
        	name = nameElement.value.replace(/^\s+|\s+$/gm,'');

            if(name.length !== 0) {
                // If name is not empty, we ensure it is unique
                var existing = component.circuit.getComponentByNaming(name);
                if(existing !== null && existing !== component) {
                	Tools.addClass(nameElement, 'cirsim-error');
                    this.error("Name already exists");
                    return;
                }
            }

	        Tools.removeClass(nameElement, 'cirsim-error');
	        name = this.sanitize(name);
        }

        var extraRet = extraValidate();
        if(extraRet !== null) {
            this.error(extraRet);
            return;
        }

        main.backup();
        if(component.prefix !== null) {
            component.naming = name.length > 0 ? name : null;
        }

        extraTake();

        this.close();
        main.currentView().draw();

    }

    //
    // Member functions
    //

    this.extra = function(_extraHTML, _extraValidate, _extraTake) {
        extraHTML = _extraHTML;
        extraValidate = _extraValidate;
        extraTake = _extraTake;
    };

    this.extraCreate = function(_extraCreate) {
        extraCreate = _extraCreate;
    }
};

ComponentPropertiesDlg.prototype = Object.create(Dialog.prototype);
ComponentPropertiesDlg.prototype.constructor = ComponentPropertiesDlg;
