const express = require('express');
const hbs = require('hbs'); // handlebars
const fs = require('fs');

// create port variable for Heroku
// for local set to 3000
const port = process.env.PORT || 3000;
var app = express();

hbs.registerPartials(__dirname + '/views/partials');
// set takes key value pairs
// key: what u want to set
// value: what u want to use 
app.set('view engine', 'hbs');

// app.use is how you registrate middleware.
// http://expressjs.com/en/4x/api.html to see which methods
// you have access too with req and res.
// With the "next" argument you can tell express when 
// the middleware function is done
app.use((req, res, next) => {
	var now = new Date().toString();
	var log = (`${now}: ${req.method} ${req.url}`);

	console.log(log);
	fs.appendFile('server.log', log + '\n', (err) => {
		if (err) {
			console.log('Unable to append to server.log.');
		}
	});
	next();
});

// because next is not being called all the code below this
// wont run, and all pages will show the maintenance page.
// app.use((req, res, next) => {
// 	res.render('maintenance.hbs');
// });

// __dirname stores the path to the directory
app.use('/assets', express.static(__dirname + '/public'));

// CLI nodemon server.js -e js,hbs to watch for js and template changes.
hbs.registerHelper('getCurrentYear', () => {
	return new Date().getFullYear();
});

hbs.registerHelper('screamIt', (text) => {
	return text.toUpperCase();
});

// http get has 2 arguments: 
// first is the url, second the function to run
// what express should send back to the person who made the request.
// the function has 2 arguments (req and response).
// req contains info like the headers being used, any body info.
// response has methods available to respond to the http request.
app.get('/', (req, res) => {

	res.render('home.hbs', {
		pageTitle: 'Home Page',
		welcomeMessage: 'Welcome to our website'
	});
});

app.get('/projects', (req, res) => {
	res.render('projects.hbs', {
		pageTitle: 'Projects'
	});
});

app.get('/about', (req, res) => {
	res.render('about.hbs', {
		pageTitle: 'About Page',
	});
});

app.get('/bad', (req, res) => {
	res.send({
		errorMessage: 'Bad request'
	});
});

// bind the app to a port
// listen takes a second argument (optional)
// its function that will lets you do something
// when the server is up.
app.listen(port, () => {
	console.log(`Server is up on port ${port}`);
});






