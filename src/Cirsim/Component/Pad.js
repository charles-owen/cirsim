import {Component} from '../Component';
import {Button} from '../Graphics/Button';
import {CanvasHelper} from '../Graphics/CanvasHelper';
import {Value} from '../Value';
import {ComponentPropertiesDlg} from '../Dlg/ComponentPropertiesDlg';

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

    // The type of pad, null until we define it
    this.pad = null;

    var len = 11;
    this.addOut(this.width/2, -16, len).bus = true;
    this.addOut(this.width/2, 16, len);

    this.setType(16);
    this.setAsInteger(0);
    this.outs[1].set(false);
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
<p>Presents a keypad with from 4 to 16 buttons. There are two outputs. The bus output (top) is the 
most recently pressed button value. The clock output (bottom) is true when the button is pressed.</p>`;
Pad.order = 50;
Pad.help = 'pad';

Pad.prototype.setType = function(pad) {
    if(this.pad === pad) {
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

    this.outs[0].x = this.width/2;
    this.outs[1].x = this.width/2;
}



/**
 * Compute the gate result
 * @param state
 */
Pad.prototype.compute = function(state) {
    if(Array.isArray(state[0])) {
        var v = state[0];
        if(v[0] === undefined || v[1] === undefined || v[2] === undefined || v[3] === undefined) {
            this.value = undefined;
        } else {
            this.value = (v[0] ? 1 : 0) + (v[1] ? 2 : 0) + (v[2] ? 4 : 0) + (v[3] ? 8 : 0);
        }
    } else {
        this.value = undefined;
    }
};

Pad.prototype.get = function(i) {
    return this.ins[0].value[i];
};


/**
 * Clone this component object.
 * @returns {Pad}
 */
Pad.prototype.clone = function() {
    var copy = new Pad();
    copy.value = this.value;
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
    const rightX = this.x + this.width/2 + 0.5;
    const topY = this.y - this.height/2 - 0.5;
    const botY = this.y + this.height/2 + 0.5;

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
            this.outs[1].set(true);
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
    this.outs[0].set(this.value.get());
    this.updateUI();
};

Pad.prototype.setAsInteger = function(value) {
    this.value.setAsInteger(value, this.bits);
    this.outs[0].set(this.value.get());
    this.updateUI();
}

Pad.prototype.updateUI = function() {
    const p = this.value.getAsInteger();
    this.buttons.forEach((button) => {
        if(button.value !== p) {
            button.state = 'off';
        }
    });
}

Pad.prototype.setAsString = function(value, parseonly) {
    this.value.setAsString(value, parseonly);
    if (!parseonly) {
        this.outs[0].set(this.value.get());
    }
}


Pad.prototype.mouseUp = function() {
    this.buttons.forEach((button) => {
        button.untouch();
    });

    this.outs[1].set(false);
};


/**
 * Create a save object suitable for conversion to JSON for export.
 * @returns {*}
 */
Pad.prototype.save = function() {
    var obj = Component.prototype.save.call(this);
    this.value.save(obj);
    obj.pad = this.pad;
    return obj;
};

/**
 * Load this object from an object converted from JSON
 * @param obj Object from JSON
 */
Pad.prototype.load = function(obj) {
    this.value.load(obj);
    this.setType(obj.pad);
    Component.prototype.load.call(this, obj);
};

Pad.prototype.properties = function(main) {
    const dlg = new ComponentPropertiesDlg(this, main);
    const id = dlg.uniqueId();

    const html = `<div class="control">
<label><input type="radio" name="${id}" value="16" ${this.pad === 16 ? 'checked' : ''}> 16 Buttons (Hex)</label>
<label><input type="radio" name="${id}" value="10" ${this.pad === 10 ? 'checked' : ''}> 10 Buttons </label>
<label><input type="radio" name="${id}" value="8" ${this.pad === 8 ? 'checked' : ''}> 8 Buttons </label>
<label><input type="radio" name="${id}" value="4" ${this.pad === 4 ? 'checked' : ''}> 4 Buttons </label>
<label><input type="radio" name="${id}" value="12" ${this.pad === 12 ? 'checked' : ''}> Phone (12 buttons)</label>
</div>`;

    dlg.extra(html, () => {
        return null;
    }, () => {
        this.setType(document.querySelector(`input[name=${id}]:checked`).value);  // $(`input[name=${id}]:checked`).val());
    });

    dlg.open();
};
