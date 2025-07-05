// server/seed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import connectDB from './configs/db.js';
import User from './models/User.js';
import Car from './models/Car.js';
import Booking from './models/Booking.js';

dotenv.config();

const NUM_USERS = 8;
const NUM_OWNERS = 3;
const NUM_CARS = 15;
const NUM_BOOKINGS = 20;

const carCategories = ['SUV', 'Sedan', 'Hatchback', 'Convertible', 'Coupe', 'Minivan'];
const fuelTypes = ['Petrol', 'Diesel', 'Electric', 'Hybrid'];
const transmissions = ['Manual', 'Automatic'];
const locations = [
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Pune', 'Ahmedabad'
];

function randomFrom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

async function seed() {
  await connectDB();
  try {
    // Clear existing data
    await Booking.deleteMany();
    await Car.deleteMany();
    await User.deleteMany();

    // Create owners
    const owners = [];
    for (let i = 0; i < NUM_OWNERS; i++) {
      owners.push(new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(), // Not hashed for demo
        role: 'owner',
        image: faker.image.avatar(),
      }));
    }
    // Create users
    const users = [];
    for (let i = 0; i < NUM_USERS; i++) {
      users.push(new User({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        role: 'user',
        image: faker.image.avatar(),
      }));
    }
    const allUsers = [...owners, ...users];
    await User.insertMany(allUsers);

    // Fetch saved users/owners with _id
    const savedOwners = await User.find({ role: 'owner' });
    const savedUsers = await User.find({ role: 'user' });

    // Create cars
    const cars = [];
    for (let i = 0; i < NUM_CARS; i++) {
      const owner = randomFrom(savedOwners);
      const brand = faker.vehicle.manufacturer();
      const model = faker.vehicle.model();
      const year = faker.number.int({ min: 2015, max: 2024 });
      const category = randomFrom(carCategories);
      const seating_capacity = faker.number.int({ min: 4, max: 8 });
      const fuel_type = randomFrom(fuelTypes);
      const transmission = randomFrom(transmissions);
      const pricePerDay = faker.number.int({ min: 1200, max: 5000 });
      const location = randomFrom(locations);
      const description = faker.lorem.sentences(2);
      const image = faker.image.urlPicsumPhotos({ width: 400, height: 250 });
      cars.push(new Car({
        owner: owner._id,
        brand,
        model,
        image,
        year,
        category,
        seating_capacity,
        fuel_type,
        transmission,
        pricePerDay,
        location,
        description,
        isAvaliable: true,
      }));
    }
    await Car.insertMany(cars);
    const savedCars = await Car.find();

    // Create bookings
    const bookings = [];
    for (let i = 0; i < NUM_BOOKINGS; i++) {
      const car = randomFrom(savedCars);
      const user = randomFrom(savedUsers);
      const owner = car.owner;
      // Generate random pickup/return dates
      const pickupDate = faker.date.between({ from: '2024-07-01', to: '2024-07-20' });
      const returnDate = faker.date.between({ from: pickupDate, to: '2024-07-30' });
      const price = car.pricePerDay * ((returnDate - pickupDate) / (1000 * 60 * 60 * 24));
      const status = randomFrom(['pending', 'confirmed', 'cancelled']);
      bookings.push(new Booking({
        car: car._id,
        user: user._id,
        owner: owner,
        pickupDate,
        returnDate,
        status,
        price: Math.round(price),
      }));
    }
    await Booking.insertMany(bookings);

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
}

seed(); 