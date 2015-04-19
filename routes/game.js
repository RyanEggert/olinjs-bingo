var mongoose = require("mongoose");
var models = require('../models/models');

var Game = models.game;
var Card = models.card;
var User = models.user;
var CardSet = models.cardset;

var routes = {};

routes.newCardSet = function(req, res) {
  /* Create and save new card set based on user input */

  // Get data submitted by user from form
  // TODO: DEFINITELY make this less stupid
  var card1 = req.body.card1;
  var card2 = req.body.card2;
  var card3 = req.body.card3;
  var card4 = req.body.card4;
  var card5 = req.body.card5;
  var card6 = req.body.card6;
  var card7 = req.body.card7;
  var card8 = req.body.card8;
  var card9 = req.body.card9;
  var card10 = req.body.card10;
  var card11 = req.body.card11;
  var card12 = req.body.card12;
  var card13 = req.body.card13;
  var card14 = req.body.card14;
  var card15 = req.body.card15;
  var card16 = req.body.card16;
  var card17 = req.body.card17;
  var card18 = req.body.card18;
  var card19 = req.body.card19;
  var card20 = req.body.card20;
  var card21 = req.body.card21;
  var card22 = req.body.card22;
  var card23 = req.body.card23;
  var card24 = req.body.card24;
  var card25 = req.body.card25;

  var square_set = [card1, card2, card3, card4, card5,
    card6, card7, card8, card9, card10,
    card11, card12, card13, card14, card15,
    card16, card17, card18, card19, card20,
    card21, card22, card23, card24, card25
  ];
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
    };
    console.log(cardset);
    res.send(cardset);
  });

};

routes.newGame = function(req, res) {
  /* Create and save a new game with set start time and pre-made card set */

  // Get data submitted by user from form 
  var card_set_id = req.body.card_set_id;
  var room = req.body.room;
  var host_name = req.body.host;

  // Default state of the game is open for play (Change later)
  var isOpen = true;

  // Get start date from user input
  var start_time = req.body.startDate;

  // Find the specified card set
  CardSet.findOne({
    _id: card_set_id
  }, function(err, cardset) {

    if (err) {
      console.error("Couldn't find specified cardset", err);
      res.status(500).send("Couldn't find specified cardset");
    };

    User.findOne({
      name: host_name
    }, function(err, host) {
      if (err) {
        console.error("Couldn't find host user", err);
        res.status(500).send("Couldn't find specified host user");
      };

      var newGame = new Game({
        host: host,
        room: room,
        card_set: cardset,
        start_time: start_time,
        isOpen: isOpen
      });

      // Save the new game to the database
      newGame.save(function(error, game) {
        if (error) {
          console.error("Can't add new game!", error);
          res.status(500).send("Couldn't add new game to db!");
        };

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
	CardSet.find({creator: currentUser}, function(err, cardsets) {

	});*/

  // Remove this once we have user login working
  CardSet.find({}, function(err, cardsets) {
    if (err) {
      console.error("Couldn't find card sets", err);
      res.status(500).send("couldn't find any card sets!");
    };
    console.log(cardsets);
    res.send(cardsets);
  });
};

routes.login = function(req, res) {
  // Allow users to log in as a guest or login with facebook


}

module.exports = routes;
