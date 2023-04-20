const express = require("express");
const routes = require("./routes.js");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static("public"))

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`, req.body);
  next();
});

// app.use("/api/albums", routes);

app.get("/", async (req,res)=> {
    console.log("hello world!")
    res.send(200).send({message: "hello world"});
})

app.listen(port, async () => {
  console.log(`Server is running on port: ${port}. http://localhost:${port}`);
})