import { Request, Response, NextFunction } from "express";
const express = require('express')
const router = express.Router();
const { MongoClient } = require("mongodb");
const mongodb = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
const gulp = require('gulp');
const tinypng = require('gulp-tinypng-compress');

const uri = `mongodb+srv://Leaves:syhnGvVftV2U3ZB2@cluster0.39aol.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const database = client.db("Leaves");
const usersChat = database.collection('chats');

client.connect();


// post user message

router.post('/', async (req: Request, res: Response) => {

    try {
        gulp.task('tinypng', function () {
            gulp.src(req.body.picture)
                .pipe(tinypng({
                    key: 'fB84pKZmS03LBzgS0yCPK3862c5hslh7',
                    sigFile: 'images/.tinypng-sigs',
                    log: true
                }))
                .pipe(gulp.dest('images'));
        });
        res.send(await usersChat.insertOne(req.body));
    }
    catch (err) {
        console.log(err)
    }
})

// 


router.get('/:room', async (req: Request, res: Response) => {
    try {
        const roomId = req.params.room;
        const query = { roomId: parseInt(roomId) };
        res.send(await usersChat.find(query).toArray());
    }
    catch (err) {
        console.log(err)
    }
})

router.get('/allchat', async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.send(await usersChat.find({}).toArray());
    } catch (err) {
        next(err)
    }
})


module.exports = router;