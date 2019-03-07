
import {CircuitRef} from './Component/CircuitRef';
import {Connection} from './Connection';
import {Sanitize} from './Utility/Sanitize';
import {Rect} from "./Utility/Rect";

/**
 * Construct a circuit
 * @param name Name of the circuit
 * @constructor
 */
export const Circuit = function(name) {

    this.circuits = null;
    this.components = [];
    this.name = name;

    this.width = this.defWidth;
    this.height = this.defHeight;

    // Previous copy in the copy stack
    this.prev = null;

    /**
     * See if some object has been touched by the mouse.
     * @param x Mouse X
     * @param y Mouse Y
     * @return Touched element or null if none
     */
    this.touch = function(x, y) {
        //
        // First we try to grab a component.
        // We do this in reverse order so we are selecting
        // from top down.
        //
        for(let i=this.components.length-1; i>= 0; i--) {
	        let component = this.components[i];
	        let grabbed = component.touch(x, y);
            if(grabbed !== null) {
                return grabbed;
            }
        }

        return null;
    };

    /**
     * Advance the animation by delta time...
     * @param delta
     */
    this.advance = function(delta) {
        var any = false;
        for(var i=0; i<this.components.length; i++) {
            var component = this.components[i];
            if(component.advance(delta)) {
                any = true;
            }
        }
        return any;
    }

};

Circuit.prototype.defWidth = 1920;   ///< Default width
Circuit.prototype.defHeight = 1080;  ///< Default height

/**
 * Create a backup clone of this circuit
 * @returns {Circuit}
 */
Circuit.prototype.clone = function() {
    const copy = new Circuit(this.name);
    copy.width = this.width;
    copy.height = this.height;

    // Add to the copy stack
    copy.prev = this.prev;
    this.prev = copy;

    // Iterate over the components, cloning each of them
    for(let i=0; i<this.components.length; i++) {
        var component = this.components[i];
        var componentCopy = component.clone();
        copy.add(componentCopy);
    }

    // Again we iterate over the components, this time
    // cloning the output connections.
    for(let i=0; i<this.components.length; i++) {
        var component = this.components[i];
        for(var j=0; j<component.outs.length; j++) {
            var out = component.outs[j];
            for(var k=0; k<out.to.length; k++) {
                out.to[k].clone();
            }
        }
    }

    return copy;
};

/**
 * Create a backup clone of this circuit
 * @returns {Circuit}
 */
Circuit.prototype.copy_clone = function() {
    var copy = new Circuit(this.name);
    copy.width = this.width;
    copy.height = this.height;

    // Iterate over the components, cloning each of them
    for(var i=0; i<this.components.length; i++) {
        var component = this.components[i];
        var componentCopy = component.clone();
        copy.add(componentCopy);
    }

    // Again we iterate over the components, this time
    // cloning the output connections.
    for(var i=0; i<this.components.length; i++) {
        var component = this.components[i];
        for(var j=0; j<component.outs.length; j++) {
            var out = component.outs[j];
            for(var k=0; k<out.to.length; k++) {
                out.to[k].clone();
            }
        }
    }

    return copy;
};


Circuit.prototype.draw = function(context, view) {
    this.components.forEach(function(component, index, array) {
        component.draw(context, view);
    });
};

Circuit.prototype.newTab = function() {
    // There was code here to iterate over the components
    // in reverse order. I don't recall why that was. I think
    // it may be a holdover from the circuits being in reverse
    // order. I'm removed it and will see if it breaks anything.
    // for(let i=this.components.length-1; i>= 0; i--) {


    for(let i=0;  i<this.components.length; i++) {
        const component = this.components[i];

        // Tell any components that need to know that
        // we have selected a new tab. This is
        // important for the reference component.
        component.newTab();
    }
}

Circuit.prototype.recompute = function() {
    for(let i=0;  i<this.components.length; i++) {
        // Ensure everything get recomputed
        this.components[i].pending();
    }
}

