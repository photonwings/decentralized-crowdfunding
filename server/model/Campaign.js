const db = require("../utils/db");

const Campaign = {};

// Get request
Campaign.getLikes = async (likes) => {
  return new Promise((resolve, reject) => {
    db.query(
      `select likes from Campaign where campaignAddr = '${likes.campaignAddr}'`,
      (error, result) => {
        if (error) {
          reject({
            status: false,
            msg: `Databse error while fetching likes: ${error}`,
          });
        } else {
          resolve({ status: true, result: result[0] });
        }
      }
    );
  });
};

Campaign.getIsLiked = async (likes) => {
  return new Promise((resolve, reject) => {
    db.query(
      `select isLiked from Likes where campaignAddr = '${likes.campaignAddr}' 
      and publicAddr = '${likes.publicAddr}'`,
      (error, result) => {
        if (error) {
          reject({
            status: false,
            msg: `Databse error while fetching likes: ${error}`,
          });
        } else {
          resolve({ status: true, result: result[0] });
        }
      }
    );
  });
};

Campaign.getUser = async (user) => {
  return new Promise((resolve, reject) => {
    db.query(
      `select * from User where publicAddr = '${user.publicAddr}'`,
      (error, result) => {
        if (error) {
          reject({
            status: false,
            msg: `Databse error while fetching User: ${error}`,
          });
        } else {
          resolve({ status: true, result: result[0] });
        }
      }
    );
  });
};

Campaign.getProgress = async (progress) => {
  return new Promise((resolve, reject) => {
    db.query(
      `select * from Progress where campaignAddr = '${progress.campaignAddr}' order by dateOfProgress desc`,
      (error, result) => {
        if (error) {
          reject({
            status: false,
            msg: `Databse error while fetching progress: ${error}`,
          });
        } else {
          resolve({ status: true, result: result });
        }
      }
    );
  });
};

Campaign.getOptions = async (option) => {
  return new Promise((resolve, reject) => {
    db.query(
      `select optionName, count from PollOption where pollId = ${option.pollId}`,
      (error, result) => {
        if (error) {
          reject({
            status: false,
            msg: `Databse error while fetching options: ${error}`,
          });
        } else {
          resolve({ status: true, result: result });
        }
      }
    );
  });
};

Campaign.getComments = async (option) => {
  return new Promise((resolve, reject) => {
    db.query(
      `select publicAddr, commentText, dateOfComment, isCreator from Comment where campaignAddr = '${option.campaignAddr}' order by dateOfComment desc`,
      (error, result) => {
        if (error) {
          reject({
            status: false,
            msg: `Databse error while fetching comments: ${error}`,
          });
        } else {
          resolve({ status: true, result: result });
        }
      }
    );
  });
};

// Post request
Campaign.createUser = async (user) => {
  return new Promise((resolve, reject) => {
    db.query(
      `insert into User (publicAddr, nickName, icon) values('${user.publicAddr}', '${user.nickName}', '${user.icon}')`,
      (error, result) => {
        if (error) {
          reject({
            status: false,
            msg: `Databse error while creating user: ${error}`,
          });
        } else {
          resolve({ status: true, msg: "New user created" });
        }
      }
    );
  });
};

Campaign.createCampaign = async (campaign) => {
  return new Promise((resolve, reject) => {
    db.query(
      `insert into Campaign (campaignAddr, publicAddr, likes) values('${campaign.campaignAddr}', '${campaign.publicAddr}', 0)`,
      (error, result) => {
        if (error) {
          reject({
            status: false,
            msg: `Databse error while creating campaign: ${error}`,
          });
        } else {
          db.query(
            `insert into Likes(campaignAddr, publicAddr, isLiked) 
            values('${campaign.campaignAddr}','${campaign.publicAddr}',0)`,
            (error, result) => {
              if (error) {
                reject({
                  status: false,
                  msg: `Error while inserting likes: ${error}`,
                });
              } else {
                resolve({
                  status: true,
                  msg: "New campaign and likes created",
                });
              }
            }
          );
        }
      }
    );
  });
};

