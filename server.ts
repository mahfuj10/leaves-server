import express from 'express'
import http from 'http';
import { Server } from 'socket.io'
import { Request, Response } from "express";
const cors = require("cors");
const { MongoClient } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;



//middleware
app.use(express.json());
app.use(cors());


// socket.io connection
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });


io.on("connection", socket => {

    console.log("User connected with ", socket.id)

    socket.on("join_room", (data) => {
        socket.join(data)
    })

    socket.on("send_message", data => {
        socket.to(data.roomId).emit("recive_message", data);
    })

    socket.on('disconnect', () => {
        console.log(`User disconnected ${socket.id}`);
    })

    socket.on('typing', function (data) {
        socket.broadcast.emit('typing', data)
    })

    socket.on('deleteMessage', function (data) {
        socket.to(data.roomId).emit("deleteMessage", data);
    })



    // socket.on('checkActive', id => {
    //     socket.to(id).emit('isActive', id);
    // })
    // socket.on('activeUser', user => {
    //     socket.broadcast.emit('receive_activeUser', user)
    // })

})

// mongodb connection
const uri = `mongodb+srv://Leaves:syhnGvVftV2U3ZB2@cluster0.39aol.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


// import router
const users = require('./src/routes/users');
const chat = require('./src/routes/chat');
const groups = require('./src/routes/groups');

async function run() {

    try {

        app.use('/users', users);
        app.use('/chat', chat);
        app.use('/group', groups);

    }
    catch (err) {
        console.log(err)
    }
    finally {

    }
}
run().catch(e => console.log(e)).finally()

app.get("/", async (req: Request, res: Response) => {
    res.send("Leaves server is running...")
})


app.listen(process.env.PORT || 5000, function (): any {
    console.log("Express server listening on port %d in %s mode",);
});