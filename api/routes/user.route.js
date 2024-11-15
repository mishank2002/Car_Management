import express from 'express';
import { deleteUser, getUser, getUserListings, test, updateUser } from '../controllers/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

/**
 * @swagger
 * /user/test:
 *   get:
 *     summary: Test the user route
 *     tags: [User]
 *     responses:
 *       200:
 *         description: Test successful
 */
router.get('/test', test);

/**
 * @swagger
 * /user/update/{id}:
 *   post:
 *     summary: Update a user
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Updated username
 *               email:
 *                 type: string
 *                 description: Updated email address
 *               password:
 *                 type: string
 *                 description: Updated password (if changing)
 *               avatar:
 *                 type: string
 *                 description: URL to the user's avatar image
 *     responses:
 *       200:
 *         description: User updated successfully
 *       404:
 *         description: User not found
 */
router.post('/update/:id', verifyToken, updateUser);

/**
 * @swagger
 * /user/delete/{id}:
 *   delete:
 *     summary: Delete a user
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/delete/:id', verifyToken, deleteUser);

/**
 * @swagger
 * /user/listings/{id}:
 *   get:
 *     summary: Get listings of a user
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Successfully retrieved user listings
 *       404:
 *         description: User listings not found
 */
router.get('/listings/:id', verifyToken, getUserListings);

/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: Successfully retrieved user
 *       404:
 *         description: User not found
 */
router.get('/:id', verifyToken, getUser);

export default router;
