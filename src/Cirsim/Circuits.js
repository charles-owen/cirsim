
import {Simulation} from './Simulation';
import {Circuit} from './Circuit';
import {Sanitize} from './Utility/Sanitize';

/**
 * A collection of circuit objects
 * @param model The model we are a member of
 * @param simulation The simulation object that simulates operation of the circuits
 * @constructor
 */
export const Circuits = function(model, simulation) {
    this.model = model;
    this.circuits = [];
    this.grid = 8;
    this.snap = true;
    this.id = model !== null ? model.id : undefined;

    // If none is supplied, create a simulation object
    this.simulation = simulation ? simulation : new Simulation();

    // Previous copy in the copy stack
    this.prev = null;
};

/**
 * Add a circuit to this collection of circuits
 * @param circuit
 */
Circuits.prototype.add = function(circuit) {
    this.circuits.push(circuit);
    circuit.circuits = this;
    return circuit;
};

Circuits.prototype.insert = function(circuit) {
    this.circuits.unshift(circuit);
    circuit.circuits = this;
    return circuit;
}

/**
 * Get the collection of circuits.
 * @returns Array of Circuit objects (copy)
 */
Circuits.prototype.getCircuits = function() {
    return this.circuits.slice();
};

/**
 * Get a circuit by name
 * @param name Name of the circuit
 * @returns Circuit object or null
 */
Circuits.prototype.getCircuit = function(name) {
    for(let i=0; i<this.circuits.length; i++) {
        const circuit = this.circuits[i];
        if(circuit.name === name) {
            return circuit;
        }
    }

    return null;
};

Circuits.prototype.advance = function(delta) {
    let ret = false;
    for(let i=0; i<this.circuits.length; i++) {
        const circuit = this.circuits[i];
        if(circuit.advance(delta)) {
            ret = true;
        }
    }

    return ret;
}

/**
 * Determine if a circuit can be deleted.
 * @param ndx Index into the circuits.
 */
Circuits.prototype.canDelete = function(ndx) {
    if(ndx === 0) {
        // The main circuit (first) cannot be deleted
        return false;
    }

    // Do any circuits to the left refer to this one?
    const circuit = this.circuits[ndx];
    for(let i=0; i<ndx; i++) {
        const references = this.circuits[i].references(circuit);
        if(references.length > 0) {
            return false;
        }
    }

    return true;
}

/**
 * Determine if a circuit can be moved left as a tab.
 * @param ndx Index into the circuits.
 * @returns {boolean} True if can be moved left
 */
Circuits.prototype.canMoveLeft = function(ndx) {
    // First two tabs cannot be moved left at all
    if(ndx < 2) {
        return false;
    }

    // Does the circuit to the left refer to this one?
    const circuit = this.circuits[ndx];
    const references = this.circuits[ndx-1].references(circuit);
    return references.length === 0;
}

/**
 * Determine if a circuit can be moved right as a tab
 * @param ndx Index into the circuits.
 * @returns {boolean} True if can be move right
 */
Circuits.prototype.canMoveRight = function(ndx) {
    // First tab cannot be moved at all. Last tab can't
    // move to the right.
    if(ndx === 0 || ndx === this.circuits.length-1) {
        return false;
    }

    // What does this circuit refer to?
    const right = this.circuits[ndx+1].name;
    const references = this.circuits[ndx].references();
    for(let reference of references) {
        if(reference.circuitName === right) {
            return false;
        }
    }

    return true;
}

Circuits.prototype.moveLeft = function(ndx) {
    if(this.canMoveLeft(ndx)) {
        this.model.backup();

        const t = this.circuits[ndx-1];
        this.circuits[ndx-1] = this.circuits[ndx];
        this.circuits[ndx] = t;
        return true;
    }

    return false;
}

Circuits.prototype.moveRight = function(ndx) {
    if(this.canMoveRight(ndx)) {
        this.model.backup();

        const t = this.circuits[ndx+1];
        this.circuits[ndx+1] = this.circuits[ndx];
        this.circuits[ndx] = t;
        return true;
    }

    return false;
}

Circuits.prototype.rename = function(ndx, name) {
    this.model.backup();
    const circuit = this.circuits[ndx];

    // Rename any references to this circuit
    for(let i=0; i<ndx; i++) {
        const references = this.circuits[i].references(circuit);
        for(let reference of references) {
            reference.circuitName = name;
        }
    }

    circuit.setName(name);
}

Circuits.prototype.newTab = function() {
    // for(let i=0; i<this.circuits.length; i++) {
    //     this.circuits[i].newTab();
    // }

    for(let i=this.circuits.length-1;  i>=0;  i--) {
        this.circuits[i].newTab();
    }
}

