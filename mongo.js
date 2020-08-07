let mongoClient = require('mongodb').MongoClient;
let gridfs = require('./gridfs');
let mongoUrl = 'mongodb://localhost:27017/';
let database = 'mirabelle';

// Insert one product in mongo database
exports.insertOne = (collection, data , files) => {
    mongoClient.connect(mongoUrl, (err, db) => {
        let dbo = db.db(database);
        if(files && files.length > 0){
            this.insertPictures(files.buffer);
        }
        dbo.collection(collection).insertOne(data, (err, res) => {
            if (err) console.log('err', err);
            db.close;
        })
    });
};

// Find all data in collection
exports.findAll = async collection =>{
    let db = await mongoClient.connect(mongoUrl);
    let dbo = db.db(database);
    const providers = await dbo.collection(collection).find({}).toArray()
        .catch(err => console.log(err));
    db.close;
    console.log('provideders', providers);
    return providers;
};

exports.insertPictures = (pictures) => {
    gridfs.insertPictures(pictures);
};