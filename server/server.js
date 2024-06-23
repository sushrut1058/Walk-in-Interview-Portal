
const http = require('http');
dotenv = require('dotenv');

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
dotenv.config({ path: envFile });

const app = require('./app');
const sequelize = require('./models/config/database');

const { setupSocket, socketServer } = require('./sockets/index');

const {authenticateSocket, authenticateSocket_recruiter} = require('./middleware/auth');
const server = http.createServer(app);
socketServer(server);

const PORT = process.env.PORT || 8000;

/*
Initialize Sequelize and the HTTP server
*/
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    return sequelize.sync(); // Sync models to the database tables
  })
  .then(() => {
    console.log('Database synchronized');
    // Start listening to the server only after the database is ready
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


