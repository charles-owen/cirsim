import {Out} from './Out';

/**
 * Out connection for a component/inverted
 * @param component Component this connector is for
 * @param x Relative x on the component
 * @param y Relative y on the component
 * @param len Length in pixels to draw the connector
 * @param name Name to draw next to the connector
 * @param inv True (optional) if connector has a circle (inverse)
 * @constructor
 */
export const OutInv = function(component, x, y, len, name, inv) {
    Out.call(this, component, x, y, len, name, inv);
};

OutInv.prototype = Object.create(Out.prototype);
OutInv.prototype.constructor = OutInv;

OutInv.prototype.draw = function(context, view) {
    /*
     * Draw the pin
     */
    var x = this.component.x + this.x;
    var y = this.component.y + this.y;

    var notRad = 4;

    context.beginPath();
    context.arc(x + notRad + 0.5, y, notRad, 0, Math.PI * 2);
    context.moveTo(x + notRad * 2, y + 0.5);
    context.lineTo(x + this.len, y + 0.5);
    context.fillRect(x + this.len - 1, y - 1, 3, 3);

    if(this.component.circuit.circuits.showOutputStates) {
        context.font = "11px Times";
        context.fillText(this.value === undefined ? "?" : (this.value ? "1" : "0"),
            x+7+notRad*2,
            y-2);
    }

    context.stroke();

    if(this.name !== undefined) {
        context.font = "12px Times";
        context.textAlign = "right";
        context.fillText(this.name, x-3, y+3);

        if(this.inv) {
            y -= 8;
            context.beginPath();
            context.moveTo(x - 3, y);
            context.lineTo(x - 13, y);
            context.stroke();
        }
    }

    /*
     * Draw any connections
     */
    for(var i=0; i<this.to.length; i++) {
        this.to[i].draw(context, view);
    }
};

OutInv.prototype.set = function(value) {
    if(value === undefined) {
        Out.prototype.set.call(this, value);
    } else {
        Out.prototype.set.call(this, !value);
    }

};


