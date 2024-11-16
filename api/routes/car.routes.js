import express from 'express';
import {
  createCar,
  deleteCar,
  getCarById,
  getCars,
  updateCar
} from '../controllers/car.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

/**
 * @swagger
 * /car/create:
 *   post:
 *     summary: Create a new car
 *     security:
 *       - BearerAuth: []
 *     tags: [Car]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the car listing
 *               description:
 *                 type: string
 *                 description: Description of the car
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags (car type, company, etc.)
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of image URLs
 *     responses:
 *       201:
 *         description: Car created successfully
 *       400:
 *         description: Failed to create car
 */
router.post('/create', verifyToken, createCar);

/**
 * @swagger
 * /car/delete/{id}:
 *   delete:
 *     summary: Delete a car by ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Car]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Car ID
 *     responses:
 *       200:
 *         description: Car deleted successfully
 *       404:
 *         description: Car not found or unauthorized
 */
router.delete('/delete/:id', verifyToken, deleteCar);

/**
 * @swagger
 * /car/update/{id}:
 *   post:
 *     summary: Update a car by ID
 *     security:
 *       - BearerAuth: []
 *     tags: [Car]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Car ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Updated title of the car
 *               description:
 *                 type: string
 *                 description: Updated description of the car
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Updated tags
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Updated array of image URLs
 *     responses:
 *       200:
 *         description: Car updated successfully
 *       404:
 *         description: Car not found or unauthorized
 */
router.post('/update/:id', verifyToken, updateCar);

/**
 * @swagger
 * /car/get/{id}:
 *   get:
 *     summary: Get a car by ID
 *     tags: [Car]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Car ID
 *     responses:
 *       200:
 *         description: Successfully retrieved car details
 *       404:
 *         description: Car not found
 */
router.get('/get/:id', getCarById);

/**
 * @swagger
 * /car/get:
 *   get:
 *     summary: Get all cars for the logged-in user
 *     security:
 *       - BearerAuth: []
 *     tags: [Car]
 *     responses:
 *       200:
 *         description: Successfully retrieved list of cars
 *       400:
 *         description: Failed to fetch cars
 */
router.get('/get', verifyToken, getCars);

export default router;
