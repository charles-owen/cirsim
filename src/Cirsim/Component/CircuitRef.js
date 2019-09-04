import {Component} from '../Component';
import {CanvasHelper} from "../Graphics/CanvasHelper";

/**
 * Component: Circuit Reference

 * @constructor
 */
export const CircuitRef = function(paletteItem) {
    Component.call(this);

    this.height = 160;
    this.width = 80;

    // Name of the circuit this refers to (tab)
    this.circuitName = paletteItem !== undefined ? paletteItem.circuit : undefined;
    this.circuitRef = null;

    this.circuitIns = [];
    this.circuitOuts = [];
};


CircuitRef.prototype = Object.create(Component.prototype);
CircuitRef.prototype.constructor = CircuitRef;

CircuitRef.type = "CircuitRef";            ///< Name to use in files
CircuitRef.label = "REF";           ///< Label for the palette
CircuitRef.desc = "Circuit Component";       ///< Description for the palette
CircuitRef.img = "circuitref.png";         ///< Image to use for the palette
CircuitRef.order = 99;               ///< Order of presentation in the palette
CircuitRef.description = '<h2>Circuit Component</h2><p>A Circuit Component uses another' +
    'Cirsim circuit as a component in the current circuit</p>';


/**
 * Compute the gate result
 * @param state
 */
CircuitRef.prototype.compute = function(state) {
    this.getCircuitRef();

    for(let i=0; i<this.ins.length && i<this.circuitIns.length; i++) {
        this.circuitIns[i].set(state[i]);
    }

    for(let i=0; i<this.outs.length && i<this.circuitOuts.length; i++) {
        this.outs[i].set(this.circuitOuts[i].get());
    }
};

/**
 * Advance the animation for this component by delta seconds
 * @param delta Time to advance in seconds
 * @returns {boolean} true if animation needs to be redrawn
 */
CircuitRef.prototype.advance = function(delta) {
    if(this.circuitRef !== null) {
        this.circuitRef.advance(delta);
    }

    for(let i=0; i<this.outs.length && i < this.circuitOuts.length; i++) {
        this.outs[i].set(this.circuitOuts[i].get());
    }

    return true;
};



CircuitRef.prototype.getCircuitRef = function() {
    if (this.circuitRef !== null) {
	    this.circuitRef.circuits = this.circuit.circuits;
        return this.circuitRef;
    }

    const circuit = this.circuit.circuits.getCircuit(this.circuitName);
    if(circuit === null) {
    	return null;
    }

    this.circuitRef = this.circuit.circuits.getCircuit(this.circuitName).copy_clone();

    this.circuitRef.circuits = this.circuit.circuits;

    // Since a copy_clone will copy any ComponentRef objects in the
	// copy circuit, we need to clear it so a fresh copy will be
	// make instead.
	this.circuitRef.newTab();

    this.circuitRef.pending();

    this.ensureIO();
    return this.circuitRef;
}

/**
 * Called whenever a new tab is selected.
 *
 * This ensures the reference is rebuilt if a referenced tab
 * is modified or reloaded with a fresh circuit.
 */
CircuitRef.prototype.newTab = function() {
    this.circuitRef = null;
    this.circuitIns = [];
    this.circuitOuts = [];
};

/**
 * Update component after a circuit change.
 * This ensures all references are always correct.
 */
CircuitRef.prototype.update = function() {
	this.circuitRef = null;
	this.circuitIns = [];
	this.circuitOuts = [];

	this.ensureIO();
}


