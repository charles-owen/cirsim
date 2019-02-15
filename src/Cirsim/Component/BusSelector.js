import {Component} from '../Component';
import {ComponentPropertiesDlg} from '../Dlg/ComponentPropertiesDlg';

/**
 * Component: BusSelector
 * A Bus Selector chooses some range of signals from an input
 * bus to output as a subset bus.

 * @constructor
 */
export const BusSelector = function() {
    Component.call(this);

    this.height = 16;
    this.width = 96;

    this.from = 0;      // Low order bit to select
    this.to = 1;        // High order bit to select

    // One input
    this.addIn(-48, 0, 16).bus=true;

    // One output
    this.addOut(48, 0, 16).bus=true;
};

BusSelector.prototype = Object.create(Component.prototype);
BusSelector.prototype.constructor = BusSelector;

BusSelector.prototype.prefix = null;

BusSelector.type = "BusSelector";        ///< Name to use in files
BusSelector.label = "Bus Selector";          ///< Label for the palette
BusSelector.desc = "Bus Subset Selector";    ///< Description for the palette
BusSelector.img = "busselector.png";       ///< Image to use for the palette
BusSelector.description = `<h2>Bus Selector</h2><p>A Bus Selector chooses some 
range of bits from an input bus and feeds them to an output bus. This is a  tool 
to use to select fields from a bus.</p>
<p>If configured as 4 to 8 (8:4 on the symbol), bits 4-8 becomes bits 0-4 on
the output bus. The output is a bus if more than one bit is selected and is a bit 
if only one bit is selected.</p>`;
BusSelector.order = 310;
BusSelector.help = 'busselector';

/**
 * Clone this component object.
 * @returns {BusSelector}
 */
BusSelector.prototype.clone = function() {
    var copy = new BusSelector();
    copy.copyFrom(this);
    copy.from = this.from;
    copy.to = this.to;
    return copy;
};

/**
 * Compute.
 *
 * Force the output to the current set value.
 * Since there are no inputs, state is ignored.
 * @param state
 */
BusSelector.prototype.compute = function(state) {
    // Test for the state undefined
    if(state[0] === undefined) {
        this.outs[0].set(undefined);
        return;
    }

    if(this.from == this.to) {
        // Single-bit output
        this.outs[0].set(state[0][this.from]);
    } else {
        // Bus output
        var value = [];
        for(var i=this.from;  i<=this.to; i++) {
            value.push(state[0][i]);
        }

        this.outs[0].set(value);
    }
};

/**
 * Draw the component.
 * @param context Display context
 * @param view View object
 */
BusSelector.prototype.draw = function(context, view) {
    // Component background
    this.outlinePath(context);
    context.fillStyle = "#dddddd";
    context.fill();

    // Select the style to draw the rest
    this.selectStyle(context, view);

    // Box for the component
    this.outlinePath(context);
    context.stroke();

    context.font = "14px Times";
    context.textAlign = "center";

    context.fillText("" + this.to + ":" + this.from, this.x, this.y + 5);

    this.drawIO(context, view);
};

BusSelector.prototype.outlinePath = function(context) {
    var leftX = this.x - this.width/2 - 0.5;
    var rightX = this.x + this.width/2 + 0.5;
    var topY = this.y - this.height/2 - 0.5;
    var botY = this.y + this.height/2 + 0.5;

    context.beginPath();
    context.moveTo(leftX + this.height/2, topY);
    context.lineTo(leftX, this.y);
    context.lineTo(leftX + this.height/2, botY);
    context.lineTo(rightX - this.height/2, botY);
    context.lineTo(rightX, this.y);
    context.lineTo(rightX - this.height/2, topY);
    context.lineTo(leftX + this.height/2, topY);
};


/**
 * Create a save object suitable for conversion to JSON for export.
 * @returns {*}
 */
BusSelector.prototype.save = function() {
    var obj = Component.prototype.save.call(this);
    obj.from = this.from;
    obj.to = this.to;
    return obj;
};

/**
 * Load this object from an object converted from JSON
 * @param obj Object from JSON
 */
BusSelector.prototype.load = function(obj) {
    this.from = obj['from'];
    this.to = obj['to'];
    Component.prototype.load.call(this, obj);
    this.ensureIO();
};

BusSelector.prototype.ensureIO = function() {
    this.outs[0].bus = this.from != this.to;
}

BusSelector.prototype.properties = function(main) {
    var dlg = new ComponentPropertiesDlg(this, main);
    var fmId = dlg.uniqueId();
    var toId = dlg.uniqueId();

    var html = `<div class="control1 center gap">
<input class="number" type="text" name="${fmId}" id="${fmId}" value="${this.from}" spellcheck="false" onfocus="this.select()"> 
<label for="${toId}">to </label>
<input class="number" type="text" name="${toId}" id="${toId}" value="${this.to}" spellcheck="false" onfocus="this.select()"></div>`;

    /* '<p>From:<br>' +
        '</p>' +
        '<p>To:<br>' +
        '<input type="text" name="selector-to" value="' + this.to +
        '" spellcheck="false"></p>'; */

    dlg.extra(html, () => {
        let fromStr = document.getElementById(fmId).value;
        let toStr = document.getElementById(toId).value;
        var from = parseInt(fromStr);
        var to = parseInt(toStr);
        if(isNaN(from) || from < 0 || from > 32) {
	        document.getElementById(fmId).select();
            return "Invalid from value";
        }
        if(isNaN(to) || to < 0 || to > 32) {
	        document.getElementById(toId).select();
            return "Invalid to value";
        }

        if(from > to) {
	        document.getElementById(fmId).select();
            return "Invalid values, <em>from</em> must be less than or equal to <em>to</em>."
        }

        return null;
    }, () => {
	    let fromstr = document.getElementById(fmId).value;
	    let tostr = document.getElementById(toId).value;
	    this.from = parseInt(fromstr);
        this.to = parseInt(tostr);
        this.ensureIO();
        this.pending();
    });

    dlg.open();
};
