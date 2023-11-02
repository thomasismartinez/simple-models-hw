// pull in our models. This will automatically load the index.js from that folder
const models = require('../models');

const { Cat, Dog } = models;

// default fake data so that we have something to work with until we make a real Cat
const defaultData = {
  name: 'unknown',
  bedsOwned: 0,
};

const defaultDogData = {
  name: 'unknown',
  breed: 'unknown',
  age: 0,
};

let lastAdded = new Cat(defaultData);
let lastDogAdded = new Dog(defaultDogData);

const hostIndex = (req, res) => {
  res.render('index', {
    currentName: lastAdded.name,
    title: 'Home',
    pageName: 'Home Page',
  });
};

const hostPage1 = async (req, res) => {
  try {
    const docs = await Cat.find({}).lean().exec();
    return res.render('page1', { cats: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'failed to retrieve cats' });
  }
};

const hostPage2 = (req, res) => {
  res.render('page2');
};

const hostPage3 = (req, res) => {
  res.render('page3');
};

const hostPage4 = async (req, res) => {
  try {
    const docs = await Dog.find({}).lean().exec();
    return res.render('page4', { dogs: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'failed to retrieve dogs' });
  }
};

const getName = (req, res) => res.json({ name: lastAdded.name });

const setName = async (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.beds) { // req.body is used for POST parameters
    return res.status(400).json({ error: 'firstname,lastname and beds are all required' });
  }

  const catData = {
    name: `${req.body.firstname} ${req.body.lastname}`,
    bedsOwned: req.body.beds,
  };

  const newCat = new Cat(catData);

  // try doing something without crashing server
  try {
    await newCat.save();

    lastAdded = newCat;
    return res.json({
      name: lastAdded.name,
      beds: lastAdded.bedsOwned,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'failed to create cat' }); // internal server err
  }
};

const searchName = async (req, res) => {
  if (!req.query.name) { // req.query is used for GET parameters
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }

  try {
    const doc = await Cat.findOneAndUpdate({ name: req.query.name }, { $inc: { bedsOwned: 1 } });

    // const doc = await Cat.findOne({name: req.query.name}).select('name bedsOwned').exec();

    if (!doc) { // no cat with that name in database
      return res.status(404).json({ error: 'cat not found' });
    }

    return res.json({ name: doc.name, beds: doc.bedsOwned });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong with updating the cat' });
  }
};

const updateLast = (req, res) => {
  lastAdded.bedsOwned++;

  lastAdded.save().then(() => res.json({
    name: lastAdded.name,
    beds: lastAdded.bedsOwned,
  })).catch((err) => {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong with updating the cat' });
  });
};

const notFound = (req, res) => {
  res.status(404).render('notFound', {
    page: req.url,
  });
};

// DOG
const setDogName = async (req, res) => {
  if (!req.body.firstname || !req.body.lastname || !req.body.breed || !req.body.age) { // req.body is used for POST parameters
    return res.status(400).json({ error: 'firstname, lastname, breed, and age are all required' });
  }

  // for debug
  console.log(`name: ${req.body.firstname} ${req.body.lastname}, breed: ${req.body.breed}, age: ${req.body.age}`)

  const dogData = {
    name: `${req.body.firstname} ${req.body.lastname}`,
    bedsOwned: req.body.age,
  };

  const newDog = new Dog(dogData);

  // try doing something without crashing server
  try {
    await newDog.save();

    lastDogAdded = newDog;
    return res.json({
      name: lastDogAdded.name,
      breed: lastDogAdded.breed,
      age: lastDogAdded.age,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'failed to create dog' }); // internal server err
  }
};

const findDogByName = async (req, res) => {
  if (!req.query.name) { // req.query is used for GET parameters
    return res.status(400).json({ error: 'Name is required to perform a search' });
  }

  try {
    // with update
    const doc = await Dog.findOneAndUpdate({ name: req.query.name }, { name: req.query.name }, { $inc: { age: 1 } });

    if (!doc) { // no dog with that name in database
      return res.status(404).json({ error: 'dog not found' });
    }

    return res.json({ name: doc.name, breed: doc.breed, beds: doc.age });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Something went wrong with updating the dog' });
  }
};

module.exports = {
  index: hostIndex,
  page1: hostPage1,
  page2: hostPage2,
  page3: hostPage3,
  page4: hostPage4,
  getName,
  setName,
  updateLast,
  searchName,
  notFound,
  setDogName,
  findDogByName
};
