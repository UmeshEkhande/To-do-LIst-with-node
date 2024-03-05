const dotenv = require("dotenv")
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
app.use(express.static("views"));

app.set("view engine", "ejs");

mongoose.connect("mongodb://127.0.0.1:27017/todolistDB");

dotenv.config({path:"./config.env"})



// Mongoose Schema for individual to-do list items
const itemSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
});

const Item = new mongoose.model("Item", itemSchema);

const item1 = new Item({
  name: "Welcome to your TO DO LIST",
});

const item2 = new Item({
  name: "Hit the + button to add a new item",
});

const item3 = new Item({
  name: "<---- Hit this to delete an item",
});

const defaultItems = null;

// Mongoose Schema for custom lists
const listSchema = {
  name: String,
  items: [itemSchema],
};

const List = mongoose.model("List", listSchema);


app.get("/", function (req, res) {

  Item.find({})
    .then((foundItems) => {
        res.render("list", { listTitle: "To do List", newListItems: foundItems });
    })
    .catch((error) => {
      console.log(error);
    });
});


app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;


  if (itemName.trim() !== '') {
    const item = new Item({
      name: itemName,
    });

    if (listName === "To do List") {
      item.save();
      res.redirect("/");
    } else {
      List.findOne({ name: listName })
        .then((foundItems) => {
          foundItems.items.push(item);
          foundItems.save();
          res.redirect("/" + listName);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  } else {
    if (listName === "To do List") {
      res.redirect("/");
    } else {
      List.findOne({ name: listName })
        .then((foundItems) => {
          res.redirect("/" + listName);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
});

// Route for deleting items
app.post("/delete", function (req, res) {

  const listName = req.body.listName;
  const checkItemId = req.body.checkbox;

  if (listName == "To do List") {
    deleteCheckedItem();
  } else {
    deleteCustomItem();
  }

  async function deleteCheckedItem() {
    await Item.deleteOne({ _id: checkItemId });
    res.redirect("/");
  }

  async function deleteCustomItem() {
    await List.findOneAndUpdate(
      { name: listName },
      { $pull: { items: { _id: checkItemId } } }
    );
    res.redirect("/" + listName);
  }
});

// Custom route for dynamic lists
app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({ name: customListName })
    .then((foundList) => {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems,
        });

        list.save();
        console.log("saved");
        res.redirect("/" + customListName);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});


// Start the server at Port 3000
app.listen(3000, function () {
  console.log(`Server is running at http://localhost:3000`);
});
