const RedisStore = require("connect-redis").default;
const session = require("express-session");
const { redisClient } = require("../db/redis");
const secretkey = process.env.REDIS_SECRET_KEY;
module.exports = session({
  store: new RedisStore({ client: redisClient }),
  secret: secretkey,
  resave: false,
  name: "doge-token",
  saveUninitialized: false, // if you are not adding anything to the session object we are not going to add it to the database
  cookie: {
    secure: false,
    maxAge: 864000000,
    httpOnly: true,
  },
});
