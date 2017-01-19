var express = require("express"),
mongoose = require("mongoose"),
methodOverride = require("method-override"),
bodyParser = require("body-parser"),
expressSanitizer = require("express-sanitizer"),
app = express();

//APP Configuration
mongoose.connect("mongodb://localhost/book_store");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.use(expressSanitizer());

var bookSchema = mongoose.Schema({
    title: String,
    author: String,
    description: String,
    price: Number, 
    image: String
});

var Book = mongoose.model("Book", bookSchema);

//RESTful routes
app.get("/", function(req, res){
    res.redirect("/books");
});

//INDEX ROUTE
app.get("/books", function(req, res){
   Book.find({}, function(err, books){
      if(err){
          console.log(err);
      } else {
          res.render("index", {books: books})
      }
   });
});

//NEW ROUTE
app.get("/books/new", function(req, res){
   res.render("new") 
});

//CREATE ROUTE
app.post("/books", function(req, res){
    req.body.book.description = req.sanitize(req.body.book.description);
    Book.create(req.body.book, function(err, book){
       if(err){
           res.render("new");
       } else {
           res.redirect("/books")
       }
    });
});

//SHOW ROUTE (all information of one especific book)
app.get("/books/:id", function(req, res){
    var id = req.params.id;
    Book.findById(id, function(err, book){
       if(err){
           console.log(err);
       } else {
           res.render("show", {book: book});
       }
    });
});

//EDIT ROUTE
app.get("/books/:id/edit", function(req, res){
   var id = req.params.id;
   Book.findById(id, function(err, book){
      if(err){
          res.render("/books");
      } else {
          res.render("edit", {book: book})
      }
   });
});

//UPDATE ROUTE
app.put("/books/:id", function(req, res){
   var id = req.params.id;
   req.body.book.description = req.sanitize(req.body.book.description);
   Book.findByIdAndUpdate(id, req.body.book, function(err, updateBook){
       if(err){
           res.redirect("/books");
       } else {
           res.redirect("/books/" + id);
       }
       
   });
});

//DESTROY ROUTE
app.delete("/books/:id", function(req, res){
    var id = req.params.id;
    Book.findByIdAndRemove(id, function(err){
       if(err){
           res.redirect("/books");
       } else {
            res.redirect("/books");
       }
    });
});


app.listen(process.env.PORT, process.env.IP, function(){
   console.log("Server has started") 
});