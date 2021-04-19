const express = require('express')
const {spawn} = require('child_process');
let MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";
const app = express()
const port = 3000;
let curIndex = 0;

function ReverseString(str) {
    if(!str || str.length < 2 || typeof str!== 'string') {
        return 'Not valid'; 
    } 
    const revArray = [];
    const length = str.length - 1; 
    for(let i = length; i >= 0; i--) {
        revArray.push(str[i]);
    } 
    return revArray.join('');
}

app.post('/', (req, res) => {
    const python = spawn('python', ['mine.py']);
    python.stdout.on('data', function (data) {
        console.log('Data from python script ...');
        var obj = JSON.parse(data);
        var s = obj['Result'].replace(/[0-9]/g, '');
        var n = obj['Result'].replace(/[a-zA-Z]/g, '');
        var final_s = ReverseString(s);
        var resArr = final_s.split("");
        var numArr = n.split("");
        let sum = 0;
        for (i = 0; i < numArr.length; i++) sum += parseInt(numArr[i]);
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("Dhamija");
            dbo.collection("Dhamija").insertOne({
                Letter: resArr[curIndex - 1],
                Number: sum
            }, 
            function(err, result) {
                if (err) throw err;
                res.json(result);
                db.close();
            });
        });
        if(curIndex < resArr.length) curIndex++;
    });
    python.on('close', (code) => {
        console.log(`child process close all stdio with code ${code}`);
    });
})

app.get('/:Letter', (req, res) => {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("Dhamija");
        dbo.collection("Dhamija").findOne({
            Letter: req.params.Letter
        }, 
        function(err, result) {
            if (err) throw err;
            res.json(result);
            db.close();
        });
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`))