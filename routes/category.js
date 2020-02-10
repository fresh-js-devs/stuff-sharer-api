const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const categoryController = require('../controllers/category');

const isAuth = require('../middleware/is-auth');

/**
 * @swagger
 * /categories:
 *    get:
 *      tags:
 *          - Categories
 *      summary: This should return all categories.
 *      consumes:
 *        - application/json
 *      responses:
 *        200:
 *          description: Receive back all user's categories.
 */
router.get('/', isAuth, categoryController.getCategories);

/**
 * @swagger
 * /categories/:categoryId:
 *    get:
 *      tags:
 *          - Categories
 *      summary: This should return the category and id of the specified category
 *      consumes:
 *        - application/json
 *      responses:
 *        200:
 *          description: Receive back category specified by id.
 */
router.get('/:categoryId', isAuth, categoryController.getCategory);

/**
 * @swagger
 * /categories:
 *    post:
 *      tags:
 *          - Categories
 *      summary: This should create a new category.
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: body
 *          in: body
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              description:
 *                type: string
 *              creator:
 *                type: string
 *      responses:
 *        200:
 *          description: Receive back added category and message.
 */
router.post(
  '/',
  isAuth,
  [
    body('title')
      .trim()
      .isLength({ min: 2 }),
  ],
  categoryController.createCategory,
);

/**
 * @swagger
 * /categories/:categoryId:
 *    put:
 *      tags:
 *          - Categories
 *      summary: This should update specific category.
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: body
 *          in: body
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              description:
 *                type: string
 *              creator:
 *                type: string
 *      responses:
 *        200:
 *          description: Updates category.
 */
router.put(
  '/:categoryId',
  isAuth,
  [
    body('title')
      .trim()
      .isLength({ min: 2 }),
  ],
  categoryController.updateCategory,
);

/**
 * @swagger
 * /categories/:categoryId:
 *    delete:
 *      tags:
 *          - Categories
 *      summary: This should delete specific category
 *      consumes:
 *        - application/json
 *      responses:
 *        200:
 *          description: Deletes category specified by id.
 */
router.delete('/:categoryId', isAuth, categoryController.deleteCategory);

module.exports = router;
