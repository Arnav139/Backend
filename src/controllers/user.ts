import { Request, response, Response } from "express";
import { users } from "../models/schema";
import dbServices from "../services/dbServices";
import axios from "axios";


interface authenticateReq{
    user?:any,
    body?:any
}
export default class user{

    static registerUser = async (req: Request, res: Response) => {
        const { firstName, lastName, email, phoneNumber, password } = req.body;
        try {
            
            // console.log(req.body)
            const newUser = await dbServices.user.registerUser({ firstName,lastName,email,phoneNumber,password,})
            // console.log("NewUser::",newUser)
            if(!newUser){
                throw new Error(" error in user Registration")
            }
            res.status(200).json({status:true,message: "User registered successfully",data: newUser});
        } catch (error: any) {
                res.status(500).json({ status:false ,  message: error.message });
            }
        }

// Controller for handling user login
    static loginUser = async (req: Request, res: Response) => {
        const { email, password } = req.body;
        try {
            const user = await dbServices.user.loginUser(email,password);
            res.status(200).json({status: true , message: "user Logged In" , data : user})
        } catch (error) {
            // console.error("Login error:", error);
            res.status(500).json({status:false, message: "Server error" });
        }
    };

     


    // static updateUser = async (req:authenticateReq,res:Response) => {
    //     const userId = req.user.userId
    //     const userData = req.body.userData;
    //     try{

    //     }catch(error:any){
    //         res.status(500).json({status:false,message:error.message})
    //     }

    // };


    static googleLogIn = async (req:Request,res:Response)=>{
        try{
            console.log("In the google LogIn")
            const token = req.query.token;
            // console.log(token)
            // let clientId = "29161426415-je4u4oenhp1bj0rbkq9ojspulh0g3op4.apps.googleusercontent.com";
            // let clientSecret = "'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";
            let REDIRECT_URI = "http://localhost:8000/";
            const validateUser = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`);

            if (validateUser.data.verified_email == false) res.status(500).send({status:false,message:"Your email is not authorized by Google"})

            const genToken = await dbServices.user.googleLogIn(validateUser.data)
            res.status(200).send({status:true,message:"LogedIn with Google",genToken})
        }catch(error:any){
            throw new Error(error)
        }
    }

}