const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "./test.env") });

require("ts-node").register({
  project: path.resolve(__dirname, "../tsconfig.test.json"),
});
