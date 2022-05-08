import { Request, Response } from "express";
const express = require('express')
const router = express.Router();
const { MongoClient } = require("mongodb");
const mongodb = require("mongodb");
const ObjectId = require('mongodb').ObjectId;


const uri = `mongodb+srv://Leaves:syhnGvVftV2U3ZB2@cluster0.39aol.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const database = client.db("Leaves");
const usersCollection = database.collection('users');

client.connect();


// save google sign method user login
router.put('/', async (req: Request, res: Response) => {
    const user = req.body;
    const filter = { email: user.email };
    const options = { upsert: true };
    const updateDoc = { $set: user };
    const result = await usersCollection.updateOne(filter, updateDoc, options);
    res.json(result);
});

// get all users
router.get('/', async (req: Request, res: Response) => {
    try {
        res.send(await usersCollection.find({}).toArray());
    } catch (err) {
        console.log(err)
    }
});


// add user in contract
router.post('/addcontract/:uid', async (req: Request, res: Response) => {
    try {
        const uid = req.params.uid;
        const query = { uid: uid };
        console.log(uid, req.body);
        const result = await usersCollection.updateOne(query, { $push: { contracts: { $each: [req.body.uid] } } });
        res.send(result);

    } catch (err) {
        console.log(err)
    }
});

// get convertation users
router.get('/convertation', async (req: Request, res: Response) => {
    try {
        const contractsUsers = [];
        const contractsUid = req.body;
        console.log(contractsUid)
        // for (let uid of contractsUid) {
        //     const query = { uid: uid };
        //     const user = await usersCollection.findOne(query);
        //     contractsUsers.push(user);
        // }
        // console.log(contractsUsers)
        res.status(200)
    }
    catch (err) {
        console.log(err)
    }
});

module.exports = router;