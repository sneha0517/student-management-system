import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
    const [students, setStudents] = useState([]);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [course, setCourse] = useState("");
    const [age, setAge] = useState("");
    const [search, setSearch] = useState("");
    const [editingId, setEditingId] = useState(null);

    const API_URL = `http://${window.location.hostname}:5001`;

    // Get all students
    const fetchStudents = async () => {
        try {
            const response = await axios.get(`${API_URL}/students`);
            setStudents(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // Clear form
    const clearForm = () => {
        setName("");
        setEmail("");
        setCourse("");
        setAge("");
        setEditingId(null);
    };

    // Add or Update student
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (editingId) {
                // Update existing student
                await axios.put(`${API_URL}/students/${editingId}`, {
                    name,
                    email,
                    course,
                    age: Number(age)
                });

                alert("Student updated successfully!");
            } else {
                // Add new student
                await axios.post(`${API_URL}/students`, {
                    name,
                    email,
                    course,
                    age: Number(age)
                });

                alert("Student added successfully!");
            }

            clearForm();
            fetchStudents();

        } catch (error) {
            console.error("Error saving student:", error);

            if (error.response?.data?.message) {
                alert(error.response.data.message);
            } else {
                alert("Something went wrong");
            }
        }
    };

    // Start editing a student
    const editStudent = (student) => {
        setEditingId(student._id);
        setName(student.name);
        setEmail(student.email);
        setCourse(student.course);
        setAge(student.age);
        
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    // Delete student
    const deleteStudent = async (id) => {
        const confirmDelete = window.confirm(
            "Are you sure you want to delete this student?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            await axios.delete(`${API_URL}/students/${id}`);
            fetchStudents();
        } catch (error) {
            console.error("Error deleting student:", error);
            alert("Could not delete student");
        }
    };

    // Search students
    const filteredStudents = students.filter((student) =>
        student.name.toLowerCase().includes(search.toLowerCase()) ||
        student.email.toLowerCase().includes(search.toLowerCase()) ||
        student.course.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="app">

            {/* Header */}
            <header className="header">
                <div>
                    <h1>Student Management System</h1>
                    <p>Manage student records from one place</p>
                </div>
            </header>

            <main className="container">

                {/* Statistics */}
                <div className="stats">

                    <div className="stat-card">
                        <span className="stat-icon">👨‍🎓</span>

                        <div>
                            <p>Total Students</p>
                            <h2>{students.length}</h2>
                        </div>
                    </div>

                    <div className="stat-card">
                        <span className="stat-icon">📚</span>

                        <div>
                            <p>Courses</p>
                            <h2>
                                {
                                    new Set(
                                        students.map(
                                            (student) => student.course
                                        )
                                    ).size
                                }
                            </h2>
                        </div>
                    </div>

                </div>

                {/* Add / Edit Student */}
                <section className="card">

                    <div className="section-title">
                        <div>
                            <h2>
                                {editingId
                                    ? "Edit Student"
                                    : "Add New Student"}
                            </h2>

                            <p>
                                {editingId
                                    ? "Update the student's information below"
                                    : "Enter the student's details below"}
                            </p>
                        </div>
                    </div>

                    <form
                        onSubmit={handleSubmit}
                        className="student-form"
                    >

                        <div className="input-group">
                            <label>Student Name</label>

                            <input
                                type="text"
                                placeholder="Enter full name"
                                value={name}
                                onChange={(e) =>
                                    setName(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Email</label>

                            <input
                                type="email"
                                placeholder="Enter email address"
                                value={email}
                                onChange={(e) =>
                                    setEmail(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Course</label>

                            <input
                                type="text"
                                placeholder="e.g. MSc Computer Science"
                                value={course}
                                onChange={(e) =>
                                    setCourse(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>Age</label>

                            <input
                                type="number"
                                placeholder="Age"
                                value={age}
                                onChange={(e) =>
                                    setAge(e.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="form-buttons">

                            <button
                                className="add-button"
                                type="submit"
                            >
                                {editingId
                                    ? "✓ Update Student"
                                    : "+ Add Student"}
                            </button>

                            {editingId && (
                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={clearForm}
                                >
                                    Cancel
                                </button>
                            )}

                        </div>

                    </form>

                </section>

                {/* Students List */}
                <section className="card">

                    <div className="students-header">

                        <div>
                            <h2>Students</h2>

                            <p>
                                View and manage all registered students
                            </p>
                        </div>

                        <input
                            className="search"
                            type="text"
                            placeholder="🔍 Search students..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>

                    {filteredStudents.length === 0 ? (

                        <div className="empty">

                            <div className="empty-icon">
                                👨‍🎓
                            </div>

                            <h3>No students found</h3>

                            <p>
                                Add a student or try a different search.
                            </p>

                        </div>

                    ) : (

                        <div className="student-table">

                            <div className="table-header">
                                <span>Name</span>
                                <span>Email</span>
                                <span>Course</span>
                                <span>Age</span>
                                <span>Action</span>
                            </div>

                            {filteredStudents.map((student) => (

                                <div
                                    className="student-row"
                                    key={student._id}
                                >

                                    <div className="student-name">

                                        <div className="avatar">
                                            {student.name
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <strong>
                                            {student.name}
                                        </strong>

                                    </div>

                                    <span>{student.email}</span>

                                    <span>{student.course}</span>

                                    <span>{student.age}</span>

                                    <div className="actions">

                                        <button
                                            className="edit-button"
                                            onClick={() =>
                                                editStudent(student)
                                            }
                                        >
                                            Edit
                                        </button>

                                        <button
                                            className="delete-button"
                                            onClick={() =>
                                                deleteStudent(
                                                    student._id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </main>

            <footer>
                Student Management System • Full Stack Development Project
            </footer>

        </div>
    );
}

export default App;
