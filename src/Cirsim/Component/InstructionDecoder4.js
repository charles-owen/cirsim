import {Component} from '../Component';
import {ComponentPropertiesDlg} from '../Dlg/ComponentPropertiesDlg';

/**
 * Component: Simple 4-bit instruction decoder
 */
export const InstructionDecoder4 = function(name) {
    Component.call(this, name);

    this.height = 120;
    this.width = 80;

    this.instruction = "";

    // Only outputs
    var y = -16 * 2;
    this.addOut(this.width/2, y, 16, "Ae").bus = true;      y += 16;
    this.addOut(this.width/2, y, 16, "Be").bus = true;      y += 16;
    this.addOut(this.width/2, y, 16, "ALUe").bus = true;    y += 16;
    this.addOut(this.width/2, y, 16, "Im").bus = true;      y += 16;
    this.addOut(this.width/2, y, 16, "C").bus = true;       y += 16;

    this.setAsString("nop");
};

InstructionDecoder4.prototype = Object.create(Component.prototype);
InstructionDecoder4.prototype.constructor = InstructionDecoder4;

InstructionDecoder4.prototype.prefix = "ID";
InstructionDecoder4.prototype.nameRequired = true;

InstructionDecoder4.type = "InstructionDecoder4";            ///< Name to use in files
InstructionDecoder4.label = "Instruction Decoder 4";           ///< Label for the palette
InstructionDecoder4.desc = "Instruction Decoder";       ///< Description for the palette
InstructionDecoder4.img = "insdecoder4.png";         ///< Image to use for the palette
InstructionDecoder4.description = '<h2>Instruction Decoder</h2><p>Simple example' +
    ' instruction decoder. Decodes assembly statements into register and ALU operations.</p>';
InstructionDecoder4.help = 'instructiondecoder4';
InstructionDecoder4.order = 600;

/**
 * Compute the gate result
 * @param state
 */
InstructionDecoder4.prototype.compute = function(state) {
};

InstructionDecoder4.prototype.setAsString = function(value, set) {
    this.instruction = value;
    if(set === undefined) {
        set = true;
    }

    // regular expression for lexical analysis
    const re = /\s*([a-zA-Z]*)(?:[\s,$]+([^\s,]+))?(?:[\s,$]+([^\s,]+))?(?:[\s,$]+([^\s,]+))?/;
    const match = this.instruction.toLowerCase().match(re);
    if(match === null || match.length < 2) {
        return "syntax error in input";
    }

	const ae = this.outs[0];
	const be = this.outs[1];
	const alue = this.outs[2];
	const im = this.outs[3];
	const c = this.outs[4];

    // Get a register value from a string
    function getreg(s) {
        switch(s) {
            case 'r0':
                return "00";

            case 'r1':
                return "01";

            case 'r2':
                return "10";

            case 'r3':
                return '11';

            default:
                return null;
        }
    }

    // Get an immediate value from a string
    function getimm(s) {
        if(s === null || s === undefined) {
            return null;
        }

        if(s.substr(0, 1) !== '#') {
            return null;
        }

        var im = parseInt(s.substr(1));
        if(im > 7 || im < -8) {
            return null;
        }


        return ((im & 8) !== 0 ? '1' : '0') + ((im & 4) !== 0 ? '1' : '0') +
            ((im & 2) !== 0 ? '1' : '0') + ((im & 1) !== 0 ? '1' : '0');
    }

    var opcode = match[1];
    var rd = match[2];
    var ra = match.length > 3 ? match[3] : null;
    var rb = match.length > 4 ? match[4] : null;

    var rdreg = getreg(rd);
    var rareg = getreg(ra);
    var rbreg = getreg(rb);

    var raimm = getimm(ra);
    var rbimm = getimm(rb);

    function operation(cOp) {
        // Must have registers Rd and Ra
        if(rdreg === null || rareg === null || rb === null) {
            return null;
        }

        if(rb.substr(0, 1) === '#') {
            // This is an immediate operation
            if(rbimm === null) {
                return "invalid immediate value";
            }

            if(set) {
                ae.setAsString(rareg);
                be.setAsString("100");
                alue.setAsString("0" + rdreg);
                c.setAsString(cOp);
                im.setAsString(rbimm);
            }
        } else if(rareg !== null) {
            // This is a register operation
            if(set) {
                ae.setAsString(rareg);
                be.setAsString("0" + rbreg);
                alue.setAsString("0" + rdreg);
                c.setAsString(cOp);
            }
        }

        return null;
    }

    switch(opcode) {
        case 'nop':
            if(set) {
                ae.setAsString("00");
                be.setAsString("000");
                alue.setAsString("100");
                im.setAsString("0000");
                c.setAsString("111");
            }
            break;

        case 'mov':
            if(rdreg === null) {
                return null;
            }

            if(ra.substr(0, 1) === '#') {
                // This is an immediate operation
                if(raimm === null) {
                    return "invalid immediate value";
                }

                if(set) {
                    ae.setAsString(rdreg);
                    be.setAsString("100");
                    alue.setAsString("0" + rdreg);
                    c.setAsString("000");
                    im.setAsString(raimm);
                }
            } else if(rareg !== null) {
                // This is a register operation
                if(set) {
                    ae.setAsString(rdreg);
                    be.setAsString("0" + rareg);
                    alue.setAsString("0" + rdreg);
                    c.setAsString("000");
                }
            }

            break;

        case 'add':
            return operation("001");

        case 'sub':
            return operation("010");

        case 'and':
            return operation("011");

        case 'or':
            return operation("100");

        case 'sll':
            return operation("101");

        case 'sla':
            return operation("110");

        default:
            return 'invalid opcode';
    }

    return null;
}


