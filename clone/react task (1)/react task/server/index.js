const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

const MongoClient = require('mongodb').MongoClient;
const routes = require('./routes.js')

function initSocketRoutes(db) {
  console.log('inited socket') // client connects:
  io.on('connection', (socket) => {
    console.log('a user connected');
    routes.initRoutes(socket);
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
}

const port = 7790;
server.listen(port, async () => {
  const db = await initDatabase();
  await routes.DAL.init(db);
  initSocketRoutes(db);
  console.log('listening on port ', port)
});

async function initDatabase() {
    const opts = { useUnifiedTopology: true };
    const db_user = 'diversibe'
    const db_pass = '9iQGSUSr_C-Ay6X9z'
    const dbConnection = (await MongoClient.connect(
        `mongodb+srv://${db_user}:${db_pass}@cluster0.cosq2.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`, opts)
    ).db( 'beatific' );
    return dbConnection;
}
