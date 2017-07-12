'use strict'

const MongoClient = require('mongodb').MongoClient
const MONGODB_URI = 'mongodb://localhost:27017/tweeter'

MongoClient.connect(MONGODB_URI, (err, db) => {
  if (err) {
    console.error(`Failed to connect: ${MONGODB_URI}`)
    throw err
  }

  // Connection to tweeter-tweets db
  console.log(`Connected to mongodb: ${MONGODB_URI}`)

  // Program logic for connections will be invoked here
  //
  // aka this is an "entry point" for a database-connected app

  // Close connection at end:
  db.close()
})