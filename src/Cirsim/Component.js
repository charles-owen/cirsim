import {Selectable} from './Selectable';
import {In} from './In';
import {Out} from './Out';
import {OutInv} from './OutInv';
import {Connection} from './Connection';
import {ComponentPropertiesDlg} from './Dlg/ComponentPropertiesDlg';

import DOMPurify from 'dompurify';

/**
 * Base object for a component in a circuit
 * @constructor
 */
export const Component = function () {
    Selectable.call(this);

    this.height = 10;
    this.width = 10;
    this.prev = null;

    this.id = '';           // Will be set to a unique id for this component
    this.circuit = null;
    this.naming = null;     // Naming, as in U1 or I1

    this.ins = [];
    this.outs = [];
};

Component.prototype = Object.create(Selectable.prototype);
Component.prototype.constructor = Component;



/**
 * Prefix for component naming
 */
Component.prototype.prefix = "U";
Component.prototype.nameRequired = false;
Component.prototype.delay = 11;      ///< Propagation delay in nanoseconds

/**
 * Assign this component a unique ID. This is done when a
 * component is created by the view.
 */
Component.prototype.brand = function() {
	// Every component get a unique ID when it is created
	this.id = 'c' + (++Component.maxId);
}

/// Maximum ID integer value for any component
Component.maxId = 1000;

Component.prototype.copyFrom = function (component) {
    this.height = component.height;
    this.width = component.width;
    this.prev = component.prev;
    this.naming = component.naming;
    this.id = component.id;
    component.prev = this;
    Selectable.prototype.copyFrom.call(this, component);

    //
    // Copy input and output states
    //
    for (var i = 0; i < this.ins.length; i++) {
        this.ins[i].copyFrom(component.ins[i]);
    }

    for (var i = 0; i < this.outs.length; i++) {
        this.outs[i].copyFrom(component.outs[i]);
    }
};


Component.prototype.drop = function () {
    if (this.x < this.width / 2) {
        this.x = this.width / 2;
    }

    if (this.y < this.height / 2) {
        this.y = this.height / 2;
    }
};

Component.prototype.grab = function() {
    Selectable.prototype.grab.call(this);

    this.circuit.moveToFront(this);
}

Component.prototype.mouseUp = function () {

};

/**
 * Called when a component is added to a circuit
 * @param circuit
 */
Component.prototype.added = function (circuit) {
    this.circuit = circuit;

    if (this.naming === null && this.nameRequired) {
        // Create a new name
        for (var i = 1; ; i++) {
            let naming;
            if (this.prefix.charAt(0) === "*") {
                if (i <= 26) {
                    naming = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.charAt(i - 1);
                } else {
                    naming = this.prefix.charAt(1) + (i - 26);
                }
            } else {
                naming = this.prefix + i;
            }

            const existing = this.circuit.getComponentByNaming(naming);
            if (existing === null) {
                this.naming = naming;
                break;
            }
        }
    }
};

/**
 * Add an input to this component
 * @param x Relative X location
 * @param y Relative Y location
 * @param len Length of the line to draw for the input
 */
Component.prototype.addIn = function (x, y, len, name) {
    var inObj = new In(this, x, y, len, name);
    inObj.index = this.ins.length;
    this.ins.push(inObj);
    return inObj;
};

/**
 * Add an output to this component
 * @param x Relative X location
 * @param y Relative Y location
 * @param len Length of the line to draw for the output
 * @return Created output object
 */
Component.prototype.addOut = function (x, y, len, name, inv) {
    var outObj = new Out(this, x, y, len, name, inv);
    outObj.index = this.outs.length;
    this.outs.push(outObj);
    return outObj;
};

/**
 * Add an inverse output to this component
 * @param x Relative X location
 * @param y Relative Y location
 * @param len Length of the line to draw for the output
 * @return Created output object
 */
Component.prototype.addOutInv = function (x, y, len, name, inv) {
    var outObj = new OutInv(this, x, y, len, name, inv);
    outObj.index = this.outs.length;
    this.outs.push(outObj);
    return outObj;
};


/**
 * Try to touch this component or some part of
 * the component.
 * @param x Mouse X
 * @param y Mouse Y
 */
Component.prototype.touch = function (x, y) {
    // First, try to touch the inputs and outputs
    var touched = this.touchOut(x, y);
    if (touched !== null) {
        // We have touched an Out connector. Add a connection
        // for this output, but with no current "to"
        return new Connection(touched, null);
    }

    touched = this.touchIn(x, y);
    if (touched !== null) {
        // We have touched an In connector. Add a connection
        // for this input, but with no current "from"
        return new Connection(null, touched);
    }

    // Have we touched the component itself?
    if (x >= this.x - this.width / 2 &&
        x <= this.x + this.width / 2 &&
        y >= this.y - this.height / 2 &&
        y <= this.y + this.height / 2) {
        return this;
    }

    // Test if we have touched an output connection or bend
    for (var i = 0; i < this.outs.length; i++) {
        var conn = this.outs[i].touchConnections(x, y);
        if (conn !== null) {
            return conn;
        }
    }

    return null;
};

