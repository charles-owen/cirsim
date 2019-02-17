import {Connector} from './Connector';


/**
 * Out connector
 * @param component Component this connector is for
 * @param x Relative x on the component
 * @param y Relative y on the component
 * @param len Length in pixels to draw the connector
 * @param name Name to draw next to the connector
 * @param inv True (optional) if connector has a circle (inverse)
 * @constructor
 */
export const Out = function(component, x, y, len, name, inv) {
    Connector.call(this, component, x, y, len, name, inv);

    this.to = [];   // Objects of type Connection
    this.orientation = "e"; // Default orientation for outputs is east
};


Out.prototype = Object.create(Connector.prototype);
Out.prototype.constructor = Out;

Out.prototype.clone = function() {
	const copy = new Out(this.component, this.x, this.y, this.len, this.name, this.inv);
	copy.orientation = this.orientation;
	copy.copyFrom(this);
	return copy;
}

/**
 * Set the output value.
 *
 * This sets the value for all connected inputs as well.
 * @param value Value to set
 */
Out.prototype.set = function(value) {
    let diff = true;

    // If the result is an array, compare it...
    if(Array.isArray(value)) {
        if(Array.isArray(this.value)) {
            if(value.length === this.value.length) {
                diff = false;
                for(let i in value) {
                    if(value[i] !== this.value[i]) {
                        diff = true;
                        break;
                    }
                }
            }
        }

    } else {
        diff = this.value !== value;
    }

    if(diff) {
        this.value = value;
        for(let i=0; i<this.to.length; i++) {
            const inp = this.to[i].to;
            if(inp !== null) {
                inp.set();
            }
        }
    }
};

Out.prototype.setAsString = function(value) {
    if(this.bus) {
        this.set(Connector.parseBusValue(value));
    } else {
        switch(value) {
            default:
                this.set(false);
                break;

            case '1':
                this.set(true);
                break;

            case '?':
                this.set(undefined);
                break;
        }
    }
}

Out.prototype.get = function() {
    return this.value;
}

Out.prototype.draw = function(context, view) {
    Connector.prototype.draw.call(this, context, view);

    if(this.bus) {
        context.lineWidth = 2;
    } else {
        context.lineWidth = 1;
    }

    /*
     * Draw any connections
     */
    for(var i=0; i<this.to.length; i++) {
        this.to[i].draw(context, view);
    }

    context.lineWidth = 1;
};

Out.prototype.add = function(connection) {
    this.to.push(connection);
};

Out.prototype.remove = function(connection) {
    var newTo = [];
    this.to.forEach(function(value) {
        if(value !== connection) {
            newTo.push(value);
        }
    });

    this.to = newTo;
};

/**
 * Clear all connections to this output
 */
Out.prototype.clear = function() {
    this.to.forEach(function(existing) {
        existing.delete(this);
    });

    this.to = [];
};


/**
 * Test connections for this out to see if they have
 * been touched.
 * @param x
 * @param y
 * @returns touched connection or null;
 */
Out.prototype.touchConnections = function(x, y) {
    for(var i=0; i<this.to.length; i++) {
        var touched = this.to[i].touch(x, y);
        if(touched != null) {
            return touched;
        }
    }

    return null;
};

/**
 * Collect all bends that
 * are contained in the rectangle.
 * @param rect Rectangle to test
 * @param collect Collection (array) to add items to.
 */
Out.prototype.selectRect = function(rect, collect) {
    for(var i=0; i<this.to.length; i++) {
        this.to[i].selectRect(rect, collect);
    }
};

export default Out;