/**
 * Clone this component object.
 * @returns {InstructionDecoder4}
 */
InstructionDecoder4.prototype.clone = function() {
    var copy = new InstructionDecoder4();
    copy.copyFrom(this);
    return copy;
};


/**
 * Draw component object.
 * @param context Display context
 * @param view View object
 */
InstructionDecoder4.prototype.draw = function(context, view) {
    this.selectStyle(context, view);

    var leftX = this.x - this.width/2 - 0.5;
    var rightX = this.x + this.width/2 + 0.5;
    var topY = this.y - this.height/2 - 0.5;
    var botY = this.y + this.height/2 + 0.5;

    // Left side
    context.beginPath();
    context.moveTo(leftX, topY);
    context.lineTo(leftX, botY);

    // Bottom
    context.lineTo(rightX, botY);

    // Right side
    context.lineTo(rightX, topY);

    // Top
    context.lineTo(leftX, topY);

    context.font = "12px Times";
    context.textAlign = "center";
    context.fillText("instruction", this.x, this.y + this.height/2 - 14);
    context.fillText("decoder", this.x, this.y + this.height/2 - 2);

    context.fillText(this.instruction, this.x, this.y - this.height/2 + 11);

    // Name
    if(this.naming !== null) {
        context.font = "14px Times";
        context.textAlign = "center";
        context.fillText(this.naming, this.x-15, this.y+3);
    }

    context.stroke();

    this.drawIO(context, view);
};

InstructionDecoder4.prototype.properties = function(main) {
    var value = this.instruction;

    var dlg = new ComponentPropertiesDlg(this, main);
	const id = dlg.uniqueId();

	var html = '<p>Value<br>' +
        `<input type="text" id="${id}" spellcheck="false" value="${value}"></p>`;

    dlg.extra(html, () => {
        const newValue = document.getElementById(id).value;
        return this.setAsString(newValue, false);
    }, () => {
	    const newValue = document.getElementById(id).value;
        this.setAsString(newValue);
    }, 40);

    dlg.open();

    const input = document.getElementById(id);
    input.select();
    input.focus();
};
