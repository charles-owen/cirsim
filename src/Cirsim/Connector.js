/**
 * @file
 * Base object for a component connection.
 * Both In and Out are derived from Connector
 */

import Util from './Utility/Util.js';
import Vector from './Utility/Vector.js';


/**
 * Base object for connectors (In or Out)
 * @param component Component this connector is for
 * @param x Relative x on the component
 * @param y Relative y on the component
 * @param len Length in pixels to draw the connector
 * @param name Name to draw next to the connector
 * @param inv True (optional) if connector has a circle (inverse)
 * @constructor
 */
var Connector = function(component, x, y, len, name, inv) {
    this.component = component;
    this.x = x;
    this.y = y;
    this.len = len !== undefined ? len : 16;
    this.index = undefined;
    this.name = name;
    this.inv = inv;

    this.value = undefined;

    this.touchRange = 8;
    this.bus = false;
};

/// Orientation of the input (n, s, e, or w)
/// "w" means the connection is to the left of x,y
Connector.prototype.orientation = "w";

/// Is this connector a clock. This applies to
/// inputs only. Clocks draw as a triangle instead of a label
Connector.clock = false;

Connector.prototype.single = function() {
    return true;
};


Connector.prototype.copyFrom = function(other) {
    this.value = other.value;
}


Connector.prototype.get = function() {
    return this.value;
}

Connector.prototype.getAsString = function() {
    function toValueString(v) {
        if($.isArray(v)) {
            var str = '';
            v.forEach(function(v1) {
                str = toValueString(v1) + str;
            })

            return str;
        } else {
            return v === undefined ? "?" : (v ? "1" : "0")
        }
    }

    return toValueString(this.value);
}

/**
 * Parse a string in the bus value format.
 * @param str String to parse
 * @returns {*} Array as value or null if invalid
 */
Connector.parseBusValue = function(str) {
    var value = [];
    for(var i=str.length-1; i>=0;  i--) {
        var char = str.substr(i, 1);
        switch(char) {
            case '0':
                value.push(false);
                break;

            case '1':
                value.push(true);
                break;

            case '?':
                value.push(undefined);
                break;

            default:
                return null;
        }
    }

    return value;
}

/**
 * Convert a bus value to a number.
 * @param bus The Bus value
 */
Connector.busValueToDecimal = function(bus) {
    if(bus === undefined) {
        return null;
    }

    var val = 0;
    var pow = 1;
    for(var i in bus) {
        if(bus[i] === undefined) {
            return null;
        }

        if(bus[i]) {
            val += pow;
        }

        pow *= 2;
    }

    return val;
}


/**
 * Test to see if we have touched this connector
 * @param x Mouse X
 * @param y Mouse Y
 * @return true if touched
 */
Connector.prototype.touch = function(x, y) {
    var loc = this.getLoc();
    var touchRange = this.touchRange;

    if(x >= loc.x - touchRange && x <= loc.x + touchRange &&
        y >= loc.y - touchRange && y <= loc.y + touchRange) {
        return true;
    }

    return false;
};

/**
 * Get the x,y location of the connection
 * @returns Object with x,y
 */
Connector.prototype.getLoc = function() {
    switch(this.orientation) {
        case 'w':
            return new Vector(this.component.x + this.x - this.len, this.component.y + this.y);

        case 'n':
            return new Vector(this.component.x + this.x, this.component.y + this.y - this.len);

        case 's':
            return new Vector(this.component.x + this.x, this.component.y + this.y + this.len);

        case 'e':
            return new Vector(this.component.x + this.x + this.len, this.component.y + this.y);
    }

};

/**
 * Draw the connector
 * @param context The display context
 * @param view View object we are drawing in
 */
Connector.prototype.draw = function(context, view) {
    var x = this.component.x + this.x;
    var y = this.component.y + this.y;

    if(this.bus) {
        context.lineWidth = 2;
    } else {
        context.lineWidth = 1;
    }

    switch(this.orientation) {
        case 'e':
            context.beginPath();
            context.moveTo(x, y + 0.5);
            context.lineTo(x + this.len, y + 0.5);
            context.fillRect(x + this.len - 1, y - 1, 3, 3);

            if(this.component.circuit.circuits.showOutputStates) {
                context.font = "11px Times";
                context.textAlign = "left";
                var value = this.getAsString();
                if(value.length > 8) {
                    value = parseInt(value, 2);
                    if(isNaN(value)) {
                        value = "?";
                    } else {
                        value = Util.toHex(value, 4);
                    }
                }
                context.fillText(value, x+5, y-2);
            }

            if(this.name !== undefined) {
                context.font = "12px Times";
                context.textAlign = "right";
                context.fillText(this.name, x-3, y+3);
            }

            context.stroke();

            break;
        
        case 'w':
            // Left side - to west
            context.beginPath();
            context.moveTo(x, y + 0.5);
            context.lineTo(x - this.len, y + 0.5);
            context.fillRect(x - this.len - 1, y - 1, 3, 3);

            if(this.clock) {
                var clockSize = 7;
                context.moveTo(x, y - clockSize);
                context.lineTo(x + clockSize, y);
                context.lineTo(x, y + clockSize);
            }

            if(this.name !== undefined) {
                context.font = "12px Times";
                context.textAlign = "left";
                context.fillText(this.name, x+2, y+3);
            }

            context.stroke();
            break;

        case 'n':
            // Top side, to north
            context.beginPath();
            context.moveTo(x + 0.5, y);
            context.lineTo(x + 0.5, y - this.len);
            context.fillRect(x - 1, y - this.len - 1, 3, 3);

            if(this.clock) {
                var clockSize = 7;
                context.moveTo(x - clockSize, y);
                context.lineTo(x, y + clockSize);
                context.lineTo(x + clockSize, y);
            }

            context.stroke();

            if(this.name !== undefined) {
                y += this.clock ? 12 + clockSize : 12;

                context.font = "12px Times";
                context.textAlign = "center";
                context.fillText(this.name, x, y);
            }
            break;

        case 's':
            // Bottom side, to sound
            context.beginPath();
            context.moveTo(x + 0.5, y);
            context.lineTo(x + 0.5, y + this.len);
            context.fillRect(x - 1, y + this.len - 1, 3, 3);

            if(this.clock) {
                var clockSize = 7;
                context.moveTo(x - clockSize, y);
                context.lineTo(x, y - clockSize);
                context.lineTo(x + clockSize, y);
            }

            context.stroke();

            if(this.name !== undefined) {
                y -= this.clock ? 6 + clockSize : 6;

                context.font = "12px Times";
                context.textAlign = "center";
                context.fillText(this.name, x, y);
            }
            break;
    }

    context.lineWidth = 1;
}

export default Connector;
