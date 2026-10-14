import React, { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "campusdesk-students";

const starterStudents = [
  {
    id: "STU-2025",
    fullName: "Mpho Ndlovu",
    age: 21,
    email: "mpho.ndlovu@example.com",
    course: "Information Technology",
    status: "Enrolled",
  },
  {
    id: "STU-2026",
    fullName: "Lerato Mokoena",
    age: 23,
    email: "lerato.mokoena@example.com",
    course: "Business Information Technology",
    status: "Enrolled",
  },
  {
    id: "STU-2027",
    fullName: "Thabo Khumalo",
    age: 20,
    email: "thabo.khumalo@example.com",
    course: "Software Engineering",
    status: "Pending",
  },
  {
    id: "STU-2028",
    fullName: "Naledi Phiri",
    age: 22,
    email: "naledi.phiri@example.com",
    course: "Information Technology",
    status: "Enrolled",
  },
  {
    id: "STU-2029",
    fullName: "Kabelo Rantso",
    age: 24,
    email: "kabelo.rantso@example.com",
    course: "Network Administration",
    status: "Graduated",
  },
];

const emptyForm = {
  fullName: "",
  age: "",
  email: "",
  course: "",
  status: "Enrolled",
};

function readStudents() {
  try {
    const savedStudents = localStorage.getItem(STORAGE_KEY);
    if (!savedStudents) return starterStudents;

    const parsedStudents = JSON.parse(savedStudents);
    if (
      Array.isArray(parsedStudents) &&
      parsedStudents.every((student) => student && typeof student.id === "string")
    ) {
      return parsedStudents;
    }
    return starterStudents;
  } catch (error) {
    console.error("Could not load saved student records.", error);
    return starterStudents;
  }
}

function validateStudent(form) {
  const errors = {};
  const fullName = form.fullName.trim();
  const email = form.email.trim();
  const age = Number(form.age);

  if (!fullName) errors.fullName = "Enter the student's full name.";
  if (!form.age) {
    errors.age = "Enter the student's age.";
  } else if (!Number.isInteger(age) || age < 16 || age > 100) {
    errors.age = "Age must be a whole number between 16 and 100.";
  }
  if (!email) {
    errors.email = "Enter an email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Enter a valid email address.";
  }
  if (!form.course) errors.course = "Choose a course of study.";
  if (!["Enrolled", "Pending", "Graduated"].includes(form.status)) {
    errors.status = "Choose a valid enrollment status.";
  }
  return errors;
}

function makeStudentId(students) {
  let highestId = 2024;
  students.forEach((student) => {
    const number = Number(student.id.replace(/\D/g, ""));
    if (Number.isFinite(number) && number > highestId) highestId = number;
  });
  return `STU-${highestId + 1}`;
}

function Icon({ name, size = 18 }) {
  const paths = {
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    people: (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M20 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    chevron: <path d="m9 18 6-6-6-6" />,
    close: <path d="m18 6-12 12M6 6l12 12" />,
    trash: (
      <>
        <path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6" />
        <path d="M10 11v5m4-5v5" />
      </>
    ),
    edit: (
      <>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
      </>
    ),
    book: (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 11h18" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
  };

  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name]}
    </svg>
  );
}

function Sidebar() {
  return (
    <aside className="sidebar">
      <a className="brand" href="#dashboard" aria-label="CampusDesk home">
        <span className="brand-mark">C</span>
        <span>campus<span className="brand-light">desk</span></span>
      </a>
      <div className="workspace-label">WORKSPACE</div>
      <nav aria-label="Main navigation">
        <a className="nav-item" href="#dashboard">
          <Icon name="grid" />
          <span>Dashboard</span>
        </a>
        <a className="nav-item active" href="#students" aria-current="page">
          <Icon name="people" />
          <span>Students</span>
          <span className="nav-count">01</span>
        </a>
      </nav>
      <div className="sidebar-bottom">
        <div className="help-card">
          <div className="help-icon">?</div>
          <strong>Need a hand?</strong>
          <p>Keep your student records up to date from one place.</p>
        </div>
        <div className="profile">
          <div className="avatar avatar-indigo">AD</div>
          <div className="profile-copy">
            <strong>Admin User</strong>
            <span>Administrator</span>
          </div>
          <span className="profile-dots" aria-hidden="true">···</span>
        </div>
      </div>
    </aside>
  );
}

