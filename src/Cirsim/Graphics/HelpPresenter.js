import {Ajax} from '../Utility/Ajax';

/**
 * Tool for presenting help. Used by both HelpDlg and HelpDiv
 * jQuery free
 * @constructor
 */
export const HelpPresenter = function(main, owner) {
    let stack = [];

    this.html = function() {
        return '<div class="cirsim-help">Fetching...</div>';
    }

    this.present = function(url) {
        if(url === '') {
            url = 'cirsim/help/index.html';
        }

        url = main.cirsim.root + '/' + url;
        this.presentAbsolute(url);
    }


    this.presentAbsolute = function(url) {
        stack.push(url);

	    Ajax.do({
		    url: url,
		    data: {},
		    method: "GET",
		    success: (data) => {
			    install(data);
		    },
		    error: (xhr, status, error) => {
			    main.toast.message('Unable to communicate with server: ' + error);
		    }
	    });
    }

	/*
	 * Install help HTML into the presenter.
	 * @param html HTML to present
	 */
	const install = (html) => {
        if(html.indexOf('{{components}}') > 0) {
            let root = main.cirsim.root;
            let links = '<ul>';
            main.palette.palette.forEach((component) => {
                if(component.help !== undefined) {
                    //
                    // There are a few components we rename here so they are
                    // easier to find in the list of components.
                    //
                    let label = component.label;
                    switch(label) {
                        case '0':
                            label = 'Zero';
                            break;

                        case '1':
                            label = 'One';
                            break;
                    }
                    links += `<li><a href="${component.help}.html">${label}</a> <em>${component.desc}</em></li>`;
                }
            });

            links += '</ul>';
            html = html.replace('{{components}}', links);
        }

        let root = main.cirsim.root;
        html = html.replace(/src="img\//g, 'src="' + root + '/cirsim/help/img/');
        html = html.replace(/href="/g, 'href="' + root + '/cirsim/help/');

		// Install a click handler for every link so they stay in this page
		// rather than navigating to the link.
		const cirsimHelp = owner.element.querySelector('.cirsim-help');
        if(cirsimHelp !== null) {
            cirsimHelp.innerHTML = html;
            for(const link of cirsimHelp.querySelectorAll('a')) {
	            link.addEventListener('click', (event) => {
		            event.preventDefault();
		            this.presentAbsolute(event.target.href);
	            });
            }
        }
    }

    this.home = function() {
        this.present('');
    }

    this.back = function() {
        if(stack.length < 2) {
            return;
        }

        // Pop off the current page
        stack.pop();

        // Page to return to
        let url = stack[stack.length-1];

        // Pop it off, since it will be pushed back on
        stack.pop();
        this.presentAbsolute(url);
    }
}
