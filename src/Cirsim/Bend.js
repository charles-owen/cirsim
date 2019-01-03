import {Selectable} from './Selectable';

/**
 * Object that represents a bend in a connection line.
 * @constructor
 */
export const Bend = function(x, y) {
    Selectable.call(this);
    this.connection = null;     // Connection this bend is associated with

    if(x !== undefined) {
        this.x = x;
        this.moveX = x;
    }

    if(y !== undefined) {
        this.y = y;
        this.moveY = y;
    }
};

Bend.prototype = Object.create(Selectable.prototype);
Bend.prototype.constructor = Bend;

Bend.prototype.touchRange = 12;
Bend.prototype.size = 4;

Bend.prototype.clone = function() {
    var copy = new Bend();
    copy.copyFrom(this);
    return copy;
};

Bend.prototype.draw = function(context, view) {
    if(view.selection.isSelected(this)) {
        this.selectStyle(context, view);

        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        context.fill();
    }
};

/**
 * Determine if we have touched this bend
 * @param x
 * @param y
 * @returns {boolean}
 */
Bend.prototype.touch = function(x, y) {
    return (Math.abs(x - this.x) + Math.abs(y - this.y)) <= this.touchRange;
};

/**
 * Delete this bend, removing it from the connection.
 * @param caller Calling object.
 * that object.
 */
Bend.prototype.delete = function(caller) {
    this.connection.removeBend(this);
};

/**
 * Save this bend as an object suitable for conversion to JSON
 * @returns {{x: *, y: *}}
 */
Bend.prototype.save = function() {
    return {"x": this.x, "y": this.y};
};
