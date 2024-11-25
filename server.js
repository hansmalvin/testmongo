const { MongoClient, ObjectId } = require('mongodb'); // Add ObjectId import
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbName = 'npm';

async function main() {
  await client.connect();
  console.log('Connected successfully to server');
  const db = client.db(dbName);
  const collection = db.collection('mahasiswa');

  const app = express();
  app.use(cors());
  app.use(bodyParser.json());

  // Create a new student
  app.post('/students', async (req, res) => {
    const { name, email } = req.body;
    await collection.insertOne({ name, email });
    res.status(201).send('Student created');
  });

  // Get all students
  app.get('/students', async (req, res) => {
    const students = await collection.find({}).toArray();
    res.json(students);
  });

  // Update a student
  app.put('/students/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;
    try {
      const result = await collection.updateOne(
        { _id: new ObjectId(id) }, // Use ObjectId here
        { $set: { name, email } }
      );
      if (result.matchedCount === 0) {
        res.status(404).send('Student not found');
      } else {
        res.send('Student updated');
      }
    } catch (err) {
      res.status(400).send('Invalid ID format');
    }
  });

  // Delete a student
  app.delete('/students/:id', async (req, res) => {
    const { id } = req.params;
    try {
      const result = await collection.deleteOne({ _id: new ObjectId(id) }); // Use ObjectId here
      if (result.deletedCount === 0) {
        res.status(404).send('Student not found');
      } else {
        res.send('Student deleted');
      }
    } catch (err) {
      res.status(400).send('Invalid ID format');
    }
  });

  app.listen(3000, () => console.log('Server running on http://localhost:3000'));
}

main().catch(console.error);
