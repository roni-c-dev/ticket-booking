import * as winston from "winston";

function logFunction () {
  const logConfiguration = {
    "transports": [
       new winston.transports.Console()
    ] 
  }
  const logger = winston.createLogger(logConfiguration);
  return logger
}
export default logFunction() 
