// ===============================================================================
// LOAD DATA
// Linking to the friends array data source
// ===============================================================================

var friendsData = require("../data/friends.js");

// ===============================================================================
// ROUTING
// ===============================================================================

module.exports = function (app) {
  // API GET Requests for array of friends
  //  ---------------------------------------------------------------------------

  app.get("/api/friends", function (req, res) {
    res.json(friendsData);
  });

  // API POST Requests
  // UPdates the friends array and sends back the most compatible friend in JSON format
  // ---------------------------------------------------------------------------

  app.post("api/friends", function (req, res) {
    // Move new friend data into variable
    var newFriend = req.body;
    // compute best match from scores
    var bestMatch = {};

    for (var i = 0; i < newFriend.scores.length; i++) {
      if (newFriend.scores[i] == "1 (Strongly Disagree)") {
        newFriend.scores[i] = 1;
      } else if (newFriend.scores[i] == "5 (Strongly Agree)") {
        newFriend.scores[i] = 5;
      } else {
        newFriend.scores[i] = parseInt(newFriend.scores[i]);
      }
    }
    // compare the scores of newFriend with the scores of each friend in the database and find the friend with the smallest difference when each set of scores is compared

    var bestMatchIndex = 0;
    //greatest score difference for a question is 4, therefore greatest difference is 4 times # of questions in survey
    var bestMatchDiff = 40;

    for (var i = 0; i < friendsData.length; i++) {
      var totalDiff = 0;

      for (var index = 0; index < friendsData[i].scores.length; index++) {
        var diffScore = Math.abs(friendsData[i].scores[index] - newFriend.scores[index]);
        totalDiff += diffScore;
      }

      // if the totalDifference in scores is less than the best match so far
      // save that index and difference
      if (totalDiff < bestMatchDiff) {
        bestMatchIndex = i;
        bestMatchDiff = totalDiff;
      }
    }

    // the best match index is used to get the best match data from the friends index
    bestMatch = friendsData[bestMatchIndex];

    // Put new friend from survey in "database" array
    friendsData.push(newFriend);

    // return the best match friend
    res.json(bestMatch);
  });

};