/**
 * Try to touch an Out object for this componenet
 * @param x
 * @param y
 * @return Out object touched or null if none
 */
Component.prototype.touchOut = function (x, y) {
    for (var i = 0; i < this.outs.length; i++) {
        if (this.outs[i].touch(x, y)) {
            return this.outs[i]
        }
    }

    return null;
};

/**
 * Try to touch an In object for this componenet
 * @param x
 * @param y
 * @return In object touched or null if none
 */
Component.prototype.touchIn = function (x, y) {
    for (var i = 0; i < this.ins.length; i++) {
        if (this.ins[i].touch(x, y)) {
            return this.ins[i]
        }
    }

    return null;
};

/**
 * Collect all of this component and any bends that
 * are contained in the rectangle.
 * @param rect Rectangle to test
 * @param collect Collection (array) to add items to.
 */
Component.prototype.inRect = function (rect, collect) {
    if (rect.contains(this.x, this.y)) {
        collect.push(this);
    }

    this.outs.forEach(function (out) {
        out.selectRect(rect, collect);
    });
};

Component.prototype.delete = function () {
    // Delete all connection
    for (var i = 0; i < this.ins.length; i++) {
        this.ins[i].clear();
    }

    for (var i = 0; i < this.outs.length; i++) {
        this.outs[i].clear();
    }

    this.circuit.delete(this);
};

/**
 * Draw component object.
 *
 * Default version for simple box objects
 * @param context Display context
 * @param view View object
 */
Component.prototype.draw = function(context, view) {
    this.selectStyle(context, view);
    this.drawBox(context);
    this.drawName(context, 0, 3);
    this.drawIO(context, view);
}

/**
 * Draw the input/output pins for this component.
 *
 * This also draws the connections.
 */
Component.prototype.drawIO = function (context, view) {
    for (var i = 0; i < this.ins.length; i++) {
        this.selectStyle(context, view);
        this.ins[i].draw(context, view);
    }

    for (var i = 0; i < this.outs.length; i++) {
        this.selectStyle(context, view);
        this.outs[i].draw(context, view);
    }
};

/**
 * Save the component basic properties to an object
 *
 * The character ' is replaced with `. This is so the
 * output JSON won't have any ' characters that would
 * cause problems in PHP and Javascript
 *
 * @returns {{id: *, x: *, y: *, name: string, type: *}}
 */
Component.prototype.save = function () {
    var type = this.constructor.type;
    var naming = this.naming;
    if (naming !== null) {
        naming = naming.replace(/'/g, '`');
    }
    return {
        "id": this.id,
        "x": this.x,
        "y": this.y,
        "name": naming, "type": type
    };
};

Component.prototype.load = function (obj) {
    this.id = this.sanitize(obj["id"]);

    // Determine the maximum loaded ID value as we load
    // in new components.
    const idValue = +this.id.substr(1);
    if(idValue > Component.maxId) {
        Component.maxId = idValue;
    }

    this.x = +obj["x"];
    this.y = +obj["y"];
    this.moveX = this.x;
    this.moveY = this.y;
    let naming = obj["name"];
    if (naming !== null) {
        this.naming = this.sanitize(naming).replace(/`/g, "'");
    } else {
        this.naming = null;
    }
};

Component.prototype.saveConnections = function () {
    var connections = [];

    for (var i = 0; i < this.outs.length; i++) {
        var out = this.outs[i];
        for (var j = 0; j < out.to.length; j++) {
            var conn = out.to[j];
            var connObj = conn.save();
            if (connObj !== null) {
                connections.push(connObj);
            }
        }
    }

    return connections;
};

Component.prototype.properties = function (main) {
    var dlg = new ComponentPropertiesDlg(this, main);
    dlg.open();
};

/**
 * Advance the animation for this component by delta seconds
 * @param delta Time to advance in seconds
 * @returns true if animation needs to be redrawn
 */
Component.prototype.advance = function (delta) {
    return false;
};


/**
 * This function is called when an input is changed on this
 * component. It indicates that we need to queue a simulation
 * event for this component.
 */
Component.prototype.pending = function () {
    var delay = this.delay * 0.1;
    var state = [];
    for (var i = 0; i < this.ins.length; i++) {
        state.push(this.ins[i].value);
    }

    if (this.circuit.circuits !== null) {
        this.circuit.circuits.simulation.queue(this, delay, state);
    }
};

/**
 * Determine the propagation delay for this device
 */
Component.prototype.getDelay = function () {
    return this.delay;
};

Component.prototype.compute = function (state) {
};

Component.prototype.newTab = function () {
};

/**
 * Draw the name of a component
 * @param context Context to draw on
 * @param x X location
 * @param y Y locatino
 * @param font Optional font to use
 */
