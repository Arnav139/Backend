import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {  users, documents  } from "../../models/schema"
import postgresdb from "../../config/db";
import { setUser } from "../../config/jwt";
import { eq } from "drizzle-orm";



export default class user{

    static registerUser = async (userData: any) => {
        try{
        const { phoneNumber, email, firstName, lastName, password } = userData;
        
        const existingUser = await postgresdb.query.users.findFirst({
            where:eq(users.email,email)
        });
        console.log(existingUser)
        if (existingUser) {
            throw new Error("User already exists with this email");
        }
        // console.log(existingUser , "esrdtfyuiopfdghjklj")
        const data = await postgresdb.insert(users).values({
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
        }).returning({email:users.email,firstName:users.firstName,lastName:users.lastName,id:users.id})
        const token = setUser({userId:data[0].id})
        console.log(token)
        return token
        }catch(error:any){
            throw new Error(error)

        }
    };

    static loginUser = async (email: string, password: string) => {
        try {
        const user = await postgresdb.select().from(users).where(eq(users.email, email)).limit(1);
        if (user.length === 0) {
            throw new Error("User not found");
        }
        const token = setUser({userId:user[0].id})
        return {token}

        } catch (error: any) {
            throw new Error(error);
        }
    
};
    
    static updateUser = async ():Promise<any> =>{
        try{
  
        }catch(error){
            

        }
    }

 
    static googleLogIn = async(userDetails:any)=>{
        try{
            const user:any= await postgresdb.select().from(users).where(eq(users.email, userDetails.email)).limit(1);
            console.log("the user is",user)
            if (user.length === 0) {
                const data:any = await postgresdb.insert(users).values({
                    firstName:userDetails.given_name.trim(),
                    lastName:userDetails.family_name,
                    email:userDetails.email,
                    phoneNumber:'null',
                    password:"123"
                }).returning({email:users.email,firstName:users.firstName,lastName:users.lastName,id:users.id,credit:users.credits})
                const token = setUser({userId:data[0].id})
                console.log("Registered User Tokenn:",token)
                return {token,data}
            }
            const token = setUser({userId:user[0].id})
            // console.log("Registered User Token:",token)
            return {token,user:user[0]}
        }catch(error:any){
            throw new Error(error.message)
        }
    }



}