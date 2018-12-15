import {View} from './View';
import {Tools} from './DOM/Tools';


/**
 * Manages the tabs in the model
 * @param div The div to add the tabs to
 * @param model The model we are viewing
 * @constructor
 */
var Tabs = function(main) {
    var that = this;

    // The currently active view/tab
    var active = -1;
    this.active = active;

    // The work div we put the tabs into
    var work = null;

    // The model
    var model = null;

    // The collection of tabs
    var tabs = [];

    // The tabs div
    let tabsDiv = null;

    // The ul inside tabsDiv
    let ul = null;

    // The panes div
    let panesDiv = null;

    this.create = function(_work) {
        work = _work;

        // Create: '<div class="tabs"><ul></ul><div class="panes"></div></div>'
        tabsDiv = Tools.createClassedDiv('tabs');
        ul = document.createElement('ul');
        tabsDiv.appendChild(ul);

        panesDiv = Tools.createClassedDiv('panes');
        tabsDiv.appendChild(panesDiv);

        work.appendChild(tabsDiv);

        // work.append('<div class="tabs"><ul></ul><div class="panes"></div></div>');

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
        let current = active >= 0 ? tabs[active].circuit : null;
        let collection = main.model.circuits.getCircuits();

        // Div containing the panes
	    panesDiv = Tools.createClassedDiv('panes');

        // The ul tag for the tabs
        ul = document.createElement('ul');

        // New collection of tabs
        let tabsNew = [];

        collection.forEach((circuit) => {
            let li = document.createElement('li');
            li.innerHTML = `<a>${circuit.getName()}</a>`;
            li.addEventListener('click', (event) => {
	            event.preventDefault();
	            selectLi(li);
            });

            //let li = $(`<li><a>${circuit.getName()}</a></li>`);
            li.click((event) => {
	            event.preventDefault();
	            selectLi(li);
            });

            // li.find('a').click((event) => {
            //     event.preventDefault();
            //     selectLi(li);
            // });

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
                if(active >= tabs.length) {
                    this.selectTab(active-1);
                } else {
                    this.selectTab(active);
                }
            }
        }
    }

    /**
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

            let tabName = tabs[i].li.find('a').text();
            if(tabName !== collection[i].getName()) {
                // If a circuit has been renamed
                return true;
            }
        }

        return false;
    }

    function selectLi(li) {
        for(let i=0; i<tabs.length; i++) {
            if(tabs[i].li === li) {
                that.selectTab(i);
            }
        }
    }

    this.selectTab = function(num, force) {
        if(force !== true && num === active) {
            return;
        }

        //
        // Clear all selections
        //
        tabs.forEach((tab) => {
            Tools.removeClass(tab.li, 'selected');
            Tools.removeClass(tab.pane, 'selected');
           // tab.li.removeClass('selected');
           // tab.pane.removeClass('selected');
        });

        active = num;
        this.active = active;
        let tab = tabs[active];

        Tools.addClass(tab.li, 'selected');
        Tools.addClass(tab.pane, 'selected');
        //tab.li.addClass('selected');
        //tab.pane.addClass('selected');

        tab.view.draw();
        main.model.getSimulation().setView(tab.view);

        main.newTab();
    }

    // Return the current View object
    this.currentView = function() {
        if(active < 0) {
            return null;
        }

        return tabs[active].view;
    };

    // Return the current Circuit object
    this.currentCircuit = function() {
        if(active < 0) {
            return null;
        }

        return tabs[active].circuit;
    }

    // Implement undo for the tabs
    this.undo = function() {
        tabs.forEach((tab) => {
            tab.view.undo();
        });
    }

    this.destroy = function() {
        active = -1;
        this.active = active;
        work.find(".tabs").remove();
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
    this.delActive = function(index) {
        if(active < 0) {
            return;
        }

        main.model.deleteCircuitByIndex(active);
        this.sync();
    }

    this.rename = function(name) {
        let circuit = this.currentCircuit();
        circuit.setName(name);
        this.sync();
    }

};


export default Tabs;
