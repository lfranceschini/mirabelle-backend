let express = require('express');
let mongoJS = require('./mongo');
let bodyParser = require('body-parser');
let queryString = require('querystring');
let url = require('url');
let multer = require('multer');
let upload = multer({storage: multer.memoryStorage()});

let app = express();

// create application/x-www-form-urlencoded parser
let urlencodedParser = bodyParser.urlencoded({ extended: false })

let productCreation = {};

// create application/json parser
var jsonParser = bodyParser.json()

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.render('login.ejs');
})
    .get('/product', async (req, res) => {
        let stepObj = queryString.parse(url.parse(req.url).query);
        let step = stepObj.step;
        if(step === '' || !step){
            productCreation = {};
            step = 'product';
        }
        let myProviders = [];
        myProviders = await mongoJS.findAll('provider');
        res.render('add-product.ejs', { providers: myProviders, step: step, productCreation: productCreation });
    })
    .post('/product', upload.array('files') , function (req, res) {
        console.log('BODY', req.files);
        productCreation.product = req.body;
        mongoJS.insertOne('product', req.body);
        res.redirect('/product?step=provider');
    })
    .post('/summary', urlencodedParser,  (req, res) => {
        productCreation.provider = req.body;
        res.redirect('/product?step=summary');
    })
    .get('/provider', (req, res) => {
        res.render('provider.ejs');
    })
    .post('/provider', urlencodedParser, (req, res) => {
        mongoJS.insertOne('provider', req.body);
        res.redirect('/provider');
    });

app.listen(8080);