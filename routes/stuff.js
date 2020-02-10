const express = require('express');
const { body } = require('express-validator');

const router = express.Router();

const stuffController = require('../controllers/stuff');

const isAuth = require('../middleware/is-auth');

/**
 * @swagger
 * /stuff:
 *    get:
 *      tags:
 *          - Stuff
 *      summary: This should return all stuff.
 *      consumes:
 *        - application/json
 *      responses:
 *        200:
 *          description: Receive back all stuff.
 */
router.get('/', isAuth, stuffController.getAllStuff);

/**
 * @swagger
 * /stuff/:stuffId:
 *    get:
 *      tags:
 *          - Stuff
 *      summary: This should return the stuff and id of the specified stuff
 *      consumes:
 *        - application/json
 *      responses:
 *        200:
 *          description: Receive back stuff specified by id.
 */
router.get('/:stuffId', isAuth, stuffController.getStuff);

/**
 * @swagger
 * /stuff:
 *    post:
 *      tags:
 *          - Stuff
 *      summary: This should create a new stuff.
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: body
 *          in: body
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              description:
 *                type: string
 *              imageUrl:
 *                type:
 *              categoryId:
 *                type: string
 *      responses:
 *        200:
 *          description: Receive back added stuff and message.
 */
router.post(
  '/',
  isAuth,
  [
    body('name')
      .trim()
      .isLength({ min: 2 }),
  ],
  stuffController.createStuff,
);

/**
 * @swagger
 * /stuff/:stuffId:
 *    put:
 *      tags:
 *          - Stuff
 *      summary: This should update specific stuff.
 *      consumes:
 *        - application/json
 *      parameters:
 *        - name: body
 *          in: body
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              description:
 *                type: string
 *              imageUrl:
 *                type:
 *              categoryId:
 *                type: string
 *      responses:
 *        200:
 *          description: Updates category.
 */
router.put(
  '/:stuffId',
  isAuth,
  [
    body('name')
      .trim()
      .isLength({ min: 2 }),
  ],
  stuffController.updateStuff,
);

/**
 * @swagger
 * /stuff/:stuffId:
 *    delete:
 *      tags:
 *          - Stuff
 *      summary: This should delete specific stuff
 *      consumes:
 *        - application/json
 *      responses:
 *        200:
 *          description: Deletes stuff specified by id.
 */
router.delete('/:stuffId', isAuth, stuffController.deleteStuff);

module.exports = router;