/**
 * Test if components or bends are contained in a given rectangle.
 * @param rect Rect object
 * @returns {Array} Array of all contained components
 */
Circuit.prototype.inRect = function(rect) {
    var ret = [];
    for(var i=this.components.length-1; i>= 0; i--) {
        this.components[i].inRect(rect, ret);
    }

    return ret;
};

Circuit.prototype.snapIt = function(item) {
    if(this.circuits.snap) {
        item.x = this.circuits.grid * Math.round(item.x / this.circuits.grid);
        item.y = this.circuits.grid * Math.round(item.y / this.circuits.grid);
    }
};

Circuit.prototype.add = function(component) {
    this.components.push(component);
    component.added(this);
    return component;
};

/**
 * Delete a specific item from the list of components
 * @param toDelete Item to delete
 */
Circuit.prototype.delete = function(toDelete) {
    for(let i=0; i<this.components.length; i++) {
        if(this.components[i] === toDelete) {
            this.components.splice(i, 1);
            break;
        }
    }
};

/**
 * Determine if x,y touches a component In
 * @param x
 * @param y
 */
Circuit.prototype.touchIn = function(x, y) {
    for(var i=this.components.length-1; i>= 0; i--) {
        var component = this.components[i];
        var touched = component.touchIn(x, y);
        if(touched !== null) {
            return touched;
        }
    }

    return null;
};

/**
 * Determine if x,y touches a component Out
 * @param x
 * @param y
 */
Circuit.prototype.touchOut = function(x, y) {
    for(var i=this.components.length-1; i>= 0; i--) {
        var component = this.components[i];
        var touched = component.touchOut(x, y);
        if(touched !== null) {
            return touched;
        }
    }

    return null;
};

/**
 * Save this object into an object suitable for conversion to
 * a JSON object for storage.
 * @returns Object
 */
Circuit.prototype.save = function() {
    // Iterate over the components, saving each of them
    var comps = [];

    for(let i=0; i<this.components.length; i++) {
        const component = this.components[i];

        // Set an ID on each component
       // component.id = "c" + (i + 1001);

        comps.push(component.save());
    }

    // Then iterate over the connections, saving each of them
    var connections = [];
    for(let i=0; i<this.components.length; i++) {
        const component = this.components[i];
        connections = connections.concat(component.saveConnections());
    }

    return {"name": this.name, "width": this.width, "height": this.height,
        "components": comps, "connections": connections};
};

/**
 * Load this object from an object that was converted from a
 * JSON object for storage.
 * @param obj
 */
Circuit.prototype.load = function(obj) {
    this.name = Sanitize.sanitize(obj.name);
    this.width = +obj.width;
    this.height = +obj.height;

    // Load the components
    const compsMap = {};  // Map from component ID to component object

    for(let i=0; i<obj.components.length; i++) {
        const componentObj = obj.components[i];

        let componentProto;
        if(componentObj.type === "CircuitRef") {
            componentProto = CircuitRef;
        } else {
            componentProto = this.circuits.model.main.components.get(componentObj.type);
        }

        if(componentProto !== null) {
            const component = new componentProto();
            component.circuit = this;
            component.load(componentObj);
            compsMap[component.id] = component;
            this.add(component);
        } else {
            console.log(componentObj);
        }
    }

    // Load the connections
    for(let i=0; i<obj.connections.length; i++) {
        const connectionObj = obj.connections[i];
        const fmComp = compsMap[connectionObj["from"]];
        if(fmComp === undefined) {
            console.log("From object undefined");
            console.log(this);
            console.log(connectionObj);
            continue;
        }

        const toComp = compsMap[connectionObj["to"]];
        if(toComp === undefined) {
            console.log("To object undefined");
            console.log(this);
            console.log(connectionObj);
            continue;
        }

        const outNdx = connectionObj["out"];
        const inNdx = connectionObj["in"];
        const connection = this.connect(fmComp, outNdx, toComp, inNdx);
        if(connection !== null) {
            connection.load(connectionObj);
        }
    }
};

