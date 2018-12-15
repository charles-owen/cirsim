import Options from '../../src/Cirsim/Options.js';

describe('Options', function() {
    it('should accept options', function() {
        var options = new Options();

        expect(options.load).toBe(null);
        expect(options.testTime).toBe(17);
        expect(options.userid).toBeNull();
        expect(options.display).toBe('window');


        options = new Options({
            display: 'full',
            components: [2, 3, 4]
        })

        expect(options.components).toEqual([2, 3, 4]);
        expect(options.display).toBe('full');

        expect(function() {
            new Options({
                garbage: true
            })
        }).toThrow(new Error("Invalid option garbage"));
    });

    it('should correctly determine save options', function() {
        var options = new Options();
        expect(options.getAPI('save')).toBeNull();
        expect(options.getAPI('open')).toBeNull();

        // Basic variation, single URL for all functionality
        options = new Options({
            api: '/some-api'
        });

        var save = options.getAPI('save');
        expect(save.url).toBe('/some-api');
        expect(save.extra).toBeUndefined();

        var open = options.getAPI('open');
        expect(save.url).toBe('/some-api');
        expect(save.extra).toBeUndefined();

        // Object format
        options = new Options({
            api: {
                url: '/some-api'
            }
        });

        save = options.getAPI('save');
        expect(save.url).toBe('/some-api');
        expect(Object.keys(save.extra).length).toBe(0);

        // Object format with extra data
        options = new Options({
            api: {
                url: '/some-api',
                extra: {userid: 12, assign: 'circuit2', tag: 'or'}
            }
        });

        save = options.getAPI('save');
        expect(save.url).toBe('/some-api');
        expect(save.extra.userid).toBe(12);
        expect(save.extra.assign).toBe('circuit2');

        open = options.getAPI('open');
        expect(open.url).toBe('/some-api');
        expect(open.extra.userid).toBe(12);
        expect(open.extra.assign).toBe('circuit2');


        // Automatic load/single file variation
        options = new Options({
            components: 'all',
            testTime: 100,
            api: {
                open: {
                    url: '../api-demo/',
                    name: "ab+c.cirsim"
                }
            },
            helpURL: '../help'
        });

        open = options.getAPI('open');
        expect(open).not.toBeNull();

        // Save-only variation
        options = new Options({
            api: {
                save :{
                    url: '/some-api/save',
                    extra: {userid: 22, assign: 'circuit3', tag: 'or'},
                    name: 'demo.cirsim'
                }

            }
        });

        save = options.getAPI('save');
        expect(save.url).toBe('/some-api/save');
        expect(save.extra.userid).toBe(22);
        expect(save.extra.assign).toBe('circuit3');
        expect(save.name).toBe('demo.cirsim');
        open = options.getAPI('open');
        expect(open).toBeNull();
    });
});
