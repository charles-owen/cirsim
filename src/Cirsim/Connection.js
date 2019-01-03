
import {Selectable} from './Selectable';
import {Bend} from './Bend';
import {Vector} from './Utility/Vector';

/**
 * Connections from an In to an Out
 * @param from From (Out)
 * @param to To (In)
 * @param noset If true, do not call .set on the to device.
 *
 * The noset option is used by the clone function to create a
 * copy without causing a new simulation event.
 * @constructor
 */
export const Connection = function(from, to, noset) {
    Selectable.call(this);

    this.touchRange = 8;
    this.bends = [];

    if(from !== null) {
        this.circuit = from.component.circuit;
        this.from = from;
        this.from.add(this);
        if(to === null) {
            var loc = from.getLoc();
            this.x = loc.x;
            this.y = loc.y;
        }
    } else {
        this.from = null;
    }

    if(to !== null) {
        this.circuit = to.component.circuit;
        this.to = to;
        this.to.add(this);
        if(from === null) {
            var loc = to.getLoc();
            this.x = loc.x;
            this.y = loc.y;
        }

        if(noset !== true) {
            to.set();
        }
    } else {
        this.to = null;
    }
};

Connection.prototype = Object.create(Selectable.prototype);
Connection.prototype.constructor = Connection;

/**
 * Clone this connection, create a connection on the prev circuit objects.
 * @returns {Connection}
 */
Connection.prototype.clone = function() {
    if(this.from === null || this.to === null) {
        return null;
    }

    // Get the new component object
    var from = this.from.component.prev;
    var to = this.to.component.prev;
    var fromNdx = this.from.index;
    var toNdx = this.to.index;

    var copyConn = new Connection(from.outs[fromNdx], to.ins[toNdx], true);

    // Copy the bends
    for(var l=0; l<this.bends.length; l++) {
        var copyBend = this.bends[l].clone();
        copyConn.addBend(copyBend);
    }

    return copyConn;
};

/**
 * Delete this connection, removing it from the circuit.
 * @param caller Calling object. We don't remove ourselves from
 * that object.
 */
Connection.prototype.delete = function(caller) {
    var to = this.to;

    if(this.to !== null && this.to !== caller) {
        this.to.remove(this);
    }

    if(this.from !== null && this.from !== caller) {
        this.from.remove(this);
    }

    if(to !== null) {
        to.set();
    }
};

Connection.prototype.removeBend = function(bend) {
    var newBend = [];
    this.bends.forEach(function(value) {
        if(value !== bend) {
            newBend.push(value);
        }
    });

    this.bends = newBend;
};

/**
 * Get the circuit this connection is associated with
 * @returns Circuit object or null
 */
Connection.prototype.getCircuit = function() {
    if(this.from !== null) {
        return this.from.component.circuit;
    }

    if(this.to !== null){
        return this.to.component.circuit;
    }

    return null;
};

Connection.prototype.drop = function() {
    if(this.from !== null && this.to === null) {
        // Dropping the end on an output?
        var circuit = this.from.component.circuit;
        var inObj = circuit.touchIn(this.x, this.y);
        if(inObj !== null && this.from.bus === inObj.bus) {
            inObj.setConnection(this);
        } else {
            this.from.remove(this);
        }
    } else if(this.from === null && this.to !== null) {
        // Dropping the end of an input?
        var circuit = this.to.component.circuit;
        var outObj = circuit.touchOut(this.x, this.y);
        if(outObj !== null && this.to.bus === outObj.bus) {
            this.from = outObj;
            outObj.add(this);
            this.to.set();

        } else {
            this.to.remove(this);
        }
    }
};

Connection.prototype.draw = function(context, view) {
    this.selectStyle(context, view);
    context.beginPath();
    if(this.from !== null) {
        var loc = this.from.getLoc();
        context.moveTo(loc.x + 0.5, loc.y + 0.5);
    } else {
        context.moveTo(this.x + 0.5, this.y + 0.5);
    }

    // The bends...
    for(var i=0; i<this.bends.length; i++) {
        var bend = this.bends[i];
        context.lineTo(bend.x + 0.5, bend.y + 0.5);
    }

    if(this.to !== null) {
        var loc = this.to.getLoc();
        context.lineTo(loc.x + 0.5, loc.y + 0.5);
    } else {
        context.lineTo(this.x + 0.5, this.y + 0.5);
    }

    context.stroke();

    for(var i=0; i<this.bends.length; i++) {
        this.bends[i].draw(context, view);
    }
};

