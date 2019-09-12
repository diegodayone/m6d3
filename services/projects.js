const express = require("express")
const fs = require("fs")

const router = express.Router()

router.get('/', (req, res) => {
    var buffer = fs.readFileSync("projects.json");
    var content = buffer.toString()

    res.send(content)
})

router.get("/:id", (req, res) => {
    var buffer = fs.readFileSync("projects.json");
    var content = buffer.toString()
    var projectsDB = JSON.parse(content)
    var project = projectsDB.find(x => x.ID == req.params.id)
    if (!project)
        res.send("cannot find project")
    else
        res.send(project)
})

router.post("/", (request, response) => {
    var newproject = request.body;

    var buffer = fs.readFileSync("projects.json");
    var content = buffer.toString()
    var projectsDB = JSON.parse(content)

    newproject.ID = projectsDB.length + 1;

    projectsDB.push(newproject)

    fs.writeFileSync("projects.json", JSON.stringify(projectsDB))

    response.send(projectsDB)
})

router.delete("/:id", (req, res) => {
    var buffer = fs.readFileSync("projects.json");
    var content = buffer.toString()
    var projectsDB = JSON.parse(content)
    var newDb = projectsDB.filter(x => x.ID != req.params.id)
    fs.writeFileSync("projects.json", JSON.stringify(newDb))

    res.send(newDb)
})

router.put("/:id", (req, res) => {
    var buffer = fs.readFileSync("projects.json");
    var content = buffer.toString()
    var projectsDB = JSON.parse(content)
    var newDb = projectsDB.filter(x => x.ID != req.params.id) //removing previous item
    var project = req.body;
    project.ID = req.params.id;
    newDb.push(project) //adding new item 
    fs.writeFileSync("projects.json", JSON.stringify(newDb))

    res.send(newDb)
})

module.exports = router;