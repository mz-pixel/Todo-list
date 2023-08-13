import express from "express";
import bodyParser from "body-parser";
import { MongoClient } from "mongodb";

const app = express();
const PORT = 3000;
const url = "mongodb://localhost:27017";
const dbName = "todolistDB";

var TodaylistOfTask = [];
var WorklistOfTask = [];
let lastDate = null;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  const now = new Date();
  if (lastDate && now.getDate() !== lastDate.getDate()) {
    TodaylistOfTask = [];
    WorklistOfTask = [];
  }
  lastDate = new Date();
  const options = {
    weekday: "long",
    day: "numeric",
    month: "long",
  };
  const day = now.toLocaleDateString("en-US", options);

  if (TodaylistOfTask.length == 0) {
    res.render("index.ejs", { type: day });
  } else {
    res.render("index.ejs", {
      type: day,
      list: TodaylistOfTask,
    });
  }
});
app.get("/work", (req, res) => {
  if (WorklistOfTask.length == 0) {
    res.render("work.ejs", { type: "Work" });
  } else {
    res.render("work.ejs", {
      type: "Work",
      list: WorklistOfTask,
    });
  }
});
app.post("/", (req, res) => {
  TodaylistOfTask.push(req.body["input"]);
  res.redirect("/");
});
app.post("/work", (req, res) => {
  WorklistOfTask.push(req.body["input"]);
  res.redirect("/work");
});
app.get("/about", (req, res) => {
  res.render("about.ejs");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
