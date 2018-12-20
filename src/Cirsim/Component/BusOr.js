
import {Component} from '../Component';
import {ComponentPropertiesDlg} from '../Dlg/ComponentPropertiesDlg';

/**
 * Component: Bus OR gate
 * @param name Component name
 * @constructor
 */
export const BusOr = function(name) {
    Component.call(this, name);

    this.height = 50;
    this.width = 80;

    this.size = 4;

    this.addOut(this.width/2, 0, 16).bus = true;

    this.ensureIO();
};

BusOr.prototype = Object.create(Component.prototype);
BusOr.prototype.constructor = BusOr;

BusOr.type = "BusOr";            ///< Name to use in files
BusOr.label = "Bus OR";           ///< Label for the palette
BusOr.desc = "Bus OR gate";       ///< Description for the palette
BusOr.img = "busor.png";         ///< Image to use for the palette
BusOr.description = `<h2>Bus OR Gate</h2><p>The output of an OR gate is <em>true</em> 
if either or both  inputs are true. Otherwise, it is false. This version works for 
buses. The size determines the number of inputs.</p>`;
BusOr.order = 107;


/**
 * Compute the gate result
 * @param state
 */
BusOr.prototype.compute = function(state) {
    var result = [];
    state.forEach(function(s) {
        if(Array.isArray(s)) {
            for(var i=0; i<s.length; i++) {
                var v = s[i];
                if(result.length > i) {
                    if(v === true) {
                        result[i] = true;
                    }
                } else {
                    result.push(v);
                }
            }
        }
    });

    this.outs[0].set(result);
};

/**
 * Clone this component object.
 * @returns {BusOr}
 */
BusOr.prototype.clone = function() {
    var copy = new BusOr();
    copy.size = this.size;
    copy.ensureIO();
    copy.copyFrom(this);
    return copy;
};

/**
 * Load this object from an object converted from JSON
 * @param obj Object from JSON
 */
BusOr.prototype.load = function(obj) {
    this.size = obj["size"];
    this.ensureIO();
    Component.prototype.load.call(this, obj);
};


/**
 * Create a save object suitable for conversion to JSON for export.
 * @returns {*}
 */
BusOr.prototype.save = function() {
    var obj = Component.prototype.save.call(this);
    obj.size = this.size;
    return obj;
};

/**
 * Ensure the actual number of inputs matches the
 * defined bus size.
 */
BusOr.prototype.ensureIO = function() {
    var spacing = 16;

    this.height = this.size * spacing + 8;
    if(this.height < 50) {
        this.height = 50;
    }

    var startY = this.size / 2 * spacing - 8;

    for(var i=0; i<this.size; i++) {
        //
        // This math computes the location of the pins
        // relative to the arc on the left side of the OR gate
        //
        var offset = this.size * 30;
        var a = Math.atan2(this.height/2, offset);
        var r = offset / Math.cos(a);
        var pinY = startY - i * spacing;
        var pinX = Math.sqrt(r*r - pinY*pinY) - offset;

        if(i < this.ins.length) {
            this.ins[i].x = -this.width / 2 + pinX;
            this.ins[i].y = pinY;
            this.ins[i].len = 16 + pinX;
            this.ins[i].bus = true;
        } else {
            // Add any new pins
            this.addIn(-this.width / 2 + pinX,
                startY - i * spacing,
                16 + pinX).bus = true;
        }
    }


    for(; i<this.size; i++) {

    }

    // Delete pins that have ceased to exist
    if(i < this.ins.length) {
        for( ; i<this.ins.length; i++) {
            this.ins[i].clear();
        }

        this.ins.splice(this.size);
    }
}



/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
BusOr.prototype.draw = function(context, view) {
    this.selectStyle(context, view);

    var h = this.height;
    var w = this.width;

    var leftX = this.x - w/2 - 0.5;
    var rightX = this.x + w/2 + 0.5;
    var topY = this.y - h/2 - 0.5;
    var botY = this.y + h/2 + 0.5;

    context.beginPath();

    // Left side
    var offsetX = this.size * 30;
    var a = Math.atan2(h/2, offsetX);
    var r = offsetX / Math.cos(a);
    context.arc(leftX - offsetX, this.y, r, -a, a);

    // Top
    var offsetY = ((w/2)*(w/2) - (h/2)*(h/2)) / h;
    r = h/2 + offsetY;
    a = Math.atan2(offsetY, w/2);

    context.moveTo(leftX, topY);
    context.lineTo(this.x - this.width/4, topY);
    context.bezierCurveTo(this.x + this.width/4, topY,
        this.x + 3 * this.width/8, this.y - this.height/4, this.x + this.width/2, this.y);
    context.moveTo(leftX, botY);
    context.lineTo(this.x - this.width/4, botY);
    context.bezierCurveTo(this.x + this.width/4, botY,
        this.x + 3 * this.width/8, this.y + this.height/4, this.x + this.width/2, this.y);

    context.stroke();

    this.drawName(context, -2, 5);
    this.drawIO(context, view);
};

BusOr.prototype.properties = function(main) {
    var dlg = new ComponentPropertiesDlg(this, main);
    var id = dlg.uniqueId();
    var html = `<div class="control1 center"><label for="${id}">Size: </label>
<input class="number" type="text" name="${id}" id="${id}" value="${this.size}"></div>`;

    dlg.extra(html, () => {
        let size = parseInt(document.getElementById(id).value);
        if(isNaN(size) || size < 2 || size > 16) {
            return "Size must be an integer from 2 to 16";
        }
        return null;
    }, () => {
        this.size = parseInt(document.getElementById(id).value);
        this.ensureIO();
    });

    dlg.open();
};
