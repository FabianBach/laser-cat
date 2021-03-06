// This module is a factory for control modules
// depending on the type defined in the config.
// It will create and return a control module object.
// This will be the only control module needed to require.

var io;
var globalEventHandler;

// All available modules should be listed here
var controlModules = {};
    controlModules['_abstract'] = require('./control-modules/_abstract-module.js');
    controlModules['button'] = require('./control-modules/button.js');
    controlModules['slider'] = require('./control-modules/slider.js');
    controlModules['xy-pad'] = require('./control-modules/xy-pad.js');

var createdModules = {};

function init (config, callback){
    callback = callback || function(){};

    createFromFiles(function(){
        setForeignListeners();
        callback();
    });

    globalEventHandler = new (require('events').EventEmitter);
}

// The actual module factory. It will instantiate all the modules by its configuration.
// It will also generate a protected and public object for the new module to hand on to children.
function createModule (config, shared){

    if (!io){ return console.log( 'control-module-factory '.grey + 'No io set, do that first!'.red )}
    if (!config || !config.type || controlModules[config.type] === undefined){ return console.log( 'control-module-factory '.grey + ('No such control-type: ' + config.type).red )}

    config.io = config.io || io;
    config.globalEventHandler = globalEventHandler;

    // the shared object is a substitute for protected members in JS
    shared = shared || {
        'setForeignListener': setForeignListener,
        'createModule' : createModule
    };

    // create the module
    var module = controlModules[config.type](config, shared);

    // check if module was returned or if something went wrong when creating
    if (module.error){
        console.log( 'control-module-factory '.grey + ('something went wrong when creating a ' + config.type).red );
        console.log( 'control-module-factory '.grey + (module.toString()).red );
        throw new Error(module.error.toString());
    }

    // save the reference to every created module in static array
    createdModules[module.getId()] = module;
    console.log( 'control-module-factory '.grey + ('created: '.green + module.getName() + ' '+ module.getType()+ ' ' + module.getId().grey));

    return module;
}

// Will read all the module configs and then create modules out of them
function createFromFiles(configsPath, callback){

    if (typeof(configsPath) === 'function'){ callback = configsPath }
    if (typeof(configsPath) !== 'string'){configsPath = './resources/config/control-modules/';}
    if (configsPath[configsPath.length-1] !== '/'){ configsPath += '/'}

    callback = callback || function(){};

    var configsModule = require('./config-module.js');
    configsModule.getConfigsFromPath(configsPath, function(configs){
        for (var i = 0; i < configs.length; i++){
            var config = configs[i];
            if (!config.disabled){
                createModule(config);
            }
        }
        callback();
    });
}

// will call the set foreign value listeners function on each created module
// has to be done when all modules have been created
// maybe it would be an option to use the global event emitter instead
function setForeignListeners(){
    for(var module in createdModules){
        createdModules[module].setForeignValueListeners();
    }
}

// This function is used to make modules set value change listeners on other modules.
// Will be added in the protected object.
function setForeignListener(moduleId, listener){
    var module = createdModules[moduleId];
    if(!module){ return }
    module.onValueChange(listener);
    console.log('Foreign value listener on:', moduleId.grey);
}

function getModuleList(){
    var list = [];
    for (var moduleId in createdModules){
        list.push(getModuleById(moduleId));
    }
    return list;
}

function getModuleById(moduleId){

    var moduleObj = createdModules[moduleId];
    if(!moduleObj) return null;
    return({
        id: moduleObj.getId(),
        name: moduleObj.getName(),
        namespace: moduleObj.getNamespace(),
        type: moduleObj.getType(),
        title: moduleObj.getTitle(),
        value: moduleObj.getValue(),
        minValue: moduleObj.getMinValue(),
        maxValue: moduleObj.getMaxValue()
    })
}

function setIo (_io){
    io = _io;
}

var that = {};
that.init = init;
that.createModule = createModule;
that.createFromFiles = createFromFiles;
that.getModuleList = getModuleList;
that.getModuleById = getModuleById;
that.setIo = setIo;

module.exports = that;

// beautiful loggin
require('colors');
