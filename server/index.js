const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./utils/db");
const CampaignHandler = require("./controller/CampaignHandler");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.send("API working...");
});

// Get request
app.get("/api/get-likes/:campaignAddr", CampaignHandler.getLikes);
app.get("/api/get-user/:publicAddr", CampaignHandler.getUser);
app.get("/api/get-progress/:campaignAddr", CampaignHandler.getProgress);
app.get("/api/get-option/:pollId", CampaignHandler.getOption);

// Post request
app.post("/api/create-user", CampaignHandler.createUser);
app.post("/api/create-progress", CampaignHandler.createProgress);
app.post("/api/create-poll", CampaignHandler.createPoll);

// Post request
app.put("/api/put-likes", CampaignHandler.putLikes);
app.put("/api/put-option", CampaignHandler.putOptions);

// Delete poll
app.delete("/api/delete-poll/:pollId", CampaignHandler.deletePoll);

db.connect((err) => {
  if (!err) {
    console.log("Database connected...");
    app.listen(PORT || 4001, () => {
      console.log(`Server running on PORT ${PORT}`);
    });
  } else {
    console.log("Error occured while connecting to database");
  }
});
