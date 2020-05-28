// The public-path module must be imported first!
import './src/public-path';

import './src/polyfills/all';
import {Cirsim} from './src/Cirsim/Cirsim';
import './src/_cirsim.scss';
import {Ready} from './src/Cirsim/Utility/Ready';


// This allows Cirsim to be used as Cirsim or Cirsim.Cirsim
// since the version in cl/cirsim is Cirsim.Cirsim.
Cirsim.Cirsim = Cirsim;

// Automatically install into div.cirsim-install, where the text
// contents of the tag are JSON to configure Cirsim
Ready.go(() => {
    const elements = document.querySelectorAll('div.cirsim-install');
    for(let i=0; i<elements.length; i++) {
        let element = elements[i];
        const json = JSON.parse(element.textContent);
        element.innerHTML = '';
        const cirsim = new Cirsim(element, json);
        cirsim.startNow();
        element.style.display = 'block';
    }
});

export {Cirsim};
export {Cirsim as default};
