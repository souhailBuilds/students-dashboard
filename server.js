const mongoose = require("mongoose");
const app = require("./app");
const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("doneeeeeeeeeeeeeeeee");
  });
app.listen(9000, () => {
  console.log("welcome back we are waiting for request...");
});
