require("dotenv").config()
const express = require("express")
const app = express()
const axios = require("axios")
const moment = require("moment")
const images = require("./../images.js")
const fs = require("fs")
const path = require("path")
const EVENTS_ENDPOINT = "https://gameinfo.albiononline.com/api/gameinfo/events"

app.get("/image-test", async (req, res) => {
  const json = req.query.jsonFile;

  let event = null;

  if (json) {
    try {
      const file = fs.readFileSync(path.join(__dirname, 'events/', json));
      event = JSON.parse(file);
    } catch (e) {
      console.log(`Fail getting local image: ${e}`);
    }
  }

  if (!event) {
    try {
      console.log("Fetching latest event from API...");
      const response = await axios.get(EVENTS_ENDPOINT, {
        params: {
          offset: 0,
          limit: 1,
          timestamp: moment().unix(),
        },
      });

      event = response.data[0];
    } catch (e) {
      return res.send(`Failed to fetch event. Please try again: ${e}`);
    }
  }

  return res.contentType("image/png")
    .end(await images.generateEventImage(event), "binary");
});

app.listen(3000, () => {
  console.log("Go to http://localhost:3000");
});

