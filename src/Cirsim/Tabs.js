import {View} from './View';
import {Tools} from './DOM/Tools';


/**
 * Manages the tabs in the model
 * @param main Main object
 * @constructor
 */
export const Tabs = function(main) {
    /// The currently active view/tab
    this.active = -1;

    // The collection of tabs
    let tabs = [];

    //
    // The structure: <div class="tabs"><ul></ul><div class="panes"></div></div>
    // div.tabs - Enclosure for all tabs content
    // ul - The tabs we select from
    // div.panes - The panes with the tab contents
    //

    let tabsDiv = null, ul = null, panesDiv = null;

    this.size = function() {
        return tabs.length;
    }

	/**
     * Create the tabs system
	 * @param div The div we put the tabs into
	 */
	this.create = (div) => {
        // Create: <div class="tabs"><ul></ul><div class="panes"></div></div>
        tabsDiv = Tools.createClassedDiv('tabs');
        ul = document.createElement('ul');
        tabsDiv.appendChild(ul);

        panesDiv = Tools.createClassedDiv('panes');
        tabsDiv.appendChild(panesDiv);

        div.appendChild(tabsDiv);

        // Clear the tabs collection
        tabs = [];

        this.sync();
    }

    /**
     * Synchronize the tabs to match the model.
     */
    this.sync = function() {
        if(!needSync()) {
            return;
        }

        // What is the current circuit?
        let current = this.active >= 0 ? tabs[this.active].circuit : null;
        let collection = main.model.circuits.getCircuits();

        // Div containing the panes
	    panesDiv = Tools.createClassedDiv('panes');

        // The ul tag for the tabs
        ul = document.createElement('ul');

        // New collection of tabs
        let tabsNew = [];

        collection.forEach((circuit) => {
            let li = document.createElement('li');
            let a = document.createElement('a');
            li.appendChild(a);
            a.innerText = circuit.getName();
            li.addEventListener('click', (event) => {
	            event.preventDefault();
	            selectLi(li);
            });

	        a.addEventListener('click', (event) => {
		        event.preventDefault();
		        selectLi(li);
	        });

            ul.appendChild(li);

            // Does the pane already exist in tabs?
            let pane = null;
            let view = null;
            for(let i in tabs) {
                if(circuit === tabs[i].circuit) {
                    // There was a previous tab for this circuit
                    pane = tabs[i].pane;
                    view = tabs[i].view;
                }
            }

            if(pane === null) {
                // <div class="tab"><canvas></canvas></div>
                pane = Tools.createClassedDiv('tab');
                let canvas = document.createElement('canvas');
                pane.appendChild(canvas);

                view = new View(main, canvas, circuit);
            }

            panesDiv.appendChild(pane);
            view.tabnum = tabsNew.length;
            tabsNew.push({li: li, pane: pane, circuit: circuit, view: view});
        });

        tabsDiv.innerHTML = '';

	    tabsDiv.appendChild(ul);
	    tabsDiv.appendChild(panesDiv);

        tabs = tabsNew;

        //
        // Find and select the current circuit
        //
        if(current === null) {
            // If nothing was current before, select the
            // first tab.
            this.selectTab(0, true);
        } else {
            let any = false;
            for(let i in tabs) {
                if(current === tabs[i].circuit) {
                    // We found were current moved, so select that
                    any = true;
                    this.selectTab(i, true);
                    break;
                }
            }

            if(!any) {
                // Current has been deleted
                if(this.active >= tabs.length) {
                    this.selectTab(this.active-1);
                } else {
                    this.selectTab(this.active);
                }
            }
        }
    }

    /*
     * Determine if the tabs differ from the current circuit collection.
     * @returns true if we need a new sync operation.
     */
    function needSync() {
        let collection = main.model.circuits.getCircuits();
        if(tabs.length !== collection.length) {
            // If have different number of circuits than tabs
            return true;
        }

        for (let i=0; i<tabs.length; i++) {
            if(tabs[i].circuit !== collection[i]) {
                // If a circuit has moved
                return true;
            }

            let tabName = tabs[i].li.querySelector('a').textContent;
            if(tabName !== collection[i].getName()) {
                // If a circuit has been renamed
                return true;
            }
        }

        return false;
    }

    const selectLi = (li) => {
        for(let i=0; i<tabs.length; i++) {
            if(tabs[i].li === li) {
                this.selectTab(i);
            }
        }
    }

    this.selectTab = (num, force) => {
        if(force !== true && num === this.active) {
            return;
        }

        //
        // Clear all selections
        //
        tabs.forEach((tab) => {
            Tools.removeClass(tab.li, 'selected');
            Tools.removeClass(tab.pane, 'selected');
        });

        this.active = +num;
        let tab = tabs[this.active];

        Tools.addClass(tab.li, 'selected');
        Tools.addClass(tab.pane, 'selected');

        tab.view.draw();
        main.model.getSimulation().setView(tab.view);

        main.newTab();
    }

    // Return the current View object
    this.currentView = () => {
        if(this.active < 0) {
            return null;
        }

        return tabs[this.active].view;
    };

    // Return the current Circuit object
    this.currentCircuit = () => {
        if(this.active < 0) {
            return null;
        }

        return tabs[this.active].circuit;
    }

    // Implement undo for the tabs
    this.undo = function() {
        tabs.forEach((tab) => {
            tab.view.undo();
        });
    }

    this.destroy = function() {
        this.active = -1;
        tabsDiv.parentNode.removeChild(tabsDiv);
        tabsDiv = null;
        tabs = [];
    };

    this.validateName = function(name, skip) {
        var circuits = main.model.circuits;
        var collection = circuits.getCircuits();
        for(let i=0; i<collection.length; i++) {
            const circuit = collection[i];
            if(circuit === skip) {
                continue;
            }

            if (name.toLowerCase() === circuit.getName().toLowerCase()) {
                return 'Name ' + name + ' already in use by another tab';
            }
        }

        return null;
    }

    /**
     * Add a new tab with a new circuit in it.
     * @param name
     */
    this.add = function(name) {
        main.model.addCircuit(name);
        this.sync();
        this.selectTab(tabs.length-1, true);
    }

    /**
     * Delete the active tab
     * @param index
     */
    this.delActive = (index) => {
        if(this.active < 0) {
            return;
        }

        main.model.deleteCircuitByIndex(this.active);
        this.sync();
    }

    this.rename = function(name) {
        main.model.circuits.rename(this.active, name);
        this.sync();
    }

};
