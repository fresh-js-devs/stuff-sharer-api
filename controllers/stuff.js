const { validationResult } = require('express-validator');

const Stuff = require('../models/stuff');

exports.getAllStuff = (req, res, next) => {
  Stuff.find()
    .then(stuff => {
      if (!stuff) {
        const error = new Error('Could not find any stuff!');
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({
        mesasge: 'Stuff fetched...',
        data: stuff,
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getStuff = (req, res, next) => {
  const stuffId = req.params.stuffId;

  Stuff.findById(stuffId)
    .then(stuff => {
      if (!stuff) {
        const error = new Error('Could not find stuff!');
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({ message: 'Stuff fetched...', data: stuff });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createStuff = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed!');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const name = req.body.name;
  const description = req.body.description;
  const categoryId = req.body.categoryId;
  const imageUrl = req.body.imageUrl;

  const stuff = new Stuff({
    name,
    description,
    categoryId,
    imageUrl,
  });

  stuff
    .save()
    .then(result => {
      res.status(201).json({
        message: 'Stuff created successfully',
        data: result,
      });
    })
    .catch(err => console.log(err));
};

exports.updateStuff = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed!');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const stuffId = req.params.stuffId;
  const name = req.body.name;
  const description = req.body.description;
  const categoryId = req.body.categoryId;
  const imageUrl = req.body.imageUrl;

  Stuff.findById(stuffId).then(stuff => {
    if (!stuff) {
      const error = new Error('Could not find stuff!');
      error.statusCode = 404;
      throw error;
    }
    stuff.name = name;
    stuff.description = description;
    stuff.categoryId = categoryId;
    stuff.imageUrl = imageUrl;

    return stuff.save();
  });
  then(result => {
    res.status(200).json({ message: 'Stuff updated...', data: result });
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};

exports.deleteStuff = (req, res, next) => {
  const stuffId = req.params.stuffId;

  Stuff.findById(stuffId)
    .then(stuff => {
      // Check logged in user
      if (!stuff) {
        const error = new Error('Could not find stuff!');
        error.statusCode = 404;
        throw error;
      }

      return Stuff.findByIdAndRemove(stuffId);
    })
    .then(result => {
      res.status(200).json({ message: 'Stuff deleted...' });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
