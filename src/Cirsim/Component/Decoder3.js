/**
 * Component: 3-8 decoder
 */
import Component from '../Component.js';

var Decoder3 = function() {
    Component.call(this);

    this.height = 100;
    this.width = 48;

    // Size in bits
    this.size = 8;

    // Size output and one input
    this.circuitOuts = [];
    this.addIn(-this.width/2, 0, 16, "In").bus = true;
    this.ensureIO();
};

Decoder3.prototype = Object.create(Component.prototype);
Decoder3.prototype.constructor = Decoder3;

Decoder3.prototype.prefix = null;

Decoder3.type = "Decoder3";            ///< Name to use in files
Decoder3.label = "3-to-8";           ///< Label for the palette
Decoder3.desc = "3-to-8 Decoder";       ///< Description for the palette
Decoder3.img = "decoder3.png";         ///< Image to use for the palette
Decoder3.description = `<h2>3-to-8 decoder</h2>
<p>Converts a 3-bit binary value on <strong>In</strong> to a true on one of eight output lines.</p>`;
Decoder3.order = 309;

/**
 * Compute the gate result
 * @param state
 */
Decoder3.prototype.compute = function(state) {
    if(Array.isArray(state[0])) {
        var c = (state[0][0] ? 1 : 0) + (state[0][1] ? 2 : 0) +(state[0][2] ? 4 : 0);
        for(var i=0; i<this.size; i++) {
            this.outs[i].set(i == c);
        }
    } else {
        for(var i=0; i<this.size; i++) {
            this.outs[i].set(undefined);
        }
    }
};



/**
 * Clone this component object.
 * @returns {Decoder3}
 */
Decoder3.prototype.clone = function() {
    var copy = new Decoder3();
    copy.copyFrom(this);
    return copy;
};


/**
 * Ensure the actual number of inputs matches the
 * defined bus size.
 */
Decoder3.prototype.ensureIO = function() {
    var spacing = 16;

    this.height = this.size * spacing + 24;
    if(this.height < 80) {
        this.height = 80;
    }

    var x = this.width / 2;

    var startY = this.size / 2 * spacing - 8;

    for(var i=0; i<this.size; i++) {
        if(i >= this.outs.length) {
            break;
        }

        this.outs[i].name = "O" + i;
        this.outs[i].x = x;
        this.outs[i].y = startY - i * spacing;
        this.outs[i].len = 16;
    }

    // Add any new pins
    for(; i<this.size; i++) {
        this.addOut(x, startY - i * spacing, 16, "O" + i);
    }

    // Delete pins that have ceased to exist
    if(i < this.outs.length) {
        for( ; i<this.outs.length; i++) {
            this.outs[i].clear();
        }

        this.outs.splice(this.size);
    }
}

/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
Decoder3.prototype.draw = function(context, view) {
    this.selectStyle(context, view);

    var leftX = this.x - this.width/2 - 0.5;
    var rightX = this.x + this.width/2 + 0.5;
    var topY = this.y - this.height/2 - 0.5;
    var botY = this.y + this.height/2 + 0.5;

    this.drawBox(context);

    // Left side
    //context.beginPath();

    context.font = "12px Times";
    context.textAlign = "center";
    context.fillText("decoder", this.x, this.y + this.height/2 - 2);

   // context.stroke();

    this.drawIO(context, view);
};

export default Decoder3;

