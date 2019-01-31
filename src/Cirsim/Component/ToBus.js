import {Component} from '../Component';
import {ComponentPropertiesDlg} from '../Dlg/ComponentPropertiesDlg';


/**
 * Component: Convert single-bit signals into a bus
 * @constructor
 */
export const ToBus = function() {
    Component.call(this);

    this.height = 80;
    this.width = 32;

    // Size in bits
    this.size = 4;

    this.circuitIns = [];
    this.addOut(this.width/2, 0, this.pinlength, "O").bus = true;

    this.ensureIO();
};

ToBus.prototype = Object.create(Component.prototype);
ToBus.prototype.constructor = ToBus;

ToBus.prototype.prefix = null;
ToBus.prototype.indent = 10;
ToBus.prototype.pinlength = 8;

ToBus.type = "ToBus";            ///< Name to use in files
ToBus.label = "To Bus";           ///< Label for the palette
ToBus.desc = "Single bits to a Bus";       ///< Description for the palette
ToBus.img = "tobus.png";         ///< Image to use for the palette
ToBus.order = 47;               ///< Order of presentation in the palette
ToBus.description = '<h2>To Bus</h2><p>Converts single bit inputs into a ' +
    'bus output to simplify circuits</p>';

/**
 * Compute the gate result
 * @param state
 */
ToBus.prototype.compute = function(state) {
    this.outs[0].set(state);
};

/**
 * Clone this component object.
 * @returns {ToBus}
 */
ToBus.prototype.clone = function() {
    var copy = new ToBus();
    copy.size = this.size;
    copy.ensureIO();
    copy.copyFrom(this);
    return copy;
};

/**
 * Load this object from an object converted from JSON
 * @param obj Object from JSON
 */
ToBus.prototype.load = function(obj) {
    this.size = obj["size"];
    this.ensureIO();
    Component.prototype.load.call(this, obj);
};


/**
 * Create a save object suitable for conversion to JSON for export.
 * @returns {*}
 */
ToBus.prototype.save = function() {
    var obj = Component.prototype.save.call(this);
    obj.size = this.size;
    return obj;
};


/**
 * Ensure the actual number of inputs matches the
 * defined bus size.
 */
ToBus.prototype.ensureIO = function() {
    var spacing = 16;

    this.height = this.size * spacing + 12;
    if(this.height < 48) {
        this.height = 48;
    }

    var x = this.width / 2;

    var startY = this.size / 2 * spacing - 8;

    for(var i=0; i<this.size; i++) {
        if(i >= this.ins.length) {
            break;
        }

        this.ins[i].name = "I" + i;
        this.ins[i].x = -x;
        this.ins[i].y = startY - i * spacing;
        this.ins[i].len = this.pinlength;
    }

    // Add any new pins
    for(; i<this.size; i++) {
        this.addIn(-x, startY - i * spacing, this.pinlength, "I" + i);
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
ToBus.prototype.draw = function(context, view) {
    this.selectStyle(context, view);
    this.drawTrap(context, 0, this.indent);
    this.drawIO(context, view);
};


ToBus.prototype.properties = function(main) {
    var that = this;

    var dlg = new ComponentPropertiesDlg(this, main);
    var id = dlg.uniqueId();

    var html =
        '<div class="control1 center gap"><label for="' + id + '">Size: </label><input class="number" type="text" id="' + id + '" value="' + this.size +
        '"></div>';

    dlg.extra(html, function() {
        var size = parseInt(document.getElementById(id).value);
        if(isNaN(size) || size < 2 || size > 16) {
            return "Size must be an integer from 2 to 16";
        }
        return null;
    }, function() {
        that.size = parseInt(document.getElementById(id).value);
        that.ensureIO();
        that.pending();
    });

    dlg.open();
	document.getElementById(id).select();
};
