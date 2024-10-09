import { Config, defineConfig } from "drizzle-kit";
import dotenv from "dotenv"
dotenv.config()

// console.log(process.env.HOST,process.env.USER,process.env.PASSWORD,process.env.DATABASE)
export default ({
  dialect: "postgresql", 
  schema: "./src/models/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    host: process.env.HOST,
    user: process.env.DBUSER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    ssl: false,
  },
});