Campaign.createProgress = async (progress) => {
  return new Promise((resolve, reject) => {
    db.query(
      `insert into Progress (campaignAddr, progressTitle, dateOfProgress, description) values 
      ('${progress.campaignAddr}', '${progress.progressTitle}', '${progress.dateOfProgress}', '${progress.description}')`,
      (error, result) => {
        if (error) {
          reject({
            status: false,
            msg: `Database error while creating progress: ${error}`,
          });
        } else {
          resolve({ status: true, msg: "Progress added" });
        }
      }
    );
  });
};

Campaign.createPoll = async (poll) => {
  return new Promise((resolve, reject) => {
    if (poll.options.length < 2) {
      reject({
        status: false,
        msg: "At least two poll options are required.",
      });
    }

    db.query(
      `insert into Poll (campaignAddr, question) values('${poll.campaignAddr}', '${poll.question}')`,
      (error, result) => {
        if (error) {
          reject({
            status: false,
            msg: `Database error while creating poll question: ${error}`,
          });
        } else {
          const pollId = result.insertId;

          const optionValues = poll.options.map((option) => [pollId, option]);

          db.query(
            `insert into PollOption (pollId, optionName) VALUES ?`,
            [optionValues],
            (error, result) => {
              if (error) {
                reject({
                  status: false,
                  msg: `Database error while creating options: ${error}`,
                });
              } else {
                resolve({ status: true, msg: "Poll and options added" });
              }
            }
          );
        }
      }
    );
  });
};

Campaign.createComment = async (comment) => {
  return new Promise((resolve, reject) => {
    db.query(
      `insert into Comment(campaignAddr, publicAddr, commentText, dateOfComment, isCreator)
      values('${comment.campaignAddr}','${comment.publicAddr}','${comment.commentText}','${comment.dateOfComment}','${comment.isCreator}')`,
      (error, result) => {
        if (error) {
          reject({
            status: false,
            msg: `Database error while creating comment: ${error}`,
          });
        } else {
          resolve({ status: true, msg: "Comment added" });
        }
      }
    );
  });
};

// Put request
Campaign.putLikes = async (likes) => {
  return new Promise((resolve, reject) => {
    db.query(
      `update Campaign set likes = ${likes.like} where campaignAddr = '${likes.campaignAddr}'`,
      (error, result) => {
        if (error) {
          reject({
            status: false,
            msg: `Databse error while updating likes: ${error}`,
          });
        } else {
          resolve({ status: true, msg: "Likes updated" });
        }
      }
    );
  });
};

Campaign.putIsLiked = async (likes) => {
  return new Promise((resolve, reject) => {
    db.query(
      `update Likes set isLiked = ${likes.isLiked} where 
      campaignAddr = '${likes.campaignAddr}' and publicAddr = '${likes.publicAddr}'`,
      (error, result) => {
        if (error) {
          reject({
            status: false,
            msg: `Databse error while updating isLiked: ${error}`,
          });
        } else {
          resolve({ status: true, msg: "IsLiked updated" });
        }
      }
    );
  });
};

Campaign.putOption = async (option) => {
  return new Promise((resolve, reject) => {
    db.query(
      `update PollOption set count = ${option.count} where optionId = ${option.optionId} and pollId = ${option.pollId}`,
      (error, result) => {
        if (error) {
          reject({
            status: false,
            msg: `Databse error while updating option: ${error}`,
          });
        } else {
          resolve({ status: true, msg: "Option updated" });
        }
      }
    );
  });
};

// Delete request
Campaign.deletePoll = async (poll) => {
  return new Promise((resolve, reject) => {
    const pollId = poll.pollId;

    db.query(
      `DELETE FROM PollOption WHERE pollId = ${pollId}`,
      (error, result) => {
        if (error) {
          reject({
            status: false,
            msg: `Database error while deleting options: ${error}`,
          });
        } else {
          db.query(
            `DELETE FROM Poll WHERE pollId =${pollId}`,
            (error, result) => {
              if (error) {
                reject({
                  status: false,
                  msg: `Database error while deleting poll: ${error}`,
                });
              } else {
                resolve({ status: true, msg: "Poll and options deleted" });
              }
            }
          );
        }
      }
    );
  });
};

module.exports = Campaign;
