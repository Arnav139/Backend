import { default as axios, default as axios } from "axios";
import { Request, response, Response } from "express";
import { users } from "../models/schema";
import dbServices from "../services/dbServices";

interface authenticateReq {
  user?: any;
  body?: any;
interface authenticateReq {
  user?: any;
  body?: any;
}
export default class user {
  static registerUser = async (req: Request, res: Response) => {
    const { firstName, lastName, email, phoneNumber, password } = req.body;
    try {
      // console.log(req.body)
      const newUser = await dbServices.user.registerUser({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
      });
      // console.log("NewUser::",newUser)
      if (!newUser) {
        throw new Error(" error in user Registration");
      }
      res.status(200).json({
        status: true,
        message: "User registered successfully",
        data: newUser,
      });
    } catch (error: any) {
      res.status(500).json({ status: false, message: error.message });
    }
  };
export default class user {
  static registerUser = async (req: Request, res: Response) => {
    const { firstName, lastName, email, phoneNumber, password } = req.body;
    try {
      // console.log(req.body)
      const newUser = await dbServices.user.registerUser({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
      });
      // console.log("NewUser::",newUser)
      if (!newUser) {
        throw new Error(" error in user Registration");
      }
      res
        .status(200)
        .json({
          status: true,
          message: "User registered successfully",
          data: newUser,
        });
    } catch (error: any) {
      res.status(500).json({ status: false, message: error.message });
    }
  };

  // Controller for handling user login
  static loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const user = await dbServices.user.loginUser(email, password);
      res
        .status(200)
        .json({ status: true, message: "user Logged In", data: user });
    } catch (error) {
      // console.error("Login error:", error);
      res.status(500).json({ status: false, message: "Server error" });
    }
  };
  // Controller for handling user login
  static loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    try {
      const user = await dbServices.user.loginUser(email, password);
      res
        .status(200)
        .json({ status: true, message: "user Logged In", data: user });
    } catch (error) {
      // console.error("Login error:", error);
      res.status(500).json({ status: false, message: "Server error" });
    }
  };

  // static updateUser = async (req:authenticateReq,res:Response) => {
  //     const userId = req.user.userId
  //     const userData = req.body.userData;
  //     try{
  // static updateUser = async (req:authenticateReq,res:Response) => {
  //     const userId = req.user.userId
  //     const userData = req.body.userData;
  //     try{

  //     }catch(error:any){
  //         res.status(500).json({status:false,message:error.message})
  //     }
  //     }catch(error:any){
  //         res.status(500).json({status:false,message:error.message})
  //     }

  // };
  // };

  static googleLogIn = async (req: Request, res: Response) => {
    try {
      console.log("In the google LogIn");
      const token = req.query.token;
      // console.log(token)
      // let clientId = "29161426415-je4u4oenhp1bj0rbkq9ojspulh0g3op4.apps.googleusercontent.com";
      // let clientSecret = "'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";
      // let REDIRECT_URI = "http://localhost:8000/";
      const validateUser = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`
      );

      if (validateUser.data.verified_email == false)
        res.status(500).send({
          status: false,
          message: "Your email is not authorized by Google",
        });

      const genToken = await dbServices.user.googleLogIn(validateUser.data);

      // console.log(genToken.token);
      // console.log(genToken.user);
  static googleLogIn = async (req: Request, res: Response) => {
    try {
      console.log("In the google LogIn");
      const token = req.query.token;
      // console.log(token)
      // let clientId = "29161426415-je4u4oenhp1bj0rbkq9ojspulh0g3op4.apps.googleusercontent.com";
      // let clientSecret = "'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";
      // let REDIRECT_URI = "http://localhost:8000/";
      const validateUser = await axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`
      );

      if (validateUser.data.verified_email == false)
        res
          .status(500)
          .send({
            status: false,
            message: "Your email is not authorized by Google",
          });

      const genToken = await dbServices.user.googleLogIn(validateUser.data);

      // console.log(genToken.token);
      // console.log(genToken.user);

      const accessToken = genToken.token;
      const data = genToken.user;
      const { id, firstName, lastName, email, credits } = data;
      const accessToken = genToken.token;
      const data = genToken.user;
      const { id, firstName, lastName, email, credits } = data;

      const response = {
        id,
        firstName,
        lastName,
        email,
        credits,
        image: validateUser.data.picture,
        name: validateUser.data.name,
      };
      res.status(200).send({
        status: true,
        message: "LogedIn with Google",
        accessToken,
        data: response,
      });
    } catch (error: any) {
      throw new Error(error);
    }
  };

  static userdetails = async (req: authenticateReq, res: Response) => {
    try {
      const user = req.user.userId;
      if (!user) {
        res.status(404).json({ status: false, message: "user not found" });
      }

      console.log(user);
      const data = await dbServices.user.userDetails(user);
      if (!data) {
        res.status(404).json({ status: false, message: "user not found" });
      }
      res
        .status(200)
        .send({ status: true, message: "user details", data: data });
    } catch (e: any) {
      res.send(500).json({ status: false, message: e.mesage });
    }
  };

  // static userdetails = async (req: authenticateReq, res: Response) => {
  //     try {
  //         // Extract user ID from authenticated request
  //         const userId = req.user.userId;

  //         // Check if userId exists in the request (edge case handling)
  //         if (!userId) {
  //             return res.status(400).send({
  //                 status: false,
  //                 message: "User ID is missing from the request"
  //             });
  //         }

  //         // Fetch user details from the database
  //         const data = await dbServices.user.userDetails(userId);

  //         // Check if user details were found (edge case where user is not in the database)
  //         if (!data || !data.status) {
  //             return res.status(404).send({
  //                 status: false,
  //                 message: "User not found"
  //             });
  //         }

  //         // If user details are successfully retrieved
  //         return res.status(200).send({
  //             status: true,
  //             message: "User details retrieved successfully",
  //             data: data.data // Assuming `data.data` contains the actual user info
  //         });

  //     } catch (error: any) {
  //         console.error("Error retrieving user details:", error);

  //         // General error handling, send a proper error response
  //         return res.status(500).json({
  //             status: false,
  //             message: "An error occurred while retrieving user details"
  //         });
  //     }
  // };
}
