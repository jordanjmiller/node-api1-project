console.log('its alive');

const express = require('express');

const server = express();

server.use(express.json()); //need for put and post so server can read json

const db = require('./data/db.js');


server.get('/', (req, res) => { 
    res.send('Hello world!');
 });

server.post('/api/users', (req, res) => {
    // console.log(req);
    if (!req.body.name || !req.body.bio){
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    }
    db.insert(req.body).then(user => {
        res.status(200).json(user);
    })
    .catch(err => {
        res.status(500).json({ error: "There was an error while saving the user to the database" });
    });
})

server.get('/api/users', (req, res) => {
    db.find().then(users => {
        res.status(200).json(users);
    })
    .catch(err => {
        res.status(500).json({ error: "The users information could not be retrieved."});
    });
})

server.get('/api/users/:id', (req, res) => {
    db.findById(req.params.id).then(user => {
        if(user){
            res.status(200).json(user);
        }
        else{
            res.status(404).json({ message: "The user with the specified ID does not exist." });
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The user information could not be retrieved."});
    });
})

server.delete('/api/users/:id', (req, res) => {
    db.remove(req.params.id).then(user => {
        if(user){
            res.status(200).json(user);
        }
        else{
            res.status(404).json({ message: "The user with the specified ID does not exist." });
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The user could not be removed" });
    });
})

server.put('/api/users/:id', (req, res) => {
    if (!req.body.name || !req.body.bio){
        res.status(400).json({ errorMessage: "Please provide name and bio for the user." });
    }
    db.update(req.params.id, req.body).then(user => {
        if(user){
            res.status(200).json(user);
        }
        else{
            res.status(404).json({ message: "The user with the specified ID does not exist." });
        }
    })
    .catch(err => {
        res.status(500).json({ error: "The user information could not be modified." });
    });
})


const port = 8001;
server.listen(port, () => console.log(`api running on port ${port}`));


// DELETE	/api/users/:id	Removes the user with the specified id and returns the deleted user.
// PUT	/api/users/:id	Updates the user with the specified id using data from the request body. Returns the modified document, NOT the original.
