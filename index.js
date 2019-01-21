// The public-path module must be imported first!
import './src/public-path';

import './src/polyfills/all';
import {Cirsim} from './src/Cirsim/Cirsim';
import './src/_cirsim.scss';

// This allows Cirsim to be used as Cirsim or Cirsim.Cirsim
// since the version in cl/cirsim is Cirsim.Cirsim.
Cirsim.Cirsim = Cirsim;

export {Cirsim};
export {Cirsim as default};
