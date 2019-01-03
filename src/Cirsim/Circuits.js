
import {Simulation} from './Simulation';
import Circuit from './Circuit';
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
    this.showOutputStates = false;
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
    for(var i=0; i<this.circuits.length; i++) {
        var circuit = this.circuits[i];
        if(circuit.name === name) {
            return circuit;
        }
    }

    return null;
};

Circuits.prototype.advance = function(delta) {
    var ret = false;
    for(var i=0; i<this.circuits.length; i++) {
        var circuit = this.circuits[i];
        if(circuit.advance(delta)) {
            ret = true;
        }
    }

    return ret;
}

Circuits.prototype.newTab = function() {
    for(var i=0; i<this.circuits.length; i++) {
        this.circuits[i].newTab();
    }
}

/**
 * Create a backup clone of this circuit
 * @returns {Circuits}
 */
Circuits.prototype.clone = function() {
    var copy = new Circuits(this.model, this.simulation);
    copy.grid = this.grid;
    copy.snap = this.snap;

    // Add to the copy stack
    copy.prev = this.prev;
    this.prev = copy;

    // Copy the circuit objects
    for(var i=0; i<this.circuits.length; i++) {
        var circuit = this.circuits[i];
        copy.add(circuit.clone());
    }

    return copy;
};

Circuits.prototype.toJSON = function() {
    return JSON.stringify(this.save());
};

Circuits.prototype.fmJSON = function(json) {
    var obj = JSON.parse(json);
    this.load(obj);
};

/**
 * Save this object into an object suitable for conversion to
 * a JSON object for storage.
 * @returns Object
 */
Circuits.prototype.save = function() {
    var cirs = [];
    for(var i=0; i<this.circuits.length; i++) {
        var circuit = this.circuits[i];
        cirs.push(circuit.save());
    }

    let obj = {"grid": this.grid,
        "circuits": cirs, "id": this.id};

    if(this.snap) {
        obj.snap = true;
    }

    if(this.showOutputStates) {
        obj.showoutputstates = true;
    }

    return obj;
};

/**
 * Load this object from an object converted from a JSON
 * object used for storage.
 * @param obj
 */
Circuits.prototype.load = function(obj) {
    var that = this;

    this.grid = +obj["grid"];
    this.snap = Sanitize.boolean(obj["snap"]);
    this.showOutputStates = Sanitize.boolean(obj["showoutputstates"]);
    this.prev = null;
    this.circuits = [];

    if(obj["id"] !== undefined) {
        this.id = Sanitize.sanitize(obj["id"]);
    }

    //
    // Load circuits in reverse order
    //
    var i;

    for(i=obj.circuits.length-1;  i>=0; i--) {
        var circuitObj = obj.circuits[i];
        var circuit = new Circuit(circuitObj.name);
        that.insert(circuit);
        circuit.load(circuitObj);
    }
    
    // In reverse order, ensure all circuits have
    // had compute called on all components
    for(var i=this.circuits.length-1;  i>=0; i--) {
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
    var components = [];

    for(var i=0; i<this.circuits.length; i++) {
        var circuit = this.circuits[i];
        var c = circuit.getComponentsByType(type);
        components = components.concat(c);
    }

    return components;
}

/**
 * Replace a circuit that currently exists with a new version.
 */
Circuits.prototype.replaceCircuit = function(circuit) {
    circuit.circuits = this;

    for(var i=0; i<this.circuits.length; i++) {
        if(this.circuits[i].name === circuit.name) {
            this.circuits[i] = circuit;
            break;
        }
    }
}

export default Circuits;
