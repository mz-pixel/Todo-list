import express from "express";
import bodyParser from "body-parser";

const app = express();
const PORT = 3000;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.render("index.ejs");
});
app.post("/", (req, res) => {
  res.render("index.ejs", { name: req.body["input"] });
  // console.log(req.body["input"]);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