/**
 * Get a component by it's naming
 * @param naming Naming to search for
 * @returns {*}
 */
Circuit.prototype.getComponentByNaming = function(naming) {
    for(let i=0; i<this.components.length; i++) {
        const component = this.components[i];
        if(component.naming === naming) {
            return component;
        }
    }

    return null;
};

/**
 * Get all components by type
 * @param type Naming to search for
 * @returns Array with collection of components of that type
 */
Circuit.prototype.getComponentsByType = function(type) {
    var components = [];

    for(var i=0; i<this.components.length; i++) {
        var component = this.components[i];
        if(component.constructor.type === type) {
            components.push(component);
        }
    }

    return components;
}

Circuit.prototype.mouseUp = function() {
    for(var i=0; i<this.components.length; i++) {
        var component = this.components[i];
        component.mouseUp();
    }
};

Circuit.prototype.connect = function(outObj, outNdx, inObj, inNdx) {
    if(outObj.outs.length <= outNdx || inObj.ins.length <= inNdx) {
        return null;
    }

    return new Connection(outObj.outs[outNdx], inObj.ins[inNdx]);
};

Circuit.prototype.getComponentsByType = function(type) {
    var ret = [];

    for(var i=0; i<this.components.length; i++) {
        var component = this.components[i];
        if(component.constructor.type === type) {
            ret.push(component);
        }
    }

    return ret;
}


/**
 * Determine the maximum size in each dimension for this circuit.
 * Does include an extra 16 pixel bias in each dimension to account for
 * inputs and outputs.
 * @returns {{x: number, y: number}}
 */
Circuit.prototype.maxXY = function() {
    let maxX = 1;
    let maxY = 1;

    for(let i=0; i<this.components.length; i++) {
        const bounds = this.components[i].bounds();
        if(bounds.right > maxX) {
            maxX = bounds.right;
        }

        if(bounds.bottom > maxY) {
            maxY = bounds.bottom;
        }
    }

    return {x: maxX+16, y: maxY+16};
}

/**
 * Compute a bounding box that encloses all of this circuit.
 * @returns {*}
 */
Circuit.prototype.bounds = function() {
    if(this.components.length === 0) {
        return new Rect();
    }

    const bounds = this.components[0].bounds();

    for(let i=0; i<this.components.length; i++) {
        const b = this.components[i].bounds();
        bounds.expand(b);
    }

    return bounds;
}

Circuit.prototype.pending = function() {
    for(let i=0; i<this.components.length; i++) {
        const component = this.components[i];
        component.pending();
    }
}

Circuit.prototype.getName = function() {
    return this.name;
};

Circuit.prototype.setName = function(name) {
    this.name = name;
}

/**
 * Obtain basic statistics about this circuit
 * @returns {{name: *, numComponents: Number, numConnections: number, width: *, height: *}}
 */
Circuit.prototype.stats = function() {
    let numConnections = 0;
    this.components.forEach((component) => {
        component.outs.forEach((out) => {
            numConnections += out.to.length;
        });
    });

    return {
        name: this.name,
        numComponents: this.components.length,
        numConnections: numConnections,
        width: this.width,
        height: this.height
    };
}

Circuit.prototype.moveToFront = function(component) {

	for(let i=0; i<this.components.length; i++) {
		if(this.components[i] === component) {
			this.components.splice(i, 1);
			this.components.push(component);
			break;
		}
	}
}

/**
 * Return all CircuitRef components that refer to a circuit
 * @param circuit Circuit we are testing. If omitted, all CircuitRef components are returned.
 * @return array of CircuitRef components.
 */
Circuit.prototype.references = function(circuit) {
    let references = [];

    for(let component of this.components) {
        if(component instanceof CircuitRef) {
            if(circuit !== undefined) {
                if(component.circuitName === circuit.name) {
                    references.push(component);
                }
            } else {
                references.push(component);
            }

        }
    }

    return references;
}