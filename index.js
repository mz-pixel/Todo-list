//jshint esversion:6

import express from "express";
import bodyParser from "body-parser";
import { MongoClient, ServerApiVersion } from "mongodb";
import { ObjectId } from "mongodb";
import _ from "lodash";

const app = express();
const PORT = 3000;
const url =
  "mongodb+srv://zaminjamalzj:hekpnxjISdk3q9Oe@cluster0.bnrho8k.mongodb.net/todolistDB";

let TodaylistOfTask;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

async function connectToMongoDB() {
  const client = new MongoClient(url, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    },
  });

  try {
    await client.connect();
    console.log("Connected to MongoDB");

    const db = await client.db("todolistDB");

    app.get("/", async (req, res) => {
      TodaylistOfTask = await db
        .collection("Today")
        .find({})
        .toArray(function (err, result) {
          if (err) throw err;
          console.log(result);
          db.close();
        });
      if (TodaylistOfTask.length == 0) {
        await db
          .collection("Today")
          .insertMany([
            { task: "Welcome to your todo list!" },
            { task: "Press enter key or submit button to add a new item." },
            { task: "<-- Hit this to delete an item." },
          ]);
        TodaylistOfTask = await db
          .collection("Today")
          .find({})
          .toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
          });
        res.render("index.ejs", { type: "Today", list: TodaylistOfTask });
      } else {
        res.render("index.ejs", {
          type: "Today",
          list: TodaylistOfTask,
        });
      }
    });

    app.get("/about", (req, res) => {
      res.render("about.ejs");
    });

    app.post("/about", (req, res) => {
      res.redirect("/about");
    });

    app.get("/:customListName", async (req, res) => {
      const customListName = req.params.customListName;
      const customListNameCapitalized = _.capitalize(customListName);
      var customList = await db
        .collection(customListNameCapitalized)
        .find({})
        .toArray(function (err, result) {
          if (err) throw err;
          console.log(result);
          db.close();
        });
      if (customList.length == 0) {
        await db
          .collection(customListNameCapitalized)
          .insertMany([
            { task: "Welcome to your todo list!" },
            { task: "Press enter key or submit button to add a new item." },
            { task: "<-- Hit this to delete an item." },
          ]);
        customList = await db
          .collection(customListNameCapitalized)
          .find({})
          .toArray(function (err, result) {
            if (err) throw err;
            console.log(result);
            db.close();
          });
        res.render("index.ejs", {
          type: customListNameCapitalized,
          list: customList,
        });
      } else {
        res.render("index.ejs", {
          type: customListNameCapitalized,
          list: customList,
        });
      }
    });

    app.post("/", async (req, res) => {
      const newTask = req.body["input"];
      const listN = await req.body.something;
      console.log(listN);
      const listName = _.capitalize(listN);
      if (listName === "Today") {
        const result = await db
          .collection("Today")
          .insertOne({ task: newTask });
        res.redirect("/");
      } else {
        const result = await db
          .collection(listName)
          .insertOne({ task: newTask });
        res.redirect("/" + listName);
      }
    });

    app.post("/delete", async (req, res) => {
      const checkedItemId = req.body.checkbox;
      const listName = req.body.hidden;
      const capListName = _.capitalize(listName);
      const checkedItemObjectID = new ObjectId(checkedItemId);
      if (listName !== "Today") {
        const result = await db
          .collection(capListName)
          .deleteOne({ _id: checkedItemObjectID });
        setTimeout(() => {
          res.redirect("/" + listName);
        }, 500);
      } else {
        const result = await db
          .collection("Today")
          .deleteOne({ _id: checkedItemObjectID });
        setTimeout(() => {
          res.redirect("/");
        }, 500);
      }
    });

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Error:", err);
  } finally {
    // await client.close(function (err, result) {
    //   if (err) throw err;
    //   console.log(result);
    // });
  }
}

connectToMongoDB().catch(console.error);
