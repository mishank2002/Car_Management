import express from 'express';
import { google, signOut, signin, signup } from '../controllers/auth.controller.js';

const router = express.Router();

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Username of the new user
 *               email:
 *                 type: string
 *                 description: Email address of the user
 *               password:
 *                 type: string
 *                 description: Password for the user
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Failed to register user
 */
router.post('/signup', signup);

/**
 * @swagger
 * /auth/signin:
 *   post:
 *     summary: Sign in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email of the user
 *               password:
 *                 type: string
 *                 description: Password for the user
 *     responses:
 *       200:
 *         description: User signed in successfully
 *       401:
 *         description: Invalid credentials
 */
router.post('/signin', signin);

/**
 * @swagger
 * /auth/google:
 *   post:
 *     summary: Sign in with Google
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: Email from Google account
 *               name:
 *                 type: string
 *                 description: Name from Google account
 *               photo:
 *                 type: string
 *                 description: Profile photo URL from Google account
 *     responses:
 *       200:
 *         description: User signed in with Google
 *       400:
 *         description: Failed to sign in with Google
 */
router.post('/google', google);

/**
 * @swagger
 * /auth/signout:
 *   get:
 *     summary: Sign out the user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User signed out successfully
 */
router.get('/signout', signOut);

export default router;