function StatCard({ title, value, note, icon, tone }) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span className="stat-title">{title}</span>
        <span className={`stat-icon ${tone}`}><Icon name={icon} size={19} /></span>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-note">{note}</div>
    </article>
  );
}

function StudentRow({ student, onEdit, onDelete }) {
  const initials = student.fullName
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  const avatarTones = ["avatar-indigo", "avatar-mint", "avatar-peach", "avatar-blue"];
  const avatarTone = avatarTones[
    student.fullName.charCodeAt(0) % avatarTones.length
  ];

  return (
    <tr>
      <td className="student-cell">
        <div className={`avatar ${avatarTone}`}>{initials}</div>
        <div className="student-name">
          <strong>{student.fullName}</strong>
          <span>{student.id}</span>
        </div>
      </td>
      <td>{student.course}</td>
      <td>{student.age}</td>
      <td className="email-cell">{student.email}</td>
      <td>
        <span className={`status-badge status-${student.status.toLowerCase()}`}>
          <span className="status-dot" />
          {student.status}
        </span>
      </td>
      <td>
        <div className="row-actions">
          <button className="icon-button" type="button" onClick={() => onEdit(student)} aria-label={`Edit ${student.fullName}`}>
            <Icon name="edit" size={16} />
          </button>
          <button className="icon-button delete-action" type="button" onClick={() => onDelete(student)} aria-label={`Delete ${student.fullName}`}>
            <Icon name="trash" size={16} />
          </button>
        </div>
      </td>
    </tr>
  );
}

