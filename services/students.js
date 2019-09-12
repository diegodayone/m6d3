const express = require("express")
const fs = require("fs")
const multer = require("multer")
const { parse } = require("url")

const router = express.Router()

router.get('/', (req, res) => {
    var buffer = fs.readFileSync("students.json");
    var content = buffer.toString()

    res.send(content)
})

router.get("/:id", (req, res) => {
    var buffer = fs.readFileSync("students.json");
    var content = buffer.toString()
    var studentsDB = JSON.parse(content)
    var student = studentsDB.find(x => x.ID == req.params.id)
    if (!student)
        res.send("cannot find student")
    else
        res.send(student)
})

router.get("/projects/:id", (req, res) => {
    var buffer = fs.readFileSync("projects.json");
    var content = buffer.toString()
    var projects = JSON.parse(content)

    res.send(projects.filter(x => x.StudentID == req.params.id))

})

router.post("/", (request, response) => {
    var newStudent = request.body;

    var buffer = fs.readFileSync("students.json");
    var content = buffer.toString()
    var studentsDB = JSON.parse(content)

    newStudent.ID = studentsDB.length + 1;

    studentsDB.push(newStudent)

    fs.writeFileSync("students.json", JSON.stringify(studentsDB))

    response.send(studentsDB)
})

const uploadImage = multer({})

router.post("/:id/upload", uploadImage.single("picture"), (req, res) => {

    var fullUrl = req.protocol + '://' + req.get('host') + "/img/students/";

    //1) upload the file in the specified folder
    // michele.jpg ==> [michele, jpg] => jpg
    var fileName = req.params.id + "." + req.file.originalname.split(".").reverse()[0];
    var path = "./img/students/" + fileName
    fs.writeFile(path, req.file.buffer);

    //2) we have to update the student in order to have the link in it
    var buffer = fs.readFileSync("students.json");
    var content = buffer.toString()
    var studentsDB = JSON.parse(content)
    var student = studentsDB.find(x => x.ID == req.params.id);
    studentsDB = studentsDB.filter(x => x.ID != req.params.id)
    student.Image = fullUrl + fileName
    console.log(req.baseUrl);
    studentsDB.push(student);
    fs.writeFileSync("students.json", JSON.stringify(studentsDB))
    res.send(student);
})

router.delete("/:id", (req, res) => {
    var buffer = fs.readFileSync("students.json");
    var content = buffer.toString()
    var studentsDB = JSON.parse(content)
    var newDb = studentsDB.filter(x => x.ID != req.params.id)
    fs.writeFileSync("students.json", JSON.stringify(newDb))

    res.send(newDb)
})

router.put("/:id", (req, res) => {
    var buffer = fs.readFileSync("students.json");
    var content = buffer.toString()
    var studentsDB = JSON.parse(content)
    var newDb = studentsDB.filter(x => x.ID != req.params.id) //removing previous item
    var student = req.body;
    student.ID = req.params.id;
    newDb.push(student) //adding new item 
    fs.writeFileSync("students.json", JSON.stringify(newDb))

    res.send(newDb)
})

module.exports = router;