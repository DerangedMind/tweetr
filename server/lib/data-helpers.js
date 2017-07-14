"use strict";

// Simulates the kind of delay we see with network or filesystem operations
const simulateDelay = require("./util/simulate-delay");

// Defines helper functions for saving and getting tweets, using the database `db`
module.exports = function makeDataHelpers(db, ObjectID) {
  return {

    // Saves a tweet to `db`
    saveTweet: function(newTweet, callback) {
      simulateDelay(() => {
        db.collection('tweets').insertOne(newTweet).then(function () {
          callback(null, true);
        });
      });
    },

    // Get all tweets in `db`, sorted by newest first
    getTweets: function(callback) {
      const sortNewestFirst = (a, b) => a.created_at - b.created_at;
      db.collection('tweets').find().toArray().then(function (tweets) {
        callback(null, tweets)
      });
    },

    addLike: function(tweetID, callback) {
      let objID = new ObjectID(tweetID)

      db.collection('tweets')
        .update(
          { '_id': objID },
          { $inc: { likes: 1 } }
        )
        .then(function (response) { callback(null, response) })
        .catch(function (err) {
          console.log(err.message)
        })
    },
    removeLike: function(tweetID, callback) {
      let objID = new ObjectID(tweetID)
      
      db.collection('tweets')
        .update( 
          { '_id': objID },
          { $inc: { likes: -1 } }
        )
        .then(function (response) { callback(null, response) })
        .catch(function (err) {
          console.log(err.message)
        })
    }
  };
}