Component.prototype.drawName = function (context, x, y, font) {
    // Name
    if (this.naming !== null) {
        context.beginPath();
        context.font = font !== undefined ? font : "14px Times";
        context.textAlign = "center";
        context.fillText(this.naming, this.x + x, this.y + y);
        context.stroke();
    }
};

/**
 * Draw text on a component
 * @param context Context to draw on
 * @param text Text to draw
 * @param x X location
 * @param y Y locatino
 * @param font Optional font to use
 */
Component.prototype.drawText = function (context, text, x, y, font) {
    context.beginPath();
    context.font = font !== undefined ? font : "14px Times";
    context.textAlign = "center";
    context.fillText(text, this.x + x, this.y + y);
    context.stroke();
}

/**
 * Many components are just a box. This is a function to draw that box
 * @param context Context to draw on
 */
Component.prototype.drawBox = function (context, fillStyle) {
    if(fillStyle !== 'none') {
        let save = context.fillStyle;
        context.fillStyle = fillStyle !== undefined ? fillStyle : '#ffffff';
        context.fillRect(this.x - this.width / 2 - 0.5,
            this.y - this.height / 2 - 0.5,
            this.width, this.height);
        context.fillStyle = save;
    }

    context.beginPath();
    context.rect(
        this.x - this.width / 2 - 0.5,
        this.y - this.height / 2 - 0.5,
        this.width, this.height);
    context.stroke();
}

/**
 * Many components are a trapezoid. This is a function to draw that trapezoid
 * @param context Conext to draw on
 * @param indentL Top/bottom indent size for left side (default = 0)
 * @param indentR Top/bottom indent size for right size (default = 20)
 */
Component.prototype.drawTrap = function (context, indentL, indentR) {
    if (indentL === undefined) {
        indentL = 0;
    }

    if (indentR === undefined) {
        indentR = 20;
    }

    var leftX = this.x - this.width / 2 - 0.5;
    var rightX = this.x + this.width / 2 + 0.5;
    var topY = this.y - this.height / 2 - 0.5;
    var botY = this.y + this.height / 2 + 0.5;

    context.fillStyle = '#ffffff';
    // Left side
    context.beginPath();
    context.moveTo(leftX, topY + indentL);
    context.lineTo(leftX, botY - indentL);

    // Bottom
    context.lineTo(rightX, botY - indentR);

    // Right side
    context.lineTo(rightX, topY + indentR);

    // Top
    context.lineTo(leftX, topY + indentL);

    context.fill();

    // Left side
    context.beginPath();
    context.moveTo(leftX, topY + indentL);
    context.lineTo(leftX, botY - indentL);

    // Bottom
    context.lineTo(rightX, botY - indentR);

    // Right side
    context.lineTo(rightX, topY + indentR);

    // Top
    context.lineTo(leftX, topY + indentL);

    context.stroke();
}

/**
 * Ability to send a command to a component.
 *
 * Commands are sent by tests.
 *
 * Default commands are...
 * type:InPinBus - Validates that a component is the correct type.
 *
 * @param null if not handled, or command result otherwise.
 */
Component.prototype.command = function (value) {
    if ((typeof value === 'string' || value instanceof String) &&
        value.substr(0, 5) === "type:") {
        var expected = value.substr(5);
        if (expected !== this.constructor.type) {
            //
            // TODO: This use of getComponent will have to be fixed
            //
            var expectedType = getComponent(expected);
            if (expectedType !== null) {
                expectedType = expectedType.label;
            } else {
                expectedType = expected;
            }

            return {
                ok: false,
                msg: "Component " + this.naming + " should be type <strong>" +
                expectedType + "</strong> but is <strong>" +
                this.constructor.label + "</strong>"
            }
        }
    } else {
        return null;
    }

    return {ok: true};
}

/**
 * Override in the settable types, such as InPin and InPinBus
 * @param value Value to set
 */
Component.prototype.setAsString = function (value) {
}


/**
 * Draw a jagged (stair-step) line from x1,y1 to x2,y2
 * @param context Context to draw on
 * @param x1 Starting x
 * @param y1 Starting y
 * @param x2 Ending x
 * @param y2 Ending y
 * @param t Percentage of say from x1 to x2 the vertical line is
 */
Component.prototype.jaggedLine = function (context, x1, y1, x2, y2, t) {
    var xh = Math.round(x1 + (x2 - x1) * t) + 0.5;
    y1 += 0.5;
    y2 += 0.5;

    context.moveTo(x1, y1);
    context.lineTo(xh, y1);
    context.lineTo(xh, y2)
    context.lineTo(x2, y2);
    context.stroke();
}


/**
 * Sanitize text from user input and files to prevent XSS attacks.
 * @param text Text to sanitize
 * @returns Sanitized version
 */
Component.prototype.sanitize = function(text) {
    return DOMPurify.sanitize(text);
}
