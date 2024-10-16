import { drizzle } from "drizzle-orm/node-postgres";
import { Client } from "pg";
import * as schema from "../models/schema";
import dotenv from "dotenv";
import logger from "./logger";

dotenv.config();

const db = process.env.DBPORT as string;
const dbport = parseInt(db);

export let client = new Client({
  host: process.env.HOST,
  port: dbport,
  user: process.env.DBUSER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
});

// Connect to PostgreSQL
client.connect()
  .then(() => {
    logger.info("Postgres Client is Connected Successfully");
  })
  .catch((err: any) => {
    logger.error("Error connecting DB: ", err);
  });

// Disconnect from PostgreSQL
export const disconnectDB = async () => {
  try {
    await client.end();
    logger.info("Postgres Client has disconnected successfully");
  } catch (err: any) {
    logger.error("Error disconnecting DB: ", err);
  }
};

const postgresdb = drizzle(client, { schema: { ...schema } });

export default postgresdb;
