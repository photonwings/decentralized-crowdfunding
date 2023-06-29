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
app.get(
  "/api/get-is-liked/:campaignAddr/:publicAddr",
  CampaignHandler.getIsLIked
);
app.get(
  "/api/get-is-voted/:campaignAddr/:publicAddr",
  CampaignHandler.getIsVoted
);
app.get("/api/get-users", CampaignHandler.getUsers);
app.get("/api/get-progress/:campaignAddr", CampaignHandler.getProgress);
app.get("/api/get-question/:campaignAddr", CampaignHandler.getQuestion);
app.get("/api/get-options/:campaignAddr", CampaignHandler.getOptions);
app.get("/api/get-comments/:campaignAddr", CampaignHandler.getComments);

// Post request
app.post("/api/create-user", CampaignHandler.createUser);
app.post("/api/create-campaign", CampaignHandler.createCampaign);
app.post("/api/create-progress", CampaignHandler.createProgress);
app.post("/api/create-poll", CampaignHandler.createPoll);
app.post("/api/create-comment", CampaignHandler.createComment);

// Put request
app.put("/api/put-likes", CampaignHandler.putLikes);
app.put("/api/put-is-liked", CampaignHandler.putIsLiked);
app.put("/api/put-option", CampaignHandler.putOption);

// Delete poll
app.delete("/api/delete-poll/:campaignAddr", CampaignHandler.deletePoll);

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
