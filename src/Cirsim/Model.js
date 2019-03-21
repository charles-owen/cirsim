import {Circuit} from './Circuit';
import {Circuits} from './Circuits'

/**
 * The circuits model.
 *
 * One Model objects owns the circuits, so all references are
 * to the model rather than to the circuits. This allows the
 * circuits to be switched out due to an undo or load.
 * @param main The Cirsim object
 * @constructor
 */
export const Model = function(main) {
    this.main = main;

    this.circuits = new Circuits(this);
    this.circuits.add(new Circuit("main"));
};

Model.prototype.getCircuit = function(name) {
    return this.circuits.getCircuit(name);
}

Model.prototype.undo = function() {
    if(this.circuits.prev !== null) {
        this.circuits = this.circuits.prev;
    }
};

Model.prototype.backup = function() {
    this.circuits.clone();
};

Model.prototype.status = function() {
    let i=0;
    let p = this.circuits;

    for(let circuit of p.circuits) {
        let j=0;
        let c = circuit;
        while(c !== null) {
            j++;

            c = c.prev;
        }

        console.log('circuit depth: ' + j);
    }

    while(p !== null) {
        i++;



        p = p.prev;
    }

    console.log('circuits depth: ' + i);
}

/**
 * Update components after a circuit change.
 * This is used by CircuitRef components to ensure
 * references are always correct.
 * @param circuit Update up until this circuit
 */
Model.prototype.update = function(circuit) {
    this.circuits.update(circuit);
}

Model.prototype.toJSON = function() {
    return this.circuits.toJSON();
};

Model.prototype.fmJSON = function(json) {
    this.circuits.simulation.setView(null);
    this.circuits = new Circuits(this);
    this.circuits.fmJSON(json);
};

Model.prototype.getSimulation = function() {
    return this.circuits.simulation;
};

Model.prototype.newTab = function() {
    this.circuits.newTab();
    this.recompute();
}

Model.prototype.recompute = function() {
    this.circuits.recompute();
}

Model.prototype.addCircuit = function(name) {
    this.backup();
    this.circuits.addCircuit(name);
}

/**
 * Delete a circuit by the index to the circuit
 * @param index Index into the circuits array
 */
Model.prototype.deleteCircuitByIndex = function(index) {
    this.backup();
    this.circuits.deleteCircuitByIndex(index);
}

/**
 * Get a component by it's naming
 * @param naming Naming to search for
 * @returns {*}
 */
Model.prototype.getComponentByNaming = function(naming) {
    return this.circuits.getComponentByNaming(naming);
}

/**
 * Get all components by type
 * @param type Naming to search for
 * @returns Array with collection of components of that type
 */
Model.prototype.getComponentsByType = function(type) {
    return this.circuits.getComponentsByType(type);
}

/**
 * Replace a circuit that currently exists with a new version.
 */
Model.prototype.replaceCircuit = function(circuit) {
    this.circuits.replaceCircuit(circuit);
}

/**
 * Kill any active simulation when the model is destroyed
 */
Model.prototype.kill = function() {
    this.getSimulation().kill();
}

