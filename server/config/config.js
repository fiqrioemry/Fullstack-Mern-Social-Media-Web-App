require("dotenv").config({
  path: "../.env",
});

const { DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

module.exports = {
  development: {
    username: "root",
    password: "Oemry241995@",
    database: "fullstack_instagram_app",
    host: "127.0.0.1",
    dialect: "mysql",
  },
};
