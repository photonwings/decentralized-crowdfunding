const Campaign = require("../model/Campaign");

const CampaignHandler = {};

// Get request
CampaignHandler.getLikes = async (req, res) => {
  try {
    const likes = req.params;
    const data = await Campaign.getLikes(likes);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
};

CampaignHandler.getUser = async (req, res) => {
  try {
    const user = req.params;
    const data = await Campaign.getUser(user);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
};

CampaignHandler.getProgress = async (req, res) => {
  try {
    const progress = req.params;
    const data = await Campaign.getProgress(progress);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
};

CampaignHandler.getOption = async (req, res) => {
  try {
    const option = req.params;
    const data = await Campaign.getOption(option);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Post request
CampaignHandler.createUser = async (req, res) => {
  try {
    const user = req.body;
    const data = await Campaign.createUser(user);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
};

CampaignHandler.createProgress = async (req, res) => {
  try {
    const progress = req.body;
    const data = await Campaign.createProgress(progress);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
};

CampaignHandler.createPoll = async (req, res) => {
  try {
    const poll = req.body;
    const data = await Campaign.createPoll(poll);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Put request
CampaignHandler.putLikes = async (req, res) => {
  try {
    const likes = req.body;
    const data = await Campaign.putLikes(likes);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
};

CampaignHandler.putOptions = async (req, res) => {
  try {
    const option = req.body;
    const data = await Campaign.putOption(option);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Delete request
CampaignHandler.deletePoll = async (req, res) => {
  try {
    const poll = req.params;
    const data = await Campaign.deletePoll(poll);
    res.status(200).send(data);
  } catch (error) {
    res.status(500).send(error);
  }
};

module.exports = CampaignHandler;
