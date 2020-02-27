import {Component} from '../Component';
import {Button} from '../Graphics/Button';
import {CanvasHelper} from '../Graphics/CanvasHelper';
import {Value} from '../Value';
import {ComponentPropertiesDlg} from '../Dlg/ComponentPropertiesDlg';
import {Clock} from "./Clock";
import {DFF} from "./DFF";

/**
 * Component: Pad
 * Configurable keypad for button presses

 * @constructor
 */
export const Pad = function() {
    Component.call(this);

    this.height = 150;
    this.width = 150;
    this.value = new Value();
    this.bus = true;
    this.bits = 4;
    this.clockDelay = 0;

    // The type of pad, null until we define it
    this.pad = null;

    this.setType(16);
    this.setAsInteger(0);
    this.setPressedOut(false);
};

Pad.prototype = Object.create(Component.prototype);
Pad.prototype.constructor = Pad;

Pad.prototype.prefix = "P";
Pad.prototype.nameRequired = true;

Pad.type = "Pad";        ///< Name to use in files
Pad.label = "Pad";          ///< Label for the palette
Pad.desc = "Configurable Keypad";    ///< Description for the palette
Pad.img = 'pad.png';
Pad.description = `<h2>Configurable Keypad</h2>
<p>Presents a keypad with from 4 to 16 buttons. If configured as a bus output, there are two outputs. 
The top output is the bus output and is the 
most recently pressed button value. If configured for single bit output, there will be 2-4 output bits
the represent the most recently pressed button. 
The bottom output is the clock and is true when the button is pressed.</p>`;
Pad.order = 500;
Pad.help = 'pad';

