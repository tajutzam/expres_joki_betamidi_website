// Happy coding guys

const express = require("express");
const app = express();
const port = 4000;
const router = require("./routes");



app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));


app.use("/", router);

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
