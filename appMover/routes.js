var bodyParser = require('body-parser');
var config = require('./config');
var express = require('express');
var fs = require('fs');
var promise = require('bluebird');
var qrsInteract = require('qrs-interact');
var socket = require('socket.io-client')('https://localhost:9945', {
    secure: true,
    reconnect: true
});

var parseUrlencoded = bodyParser.urlencoded({
    extended: false
});
var router = express.Router();

var qrsInteractInstances = [];

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

var getQRSInteractInstance = function (hostname) {
    var qrsInteractInstance;
    var qrsMatches = qrsInteractInstances.filter(function (interactInstance) {
        return interactInstance.hostname == hostname;
    });
    if (qrsMatches.length == 0) {
        var qrsConfig = {
            hostname: hostname,
            localCertPath: __dirname + "/certs/" + hostname
        }
        qrsInteractInstance = new qrsInteract(qrsConfig);
        qrsInteractInstances.push({
            "hostname": hostname,
            "instance": qrsInteractInstance
        });
    } else {
        qrsInteractInstance = qrsMatches[0].instance;
    }

    return qrsInteractInstance;
}

router.route('/getAppList')
    .post(parseUrlencoded, function (request, response) {
        if (request.body == {}) {
            return;
        }

        var hostname = request.body.hostname;
        var instance = getQRSInteractInstance(hostname);
        if (instance == undefined) {
            return "Could not create qrs instance for " + hostname;
        }

        return instance.Get('app')
            .then(function (result) {
                var appList = [];
                result.body.forEach(function (app) {
                    appList.push([app.id, app.name]);
                }, this);
                response.send(appList);
                return;
            })
            .catch(function (error) {
                console.log(error);
            });
    });

router.route('/deployApps')
    .post(parseUrlencoded, function (request, response) {
        var appList = request.body.apps;
        var rootHost = request.body.hostname;
        var hostnames = request.body.nodes;
        var directory = __dirname + "/temp/";

        socket.emit("appMover", "Trying to deploy apps.");


        fs.mkdirSync(directory);
        promise.map(appList, function (app) {
            var instance = getQRSInteractInstance(rootHost);
            return instance.Get('app/' + app.id + '/export').then(function (response) {
                var ticketID = response.body.value;
                return instance.Get('download/app/' + app.id + '/' + ticketID + '/' + app.name + '.qvf').then(function (response) {
                    var fileName = directory + app.name + '.qvf';
                    return new promise(function (resolve) {
                        fs.writeFile(fileName, response.body, {
                            flag: 'w'
                        }, function (err) {
                            if (err) return console.log(err);
                            console.log('Writing file success!');
                            var appStream = fs.createReadStream(fileName);
                            var uploadPromises = [];
                            hostnames.forEach(function (host) {
                                console.log("Trying to upload app to: " + host);
                                var deployInstance = getQRSInteractInstance(host);
                                uploadPromises.push(deployInstance.Post('app/upload?name=' + app.name, appStream, 'vnd.qlik.sense.app'));
                            }, this);
                            resolve(promise.all(uploadPromises).then(function (result) {
                                fs.unlinkSync(fileName);
                                console.log("Upload of '" + app.name + "' complete to all nodes.");
                            }));
                        });
                    });
                });
            });
        }, {
            concurrency: 1
        }).then(function (result) {
            fs.rmdirSync(directory);
            console.log("App deployments complete.");
        });
    });


module.exports = router;