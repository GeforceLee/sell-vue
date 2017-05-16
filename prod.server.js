/**
 * Created by GeforceLee on 2017/5/16.
 */
var express = require('express');
var config = require('./config/index');

var port = process.env.PORT || config.build.prot;

var app = express();

var router = express.Router();

router.get('/', function(req, res, next) {
  req.url = '/index.html';
  next();
});

app.use(router);
var data = require('./data.json');
var apiRouter = express.Router();
apiRouter.get('/seller', function(req, res) {
  res.send({
    code: 0,
    data: data.seller
  });
});
apiRouter.get('/goods', function(req, res) {
  res.send({
    code: 0,
    data: data.goods
  });
});
apiRouter.get('/ratings', function(req, res) {
  res.send({
    code: 0,
    data: data.ratings
  });
});

app.use('/api', apiRouter);

app.use(express.static('./dist'));

module.exports = app.listen(port, function(err) {
  if (err) {
    console.log(err);
    return;
  }
  console.log('Listening at http://localhost:' + port + '\n');
});
