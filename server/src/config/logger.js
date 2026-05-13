import morgan  from "morgan";
import winston  from "winston";
const filterBy = (keyword) =>
  winston.format((info) => {
    if (info.type === keyword) return info; // keep this log
    return false;                           // discard this log
  })();
 const logger = winston.createLogger({
  level: 'info', 
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
   transports: [

    // only API request logs
    new winston.transports.File({
      filename: "logs/login.log",
      format: filterBy("login")
    }),

    // only business event logs
    new winston.transports.File({
      filename: "logs/register.log",
      format: filterBy("register")
    }),

   new winston.transports.File({
      filename: "logs/activity.log",
      format: filterBy("activity")
    }),

    // only errors
    // new winston.transports.File({
    //   filename: "logs/errors.log",
    //   level: "error"
    // }),

    // everything together
    new winston.transports.File({
      filename: "logs/combined.log"
    }),

  ]
});

export default logger;
