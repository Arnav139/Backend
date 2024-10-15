import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {  users, documents,payment  } from "../../models/schema"
import postgresdb from "../../config/db";
import { setUser } from "../../config/jwt";
import { eq, ne, sql } from "drizzle-orm";
import Razorpay from "razorpay";
import { NewLineKind } from "typescript";
import { error } from "console";
import user from "./user";
import { Cashfree } from "cashfree-pg";

Cashfree.XClientId = process.env.XClientId;
Cashfree.XClientSecret = process.env.XClientSecret;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

// console.log(process.env.XClientId , process.env.XClientSecret)

export default class payments{

  static createPayment = async (amount:number,currency:string):Promise <any>=>{
    try{
      const instance = new Razorpay({
        key_id:"" ,
        key_secret:"",
      });
      const options={
        amount: amount * 100,
        currency: currency,
      }
      return await instance.orders.create(options)
    }catch(error:any){
      throw new Error(error)
    }
  };

  static insertPaymentDetails = async (orderDetails:any):Promise<any> => {
    try{
      await postgresdb.insert(payment).values(orderDetails).returning({paymentId:payment.id,orderId:payment.orderId})
    }catch(error:any){
      throw new Error(error)
    }
  }


  static confirmOrderStatus = async (orderId:string,status:string):Promise<any>=>{
    try{

      const orderDetails:any = await postgresdb.update(payment).set({status:status}).where(eq(payment.orderId,orderId)).returning({credits:payment.credits,userId:payment.userId}).execute()
      if(!orderDetails) throw new Error("OrderId not valid")  
      const credits:any = orderDetails[0].credits
      const UpdateData = await postgresdb.update(users).set({credits:sql`cast(${users.credits} as numeric) + ${credits}`}).where(eq(users.id,orderDetails[0].userId)).returning({credits:users.credits}).execute()
      console.log("Update:",UpdateData)
      return UpdateData[0]
    }catch(error:any){
      throw new Error(error)
    }
  }

  static updateOrderStatus = async(orderId:string,status:string):Promise<any>=>{
    try{
      const update = await postgresdb.update(payment).set({status:status}).where(eq(payment.orderId,orderId)).execute()
      return update
    }catch(error:any){
      throw new Error(error)
    }
  }

  static createCashfreeOrder = async (amount: number, currency: string, orderId: string, userId: string, customerPhone: string): Promise<any> => {
    try {
      console.log("userId:",userId)
      const request = {
        order_amount: amount,
        order_currency: currency,
        order_id: orderId,
        customer_details: {
          customer_id: userId,
          customer_phone: customerPhone,
        },
        order_meta: {
          return_url: `https://www.cashfree.com/devstudio/preview/pg/web/checkout?order_id={order_id}`,
        },
      };
      // console.log("Request:",request)
      const response = await Cashfree.PGCreateOrder("2023-08-01", request);
      console.log(response.data);
      return response.data;
    } catch (error:any) {
      console.error('Error:', error.response.data.message);
      throw new Error(error.response.data.message);
    }
  };

}

