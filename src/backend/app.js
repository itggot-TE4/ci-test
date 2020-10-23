const fetch = require("node-fetch");
const express = require("express");
const bodyParser = require('body-parser');
const db = require('better-sqlite3')("./src/backend/database/database.sqlite");
const auth = require("./config/github");

const app = express();

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header ("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    //res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token");
    res.header("Access-Control-Allow-Headers", "*");
    next();
});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());

app.get("/seed", async(req, res) => {
    await db.run("DROP TABLE IF EXISTS comments");
    await db.run("CREATE TABLE comments (id INTEGER PRIMARY KEY AUTOINCREMENT, github_uid INTEGER, github_forkId INTEGER, comment TEXT, state TEXT)");
    res.send("Generated database!");
});

app.get("/getToken", (req, res) => {
    const code = req.query.code;
    fetch(`https://github.com/login/oauth/access_token${auth}&code=${code}`, { method: 'POST' })
    .then(result => {
        return result.text()
    }) // expecting a json response
    .then(text => {
        res.send(text)
    }).catch(err => {
        console.error(err);
    })
});

// await db.run\(("[UI].*"),\s+\[(.*)\]
// db.prepare($1).run($2

app.post("/comments", async(req, res) => {
    const request = await fetch(`https://api.github.com/user`, {
        headers: {
            "Authorization": `token ${req.headers.token}`
        }
    });
    const result = await request.json();

    const data = db.prepare("SELECT * from comments WHERE github_forkId = ?").get(req.body.forkId)
    //console.log(data)
    try{
        if(data !== undefined){
            db.prepare("UPDATE comments SET comment = ?, state = ? WHERE github_forkId = ?;").run(req.body.comment, req.body.state, req.body.forkId);
        } else{
            db.prepare("INSERT INTO comments (github_uid, github_forkId, comment, state) VALUES (?, ?, ?, ?);").run(result.id, req.body.forkId, req.body.comment, req.body.state);
        }
    } catch(e) {
        res.status(500).send(e)
    }
    res.status(200).send("Inserted.");
});

app.get("/comments", async(req, res) => {
    const forkId = req.query.fork;
    const result = db.prepare("SELECT * from comments WHERE github_forkId = ?").all(forkId);
    res.send(result);
});

app.listen(4000, () => {
    console.log("Server running on port 4000");
});
