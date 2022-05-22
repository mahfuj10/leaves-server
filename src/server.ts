import express from 'express'
import http from 'http'
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

// mongodb connectiorsn

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.39aol.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});


// socket.io connection
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

io.on("connection", (socket: any) => {

    console.log("User connected with ", socket.id);

    socket.on("join_room", (data: any) => {
        socket.join(data);
    })

    socket.on("send_message", (data: any) => {
        socket.to(data.roomId).emit("recive_message", data);
    })

    socket.on('typing', function (data: any) {
        socket.broadcast.emit('typing', data)
    })

    socket.on('deleteMessage', function (data: any) {
        socket.to(data.roomId).emit("deleteMessage", data);
    })


    const users: any = {};

    socket.on('login', function (data: any) {
        // const uid = { userId: data?.userId };
        users[socket.id] = data.loginUser?.uid
        socket.broadcast.emit('user-connected', data.loginUser);

        // socket.broadcast.emit("activeusers", users);
    });


    socket.on('addedUser', function (data: any) {
        socket.emit('addedUser', data);
        console.log(data)
    })

    socket.on('disconnect', () => {
        socket.broadcast.emit('user-disconnected', users[socket.id])
        delete users[socket.id]
        console.log(`User disconnected ${socket.id}`);
    });





    // socket.on('checkActive', id => {
    //     socket.to(id).emit('isActive', id);
    // })
    // socket.on('activeUser', user => {
    //     socket.broadcast.emit('receive_activeUser', user)
    // })

})

// mongodb connection

// import router
const users = require('../src/routes/users');
const chat = require('../src/routes/chat');
const groups = require('../src/routes/groups');

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



server.listen(port, () => {
    console.log("my server is runningin port 5000")
})