const express = require("express");
const router = express.Router();
const Categorie = require("./Categorie");
const slugify = require("slugify");
const adminAuth = require('../middlewares/adminAuth');

router.get("/admin/categories/new",adminAuth,(req, res) => {
    res.render("admin/categories/new");
});

router.post("/categories/save", adminAuth,(req, res) => {
    let title = req.body.title;
    if(title != undefined){
        
        Categorie.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            res.redirect("/admin/categories");
        })

    }else{
        res.redirect("/admin/categories/new");
    }
});

    router.get("/admin/categories",adminAuth, (req,res)=>{
            Categorie.findAll().then(categories =>{
                res.render("admin/categories/index", {categories: categories});
            });
                
     });

    router.post("/categories/delete", adminAuth,(req,res)=>{
        let id = req.body.id;
        if(id != undefined){

            if(!isNaN(id)){ // FOR UM NUMERO
                Categorie.destroy({
                    where:{
                        id: id
                    }
                }).then(()=>{
                    res.redirect("/admin/categories")
                })

            }else{ // NAO FOR NUMERO
                res.redirect("/admin/categories");
            }
        }else{ // NULL
            res.redirect("/admin/categories");
        }
    });

    router.get("/admin/categories/edit/:id", adminAuth,(req,res)=>{
        //findByPk --> pesquisa algo pelo ID
        let id = req.params.id;
        if(isNaN(id)){
            res.redirect("/admin/categories")
        }
        Categorie.findByPk(id).then(categorie =>{
            if(categorie != undefined){
                // passar categoria para novo file views    

                res.render("admin/categories/edit",{categorie : categorie});

            }else{
                res.redirect("/admin/categories");
            }
        }).catch( error =>{
            res.redirect("admin/categories");
        })
    });

    router.post("/categories/update", adminAuth,(req,res)=>{
        let id = req.body.id;
        let title = req.body.title;

        Categorie.update({title : title , slug : slugify(title)},{
            where : {
                id:id
            }
        }).then(()=>{
                res.redirect("/admin/categories");
            });
    });




module.exports = router;