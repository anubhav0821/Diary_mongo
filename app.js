//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");

const homeStartingContent =
  "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent =
  "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent =
  "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connecting to mongoDB and if diaryDB does not exists, create one
mongoose.connect("mongodb://127.0.0.1:27017/diaryDB");

// Schema for the journals
const diarySchema = new mongoose.Schema({
  title: String,
  journal: String,
});

// Creating the DB with the defined journal
const Diary = mongoose.model("Diary", diarySchema);

// Find all the items in the db and displaying them on home page
app.get("/", function (req, res) {
  Diary.find({})
    .then((result) => {
      res.render("home", { para: homeStartingContent, post: result });
    })
    .catch((error) => {
      console.log("No Such Records");
    });
});

app.get("/about", function (req, res) {
  res.render("about", { para: aboutContent });
});

app.get("/contact", function (req, res) {
  res.render("contact", { para: contactContent });
});

app.get("/compose", function (req, res) {
  res.render("compose");
});

// Store the data in db if both of its fields are not empty
app.post("/compose", function (req, res) {
  if (req.body.title != "" && req.body.content != "") {
    //post.push(post_data);
    const new_diary = new Diary({
      title: req.body.post_title,
      journal: req.body.post_content,
    });
    new_diary.save();
    res.redirect("/");
  } else {
    res.redirect("/compose");
  }
});

// Using parameter to get the address and the find the one that matched the title and render it
app.get("/posts/:topic", function (req, res) {
  Diary.findOne({ title: `${req.params.topic}` }).then((result) => {
    // Display the list
    res.render("post", { posts: result });
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
