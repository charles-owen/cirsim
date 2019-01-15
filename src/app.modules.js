// The public-path module must be imported first!
import './public-path';

import './polyfills/all';
import {Cirsim} from './Cirsim/Cirsim';
import './_cirsim.scss';

export {Cirsim};

let Export = function() {
}

Export.Cirsim = Cirsim;

export {Export as default};
