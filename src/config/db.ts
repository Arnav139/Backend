import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "../models/schema"
import dotenv from "dotenv"
import logger from "./logger";
dotenv.config()
// const client = new Client({
//   connectionString: "postgres://user:password@host:port/db",
// });
// or

const db = process.env.DBPORT as string
const dbport = parseInt(db)

export let client = new Client({
  host: process.env.HOST,
  port: dbport,
  user: process.env.DBUSER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});


client.connect().then(()=>{
  logger.info("Postgress Client is Connected Successfully")
  
}).catch((err:any)=>{
  logger.error("Error connecting DB : ",err)
  
});

const postgresdb = drizzle(client,{schema:{...schema}});

export default postgresdb