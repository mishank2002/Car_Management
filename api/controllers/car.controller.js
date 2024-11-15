import Car from '../models/car.model.js';

export const searchCars = async (req, res) => {
  try {
    const { searchTerm } = req.query;

    // Add case-insensitive regex search for title, description, or tags
    const cars = await Car.find({
      $or: [
        { title: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
        { tags: { $regex: searchTerm, $options: 'i' } },
      ],
    });

    res.status(200).json(cars);
  } catch (error) {
    console.error('Error fetching cars for search:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch cars for search' });
  }
};

export const createCar = async (req, res) => {
  try {
      const { title, description, tags, images } = req.body;

      // Validate image count
      if (images.length > 10) {
          return res.status(400).json({ success: false, error: 'You can upload a maximum of 10 images' });
      }

      const car = new Car({
          title,
          description,
          tags,
          images,
          userRef: req.user.id, // Assuming authentication middleware adds user to the request
      });

      await car.save();
      res.status(201).json({ success: true, car, message: 'Car created successfully' });
  } catch (error) {
      res.status(400).json({ success: false, error: 'Failed to create car' });
  }
};


export const getCars = async (req, res) => {
  try {
    // Fetch all cars without user-specific filtering
    const cars = await Car.find();
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch cars' });
  }
};

export const getOfferCars = async (req, res) => {
  try {
    // Fetch only cars with offers
    const cars = await Car.find({ offer: true }).limit(4);
    res.status(200).json(cars);
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch offer cars' });
  }
};


export const getCarById = async (req, res) => {
    try {
        const car = await Car.findById(req.params.id);
        if (!car) return res.status(404).json({ error: 'Car not found' });

        res.status(200).json(car);
    } catch (error) {
        res.status(400).json({ error: 'Failed to fetch car details' });
    }
};

export const updateCar = async (req, res) => {
    try {
        const { title, description, tags, images } = req.body;

        // Find and update car
        const car = await Car.findOneAndUpdate(
            { _id: req.params.id, userRef: req.user.id },
            { title, description, tags, images },
            { new: true }
        );

        if (!car) return res.status(404).json({ error: 'Car not found or unauthorized' });

        res.status(200).json(car);
    } catch (error) {
        res.status(400).json({ error: 'Failed to update car' });
    }
};

export const deleteCar = async (req, res) => {
  try {
      const car = await Car.findOneAndDelete({ _id: req.params.id, userRef: req.user.id });

      if (!car) return res.status(404).json({ success: false, error: 'Car not found or unauthorized' });

      res.status(200).json({ success: true, message: 'Car deleted successfully' });
  } catch (error) {
      res.status(400).json({ success: false, error: 'Failed to delete car' });
  }
};
