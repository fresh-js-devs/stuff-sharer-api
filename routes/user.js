const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const userController = require('../controllers/user');

const User = require('../models/user');

const isAuth = require('../middleware/is-auth');

/**
 * @swagger
 * /users:
 *    get:
 *      tags:
 *          - Users
 *      summary: This should return all users.
 *      consumes:
 *        - application/json
 *      responses:
 *        200:
 *          description: Receive back all users.
 */
router.get('/', isAuth, userController.getUsers);

/**
 * @swagger
 * /users/:userId:
 *    get:
 *      tags:
 *          - Users
 *      summary: This should return the user and id of the specified user
 *      consumes:
 *        - application/json
 *      responses:
 *        200:
 *          description: Receive back user specified by id.
 */
router.get('/', isAuth, userController.getUser);

/**
 * @swagger
 * /users/signup:
 *    put:
 *      tags:
 *          - Users
 *      summary: This should sign up a new user.
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: body
 *          in: body
 *          schema:
 *            type: object
 *            properties:
 *              username:
 *                type: string
 *              email:
 *                type: string
 *              password:
 *                type: string
 *      responses:
 *        200:
 *          description: Receive back added user's id.
 */
router.put(
  '/signup',
  [
    body('username')
      .trim()
      .isLength({ min: 2 }),
    body('email')
      .trim()
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom((value, { res }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-Mail address already exists!');
          }
        });
      })
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 6 }),
  ],
  userController.signup,
);

// PUT: /users/:userId
router.put(
  '/:userId',
  [
    body('username')
      .trim()
      .isLength({ min: 2 }),
    body('email')
      .trim()
      .isEmail(),
    body('password')
      .trim()
      .isLength({ min: 6 }),
  ],
  userController.updateUser,
);

/**
 * @swagger
 * /users/login:
 *    post:
 *      tags:
 *          - Users
 *      summary: This should login user and return token, userId.
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: body
 *          in: body
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *      responses:
 *        200:
 *          description: Receive back JWT token and userId.
 */
router.post('/login', userController.login);

module.exports = router;
