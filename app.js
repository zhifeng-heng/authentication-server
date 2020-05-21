var express = require('express'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	OAuth2Server = require('oauth2-server'),
	Request = OAuth2Server.Request,
	Response = OAuth2Server.Response,
	loadDummyData = require('./model.js');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var mongoUri = 'mongodb://authentication-server-mongo:27017/oauth';

mongoose.connect(mongoUri, {
	useCreateIndex: true,
	useNewUrlParser: true
}, function(err, res) {
	if (err) {
		return console.error('Error connecting to "%s":', mongoUri, err);
	}
	console.log('Connected successfully to "%s"', mongoUri);
});


app.oauth = new OAuth2Server({
	model: require('./model.js'),
	accessTokenLifetime: 60 * 60,
	allowBearerTokensInQueryString: true
});

app.all('/oauth/token', obtainToken);
app.all('/oauth/loaddata', loadData);
app.get('/', authenticateRequest, function(req, res) {
	res.send('Congratulations, you are in a secret area!');
});

app.listen(6000, () => console.log('Authentication Server is up and running on port 6000!'));


function loadData(req, res) {
	var request = new Request(req);
	var response = new Response(res);

	loadDummyData.loadExampleData();

	return app.oauth.token(request, response)
		.then(function(token) {

			res.json(token);
		}).catch(function(err) {

			res.status(err.code || 500).json(err);
		});
}

function obtainToken(req, res) {
	var request = new Request(req);
	var response = new Response(res);

	return app.oauth.token(request, response)
		.then(function(token) {

			res.json(token);
		}).catch(function(err) {

			res.status(err.code || 500).json(err);
		});
}

function authenticateRequest(req, res, next) {
	var request = new Request(req);
	var response = new Response(res);

	return app.oauth.authenticate(request, response)
		.then(function(token) {

			next();
		}).catch(function(err) {

			res.status(err.code || 500).json(err);
		});
}
