// const mongodb = require('mongodb');
// const MongoClient = mongodb.MongoClient;
// const ObjectID = mongodb.ObjectID;
const {
  MongoClient,
  ObjectId
} = require('mongodb')

const connectionURL = 'mongodb://127.0.0.1:27017';
const dbName = 'task-manager';


MongoClient.connect(connectionURL, {
  useNewUrlParser: true
}, (err, client) => {
  if (err) {
    return console.log('Unable to connect to the DB');
  }

    const db = client.db(dbName);
    db.collection('users').deleteMany({ age: 33 }).then((success) => { 
      console.log(success)
    }).catch((err) => { 
      console.log(err)
    })
});