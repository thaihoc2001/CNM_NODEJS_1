import express from 'express';
import multer from 'multer';
// import store from './data/store';
import AWS from 'aws-sdk';
import * as dotenv from 'dotenv';
dotenv.config()

const upload = multer();
const app = express();
const store = [];

app.use(express.static('./template'));
app.set('view engine', 'ejs');
app.set('views', './template')

AWS.config.update({
    accessKeyId: process.env.ACESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    region: process.env.REGION
});

const docClient = new AWS.DynamoDB.DocumentClient();

const port = 3000;
const tableName = 'SanPham';

app.get('/', function (req, res) {
    const params = {
        TableName: tableName
    };
    docClient.scan(params, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
            return res.render('index', { data: data.Items });
        }
    })
})

app.post('/', upload.fields([]), function (req, res) {
    const { MaSanPham, TenSanPham, MoTaSanPham } = req.body;
    const params = {
        TableName: tableName,
        Item: { MaSanPham, TenSanPham, MoTaSanPham }
    };
    docClient.put(params, (err, data) => {
        if (err) {
            console.log(err);
        } else {
            console.log(data);
            return res.redirect('/');
        }
    })
})

app.post('/delete', upload.fields([]), function (req, res) {
    const { MaSanPham, TenSanPham} = req.body;
    const params = {
        TableName: tableName,
        Key: {
            'MaSanPham': MaSanPham,
            'TenSanPham': TenSanPham
        }
    };
    console.log('MaSanPham', params);
    docClient.delete(params, (err, data) => {
        if (err) {
            return res.send(err);
        } else {
            console.log('Success');
            return res.redirect('/');
        }
    });
})

app.listen(port, () => {
    console.log(`Server is runing on port ${port}`);
    console.log(process.env.REGION)
});
