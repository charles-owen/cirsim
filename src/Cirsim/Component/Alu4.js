import {Component} from '../Component';
import {ComponentPropertiesDlg} from '../Dlg/ComponentPropertiesDlg';

/**
 * Component: Simple 4-bit ALU
 * @constructor
 */
export const Alu4 = function() {
    Component.call(this);

    this.height = 16 * 8;
    this.width = 64;
    this.shrink = 15;

    const left = -this.width / 2;
    const right = this.width / 2;

    // Inputs and one output
    var inOffset = 32;
    this.addIn(left, -inOffset, 16, "A").bus = true;
    this.addIn(left, inOffset, 16, "B").bus = true;

    var dy = 0.5 * this.shrink;
    var c = this.addIn(0, this.height/2 - dy, 6 + dy, "C");
    c.orientation = 's';
    c.bus = true;

    this.addOut(right, 0, 16, "O").bus = true;
    this.addOut(right, 24, 16, "CPSR").bus = true;
};

Alu4.prototype = Object.create(Component.prototype);
Alu4.prototype.constructor = Alu4;

Alu4.prototype.prefix = "ALU";
Alu4.prototype.nameRequired = true;

Alu4.type = "alu4";            ///< Name to use in files
Alu4.label = "ALU 4";           ///< Label for the palette
Alu4.desc = "Simple 4-bit ALU";       ///< Description for the palette
Alu4.img = "alu.png";         ///< Image to use for the palette
Alu4.description = `<h2>4-bit ALU</h2><p>Simple example 4-bit ALU</p>
<p>The operation is determined by the value of the C bus input. Operations 
supported are:<p>
<table>
<tr><th>C</th><th>operation</th></tr>
<tr><td>0</td><td>O&larr;B</td></tr>
<tr><td>1</td><td>O&larr;A+B</td></tr>
<tr><td>2</td><td>O&larr;A-B</td></tr>
<tr><td>3</td><td>O&larr;A&amp;B</td></tr>
<tr><td>4</td><td>O&larr;A|B</td></tr>
<tr><td>5</td><td>O&larr;A&lt;&lt;B (logical)</td></tr>
<tr><td>6</td><td>O&larr;A&lt;&lt;B (arithmetic)</td></tr>
</table>
<p>For the shift operations, negative values for B result in a right shift.<p>
<p>The CPSR bits are VCZN (N is the lsb).</p>`;

Alu4.order = 602;

/**
 * Compute the gate result
 * @param state
 */
Alu4.prototype.compute = function(state) {
    var a = state[0];
    var b = state[1];
    var c = state[2];

    function parse(c) {
        if(c === undefined) {
            return undefined;
        }

        var p = 1;
        var sum = 0;
        c.forEach(function(v) {
            if(v === undefined) {
                return undefined;
            }

            if(v) {
                if(p == 8) {
                    sum -= p;
                } else {
                    sum += p;
                }

            }

            p *= 2;
        });

        return sum;
    }

    var av = parse(a);
    var bv = parse(b);
    var cv = parse(c);
    //console.log("av=" + av + " bc=" + bv + " cv=" + cv);

    var ov = bv;
    var carry = false;
    var overflow = false;

    switch(cv) {
        default:    // mov
            ov = bv;
            break;

        case 1:     // add
            ov = av + bv;
            var ov1 = (av & 0xf) + (bv & 0xf);
            carry = (ov1 & 16) != 0;
            overflow = (ov < -8 || ov > 7);
            break;

        case 2:     // sub
            ov = av - bv;
            var ov1 = (av & 0xf) + ((~bv) & 0xf) + 1;
            carry = (ov1 & 16) != 0;
            overflow = (ov < -8 || ov > 7);
            break;

        case 3:     // and
            ov = av & bv;
            break;

        case 4:     // or
            ov = av | bv;
            break;

        case 5:     // shift logical
            if(bv < 0) {
                ov = (av & 0xf) >> -bv;
            } else {
                ov = (av & 0xf) << bv;
            }
            break;

        case 6:     // shift arithmetic
            if(bv < 0) {
                ov = av >> -bv;
            } else {
                ov = av << bv;
            }
            break;
    }

    if(ov === undefined) {
        this.outs[0].set([undefined, undefined, undefined, undefined]);
        this.outs[1].set([undefined, undefined, undefined, undefined]);
    } else {
        var o = [(ov & 1) == 1, (ov & 2) == 2, (ov & 4) == 4, (ov & 8) == 8];
        this.outs[0].set(o);

        // Order: N, Z, C, V
        this.outs[1].set([o[3], ov == 0, carry, overflow]);
    }

};

/**
 * Clone this component object.
 * @returns {Alu4}
 */
Alu4.prototype.clone = function() {
    var copy = new Alu4();
    copy.copyFrom(this);
    return copy;
};



/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
Alu4.prototype.draw = function(context, view) {
    this.selectStyle(context, view);

    var leftX = this.x - this.width/2 - 0.5;
    var rightX = this.x + this.width/2 + 0.5;
    var topY = this.y - this.height/2 - 0.5;
    var botY = this.y + this.height/2 + 0.5;


    // Left side
    context.beginPath();
    context.moveTo(leftX, topY);
    context.lineTo(leftX, this.y - this.shrink / 2);
    context.lineTo(leftX + 20, this.y);
    context.lineTo(leftX, this.y + this.shrink / 2);
    context.lineTo(leftX, botY);

    // Bottom
    context.lineTo(rightX, botY - this.shrink);

    // Right side
    context.lineTo(rightX, topY + this.shrink);

    // Top
    context.lineTo(leftX, topY);

    // Name
    if(this.naming !== null) {
        context.font = "14px Times";
        context.textAlign = "center";
        context.fillText(this.naming, this.x, this.y-15);
    }

    context.stroke();

    this.drawIO(context, view);
};

Alu4.prototype.properties = function (main) {
    var dlg = new ComponentPropertiesDlg(this, main);
    dlg.open();
};
