import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import carRouter from './routes/car.routes.js';
import cookieParser from 'cookie-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors'

dotenv.config();

console.log('Mongo URI:', process.env.MONGO); // Debug log

mongoose
    .connect(process.env.MONGO)
    .then(() => {
        console.log('Connected to MongoDB!');
    })
    .catch((err) => {
        console.error('Failed to connect to MongoDB:', err.message);
    });

const app = express();

app.use(express.json());
app.use(cookieParser());

// CORS Configuration
const allowedOrigins = [
  'http://localhost:5173', // Local development frontend
  'https://mishank-car-management.onrender.com', // Replace with your production frontend URL
];

app.use(
  cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true, // Allow cookies or other credentials
  })
);


// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Car Management API',
      version: '1.0.0',
      description: 'API documentation for Car Management Application',
    },
    servers: [
      {
        url: 'https://car-management-0m4n.onrender.com/api',
      },
    ],
  },
  apis: ['./routes/*.js'], // Location of API routes
}; 

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/car', carRouter);

// Error handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal server error';
    return res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
