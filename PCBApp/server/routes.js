const express = require("express");
const fs = require("fs");
const { loadModel, transcriptFromFile } = require("./voskjs");

let csvToJson = require("convert-csv-to-json");
let allAnnots = csvToJson.fieldDelimiter(",").getJsonFromCsv("annotations.csv");
let updatedAnnots = allAnnots.map((annot) => {
  let newArray = annot.Actions.split("/");
  annot.Actions = newArray;
  return annot;
});

let model;
async function main() {
  model = loadModel("./models/vosk-model-small-hi-0.22");
}

main();

const app = express();

app.use(express.text({ limit: "50mb", extended: true }));
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

//Test db connection
app.post("/sendaudio", async (req, res) => {
  var request = req.body;
  fs.writeFileSync(
    "file.wav",
    Buffer.from(
      request.sound.replace("data:audio/wav; codecs=opus;base64,", ""),
      "base64"
    )
  );
  const result = await transcriptFromFile("file.wav", model);
  res.send(result);
});

app.get("/getjson", async (req, res) => {
  res.send({ response: updatedAnnots });
});

// Starting our server.
app.listen(process.env.PORT || 5015, () => {
  console.log("Go to http://localhost:5015 so you can see the data.");
});
