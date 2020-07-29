let express = require('express');
let bodyParser = require('body-parser');
let queryString = require('querystring');
let urll = require('url');
let mongoClient = require('mongodb').MongoClient;
let url = "mongodb://localhost:27017/";

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
        let stepObj = queryString.parse(urll.parse(req.url).query);
        let step = stepObj.step;
        console.log('productCreation', productCreation);
        if(step === '' || !step){
            productCreation = {};
            step = 'product';
        }
        let myProviders = [];
        myProviders = await findAllInMongo('provider');
        res.render('add-product.ejs', { providers: myProviders, step: step, productCreation: productCreation });
    })
    .post('/product', urlencodedParser, function (req, res) {
        productCreation.product = req.body;
        insertInMongo('product', req.body);
        res.redirect('/product?step=provider');
    })
    .post('/summary', urlencodedParser,  (req, res) => {
        console.log('req', req.body);
        productCreation.provider = req.body;
        res.redirect('/product?step=summary');
    })
    .get('/provider', (req, res) => {
        res.render('provider.ejs');
    })
    .post('/provider', urlencodedParser, (req, res) => {
        insertInMongo('provider', req.body);
        res.redirect('/provider');
    });

let insertInMongo = (collection, body) => {
    mongoClient.connect(url, (err, db) => {
        let dbo = db.db('mirabelle');
        dbo.collection(collection).insertOne(body, (err, res) => {
            if (err) console.log('err', err);
            db.close;
        })
    });
};

async function findAllInMongo(collectionName) {
    const client = await mongoClient.connect(url, { useNewUrlParser: true });
    const db = client.db('mirabelle');
    const collection = db.collection(collectionName);
    const providers = await collection.find({}).toArray();
    db.close;
    return providers;
};


app.listen(8080);