/**
 * Determine if we have touched this connection
 * @param x
 * @param y
 * @returns Connection or Bend or null
 */
Connection.prototype.touch = function(x, y) {
    // Handle any missing ends
    var from = this.from !== null ? this.from : new Vector(x, y);
    var to = this.to !== null ? this.to : new Vector(x, y);

    // Are we touching a bend?
    for(var i=0; i<this.bends.length; i++) {
        var bend = this.bends[i];
        if(bend.touch(x, y)) {
            return bend;
        }
    }

    var p1 = from.getLoc();
    for(i=0; i<this.bends.length; i++) {
        var p2 = this.bends[i];
        var d = Vector.distanceToLineSegment({x: x, y: y}, p1, p2);
        if(d.d <= this.touchRange) {
            return this;
        }

        p1 = p2;
    }

    var d = Vector.distanceToLineSegment({x: x, y: y}, p1, to.getLoc());
    return (d.d <= this.touchRange) ? this : null;
};

/**
 * Collect all bends that
 * are contained in the rectangle.
 * @param rect Rectangle to test
 * @param collect Collection (array) to add items to.
 */
Connection.prototype.selectRect = function(rect, collect) {
    // Are we touching a bend?
    for(var i=0; i<this.bends.length; i++) {
        var bend = this.bends[i];
        if(rect.contains(bend.x, bend.y)) {
            collect.push(bend);
        }
    }
};

/**
 * A selected connection that we try to drag will create
 * a new bending point.
 * @returns null
 */
Connection.prototype.spawn = function(x, y) {
    if(this.to !== null && this.from !== null) {
        // Determine the segment we are closest to.
        var closest = 0;
        var closestD = 1e10;

        var p1 = this.from.getLoc();
        for(var i=0; i<this.bends.length; i++) {
            var p2 = this.bends[i];
            var d = Vector.distanceToLineSegment({x: x, y: y}, p1, p2);
            if(d.d <= closestD) {
                closest = i;
                closestD = d.d;
            }

            p1 = p2;
        }

        var d = Vector.distanceToLineSegment({x: x, y: y}, p1, this.to.getLoc());
        if(d.d <= closestD) {
            closest = i;
            closestD = d.d;
        }

        // Create the bend
        var bend = new Bend();

        if(closest < this.bends.length) {
            // Insert into list of bends
            this.insertBend(closest, bend);
        } else {
            this.addBend(bend);
        }

        bend.place(x, y);

        return bend;
    } else {
        return null;
    }
};

Connection.prototype.insertBend = function(before, bend) {
    bend.connection = this;
    bend.circuit = this.circuit;
    this.bends.splice(before, 0, bend);
};


Connection.prototype.addBend = function(bend) {
    bend.connection = this;
    bend.circuit = this.circuit;
    this.bends.push(bend);
};

/**
 * Save this connection as an object suitable for conversion to JSON
 * @returns Object
 */
Connection.prototype.save = function() {
    if(this.from === null || this.to === null) {
        return null;
    }

    // Get the component objects
    var from = this.from.component;
    var to = this.to.component;
    var fromNdx = this.from.index;
    var toNdx = this.to.index;

    // And the bends
    var bends = [];
    for(var i=0; i<this.bends.length; i++) {
        var bend = this.bends[i];
        bends.push(bend.save());
    }

    return {"from": from.id, "out": fromNdx, "to": to.id, "in": toNdx, "bends": bends};
};

Connection.prototype.load = function(obj) {
    var that = this;

    obj["bends"].forEach(function(bendObj) {
        var bend = new Bend(bendObj["x"], bendObj["y"]);
        that.addBend(bend);
    });
};

export default Connection;