CircuitRef.prototype.ensureIO = function() {
    const circuit = this.circuitRef;

    if(circuit !== null) {

    	// Find all of the pins (in or out) for a circuit
	    const findAllPins = function(regPin, busPin) {
		    // Find all input pins in the tab circuit
		    const ins = circuit.getComponentsByType(regPin);
		    const insb = circuit.getComponentsByType(busPin);
		    for(const pin of insb) {
			    ins.push(pin);
		    }

		    // Sort the order so they are in the order they appear
		    ins.sort(function(a,b) {
			    if(a.y === b.y) {
				    return a.x - b.x;
			    }

			    return a.y - b.y;
		    });

		    return ins;
	    }

	    // Collect an array of pins by the component ID.
	    const collectById = function(pins) {
		    const pinsById = {};
		    for(let pin of pins) {
			    pinsById[pin.id] = pin;
		    }

		    return pinsById;
	    }

        //
        // Collect inputs
        //

        // Find all input pins in the tab circuit
	    const ins = findAllPins('InPin', 'InPinBus');

	    // Collect inputs by their ID
	    const insById = collectById(ins);

        //
        // If this is the first time this circuit
        // has been used, force all inputs to undefined
        // to ensure they get set from this circuit
        //
        if(this.circuitIns.length === 0) {
            for(let i=0; i<ins.length; i++) {
                ins[i].set(undefined);
            }
        }

        this.circuitIns = ins;

        //
	    // Collect outputs
	    //

        // Find output pins in the tab circuit
	    const outs = findAllPins('OutPin', 'OutPinBus');

        // Collect outputs by their ID
	    const outsById = collectById(outs);

        this.circuitOuts = outs;

        //
        // Determine if the settings are already correct.
        //
        if(ins.length === this.ins.length && outs.length === this.outs.length) {
            let bad = false;

            // Check the inputs
	        for(let i=0; i<ins.length; i++) {
	            if(this.ins[i].name !== ins[i].naming ||
                    this.ins[i].bus !== (ins[i].constructor.type === 'InPinBus')) {
	                bad = true;
	                break;
                }
	        }

	        // Check the outputs
	        for(let i=0; i<outs.length; i++) {
		        if(this.outs[i].name !== outs[i].naming ||
			        this.outs[i].bus !== (outs[i].constructor.type === 'OutPinBus')) {
			        bad = true;
			        break;
		        }
	        }

	        // If it ain't broke, don't fix it.
	        if(!bad) {
	            return;
            }
        }

        //
        // Determine the size we need to draw the component
        //
        const maxIO = ins.length > outs.length ? ins.length : outs.length;

        this.height = maxIO * 16 + 32;
        if(this.height < 48) {
            this.height = 48;
        }

        let x = this.width / 2;
        let startY = - this.height / 2 + 8;

        const saveExistingPins = function(currentPins, pinsById) {
	        const savedPins = {};
	        for(const pin of currentPins) {
		        if(pin.reference !== null && pinsById[pin.reference] !== undefined) {
			        savedPins[pinsById[pin.reference].naming] = pin;
		        } else {
			        savedPins[pin.name] = pin;
		        }
	        }

	        return savedPins;
        }

        //
	    // Fix inputs
	    //

        // Save off the existing inputs by name, then
	    // clear the inputs so we can add them back in
        const savedInputs = saveExistingPins(this.ins, insById);
        this.ins = [];

        let i = 0;
        for(i=0; i<ins.length; i++) {
        	let inp;
            if(savedInputs[ins[i].naming] !== undefined) {
            	inp = savedInputs[ins[i].naming];
                this.ins.push(inp);

	            inp.name = ins[i].naming;
	            inp.x = -x;
	            inp.y = startY + i * 16;
	            inp.len = 16;

	            savedInputs[ins[i].naming] = null;
            } else {
	            inp = this.addIn(-x, startY + i * 16, 16, ins[i].naming);
            }

	        inp.bus = ins[i].constructor.type === 'InPinBus';
	        inp.index = i;
	        inp.reference = ins[i].id;
        }

        for(let name in savedInputs) {
        	if(savedInputs[name] !== null) {
        		// We have an input that has been deleted!
		        // console.log(savedInputs[name]);
		        savedInputs[name].clear();
	        }
        }

        //
        // Fix outputs
        //

        // Save off existing outputs by name, then
	    // clear the outputs so we can add them back in
	    const savedOutputs = saveExistingPins(this.outs, outsById);
	    this.outs = [];

	    for(i=0; i<outs.length; i++) {
	    	let out;
		    if(savedOutputs[outs[i].naming] !== undefined) {
		    	out = savedOutputs[outs[i].naming];
			    this.outs.push(out);

			    out.name = outs[i].naming;
			    out.x = x;
			    out.y = startY + i * 16;
			    out.len = 16;

			    savedOutputs[outs[i].naming] = null;
		    } else {
		    	out = this.addOut(x, startY + i * 16, 16, outs[i].naming);
		    }

		    out.index = i;
		    out.bus = outs[i].constructor.type === 'OutPinBus';
		    out.reference = outs[i].id;
	    }

	    for(let name in savedOutputs) {
		    if(savedOutputs[name] !== null) {
			    // We have an output that has been deleted!
			    savedOutputs[name].clear();
		    }
	    }

    }

}

/**
 * Clone this component object.
 * @returns {CircuitRef}
 */
CircuitRef.prototype.clone = function() {
    const copy = new CircuitRef();

    copy.circuitName = this.circuitName;
    for(let i=0; i<this.ins.length; i++) {
    	const clone = this.ins[i].clone();
    	clone.component = copy;
    	copy.ins.push(clone);
    }


    for(let i=0; i<this.outs.length; i++) {
	    const clone = this.outs[i].clone();
	    clone.component = copy;
	    copy.outs.push(clone);
    }

	if(this.circuitRef !== null) {
		copy.circuitRef = this.circuitRef.copy_clone();
		copy.ensureIO();
	}

    copy.copyFrom(this);

    return copy;
};


/**
 * Load this object from an object converted from JSON
 * @param obj Object from JSON
 */
CircuitRef.prototype.load = function(obj) {
    this.circuitName = obj["circuitName"];
    Component.prototype.load.call(this, obj);

    this.getCircuitRef();
};


/**
 * Create a save object suitable for conversion to JSON for export.
 * @returns {*}
 */
CircuitRef.prototype.save = function() {
    var obj = Component.prototype.save.call(this);
    obj.circuitName = this.circuitName;
    return obj;
};


/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
CircuitRef.prototype.draw = function(context, view) {
    this.getCircuitRef();
    this.ensureIO();
    
    this.selectStyle(context, view);

    var leftX = this.x - this.width/2 - 0.5;
    var rightX = this.x + this.width/2 + 0.5;
    var topY = this.y - this.height/2 - 0.5;
    var botY = this.y + this.height/2 + 0.5;

    context.beginPath();
    context.rect(leftX, topY, this.width, this.height);
	CanvasHelper.fillWith(context);
	context.stroke();

    // Name

    context.font = "14px Times";
    context.textAlign = "center";
    if(this.naming !== null) {
        context.fillText(this.naming, this.x, this.y - 10);
    }

    context.fillText(this.circuitName, this.x, this.y + this.height/2 - 5);
    context.stroke();


    this.drawIO(context, view);
};
