import path from "path";
import pino from "pino";
const logger = pino(
  pino.destination({ dest: path.join(__dirname, "app.log") })
);
export default logger;
