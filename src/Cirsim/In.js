import {Connector} from './Connector';

/**
 * In connection for a component
 * @param component Component this connector is for
 * @param x Relative x on the component
 * @param y Relative y on the component
 * @param len Length in pixels to draw the connector
 * @param name Name to draw next to the connector
 * @param inv True (optional) if connector has a circle (inverse)
 * @implements Connector
 * @constructor
 */
export const In = function(component, x, y, len, name, inv) {
    Connector.call(this, component, x, y, len, name, inv);

    this.from = []; // Objects of type Connection
    this.orientation = "w";     // Default orientation for inputs is west
};

In.prototype = Object.create(Connector.prototype);
In.prototype.constructor = In;

In.prototype.clone = function() {
    const copy = new In(this.component, this.x, this.y, this.len, this.name, this.inv);
    copy.orientation = this.orientation;
    copy.copyFrom(this);
    return copy;
}

/**
 * Set the value from a connection
 */
In.prototype.set = function() {
    const value = this.from.length > 0 && this.from[0].from !== null ?
        this.from[0].from.value : undefined;
    if(this.value !== value) {
        this.value = value;
        this.component.pending();
    }
};

/**
 * Set a connection as the from for this input.
 * @param connection Connection to set
 */
In.prototype.setConnection = function(connection) {
    this.from.forEach(function(existing) {
        existing.delete(this);
    });

    connection.to = this;
    this.from = [connection];

    // Update value whenever a connection is made
    this.set();
};

/**
 * Clear all connections to this input
 */
In.prototype.clear = function() {
    this.from.forEach(function(existing) {
        existing.delete(this);
    });

    this.from = [];
};

/**
 * Add a connection to this input. Normal connections only allow
 * one connection per input, but we allow two during the time we are
 * creating a new connection.
 * @param connection Connection to add
 */
In.prototype.add = function(connection) {
    this.from.push(connection);
};


In.prototype.remove = function(connection) {
    var newFrom = [];
    this.from.forEach(function(value) {
        if(value !== connection) {
            newFrom.push(value);
        }
    });

    this.from = newFrom;
};


In.prototype.draw = function(context, view) {
    Connector.prototype.draw.call(this, context, view);

    for(let i=0; i<this.from.length;  i++) {
        if(this.from[i].from === null) {
            this.from[i].draw(context, view);
        }
    }
};

