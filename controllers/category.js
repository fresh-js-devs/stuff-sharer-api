const { validationResult } = require('express-validator');

const Category = require('../models/category');
const User = require('../models/user');

exports.getCategories = (req, res, next) => {
  Category.find()
    .then(categories => {
      if (!categories) {
        const error = new Error('Could not find any category!');
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({
        mesasge: 'Categories fetched...',
        data: categories,
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.getCategory = (req, res, next) => {
  const categoryId = req.params.categoryId;

  Category.findById(categoryId)
    .then(category => {
      if (!category) {
        const error = new Error('Could not find category!');
        error.statusCode = 404;
        throw error;
      }

      res.status(200).json({ message: 'Category fetched...', data: category });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createCategory = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed!');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const title = req.body.title;
  const description = req.body.description;

  let creator;
  const category = new Category({
    title,
    description,
    creator: req.userId,
  });

  category
    .save()
    .then(result => {
      return User.findById(req.userId);
    })
    .then(user => {
      creator = user;
      user.categories.push(category);
      return user.save();
    })
    .then(result => {
      res.status(201).json({
        message: 'Category created successfully',
        data: category,
        creator: { _id: creator._id, username: creator.username },
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateCategory = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const error = new Error('Validation failed!');
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }

  const categoryId = req.params.categoryId;
  const title = req.body.title;
  const description = req.body.description;

  Category.findById(categoryId).then(category => {
    if (!category) {
      const error = new Error('Could not find category!');
      error.statusCode = 404;
      throw error;
    }

    if (category.creator.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 401;
      throw error;
    }

    category.title = title;
    category.description = description;

    return category.save();
  });
  then(result => {
    res.status(200).json({ message: 'Category updated...', data: result });
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  });
};

exports.deleteCategory = (req, res, next) => {
  const categoryId = req.params.categoryId;

  Category.findById(categoryId)
    .then(category => {
      // Check logged in user
      if (!category) {
        const error = new Error('Could not find category!');
        error.statusCode = 404;
        throw error;
      }

      if (category.creator.toString() !== req.userId) {
        const error = new Error('Not authorized!');
        error.statusCode = 401;
        throw error;
      }

      return Category.findByIdAndRemove(categoryId);
    })
    .then(result => {
      return User.findById(req.userId);
    })
    .then(user => {
      user.posts.pull(categoryId);
      return user.save();
    })
    .then(result => {
      res.status(200).json({ message: 'Category deleted...' });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};
