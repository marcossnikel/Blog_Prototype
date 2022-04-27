const express  = require ("express");
const router = express.Router();
const Categorie = require("../categories/Categorie");
const Article = require("./Article")
const slugify = require("slugify");
const adminAuth = require('../middlewares/adminAuth');




router.get ("/admin/articles",adminAuth, (req,res)=>{
    Article.findAll({
        include: [{model :Categorie}]
    }).then(articles =>{
        console.log({articles});
        res.render("admin/articles/index",{articles})
    });
});

router.get("/admin/articles/new", adminAuth, (req,res)=>{
    Categorie.findAll().then(category =>{

        res.render ("admin/articles/new", {category:category})
    })
})

router.post("/article/save",adminAuth,(req,res)=>{
    let title = req.body.title;
    let body = req.body.body ;
    let category = req.body.category;
   
    
    Article.create({
        title: title, 
        slug : slugify(title),
        body : body,
        categoryId : category
    }).then(()=>{
        res.redirect("/admin/articles")
    })


});

router.post("/articles/delete",adminAuth, (req,res)=>{
    let id = req.body.id;
    if(id != undefined){

        if(!isNaN(id)){ // FOR UM NUMERO
            Article.destroy({
                where:{
                    id: id
                }
            }).then(()=>{
                res.redirect("/admin/articles")
            })

        }else{ // NAO FOR NUMERO
            res.redirect("/admin/articles");
        }
    }else{ // NULL
        res.redirect("/admin/articles");
    }
});

router.get('/admin/articles/edit/:id', adminAuth,(req,res)=>{
let id = req.params.id;
Article.findByPk(id).then(article =>{
    if(article != undefined){
        
        Categorie.findAll().then(category =>{

            res.render('admin/articles/edit', {category : category ,article: article})
        })
    }else{
        res.redirect('/')
    }
}).catch( err=>{
    res.redirect('/')
})
})

router.post("/articles/update",adminAuth, (req,res)=>{
    let id = req.body.id;
    let title = req.body.title;
    let body = req.body.body;
    let category = req.body.category;


    Article.update({title:title, body: body, categoryId:category, slug:slugify(title)},{
        where : {
            id:id
        }
    }).then(()=>{
        res.redirect("/admin/articles");
    }).catch(err => {
        res.redirect("/")
    });
})



router.get("/articles/page/:num", (req,res)=>{
    let page = req.params.num;
    let offset = 0;
    if(isNaN(page)|| page ==1){
        offset= 0;
    }else{
        offset= (parseInt(page )-1)  *4;
    }
    Article.findAndCountAll({
        limit : 4,
        offset: offset , 
        order:[
            ['id','DESC']
        ]

    }).then(articles=>{
        let next;
        if(offset + 4 >= articles.count){
            next = false;
        }else {
            next= true;
        }

        let result={
            next : next,
            articles : articles,
            page : parseInt(page)
        }

        Categorie.findAll().then(categories=>{
            res.render("admin/articles/page",{result : result, categories:categories})

        });;
        
    })
})


module.exports = router;