Circuits.prototype.recompute = function() {
    //for(let i=0; i<this.circuits.length; i++) {
    for(let i=this.circuits.length-1;  i>=0;  i--) {
        this.circuits[i].recompute();
    }
}

/**
 * Create a backup clone of this circuit
 * @returns {Circuits}
 */
Circuits.prototype.clone = function() {
    const copy = new Circuits(this.model, this.simulation);
    copy.grid = this.grid;
    copy.snap = this.snap;

    // Add to the copy stack
    copy.prev = this.prev;
    this.prev = copy;

    // Copy the circuit objects
    for(let i=0; i<this.circuits.length; i++) {
        const circuit = this.circuits[i];
        copy.add(circuit.clone());
    }

    return copy;
};

/**
 * Update circuits after a circuit change.
 * This is used by CircuitRef components to ensure
 * references are always correct.
 * @param circuit Update up until this circuit
 */
Circuits.prototype.update = function(circuit) {
    for(let c of this.circuits) {
        if(c === circuit) {
            break;
        }
        c.update();
    }
}

Circuits.prototype.toJSON = function() {
    return JSON.stringify(this.save());
};

/**
 * Load the circuits from a JSON-encoded object
 * @param json
 */
Circuits.prototype.fmJSON = function(json) {
    const obj = JSON.parse(json);
    this.load(obj);
};

/**
 * Save this object into an object suitable for conversion to
 * a JSON object for storage.
 * @returns Object
 */
Circuits.prototype.save = function() {
    const cirs = [];
    for(let i=0; i<this.circuits.length; i++) {
        const circuit = this.circuits[i];
        cirs.push(circuit.save());
    }

    let obj = {"grid": this.grid,
        "circuits": cirs, "id": this.id};

    if(this.snap) {
        obj.snap = true;
    }

    return obj;
};

/**
 * Load this object from an object converted from a JSON
 * object used for storage.
 * @param obj
 */
Circuits.prototype.load = function(obj) {
    // Some tests for an invalid file
    if(obj.grid === undefined || obj.circuits === undefined) {
      obj = JSON.parse("{\"grid\":8,\"circuits\":[{\"name\":\"main\",\"width\":1920,\"height\":1080,\"components\":[],\"connections\":[]}],\"snap\":true}");
    }

    this.grid = +obj["grid"];
    this.snap = Sanitize.boolean(obj["snap"]);
    this.prev = null;
    this.circuits = [];

    if(obj["id"] !== undefined) {
        this.id = Sanitize.sanitize(obj["id"]);
    }

    //
    // Load circuits in reverse order
    //
    for(let i=obj.circuits.length-1;  i>=0; i--) {
        var circuitObj = obj.circuits[i];
        var circuit = new Circuit(circuitObj.name);
        this.insert(circuit);
        circuit.load(circuitObj);
    }
    
    // In reverse order, ensure all circuits have
    // had compute called on all components
    for(let i=this.circuits.length-1;  i>=0; i--) {
        this.circuits[i].pending();
    }

};

Circuits.prototype.addCircuit = function(name) {
    var circuit = new Circuit(name);
    this.add(circuit);
}

/**
 * Delete a circuit by the index to the circuit
 * @param index Index into the circuits array
 */
Circuits.prototype.deleteCircuitByIndex = function(index) {
    this.circuits.splice(index, 1);
}


/**
 * Get a component by it's naming
 * @param naming Naming to search for
 * @returns {*}
 */
Circuits.prototype.getComponentByNaming = function(naming) {
    for(var i=0; i<this.circuits.length; i++) {
        var circuit = this.circuits[i];
        var pin = circuit.getComponentByNaming(naming);
        if(pin !== null) {
            return pin;
        }
    }

    return null;
}

/**
 * Get all components by type
 * @param type Naming to search for
 * @returns Array with collection of components of that type
 */
Circuits.prototype.getComponentsByType = function(type) {
    let components = [];

    for(let i=0; i<this.circuits.length; i++) {
        const circuit = this.circuits[i];
        const c = circuit.getComponentsByType(type);
        components = components.concat(c);
    }

    return components;
}

/**
 * Replace a circuit that currently exists with a new version.
 */
Circuits.prototype.replaceCircuit = function(circuit) {
    circuit.circuits = this;

    for(let i=0; i<this.circuits.length; i++) {
        if(this.circuits[i].name === circuit.name) {
            this.circuits[i] = circuit;

	        // Ensure all components in the new circuit are pending, so they
	        // all get updated.
	        circuit.components.forEach(function(component) {
		        component.pending();
	        });

	        // Force this to appear to be a new tab
	        this.model.newTab();
            break;
        }
    }


}
