/**
 * API object for help processing JSON API responses
 * @constructor
 */
export const JsonAPI = function(api) {
    this.api = api;
}

JsonAPI.prototype.errors = function() {
    if(this.api.errors !== undefined) {
        return this.api.errors;
    }

    return null;
}

JsonAPI.prototype.fetch = function(type) {
    if(this.api.data === undefined) {
        return [];
    }

    var ret = [];
    this.api.data.forEach((item) => {
       if(item.type === type) {
           ret.push(item);
       }
    });

    return ret;
}

export default JsonAPI;
