const redis = require("redis");
const redisport = process.env.REDIS_PORT;
const redisClient = redis.createClient({
  port: redisport,
  host: "localhost",
});
redisClient.connect().catch(console.error);
module.exports = {
  redisClient,
};
