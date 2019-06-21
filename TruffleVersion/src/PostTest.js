const express = require('express');
const bodyParser = require("body-parser");
var formidable = require('formidable');
const request = require('request');
const app = express();
app.set('view engine', 'ejs');
/** bodyParser.urlencoded(options)
 * Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST)
 * and exposes the resulting object (containing the keys and values) on req.body
 */
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

/**bodyParser.json(options)
 * Parses the text as JSON and exposes the resulting object on req.body.
 */
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded()); // to support URL-encoded bodies

app.set('view engine', 'ejs');

app.post("/", function (req, res) {
console.log("IN /");
	res.render('login');
});

app.post("/Test", function (req, res) {
console.log("IN TEST");
    console.log("NAME IS: " + req.body.user.name);
});


app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
