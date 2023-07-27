const server = require('http').Server(app);
const io = require('socket.io')(server);
const massive = require("massive");
const pg = require("pg");

var startExpress = function () {
  server.listen(config.express.port);
  db = app.get('db');
}


var connectionString = "postgres://" + config.postgres.user + ":" + config.postgres.password + "@" + config.postgres.host + "/" + config.postgres.db;
var pgClient = new pg.Client(connectionString);
pgClient.connect();
pgClient.query('LISTEN "changes"');
pgClient.on('notification', function (data) { io.emit("change"); });

var update = function (request, res, next) {
  var newDoc = request.body.data;
  db.steps.saveDoc({ id: 1, data: newDoc }, function (err, response) {
    if (err) { handleError(err) };
    res.json({ data: response });
    pgClient.query('NOTIFY "change"');
  });
} 