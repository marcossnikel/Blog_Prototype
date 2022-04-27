const express = require("express");
const app = express();
const session = require("express-session");
const bodyParser = require("body-parser");
const connection = require("./database/database")
const articlesController = require("./articles/ArticlesControler");
const categoriesController = require("./categories/CategoriesControler");
const usersController = require("./users/UsersController");
const Article = require("./articles/Article");
const Categorie = require("./categories/Categorie");
const User = require("./users/User");
//View Engine
app.set('view engine','ejs');


//Static
app.use(express.static('public'));
//Session
app.use(session({
    secret: "312312312312", cookie : {maxAge:300000}
}));

//Body Parser ---> Forms
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Database Connection
connection.
authenticate()
.then(()=>{
    console.log("Connection Succeful!");
}).catch((erro)=>{
    console.log(erro);
})

//Using the Models of our Controllers --> ROUTES
app.use("/",categoriesController);
app.use("/",articlesController);
app.use("/",usersController)

app.get("/", (req,res) =>{
    Article.findAll({
        order:[
            ['id','DESC']
        ],
        limit : 4
    }).then(articles =>{
        Categorie.findAll().then(categories =>{
            res.render("index",{articles : articles , categories:categories});

   })
   })
})

app.get("/:slug",(req,res)=>{
    let slug= req.params.slug;
    Article.findOne({
        where: {
            slug: slug
        }
    }).then(article =>{
        if(article != undefined){
            Categorie.findAll().then(categories =>{
                res.render("article",{article : article , categories:categories});
    
       })
        }else{
            res.redirect("/");
        }
    }).catch(error =>{
        res.redirect("/");
    })
})

app.get("/category/:slug", (req, res)=>{
    let slug= req.params.slug;
    Categorie.findOne({
        where: {
            slug: slug,
        },
        include: [{model:Article}]
    }).then(category=>{
        if (category != undefined){

            Categorie.findAll().then(category =>{
                res.render('index', {articles:category.articles,category:category } )
            })
        }else{
            res.redirect("/")
        }
    }).catch( error =>{
        res.redirect('/')
    })
})


//Openning our Server
app.listen(8080, ()=>{
    console.log("Server  ON !!!");
})