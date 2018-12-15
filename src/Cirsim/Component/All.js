
import Zero from './Zero';
import One from './One';
import Or from './Or';
import Or3 from './Or3';
import Or4 from './Or4';
import Nor from './Nor';
import And from './And';
import And3 from './And3';
import And4 from './And4';
import Nand from './Nand';
import InPin from './InPin';
import OutPin from './OutPin';
import {Clock} from './Clock';
import {Inverter} from './Inverter';
import LED from './LED';
import Xor from './Xor'
import InPinBus from './InPinBus';
import OutPinBus from './OutPinBus';
import BusConstant from './BusConstant';
import BusOr from './BusOr';
import BusDecoder from './BusDecoder';
import BusSelector from './BusSelector';
import BusMultiplexer from './BusMultiplexer';
import Button from './Button';
import Text from './Text';
import TrafficLight from './TrafficLight';
import HexToSevenSegment from './HexToSevenSegment';
import SevenSeg from './SevenSeg';
import FmBus from './FmBus';
import ToBus from './ToBus';
import DFF from './DFF';
import DFFsr from './DFFsr';
import JKFF from './JKFF';
import DLatch from './DLatch';
import SRLatch from './SRLatch';
import Letters16 from './Letters16';
import Register from './Register';
import Alu4 from './Alu4';
import Registers16 from './Registers16';
import Pad from './Pad';
import LEDBar from './LEDBar';
import Pc16 from './Pc16';
import Memory16 from './Memory16';

/**
 * Add all components into the system.
 */
export default function(components) {

    components.add(Zero);
    components.add(One);
    components.add(InPin);
    components.add(OutPin);
    components.add(Clock);
    components.add(Button);
    components.add(LED);
    components.add(Or);
    components.add(Or3);
    components.add(Or4);
    components.add(Nor);
    components.add(And);
    components.add(And3);
    components.add(And4);
    components.add(Nand);
    components.add(Inverter);
    components.add(Xor);
    components.add(InPinBus);
    components.add(OutPinBus);
    components.add(BusOr);
    components.add(BusSelector);
    components.add(BusDecoder);
    components.add(BusMultiplexer);
    components.add(LEDBar);
    components.add(Text);
    components.add(TrafficLight);
    components.add(HexToSevenSegment);
    components.add(SevenSeg);
    components.add(FmBus);
    components.add(ToBus);
    components.add(DFF);
    components.add(DFFsr);
    components.add(JKFF);
    components.add(DLatch);
    components.add(SRLatch);
    components.add(Letters16);
    components.add(Register);
    components.add(BusConstant);
    components.add(Alu4);
    components.add(Registers16);
    components.add(Pad);
    components.add(Pc16);
    components.add(Memory16);

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
            Letters16, Alu4, Registers16, Pc16, Memory16, Pad ]
    )
}