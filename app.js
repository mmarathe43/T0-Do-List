//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _=require("lodash");


mongoose.connect("mongodb://localhost:27017/todolistDB",{useNewUrlParser: true,useUnifiedTopology: true});
const app = express();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use('*/css', express.static('public/css'));




const todolistSchema = new mongoose.Schema({
  description: String
})
const Item = mongoose.model("Item", todolistSchema);


const ListSchema = new mongoose.Schema({
  name: String,
  items: [todolistSchema]
})
const List = mongoose.model("List", ListSchema);




const new1 = new Item({
  description: "This is a to-do list"
});
const new2 = new Item({
  description: "Click + to add new items"
});
const new3 = new Item({
  description: "<-- Check this box  to delete items"
});
const definedItems = [new1, new2, new3];
Item.find({}, function(err, result) {
  if (err) {
    console.log(err);
  } else {
    if (result.length === 0) {
      new1.save();
      new2.save();
      new3.save();
      //res.redirect("/");
    }
  }
})









app.get("/", function(req, res) {

  Item.find({}, function(err, result) {
    if (err) {
      console.log(err);
    } else {
      res.render('list', {listTitle: 'Todo List',newListItems: result});
    }
  })


});


app.get("/about", function(req, res) {
  res.render('about')
})








app.get("/:topic", function(req, res)
{
      var enteredval = _.capitalize(req.params.topic);
      List.findOne({name: enteredval}, function(err, result)
       {
        if (err)
         {
          console.log(err);
          } else
          {
            if (!result)
              {
              var list = new List({
              name: enteredval,
              items: definedItems
                                  })
              list.save();
              res.redirect("/"+enteredval);
            }else{
              res.render("list", {listTitle: result.name,newListItems: result.items});

            }
          }
        })
})





app.post("/", function(req, res) {
  const item = req.body.newItem;
  const thisList = req.body.list;
  const latest = new Item({
    description: item
  });

    List.findOne({name: thisList}, function(err, foundList) {
      if(err){
        console.log(err);
      }
      if(!foundList){
        latest.save();
        res.redirect("/");
      }
      else{
      foundList.items.push(latest);
      foundList.save();
      console.log("i found"+foundList);
      res.redirect("/" + thisList);
    }
    })


})


app.post("/delete", function(req, res) {
    const listname=req.body.listname;
    if(listname=='Todo List'){
      Item.deleteOne({_id: req.body.checkbox}, function(err) {
        if (err) {
          console.log(err);
        }
      })
      res.redirect("/");
    }else{
      List.findOneAndUpdate({name:listname},{$pull:{items:{_id:req.body.checkbox}}},function(err,foundList){
        if(err){
          console.log(err);
        }else{
          res.redirect("/"+listname);
        }
      })
    }
  })





  app.listen(3000, function() {
    console.log("Server started on port 3000.");
  });
