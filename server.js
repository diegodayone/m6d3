const express = require("express")
const bodyParser = require("body-parser")
const cors = require("cors")

const studentsRouter = require("./services/students")
const projectsRouter = require("./services/projects")

const server = express();

server.use(cors())
server.use(bodyParser.json())

server.use("/students", studentsRouter);
server.use("/projects", projectsRouter)

//here we have to include the routes

server.listen(3550, () => {
    console.log("Yeee, I'm running!!!")
})