Pad.prototype.setType = function(pad) {
    if(this.pad === pad) {
        this.ensureIO();
        return;
    }

    const size = 30;
    const gap = 5;

    let set16 = () => {
        this.pad = 16;
        const a = - size * 1.5 - gap * 1.5;
        const b = - size/2 - gap/2;
        const c = size/2 + gap/2;
        const d = size * 1.5 + gap * 1.5;
        const up = -8;

        this.buttons = [
            new Button('0', 0, a, a + up, size),
            new Button('1', 1, b, a + up, size),
            new Button('2', 2, c, a + up, size),
            new Button('3', 3, d, a + up, size),
            new Button('4', 4, a, b + up, size),
            new Button('5', 5, b, b + up, size),
            new Button('6', 6, c, b + up, size),
            new Button('7', 7, d, b + up, size),
            new Button('8', 8, a, c + up, size),
            new Button('9', 9, b, c + up, size),
            new Button('A', 10, c, c + up, size),
            new Button('B', 11, d, c + up, size),
            new Button('C', 12, a, d + up, size),
            new Button('D', 13, b, d + up, size),
            new Button('E', 14, c, d + up, size),
            new Button('F', 15, d, d + up, size),

        ];

        this.width = (size + gap) * 4 + gap * 2 + 4;
        this.height = this.width + 13 + 4;
        this.bits = 4;
    }

    let set10 = () => {
        this.pad = 10;
        // Columns
        const x = -size - gap;
        const y = 0;
        const z = size + gap;

        // Rows
        const a = - size * 1.5 - gap * 1.5;
        const b = - size/2 - gap/2;
        const c = size/2 + gap/2;
        const d = size * 1.5 + gap * 1.5;
        const up = -8;

        this.buttons = [
            new Button('1', 1, x, a + up, size),
            new Button('2', 2, y, a + up, size),
            new Button('3', 3, z, a + up, size),
            new Button('4', 4, x, b + up, size),
            new Button('5', 5, y, b + up, size),
            new Button('6', 6, z, b + up, size),
            new Button('7', 7, x, c + up, size),
            new Button('8', 8, y, c + up, size),
            new Button('9', 9, z, c + up, size),

            new Button('0', 0, y, d + up, size),
        ];

        this.width = (size + gap) * 3 + gap * 2 + 4;
        this.height = (size + gap) * 4 + gap * 2 + 4 + 13 + 4;
        this.bits = 4;
    }

    let set12 = () => {
        this.pad = 12;
        // Columns
        const x = -size - gap;
        const y = 0;
        const z = size + gap;

        // Rows
        const a = - size * 1.5 - gap * 1.5;
        const b = - size/2 - gap/2;
        const c = size/2 + gap/2;
        const d = size * 1.5 + gap * 1.5;
        const up = -8;

        this.buttons = [
            new Button('1', 1, x, a + up, size),
            new Button('2', 2, y, a + up, size),
            new Button('3', 3, z, a + up, size),
            new Button('4', 4, x, b + up, size),
            new Button('5', 5, y, b + up, size),
            new Button('6', 6, z, b + up, size),
            new Button('7', 7, x, c + up, size),
            new Button('8', 8, y, c + up, size),
            new Button('9', 9, z, c + up, size),

            new Button('*', 10, x, d + up, size),
            new Button('0', 0, y, d + up, size),
            new Button('#', 11, z, d + up, size),
        ];

        this.width = (size + gap) * 3 + gap * 2 + 4;
        this.height = (size + gap) * 4 + gap * 2 + 4 + 13 + 4;
        this.bits = 4;
    }

    let set8 = () => {
        this.pad = 8;
        const a = - size * 1.5 - gap * 1.5;
        const b = - size/2 - gap/2;
        const c = size/2 + gap/2;
        const d = size * 1.5 + gap * 1.5;
        const up = -8;

        this.buttons = [
            new Button('0', 0, a, b + up, size),
            new Button('1', 1, b, b + up, size),
            new Button('2', 2, c, b + up, size),
            new Button('3', 3, d, b + up, size),
            new Button('4', 4, a, c + up, size),
            new Button('5', 5, b, c + up, size),
            new Button('6', 6, c, c + up, size),
            new Button('7', 7, d, c + up, size),

        ];

        this.width = (size + gap) * 4 + gap * 2 + 4;
        this.height = (size + gap) * 2 + gap * 2 + 4 + 13 + 4;
        this.bits = 3;
    }

    let set4 = () => {
        this.pad = 4;
        const b = - size/2 - gap/2;
        const c = size/2 + gap/2;

        const up = -8;

        this.buttons = [
            new Button('0', 0, b, b + up, size),
            new Button('1', 1, c, b + up, size),
            new Button('2', 2, b, c + up, size),
            new Button('3', 3, c, c + up, size),

        ];

        this.width = (size + gap) * 2 + gap * 2 + 4;
        this.height = (size + gap) * 2 + gap * 2 + 4 + 13 + 4;
        this.bits = 2;
    }

    switch(pad) {
        case 16:
        case '16':
        default:
            set16();
            break;

        case 10:
        case '10':
            set10();
            break;

        case 12:
        case '12':
            set12();
            break;

        case 8:
        case '8':
            set8();
            break;

        case 4:
        case '4':
            set4();
            break;
    }

    this.ensureIO();
}

/**
 * Ensure the actual number of outputs matches the
 * defined bus size.
 */
Pad.prototype.ensureIO = function() {
    let spacing = 16;

    let i=0;

    if(this.outs.length > 0) {
        //
        // Test if we switched output types or size
        // If so, disconnect everything
        //
        let clear = false;
        if(this.outs[0].bus !== this.bus) {
            // Changed bus status
            clear = true;
        }

        if(!this.bus && this.outs.length !== this.bits + 1) {
            // Changed number of bits required
            clear = true;
        }

        if(!clear) {
            // Ensure positions are correct...
            for(let out of this.outs) {
                out.x = this.width/2;
            }

            return; // We're good!
        }
    }

    // Clear all outputs
    for(i=0; i<this.outs.length; i++) {
        this.outs[i].clear();
    }

    this.outs = [];

    let startY = 0;
    const len = 11;

    if(this.bus) {
        this.addOut(this.width/2, -16, len).bus = true;
    } else {
        for(i=0; i<this.bits; i++) {
            let pinY = startY - i * spacing;

            // Add any new pins
            this.addOut(this.width / 2, pinY, len);
        }
    }

    this.addOut(this.width/2, 32, len);
    this.setOuts();
    this.setPressedOut(false);
}