function StudentModal({ student, onClose, onSave }) {
  const [form, setForm] = useState(() => student
    ? {
        fullName: student.fullName,
        age: String(student.age),
        email: student.email,
        course: student.course,
        status: student.status,
      }
    : emptyForm);
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((currentForm) => ({ ...currentForm, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: "" }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    const validationErrors = validateStudent(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    onSave({
      ...form,
      fullName: form.fullName.trim(),
      age: Number(form.age),
      email: form.email.trim(),
    });
  }

  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="student-modal-title"
      >
        <div className="modal-heading">
          <div>
            <span className="eyebrow">{student ? "STUDENT RECORD" : "NEW RECORD"}</span>
            <h2 id="student-modal-title">{student ? "Edit student" : "Add a student"}</h2>
            <p>{student ? "Update the details for this student." : "Fill in the details to create a student record."}</p>
          </div>
          <button className="icon-button modal-close" type="button" onClick={onClose} aria-label="Close dialog">
            <Icon name="close" />
          </button>
        </div>
        <form className="student-form" onSubmit={handleSubmit} noValidate>
          <label className="field full-field">
            <span>Full name <b>*</b></span>
            <input
              autoFocus
              name="fullName"
              value={form.fullName}
              onChange={handleChange}
              placeholder="e.g. Mpho Ndlovu"
              aria-invalid={Boolean(errors.fullName)}
              aria-describedby={errors.fullName ? "fullName-error" : undefined}
            />
            {errors.fullName && <small id="fullName-error" className="field-error">{errors.fullName}</small>}
          </label>
          <label className="field">
            <span>Age <b>*</b></span>
            <input
              name="age"
              type="number"
              min="16"
              max="100"
              step="1"
              value={form.age}
              onChange={handleChange}
              placeholder="e.g. 21"
              aria-invalid={Boolean(errors.age)}
              aria-describedby={errors.age ? "age-error" : undefined}
            />
            {errors.age && <small id="age-error" className="field-error">{errors.age}</small>}
          </label>
          <label className="field">
            <span>Email address <b>*</b></span>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="name@example.com"
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "email-error" : undefined}
            />
            {errors.email && <small id="email-error" className="field-error">{errors.email}</small>}
          </label>
          <label className="field full-field">
            <span>Course of study <b>*</b></span>
            <select
              name="course"
              value={form.course}
              onChange={handleChange}
              aria-invalid={Boolean(errors.course)}
              aria-describedby={errors.course ? "course-error" : undefined}
            >
              <option value="">Select a course</option>
              <option>Information Technology</option>
              <option>Business Information Technology</option>
              <option>Software Engineering</option>
              <option>Network Administration</option>
              <option>Multimedia Design</option>
            </select>
            {errors.course && <small id="course-error" className="field-error">{errors.course}</small>}
          </label>
          <label className="field full-field">
            <span>Enrollment status <b>*</b></span>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              aria-invalid={Boolean(errors.status)}
              aria-describedby={errors.status ? "status-error" : undefined}
            >
              <option>Enrolled</option>
              <option>Pending</option>
              <option>Graduated</option>
            </select>
            {errors.status && <small id="status-error" className="field-error">{errors.status}</small>}
          </label>
          <div className="modal-actions full-field">
            <button className="button button-secondary" type="button" onClick={onClose}>Cancel</button>
            <button className="button button-primary" type="submit">
              {student ? "Save changes" : "Add student"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function DeleteModal({ student, onClose, onConfirm }) {
  useEffect(() => {
    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}>
      <section className="modal-card confirm-card" role="alertdialog" aria-modal="true" aria-labelledby="delete-title">
        <div className="confirm-icon"><Icon name="trash" size={22} /></div>
        <h2 id="delete-title">Delete student?</h2>
        <p>This will permanently remove <strong>{student.fullName}</strong> and their record from your dashboard.</p>
        <div className="modal-actions">
          <button className="button button-secondary" type="button" onClick={onClose}>Keep student</button>
          <button className="button button-danger" type="button" onClick={onConfirm}>Delete student</button>
        </div>
      </section>
    </div>
  );
}

function App() {
  const [students, setStudents] = useState(readStudents);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All students");
  const [isStudentModalOpen, setIsStudentModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(students));
    } catch (error) {
      console.error("Could not save student records.", error);
      setNotice("Your changes are visible, but could not be saved to this browser.");
    }
  }, [students]);

  useEffect(() => {
    if (!notice) return undefined;
    const timeoutId = window.setTimeout(() => setNotice(""), 4000);
    return () => window.clearTimeout(timeoutId);
  }, [notice]);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();
    return students.filter((student) => {
      const matchesSearch = !query || [
        student.fullName,
        student.id,
        student.email,
        student.course,
      ].some((value) => value.toLowerCase().includes(query));
      const matchesStatus = statusFilter === "All students" || student.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [students, search, statusFilter]);

  const enrolledCount = students.filter((student) => student.status === "Enrolled").length;
  const pendingCount = students.filter((student) => student.status === "Pending").length;
  const graduationCount = students.filter((student) => student.status === "Graduated").length;

  function addStudent(studentDetails) {
    const newStudent = {
      ...studentDetails,
      id: makeStudentId(students),
    };
    setStudents((currentStudents) => [newStudent, ...currentStudents]);
    setIsStudentModalOpen(false);
    setNotice(`${newStudent.fullName} was added successfully.`);
  }

  function editStudent(studentDetails) {
    setStudents((currentStudents) => currentStudents.map((student) => (
      student.id === editingStudent.id
        ? { ...student, ...studentDetails }
        : student
    )));
    setNotice(`${studentDetails.fullName}'s record was updated.`);
    setIsStudentModalOpen(false);
    setEditingStudent(null);
  }

  function deleteStudent() {
    setStudents((currentStudents) => currentStudents.filter(
      (student) => student.id !== studentToDelete.id,
    ));
    setNotice(`${studentToDelete.fullName}'s record was deleted.`);
    setStudentToDelete(null);
  }

  const openAddModal = () => {
    setEditingStudent(null);
    setIsStudentModalOpen(true);
  };
  const openEditModal = (student) => {
    setEditingStudent(student);
    setIsStudentModalOpen(true);
  };
  const handleModalClose = () => {
    setIsStudentModalOpen(false);
    setEditingStudent(null);
  };
  const handleDeleteClose = () => setStudentToDelete(null);

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content" id="dashboard">
        <header className="topbar">
          <div className="breadcrumb"><span>Workspace</span><Icon name="chevron" size={14} /><strong>Students</strong></div>
          <div className="topbar-right">
            <span className="semester-label"><Icon name="calendar" size={16} /> Semester 3, 2025</span>
            <div className="avatar avatar-indigo top-avatar" aria-label="Admin User">AD</div>
          </div>
        </header>
        <div className="page-content" id="students">
          <section className="page-heading">
            <div>
              <div className="eyebrow">STUDENT DIRECTORY</div>
              <h1>Students <span className="heading-count">{students.length}</span></h1>
              <p>Manage your student records, all in one place.</p>
            </div>
            <button className="button button-primary add-button" type="button" onClick={openAddModal}>
              <Icon name="plus" size={18} /> Add student
            </button>
          </section>

          <section className="stats-grid" aria-label="Student statistics">
            <StatCard title="Total students" value={students.length} note="Across all courses" icon="people" tone="tone-purple" />
            <StatCard title="Enrolled" value={enrolledCount} note="Currently studying" icon="book" tone="tone-green" />
            <StatCard title="Pending" value={pendingCount} note="Awaiting enrollment" icon="calendar" tone="tone-orange" />
            <StatCard title="Graduated" value={graduationCount} note="Completed their course" icon="grid" tone="tone-blue" />
          </section>

          <section className="table-card" aria-labelledby="directory-heading">
            <div className="table-card-heading">
              <div>
                <h2 id="directory-heading">All students</h2>
                <p>A complete list of students in your institution.</p>
              </div>
              <span className="record-count">{filteredStudents.length} {filteredStudents.length === 1 ? "record" : "records"}</span>
            </div>
            <div className="table-controls">
              <label className="search-box">
                <Icon name="search" size={18} />
                <input
                  type="search"
                  placeholder="Search by name, ID, email or course..."
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  aria-label="Search students"
                />
              </label>
              <label className="filter-control">
                <span className="sr-only">Filter by enrollment status</span>
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                  <option>All students</option>
                  <option>Enrolled</option>
                  <option>Pending</option>
                  <option>Graduated</option>
                </select>
              </label>
            </div>
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    <th scope="col">STUDENT</th>
                    <th scope="col">COURSE</th>
                    <th scope="col">AGE</th>
                    <th scope="col">EMAIL ADDRESS</th>
                    <th scope="col">STATUS</th>
                    <th scope="col"><span className="sr-only">Actions</span></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((student) => (
                    <StudentRow
                      key={student.id}
                      student={student}
                      onEdit={openEditModal}
                      onDelete={setStudentToDelete}
                    />
                  ))}
                </tbody>
              </table>
              {filteredStudents.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon"><Icon name="people" size={22} /></div>
                  <strong>{students.length === 0 ? "No students yet" : "No matching students"}</strong>
                  <p>{students.length === 0
                    ? "Add your first student to get started."
                    : "Try another search term or change the status filter."}</p>
                  {students.length === 0 && (
                    <button className="button button-primary" type="button" onClick={openAddModal}>
                      <Icon name="plus" size={17} /> Add student
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="table-footer">
              <span>Showing <strong>{filteredStudents.length}</strong> of <strong>{students.length}</strong> students</span>
              <span className="footer-note"><span className="sync-dot" /> Changes save automatically</span>
            </div>
          </section>
          <footer className="page-footer">
            <span>CampusDesk <span className="footer-separator">·</span> Student management</span>
            <span>DIWA2110 <span className="footer-separator">·</span> Semester 3</span>
          </footer>
        </div>
      </main>

      {isStudentModalOpen && (
        <StudentModal
          student={editingStudent}
          onClose={handleModalClose}
          onSave={editingStudent ? editStudent : addStudent}
        />
      )}
      {studentToDelete && (
        <DeleteModal
          student={studentToDelete}
          onClose={handleDeleteClose}
          onConfirm={deleteStudent}
        />
      )}
      {notice && <div className="toast" role="status">{notice}</div>}
    </div>
  );
}

export default App;
