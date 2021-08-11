const express = require("express");
const app = express();
//Requiring mailchimp's module
//For this we need to install the npm module @mailchimp/mailchimp_marketing. To do that we write:
//npm install @mailchimp/mailchimp_marketing
const mailchimp = require("@mailchimp/mailchimp_marketing");
//setting up environment variable to protect our files
//for more info visit https://www.youtube.com/watch?v=17UVejOw3zA

require('dotenv').config()

//console.log(process.env);

app.use(express.static("static"));
app.use(express.urlencoded({extended:true}));


//Sending the signup.html file to the browser as soon as a request is made on localhost:3000

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html")
});
//setting up Mailchimp
mailchimp.setConfig({
    apiKey: process.env.API_KEYS,
    server: "us5"
});

//as soon as sign in button is pressed execute this
app.post("/",function(req,res){
    const first=req.body.fname;
    const email=req.body.email;
    const last=req.body.lname;
    const listId = "4c2780cf1d"
    //creating object with users data
    const subscribingUser = {
        firstName:first,
        lastName:last,
        email:email
    };
    //uploading data to server
    async function run() {
        try {
            const response = await mailchimp.lists.addListMember(listId,{
                email_address: subscribingUser.email,
                status: "subscribed",
                merge_fields: {
                    FNAME: subscribingUser.firstName,
                    LNAME: subscribingUser.lastName
                }
            });
            console.log(response);
            res.sendFile(__dirname+"/success.html");
        } catch (e) {
            console.log(e.status);
            res.sendFile(__dirname+"/failure.html");
        }
       
    };
    
    run();
});
app.post("/failure",function(req,res){
    res.redirect("/");
});

app.listen(3000,function(){
    console.log("Port 3000");
});
