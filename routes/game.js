var mongoose = require("mongoose");
var models = require('../models/models');
var tools = require('../utils/utils');

var Game = models.game;
var Card = models.card;
var User = models.user;
var CardSet = models.cardset;

var routes = {};

routes.newCardSet = function(req, res) {
  /* Create and save new card set based on user input */

  // Get data submitted by user from form
  // TODO: DEFINITELY make this less stupid

  var square_set = req.body.cards;
  var name = req.body.name;

  // Assign current logged in user as creator
  var creator = req.session.user;
  console.log(creator._id);

  // Create new CardSet object
  var newCardSet = new CardSet({
    name: name,
    square_set: square_set,
    creator: creator._id
  });

  // Save the new card set object to the database
  newCardSet.save(function(err, cardset) {
    if (err) {
      console.error('Cant add new card set', err);
      res.status(500).send("Couldn't add new card set to db");
    }
    console.log(cardset);
    res.send(cardset);
  });
};

routes.editedCardSet = function(req, res) {
  /* Create and save new card set based on user input */

  // Get data submitted by user from form
  // TODO: DEFINITELY make this less stupid

  var square_set = req.body.cards;
  var name = req.body.name;
  var id = req.body.id;

  console.log(square_set);
  console.log(name);
  console.log(id);

  CardSet.findOneAndUpdate({
    _id: id
  }, {
    name: name,
    square_set: square_set
  }).exec(function(err, cardset) {
    if (err) {
      console.error("Couldn't find specified cardset", err);
      res.status(500).send("Couldn't find specified cardset");
    }

    res.send(cardset);
  });
};

routes.getinfoCardSet = function(req, res) {
  CardSet.findOne({
    _id: req.body.cardsetid
  }, function(err, cardset) {
    if (err) {
      console.error("Couldn't find specified cardset", err);
      res.status(500).send("Couldn't find specified cardset");
    }

    res.send({
      name: cardset.name,
      choices: cardset.square_set
    });

  });
}

routes.editCardSet = function(req, res) {
  CardSet.findOne({
    _id: req.body.cardsetid
  }, function(err, cardset) {
    if (err) {
      console.error("Couldn't find specified cardset", err);
      res.status(500).send("Couldn't find specified cardset");
    }

    if (cardset.creator == req.session.user._id) {
      res.send({
        restrict: false
      });
    } else {
      res.send({
        restrict: true
      });
    }
  })
}

routes.deleteCardset = function(req, res) {
  var card_set_id = req.body.cardset_id;
  var card_in_use = true;

  CardSet.findOne({
    _id: card_set_id
  }, function(err, cardset) {
    if (err) {
      console.error("Couldn't find specified cardset", err);
      res.status(500).send("Couldn't find specified cardset");
    }

    Game.find({
      card_set: card_set_id
    }, function(err, list) {
      if (err) {
        console.error("Error finding the game", err);
        res.status(500).send("Error finding the game");
      }

      list = list.filter(function(game) {
        return !game.isFinished;
      })

      if (!list.length) {
        card_in_use = false;
      }

      if (cardset.creator == req.session.user._id && !card_in_use) {
        CardSet.findOneAndRemove({
          _id: card_set_id
        }, function(err, cardset) {
          res.send({
            restrict: false
          });
        })
      } else {
        res.send({
          restrict: true
        });
      }

    })
  });
}

routes.newGame = function(req, res) {
  /* Create and save a new game with set start time and pre-made card set */

  // Get data submitted by user from form
  var card_set_id = req.body.card_set_id;
  var room = req.body.room;
  var host_name = req.session.user.name;

  // Default state of the game is open for play (Change later)
  var isOpen = false;

  // Get start date from user input
  var start_time = req.body.startDate;

  // Find the specified card set
  CardSet.findOne({
    _id: card_set_id
  }, function(err, cardset) {

    if (err) {
      console.error("Couldn't find specified cardset", err);
      res.status(500).send("Couldn't find specified cardset");
    }

    User.findOne({
      name: host_name
    }, function(err, host) {
      if (err) {
        console.error("Couldn't find host user", err);
        res.status(500).send("Couldn't find specified host user");
      }

      var newGame = new Game({
        host: host,
        room: room,
        card_set: cardset,
        start_time: start_time,
        isOpen: isOpen,
        isFinished: false,
        winners: [],
      });

      // Save the new game to the database
      newGame.save(function(error, game) {
        if (error) {
          console.error("Can't add new game!", error);
          res.status(500).send("Couldn't add new game to db!");
        }

        console.log(game);
        res.send(game);
      });
    });
  });
};

