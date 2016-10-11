var bodyParser = require('body-parser');
var config = require('./config');
var express = require('express');
var qrsInteract = require('qrs-interact');

var parseUrlencoded = bodyParser.urlencoded({
    extended: false
});
var router = express.Router();

var qrsInteractInstances = [];

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

var getQRSInteractInstance = function(hostname) {
    var qrsInteractInstance;
    var qrsMatches = qrsInteractInstances.filter(function (interactInstance) {
        return interactInstance.hostname == hostname;
    });
    if (qrsMatches.length == 0)
    {
        var qrsConfig = {
            hostname: hostname,
            localCertPath: __dirname + "/certs/" + hostname
        }
        qrsInteractInstance = new qrsInteract(qrsConfig);
        qrsInteractInstances.push({"hostname":hostname,"instance":qrsInteractInstance});
    }
    else
    {
        qrsInteractInstance = qrsMatches[0].instance;
    }

    return qrsInteractInstance;
}

router.route('/getAppList')
    .post(parseUrlencoded, function (request, response) {
        if (request.body == {})
        {
            return;
        }

        var hostname = request.body.hostname;
        var instance = getQRSInteractInstance(hostname);
        if (instance == undefined)
        {
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
        appList.forEach(function(app) {
            var instance = getQRSInteractInstance(rootHost);
            instance.Get('app/'+app.id+'/export').then(function(response) {
                var ticketID = response.body.value;
                instance.Get('download/app/'+app.id+'/'+ticketID+'/'+app.name+'.qvf').then(function(response) {
                    var appBinary = response.body;

                    
                    hostnames.forEach(function(host) {
                        console.log("Trying to write file to: \\\\"+host+"\\defaultapps\\"+app.name+".qvf");
                        fs.writeFile('\\\\'+host+'\\defaultapps\\'+app.name+'.qvf', appBinary, function (err) {
                            if (err) return console.log(err);
                            console.log('Writing file success!');
                            var deployInstance = getQRSInteractInstance(host);
                           deployInstance.Post('app/import?name='+app.name, app.name+".qvf");
                        });
                        
                    }, this);


                });
            });

        }, this);
    });


module.exports = router;