const express = require('express');
const fs = require('fs');
const { loadModel, transcriptFromFile} = require('./voskjs');


let csvToJson = require('convert-csv-to-json');
let jsonObj = csvToJson.parseSubArray('*',',').getJsonFromCsv('new_epic_100_train.csv');


let model;
async function main () {
model = loadModel('./models/vosk-model-en-in-0.4');
}

main();

const app = express();

app.use(express.text({limit:'50mb',extended:true}))
app.use(express.json({limit:'50mb',extended:true}))
app.use(express.urlencoded({limit:'50mb',extended:true}))

//Test db connection
app.post('/sendaudio', async (req,res) => {
  var request = req.body;
  fs.writeFileSync('file.wav', Buffer.from(request.sound.replace('data:audio/wav; codecs=opus;base64,', ''), 'base64'));
  const result = await transcriptFromFile('file.wav', model); 
  res.send(result);
});

app.get('/getjson', async (req,res) => {
  res.send({response:jsonObj})
});

// Starting our server.
app.listen(5015, () => {
  console.log('Go to http://localhost:5015 so you can see the data.');
});