routes.getUserCardsets = function(req, res) {
  /* Gets all of the card sets created by the current logged in user */

  /* // Uncomment this stuff once we have user log in working
  // Get the object Id of the current logged in user to use in query
  var currentUser = req.user._id;

  // Find all of the logged in user's card sets
  CardSet.find({creator: currentUser}, function(err, cardsets) {});*/

  // Remove this once we have user login working
  CardSet
    .find({})
    .populate('creator')
    .exec(function(err, cardsets) {
      if (err) {
        console.error("Error retrieving cardsets!", err);
        res.status(500).send("Error retrieving cardsets!");
      }
      res.send(cardsets); // an object, to allow the easy addition of more homepage data
    });
};


var generatecard = function(square_set, gameid) {
  // Order the square set randomly
  square_set.sort(function() {
    return 0.5 - Math.random();
  });
  console.log(square_set);

  // Set card's initial score
  var initScore = [
    [false, false, false, false, false],
    [false, false, false, false, false],
    [false, false, true, false, false],
    [false, false, false, false, false],
    [false, false, false, false, false]
  ];

  // Assign the squares for the card based on the shuffled square_set deck
  // TODO: make this less stupid with a loop or something
  var squares = [
    [square_set[0], square_set[1], square_set[2], square_set[3], square_set[4]],
    [square_set[5], square_set[6], square_set[7], square_set[8], square_set[9]],
    [square_set[10], square_set[11], "FREE", square_set[13], square_set[14]],
    [square_set[15], square_set[16], square_set[17], square_set[18], square_set[19]],
    [square_set[20], square_set[21], square_set[22], square_set[23], square_set[24]],
  ];

  // Create a new bingo card
  var newBingoCard = new Card({
    game: gameid,
    score: initScore,
    squares: squares
  });

  return newBingoCard;
};

var gamedata = function(err, data, res) {
  if (err) {
    console.log(err);
    return null;
  } else {
    if (data != null) {
      ncard = generatecard(data.card_set.square_set, data._id);
      return ncard;
    } else {
      return null;
    }
  }
};

routes.init = function(req, res) {
  /* Send data necessary to load game page */
  Game
    .findOne({
      _id: req.body.gameid
    })
    .populate('card_set host')
    .exec(function(err, data) {
      ncard = gamedata(err, data);
      if (ncard == null) {
        res.status(404).send("Game not found!");
        return;
      }
      ncard.user = req.session.user._id;
      Card.findOrCreate({
        game: ncard.game,
        user: ncard.user
      }, {
        game: ncard.game,
        squares: ncard.squares,
        user: ncard.user,
        score: ncard.score,
      }, {}, function(err, card) {
        if (err) {
          console.error("Error saving new card", err);
          res.status(500).send("Error saving new card");
        }

        res.send({
          user: req.session.user,
          game: data,
          card: card
        });
      });
    });
};

routes.updatescore_db = function(score, card_id) {
  Card.update({
    _id: card_id
  }, {
    score: score
  }, {}, function(err, data) {
    if (err) {
      console.log('Error updating score', err);
    }
  });
};

routes.startdb = function(gameid) {
  Game
    .findOneAndUpdate({
      _id: gameid
    }, {
      isOpen: true
    })
    .exec(function(err, data) {
      if (err) {
        console.log('Error starting game in db', err);
      }
    });
};
module.exports = routes;
