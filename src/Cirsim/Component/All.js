
import {Zero} from './Zero';
import {One} from './One';
import {Or} from './Or';
import {Or3} from './Or3';
import {Or4} from './Or4';
import {Nor} from './Nor';
import {And} from './And';
import {And3} from './And3';
import {And4} from './And4';
import {Nand} from './Nand';
import {InPin} from './InPin';
import {OutPin} from './OutPin';
import {Clock} from './Clock';
import {Inverter} from './Inverter';
import {LED} from './LED';
import {Xor} from './Xor'
import {InPinBus} from './InPinBus';
import {OutPinBus} from './OutPinBus';
import {BusConstant} from './BusConstant';
import {BusOr} from './BusOr';
import {BusDecoder} from './BusDecoder';
import {BusSelector} from './BusSelector';
import {BusMultiplexer} from './BusMultiplexer';
import {Button} from './Button';
import {Text} from './Text';
import {TrafficLight} from './TrafficLight';
import {HexToSevenSegment} from './HexToSevenSegment';
import {SevenSeg} from './SevenSeg';
import {FmBus} from './FmBus';
import {ToBus} from './ToBus';
import {DFF} from './DFF';
import {DFFsr} from './DFFsr';
import {JKFF} from './JKFF';
import {DLatch} from './DLatch';
import {SRLatch} from './SRLatch';
import {Letters16} from './Letters16';
import {Register} from './Register';
import {Alu4} from './Alu4';
import {Registers16} from './Registers16';
import {Pad} from './Pad';
import {LEDBar} from './LEDBar';
import {Pc16} from './Pc16';
import {Memory16} from './Memory16';
import {Decoder3} from './Decoder3';
import {InstructionDecoder4} from './InstructionDecoder4';
import {Alu16} from './Alu16';
import {Counter} from './Counter';

/**
 * Add all components into the system.
 */
export const All = function(components) {
    // Comments are the order values
    components.add(Zero);       // 0
    components.add(One);        // 1
    components.add(InPin);      // 2
    components.add(OutPin);     // 3

    components.add(And);        // 11
    components.add(And3);       // 12
    components.add(And4);       // 13
    components.add(Nand);       // 16

    components.add(Or);         // 20
    components.add(Or3);        // 21
    components.add(Or4);        // 22
    components.add(Nor);        // 30

    components.add(Xor);        // 40
    components.add(Inverter);   // 50

    components.add(Button);     // 100
    components.add(LED);        // 102
    components.add(Clock);      // 104
    components.add(Text);       // 106

    components.add(SRLatch);    // 200
    components.add(DLatch);     // 202
    components.add(DFF);        // 204
    components.add(DFFsr);      // 206
    components.add(JKFF);       // 208

    components.add(InPinBus);       // 300
    components.add(BusConstant);    // 301
    components.add(OutPinBus);      // 302
    components.add(FmBus);          // 305
    components.add(ToBus);          // 306
    components.add(BusOr);          // 308
    components.add(BusSelector);    // 310

    components.add(BusDecoder);     // 400
    components.add(BusMultiplexer); // 402
    components.add(Register);       // 404
    components.add(Counter);        // 406

    components.add(Pad);            // 500
    components.add(LEDBar);         // 502
    components.add(TrafficLight);   // 504
    components.add(HexToSevenSegment);  // 506
    components.add(SevenSeg);       // 508
    components.add(Letters16);      // 510

    components.add(InstructionDecoder4);    // 600
    components.add(Alu4);           // 602

    components.add(Registers16);    // 700
    components.add(Pc16);           // 702
    components.add(Memory16);       // 704
    components.add(Alu16);          // 706

    components.add(Decoder3);       // 1000

    components.addPalette('combinatorial',
        [Or, And, Inverter, Xor, Nand, Nor]);

    components.addPalette('sequential',
        [DFF, DFFsr, JKFF, DLatch, SRLatch]);

    components.addPalette('bus',
        [InPinBus, OutPinBus, BusOr, BusSelector, BusDecoder, BusMultiplexer])

    components.addPalette('all',
        [Zero, One, InPin, OutPin, Clock, Button, LED, Text,
            Or, Or3, Or4, Nor, And, And3, And4, Nand, LEDBar,
            Inverter, Xor,
            DFF, DFFsr, JKFF, DLatch, SRLatch,
            InPinBus, OutPinBus, BusConstant, BusOr, BusDecoder, BusSelector,
            BusMultiplexer,
            TrafficLight, HexToSevenSegment, SevenSeg, FmBus,
            ToBus, Register,
            Letters16, Alu4, Registers16, Pc16, Memory16, InstructionDecoder4, Pad,
            Alu16, Counter ]
    )
}