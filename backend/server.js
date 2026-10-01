const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Student = require("./models/Student");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Student Management API is running!"
    });
});

app.get("/students", async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: error.message
        });
    }
});

app.post("/students", async (req, res) => {
    console.log("POST /students received");
    console.log("Data:", req.body);

    try {
        const student = new Student({
            name: req.body.name,
            email: req.body.email,
            course: req.body.course,
            age: Number(req.body.age)
        });

        const savedStudent = await student.save();

        console.log("Student saved:", savedStudent);

        res.status(201).json(savedStudent);
    } catch (error) {
        console.error("POST ERROR:", error);

        res.status(400).json({
            message: error.message
        });
    }
});
app.put("/students/:id", async (req, res) => {
    try {
        const updatedStudent = await Student.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                email: req.body.email,
                course: req.body.course,
                age: Number(req.body.age)
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedStudent) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json(updatedStudent);
    } catch (error) {
        console.error("PUT ERROR:", error);

        res.status(400).json({
            message: error.message
        });
    }
});

app.delete("/students/:id", async (req, res) => {
    try {
        const deletedStudent = await Student.findByIdAndDelete(
            req.params.id
        );

        if (!deletedStudent) {
            return res.status(404).json({
                message: "Student not found"
            });
        }

        res.json({
            message: "Student deleted successfully"
        });
    } catch (error) {
        console.error(error);

        res.status(400).json({
            message: error.message
        });
    }
});

const PORT = 5001;

mongoose.connect(
    process.env.MONGO_URI || "mongodb://127.0.0.1:27017/student_management"
)
    .then(() => {
        console.log("MongoDB connected successfully");

        app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
    })
    .catch((error) => {
        console.error("MongoDB connection failed:", error);
    });