/**
 * Clone this component object.
 * @returns {Pad}
 */
Pad.prototype.clone = function() {
    const copy = new Pad();
    copy.value = this.value.clone();
    copy.bus = this.bus;
    copy.setType(this.pad);
    copy.copyFrom(this);
    return copy;
};

/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
Pad.prototype.draw = function(context, view) {
    const leftX = this.x - this.width/2 - 0.5;
    const topY = this.y - this.height/2 - 0.5;

    // Select the style
    const saveUS = this.unselectedStyle;
    this.unselectedStyle = '#f2f2f2';
    this.selectStyle(context, view);

    const saveFillStyle = context.fillStyle;
    const saveStrokeStyle = context.strokeStyle;

    const radius = 6;

    //
    // Background
    //
    context.fillStyle = "#111111";
    CanvasHelper.roundedRect(context, leftX, topY, this.width, this.height, radius);
    context.fill();

    // Border
    const indent = 3;
    context.fillStyle = saveFillStyle;
    context.lineWidth = 2;
    CanvasHelper.roundedRect(context, leftX+indent, topY+indent, this.width-indent*2, this.height-indent*2, radius);
    context.stroke();
    context.lineWidth = 1;

    this.buttons.forEach((button) => {
        button.draw(context, this.x, this.y);
    });

    this.drawName(context, 0, this.height/2 - 8);

    // Restore
    context.lineWidth = 1;
    context.fillStyle = saveFillStyle;
    context.strokeStyle = saveStrokeStyle;
    this.unselectedStyle = saveUS;

    this.drawIO(context, view);
};

Pad.prototype.touch = function(x, y) {
    const size = this.size;
    if(x < this.x - size/2 || x > this.x + size/2 ||
        y < this.y - size/2 || y > this.y - size/2) {
        return;
    }

    for(let i in this.buttons) {
        const button = this.buttons[i];

        if(button.touch(x - this.x, y - this.y)) {
            this.setAsInteger(button.value, 4);
            this.setPressedOut(true);
            break;
        }
    }

    return Component.prototype.touch.call(this, x, y);
};

/**
 * Set the value for the input
 * @param value to set
 */
Pad.prototype.set = function(value) {
    this.value.set(value);
    this.setOuts();
    this.updateUI();
};

Pad.prototype.setAsInteger = function(value) {
    this.value.setAsInteger(value, this.bits);
    this.setOuts();
    this.updateUI();
}

Pad.prototype.updateUI = function() {
    const p = this.value.getAsInteger();
    let pressed = this.getPressedOut();
    if(pressed === undefined) {
        pressed = false;
    }

    this.buttons.forEach((button) => {
        if(button.value !== p) {
            button.setState('off');
        } else if(pressed) {
            button.setState('pressed');
        } else {
            button.setState('on');
        }
    });
}

/**
 * This function sets the pad state based on an input string.
 *
 * This accepts a simple value. It also accepts these strings:
 *
 *  release - Releases any currently pressed button
 *  press:X - Presses button X
 *
 * @param value
 * @param parseonly
 */
Pad.prototype.setAsString = function(value, parseonly) {
    if(value === 'release') {
        this.mouseUp();
    } else if(value.substr(0, 6) === 'press:') {
        this.value.setAsHex(value.substr(6));
        this.setPressedOut(true);
        this.updateUI();
    } else {
        this.value.setAsString(value, parseonly);
        this.updateUI();
    }

    if (!parseonly) {
        this.setOuts();
    }
}

Pad.prototype.setOuts = function() {
    if(this.bus) {
        this.outs[0].set(this.value.get());
    } else {
        for(let b=0; b<this.bits; b++) {
            this.outs[b].set(this.value.getBit(b));
        }
    }
}

