import express from 'express'
import http from 'http';
import { Server } from 'socket.io'
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const path = require("path");
const app = express();
const port = process.env.PORT || 5000;



//middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());


// socket.io connection
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "http://localhost:3000" } });

io.on("connection", socket => {

    console.log("User connected with ", socket.id)

    socket.on("join_room", (data) => {
        console.log(data)
        socket.join(data)
    })

    socket.on("send_message", data => {
        socket.to(data.roomId).emit("recive_message", data);
    })

    socket.on('disconnect', () => {
        console.log(`User disconnected ${socket.id}`);
    })

})

// mongodb connection
const uri = `mongodb+srv://Leaves:syhnGvVftV2U3ZB2@cluster0.39aol.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


// import router
const users = require('../src/routes/users');
const chat = require('../src/routes/chat');

async function run() {

    try {

        app.use('/users', users);
        app.use('/chat', chat);

    }
    catch (err) {
        console.log(err)
    }
    finally {

    }
}
run().catch(e => console.log(e)).finally()

app.get(`/`, async (req, res) => {
    res.send("Leaves server is running...")
})

server.listen(5000, () => console.log("Server started on port 5000..."));