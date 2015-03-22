

//TODO: process.on('exit') or 'beforeExit

var express = require('express');
var io = require('socket.io');
var http = require('http');

var controlModules = require('../server/control-module.js');
var viewModules = require('../server/view-module.js');

var tkvrServer;
var tkvr = {};

function init(config, callback){
    var port = config.port || 8080;
    tkvr = express();
    //tkvr.use(express.static(__dirname + '/public'));
    tkvr.use(express.static('/public'));

    tkvr.get('/tkvr-view-list', function(req, res){
        var list = viewModules.getViews();
        res.json(list);
    });

    tkvr.get('/tkvr-view/:id', function(req, res){
        var view = viewModules.getViewById(req.params.id);
        res.json(view);
    });

    tkvrServer = tkvr.listen(port, onServerReady.bind(null, callback));
    io = io.listen(tkvrServer);

    //TODO: set socket io timeout
}

function onServerReady(callback){
    var host = tkvrServer.address().address;
    var port = tkvrServer.address().port;
    console.log('Server listening at http://%s:%s', host, port.toString().cyan);

    openWebSockets();
    callback(io);
}

function openWebSockets(){
    io.sockets.on('connection', function(socket){
        console.log('Yeay, client connected!'.rainbow + socket.id.grey);
        setSocketListeners(socket);
    });
}

function setSocketListeners(socket){
    socket.on('disconnect', function(data){
        console.log('Oh, client disconnected...' + socket.id.grey);
    });
}

that = {};
that.init = init;

module.exports = that;

// beautiful loggin
require('colors');