/**
 * Advance the animation for this component by delta seconds
 * @param delta Time to advance in seconds
 * @returns true if animation needs to be redrawn
 */
Pad.prototype.advance = function(delta) {
    // if(this.clockDelay > 0) {
    //     this.clockDelay -= delta;
    //     if(this.clockDelay < 0) {
    //         this.clockDelay = 0;    // No pending clock
    //         if(this.bus) {
    //             this.outs[1].set(true);
    //         } else {
    //             this.outs[this.bits].set(true);
    //         }
    //         this.updateUI();
    //         return true;
    //     }
    // }

    return false;
};

/**
 * Compute the gate result
 * @param state
 */
Pad.prototype.compute = function(state) {
    const value = state[0] === true;
    if(this.bus) {
        this.outs[1].set(value);
    } else {
        this.outs[this.bits].set(value);
    }
    this.updateUI();
};

/**
 * Set the button pressed output to a given value.
 * @param value Value to set
 */
Pad.prototype.setPressedOut = function(value) {
    const simulation = this.getSimulation();
    if(simulation !== null) {
        simulation.queue(this, 50, [value]);
    }

    // if(value) {
    //     // The clock rising edge output is delayed by 50ns
    //     this.clockDelay = 0.00000004; // 0.00000005;
    //
    //     this.getSimulation().queue(this, 50, [1]);
    // } else {
    //     // Setting to zero
    //     this.clockDelay = 0;    // No pending clock
    //     if(this.bus) {
    //         this.outs[1].set(value);
    //     } else {
    //         this.outs[this.bits].set(value);
    //     }
    //     this.updateUI();
    // }
}

Pad.prototype.getPressedOut = function() {
    if(this.bus) {
        return this.outs[1].get();
    } else {
        return this.outs[this.bits].get();
    }
}


Pad.prototype.mouseUp = function() {
    this.buttons.forEach((button) => {
        button.untouch();
    });

    this.setPressedOut(false);
};


/**
 * Create a save object suitable for conversion to JSON for export.
 * @returns {*}
 */
Pad.prototype.save = function() {
    const obj = Component.prototype.save.call(this);
    this.value.save(obj);
    obj.pad = this.pad;
    obj.bus = this.bus;
    return obj;
};

/**
 * Load this object from an object converted from JSON
 * @param obj Object from JSON
 */
Pad.prototype.load = function(obj) {
    this.value.load(obj);
    this.bus = obj.bus !== false;
    this.setType(obj.pad);
    Component.prototype.load.call(this, obj);
};

Pad.prototype.properties = function(main) {
    const dlg = new ComponentPropertiesDlg(this, main);
    const id = dlg.uniqueId();

    let html = '<div class="control center"><div class="choosers">';

    html += `
<label><input type="radio" name="${id}" value="16" ${this.pad === 16 ? 'checked' : ''}> 16 Buttons (Hex)</label>
<label><input type="radio" name="${id}" value="10" ${this.pad === 10 ? 'checked' : ''}> 10 Buttons </label>
<label><input type="radio" name="${id}" value="8" ${this.pad === 8 ? 'checked' : ''}> 8 Buttons </label>
<label><input type="radio" name="${id}" value="4" ${this.pad === 4 ? 'checked' : ''}> 4 Buttons </label>
<label><input type="radio" name="${id}" value="12" ${this.pad === 12 ? 'checked' : ''}> Phone (12 buttons)</label>
`;

    html += '<br>';

    const busId = dlg.uniqueId();
    html += `
<label><input type="radio" name="${busId}"  ${this.bus ? 'checked' : ''} value="1"> Bus Output</label>
<label><input type="radio" name="${busId}" ${!this.bus ? 'checked' : ''} value="0"> Single Bit Outputs</label>`;

    html += '</div></div>';

    dlg.extra(html, () => {
        return null;
    }, () => {
        this.bus = document.querySelector(`input[name=${busId}]:checked`).value === '1';
        this.setType(document.querySelector(`input[name=${id}]:checked`).value);
    });

    dlg.open();
};
