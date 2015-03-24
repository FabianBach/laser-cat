
var button = function(config, shared){

    shared = shared || {};

    // this object inherits from the abstract object
    var that = require('./_abstract-module.js');
    that = that(config, shared);

    var eventHandler = shared.getEventHandler();
    eventHandler.on('socket_in_use_disabled', onSocketInUseDisable);

    //TODO: test this
    function onSocketInUseDisable(socket){
        var minValue = shared.getMinValue();
        shared.setValue(minValue, true, socket);
    }

    return that;
};

module.exports = button;

// nice logging
require('colors');