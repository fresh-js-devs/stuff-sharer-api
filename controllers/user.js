const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

exports.getUsers = (req, res, next) => {
  User.find()
    .then(users => {
      if (!users) {
        const error = new Error('Could not find any user!');
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({
        mesasge: 'Users fetched...',
        data: users,
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getUser = (req, res, next) => {
  const userId = req.params.userId;

  User.findById(userId)
    .then(user => {
      if (!user) {
        const error = new Error('Could not find user!');
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({ message: 'User fetched...', data: user });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.signup = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed!');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  bcrypt
    .hash(password, 12)
    .then(hashedPassword => {
      const user = new User({
        username,
        email,
        password: hashedPassword,
      });

      return user.save();
    })
    .then(result => {
      res.status(201).json({
        message: 'User created...',
        userId: result._id,
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateUser = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed!');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const userId = req.params.userId;
  const username = req.body.username;
  const email = req.body.email;

  User.findById(userId).then(user => {
    if (!user) {
      const error = new Error('Could not find user!');
      error.statusCode = 404;
      throw error;
    }
    user.username = username;
    user.email = email;

    return user.save();
  });
  then(result => {
    res.status(200).json({ message: 'User updated...', data: result });
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};

exports.login = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;

  User.findOne({ email })
    .then(user => {
      if (!user) {
        const error = new Error('A user with this E-Mail could not be found!');
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, user.password);
    })
    .then(isEqual => {
      if (!isEqual) {
        const error = new Error('Wrong password!');
        error.statusCode = 401;
        throw error;
      }

      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        'stuff-sharer-secred-code',
        { expiresIn: '1h' },
      );
      res.status(200).json({ token, userId: loadedUser._id.toString() });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
