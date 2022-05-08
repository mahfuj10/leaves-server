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
const allGroups = database.collection('groups');

client.connect();

// post groups
router.post('/', async (req: Request, res: Response) => {
    res.send(await allGroups.insertOne(req.body));
});



module.exports = router;