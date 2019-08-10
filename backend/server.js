  const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const hotdogRoutes = express.Router();
const PORT = 4000;

let Hotdog = require('./hotdog.model');

app.use(cors());
app.use(bodyParser.json());

mongoose.connect('mongodb://127.0.0.1:27017/hotdogs', { useNewUrlParser: true});
const connection = mongoose.connection;

connection.once('open', function() {
    console.log("MongoDB database connection established successfuly");
})

hotdogRoutes.route('/').get(function(req, res) {
    Hotdog.find(function(err, hotdogs) {
        if (err) {
            console.log(err);
        } else {
            res.json(hotdogs);
        }
    });
}); 

hotdogRoutes.route('/:id').get(function(req, res ) {
    let id = req.param.id;
    Hotdog.findById(id, function(err, hotdog) {
        res.json(hotdog);
    });
});

hotdogRoutes.route('/add').post(function(req, res) {
    let hotdog = new Hotdog(req.body);
    hotdog.save()
        .then(hotdog => {
            res.status(200).json({'hotdog': 'hotdog added succesfully'});
        })

        .catch(err => {
            res.status(400).send('adding new hotdog failed');
        });
});



hotdogRoutes.route('/update/:id').post(function(req, res) {
    Hotdog.findById(req.params.id, function(err, hotdog) {
        if(!hotdog)
            res.status(404).send('data is not found');
            else
                hotdog.hotdog_description = req.body.hotdog_description;
                hotdog.hotdog_responsible = req.body.hotdog_responsible;
                hotdog.hotdog_priority = req.body.hotdog_priority;
                hotdog.hotdog_complited= req.body.hotdog_complited;

                hotdog.save().then(hotdog => {
                    res.json('Hotdog updated');
                })
                .catch(err => {
                    res.status(400).send("Update not possible");
                });
     });
});

app.use('/hotdogs', hotdogRoutes);

app.listen(PORT, function() {
    console.log("Server is running on Port: " + PORT);
});