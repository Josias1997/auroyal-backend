const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const config = require('./config/config');
const auth = require('./routes/api/auth');
const users = require('./routes/api/users');
const payment = require('./routes/api/payment');

const PORT = process.env.PORT || 8000;

const app = express();

app.use(cookieParser());
app.use(cors());

app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.text({limit: '50mb'}));
app.use(bodyParser.json({ limit: '50mb', type: "application/json" }));


const server = http.createServer(app);
const io = socketio(server);

mongoose
    .connect(config.mongoURI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
    })
    .then(() => {
        console.log("Connected successfully");
    })
    .catch((err) => {
        console.log(err);
    });


app.use('/api/auth', auth);
app.use('/api/users', users);
app.use('/api/payments', payment);


server.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
})