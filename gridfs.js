var fs = require("fs"),
    mongo = require("mongodb"),
    Grid = require("gridfs-stream"),
    gridfs,
    writeStream,
    readStream,
    buffer = "";
let url = "mongodb://localhost:27017/";
const multer = require('multer');
const GridFsStorage = require('multer-gridfs-storage');

// Create a storage object with a given configuration
const storage = new GridFsStorage({ url: `${url}/mirabelle` });
const upload = multer({ storage });

exports.insertPictures = async (pictures) => {
    const client = await mongo.connect(url, { useNewUrlParser: true });
    const db = client.db('mirabelle');
    gridfs = Grid(db, mongo);

    // write file
    writeStream = gridfs.createWriteStream({ filename: "halo1.jpg" });
    fs.createReadStream("./public/img/halo1.jpg").pipe(writeStream);
};

