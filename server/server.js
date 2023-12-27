import express from 'express';
import mongoose from 'mongoose';
import "dotenv/config" ;
import bcrypt from 'bcrypt';
import { nanoid } from 'nanoid';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import admin from "firebase-admin";
import serviceAccountKey from "./reactjs-blog-website-80eb2-firebase-adminsdk-x46gi-3dcc692f81.json" assert {type:"json"};
import { getAuth } from 'firebase-admin/auth';
//schemas
import User from './Schema/User.js'


const server = express();
let PORT = 3000;

admin.initializeApp({
    credential: admin.credential.cert(serviceAccountKey)
});

let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/; // regex for email
let passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/; // regex for password


//we use the middleware of the express to let the server understand the json
server.use(express.json());
server.use(cors());

//setting up the mongodb
mongoose.connect(process.env.DB_LOCATION, {
    autoIndex: true
});

//function to formate the data that is going to the frontend
const formateDatatoSend = (user) =>{

    const access_token = jwt.sign({ id: user._id } , process.env.SECRET_ACCESS_KEY)

    return{
        access_token,
        profile_img: user.personal_info.profile_img,
        username: user.personal_info.username,
        fullname:user.personal_info.fullname
    }
}



//function to generate the username unique
const generateUsername = async (email) =>{
    let username = email.split("@")[0];

    let isUsernameNotunique = await User.exists({"personal_info.username":username }).then((result) => result);

    isUsernameNotunique ? username += nanoid().substring(0,5) : "";

    return username ;
}

//making the signup root for the forms
server.post("/signup", (req,res) => {
    let {fullname, email , password } = req.body;
    
    // validating the data from frontend
    if(fullname.length < 3){
        return res.status(403).json({"error":"Full name must be 3 letters long"});
    }
    if(!email.length){
        return res.status(403).json({"error":"Enter the email"});
    }
    if(!emailRegex.test(email)){
        return res.status(403).json({"error":"Email is invalid"});
    }
    if(!passwordRegex.test(password)){
        return res.status(403).json({"error":"Password should be 6 to 20 character long with a numeric, 1 uppercase and 1 lowercase letters"})
    }

    bcrypt.hash(password, 10, async (err, hashed_password)=>{

        let username = await generateUsername(email);  // as@gmial.com -> [as, gmail]
        let user = new User({
            personal_info: { fullname , email, password:hashed_password , username}
        })
        
        user.save().then((u)=>{
            return res.status(200).json(formateDatatoSend(u));
        })
        .catch(err => {
            if(err.code == 11000){
                return res.status(403).json({"error":"Email already exists"})
            }
            return res.status(500).json({"error":err})
        })

    })

    // return res.status(200).json({"success":"ok"})



});


//making the signin root
server.post("/signin" , (req,res) => {

    let {email, password } = req.body;

    User.findOne({ "personal_info.email":email})
     .then((user)=>{
        if(!user){
            return res.status(403).json({"error": "Email not found"})
        }
        if(!user.google_auth){
            bcrypt.compare(password, user.personal_info.password , (err, result) =>{
                if(err){
                    return res.status(403).json({"error":"Error occured while login please login again"});
                }
    
                if(!result){
                    return res.status(403).json({"error":"Incorrect password"});
                }else{
                    return res.status(200).json(formateDatatoSend(user));
                }
            })
        }else{
            return res.status(403).json({"error": "Account is created with google , try logging with google"})
        }

        

        // return res.json({"status":"get user document"})
     })
     .catch(err =>{
        console.log(err);
        return res.status(500).json({"error": err.message})
     });


})


server.post("/google-auth" , async (req, res) => {

    let { access_token } = req.body;

    getAuth()
        .verifyIdToken(access_token)
        .then(async (decodedUser) => {

            let { email, name, picture } = decodedUser;

            picture = picture.replace("s96-c", "s384-c")

            let user = await User.findOne({"personal_info.email":email}).select("personal_info.fullname personal_info.username personal_info.profile_img  google_auth")
                .then((u) => {
                    return u || null
                })
                .catch((err)=>{
                    return res.status(500).json({"error":err.message})
                })

            if(user){
                if(!user.google_auth){
                    return res.status(403).json({"error":"This email is signed up without google. Please log in with password to access the account"})
                }
            }else{

                let username = await generateUsername(email);

                user = new User({
                    personal_info:{
                        fullname: name,
                        email,
                        profile_img:picture,
                        username
                    },
                    google_auth:true
                })

                await user.save().then((u) => {
                    user = u;
                })
                .catch((err) => {
                    return res.status(500).json({"error":err.message});
                })
            }    
        
            return res.status(200).json(formateDatatoSend(user));
        })
        .catch((err) => {
            return res.status(500).json({"error":"Failed to authanticate you with google. Try with some another google account ! "});
        })
} )



server.listen(PORT , ()=>{
    console.log('listening on port -> ' + PORT);
});
// UUqZ69XPGQ31VQVb