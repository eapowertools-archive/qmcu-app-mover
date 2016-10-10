var bodyParser = require('body-parser');
var config = require('./config');
var express = require('express');
var qrsInteract = require('qrs-interact');

var parseUrlencoded = bodyParser.urlencoded({
    extended: false
});
var router = express.Router();
var qrsConfig = {
    hostname: config.qrs.hostname,
    localCertPath: config.qrs.localCertPath
}
var qrs = new qrsInteract(qrsConfig);

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({
    extended: true
}));

router.route('/getAppList')
    .post(parseUrlencoded, function (request, response) {
        return qrs.Get('app')
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

router.route('/getRules')
    .get(function (request, response) {
        //first get the table file;
        var tableDef = fs.readFileSync(config.thisServer.pluginPath + "/rulemanager/data/tableDef.json");

        var filter = "((category+eq+%27Security%27))";

        qrs.Post("systemrule/table?filter=" + filter + "&orderAscending=true&skip=0&sortColumn=name", JSON.parse(tableDef), "json")
            .then(function (result) {
                var s = JSON.stringify(result.body);
                response.send(s);
            })
            .catch(function (error) {
                response.send(error);
            });

    });


module.exports = router;