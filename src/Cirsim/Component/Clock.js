import {Component} from '../Component';
import {ComponentPropertiesDlg} from '../Dlg/ComponentPropertiesDlg';

/**
 * Component: Clock generator
 * @param name The name to assign to the component
 * @constructor
 */
export const Clock = function() {
    Component.call(this);

    this.height = 44;
    this.width = 44;

    this.freq = 1000000;
    this.period = 0.5;

    this.addOut(22, 0, 10);
    this.set(true);
    this.remaining = (1 / this.freq) * this.period;
};

Clock.prototype = Object.create(Component.prototype);
Clock.prototype.constructor = Clock;

Clock.prototype.prefix = "C";
Clock.type = "Clock";            ///< Name to use in files
Clock.label = "Clock";           ///< Label for the palette
Clock.desc = "Clock";            ///< Description for the palette
Clock.img = "clock.png";         ///< Image to use for the palette
Clock.order = 41;               ///< Order of presentation in the palette
Clock.description = '<h2>Clock</h2><p>A clock generates a sequence of pulses' +
    ' over time. The duty cycle is the width of the true period of the pulse as a percentage.</p>';

/**
 * Clone this component object.
 * @returns {Clock}
 */
Clock.prototype.clone = function() {
    let copy = new Clock();
    copy.freq = this.freq;
    copy.period = this.period;
    copy.value = this.value;
    copy.remaining = this.remaining;
    copy.copyFrom(this);
    return copy;
};

/**
 * Advance the animation for this component by delta seconds
 * @param delta Time to advance in seconds
 * @returns true if animation needs to be redrawn
 */
Clock.prototype.advance = function(delta) {
    this.remaining -= delta;
    if(this.remaining <= 0) {
        this.set(!this.value);
        this.remaining = (1 / this.freq) * (this.value ? this.period : (1 - this.period));
        return true;
    } else {
        return false;
    }
};

/**
 * Set the value for the input
 * @param value true for on
 */
Clock.prototype.set = function(value) {
    this.value = value;
    this.outs[0].set(value);
};

Clock.prototype.get = function() {
    return this.value;
};


/**
 * Compute the gate result
 * @param state
 */
Clock.prototype.compute = function(state) {
    this.set(false);
};

/**
 * Load this object from an object converted from JSON
 * @param obj Object from JSON
 */
Clock.prototype.load = function(obj) {
    this.freq = obj["freq"];
    this.period = obj["period"];
    Component.prototype.load.call(this, obj);
};


/**
 * Create a save object suitable for conversion to JSON for export.
 * @returns {*}
 */
Clock.prototype.save = function() {
    var obj = Component.prototype.save.call(this);
    obj.freq = this.freq;
    obj.period = this.period;
    return obj;
};



/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
Clock.prototype.draw = function(context, view) {
    this.selectStyle(context, view);

    let x = this.x;
	let y = this.y;


    context.beginPath();
    context.arc(x, y, this.width/2, 0, Math.PI*2);
    context.fillStyle = '#ffffff';
    context.fill();

    context.beginPath();
    context.arc(x, y, this.width/2, 0, Math.PI*2);
    context.stroke();


    // Waveform
	let leftX = this.x - 15.5;
	let rightX = this.x + 15.5;
	let topY = this.y - 10.4;
	let botY = this.y + 10.5;
	let midX = leftX + this.period * (rightX - leftX);

	let save = context.strokeStyle;
    context.strokeStyle = "#00aa00";

    context.beginPath();

    context.moveTo(leftX, botY);
    context.lineTo(leftX, topY);
    context.lineTo(midX, topY);
    context.lineTo(midX, botY);
    context.lineTo(rightX, botY);

    // Name
    if(this.naming !== null) {
        context.font = "14px Times";
        context.textAlign = "center";
        context.fillText(this.naming, this.x-2, this.y + 5);
    }

    context.stroke();
    context.strokeStyle = save;

    this.drawIO(context, view);
}

Clock.prototype.properties = function(main) {
    const dlg = new ComponentPropertiesDlg(this, main);
    const freqId = dlg.uniqueId();
    const sliderId = dlg.uniqueId();

	let html = `<div class="control"><label for="${freqId}">Frequency (Hz)</label>
<input type="text" id="${freqId}" value="${this.freq}"></div>
<div class="control slider"><label for="${sliderId}">Duty Cycle</label>
<input type="range" min="100" max="900" class="" value="${this.period * 1000}" id="${sliderId}">
</div>`;

    dlg.extra(html, () => {
    	let freq = document.getElementById(freqId).value;
        if(+freq !== parseInt(freq)) {
            return "Frequency must be integer 1 to 1000000";
        }
        if(freq < 1 || freq > 10000000) {
            return "Frequency must be integer 1 to 1000000";
        }
        return null;
    }, () => {
        this.freq = document.getElementById(freqId).value;
        this.period = document.getElementById(sliderId).value * 0.001;
    });

    dlg.open();
}
