
import {PaletteItem} from './PaletteItem';
import {Tools} from './DOM/Tools';
import {Util} from './Utility/Util';
import {CircuitRef} from './Component/CircuitRef';

/**
 * The pallet div where we select parts to add to the circuit
 * @param main Main object
 * @param work div.work
 * @constructor
 */
export const Palette = function(main, work) {
    this.main = main;
    this.cirsim = main.cirsim;
    this.palette = [];

    let div = null;

    let components = [];

    const initialize = () => {
        // Create and install the div
	    div = Tools.createClassedDiv('palette');
	    work.appendChild(div);

	    // We allow either an array of strings in components
	    // or a string naming a specific named palette
	    if(typeof main.options.components === "string") {
		    components = main.components.getPalette(main.options.components);
		    if(components === null) {
			    throw new Error('options.components invalid name ' + main.options.components);
		    }
	    } else {
		    main.options.components.forEach((component) => {
			    // This can be a component name or a palette name
			    let palette = main.components.getPalette(component);
			    if(palette !== null) {
				    components = components.concat(palette);
			    } else {
			    	if(component.toLowerCase() === 'not') {
			    		component = 'Inverter';
				    }
				    
				    components.push(component);
			    }
		    });
	    }

	    //
	    // Load the circuit components into the palette
	    //
	    main.components.components.forEach(function(obj) {
		    addToPalette(obj);
	    });
    }

    const addToPalette = (obj) => {
        // Only some components get added to the pallet...
        // A component is added if it is in the current
        // list of components or main.options.always
        let name = obj.type;
        if(!Util.inArray(name, components) &&
                !Util.inArray(name, main.options.always)) {
            return;
        }

        this.palette.push(obj);
        const pi = new PaletteItem(this, obj);
        div.appendChild(pi.element);
    }

	/**
	 * Refresh the palette after any tab changes.
	 * Ensures any CircuitRef palette items are correct
	 */
	this.refresh = function() {
        // Remove any palette items that are of class "circuitref"
        for(const c of div.querySelectorAll('.circuitref')) {
            div.removeChild(c);
        }

        // Add any necessary circuitref palette items
        for(let i = main.currentView().tabnum+1;  i < main.model.circuits.circuits.length;  i++) {
            const circuit = main.model.circuits.circuits[i];

	        const pi = new PaletteItem(this, CircuitRef, circuit);
	        Tools.addClass(pi.element, 'circuitref');
	        div.appendChild(pi.element);
        }
    }

    initialize();
};

