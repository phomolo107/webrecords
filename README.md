# CampusDesk — Student Management System

A responsive student dashboard built for the DIWA2110 Web Application Development individual assignment. The app uses React and JavaScript to view, add, edit, search, filter, and delete student records.

## Run locally

1. Install [Node.js](https://nodejs.org/) (version 18 or newer).
2. From this project directory, install dependencies:

   ```sh
   npm install
   ```

3. Start the development server:

   ```sh
   npm run dev
   ```

4. Open the local URL printed by Vite.

Create a production build with `npm run build`; preview it locally with `npm run preview`.

## Features

- Dashboard summary cards for total, enrolled, pending, and graduated students.
- Search by student name, ID, email, or course, and filter by enrollment status.
- Add and edit forms with required-field, age, email, course, and status validation.
- A separate confirmation dialog before deleting a student.
- Responsive student table, accessible form labels and dialogs, and an empty state.
- Automatic persistence in browser `localStorage`; no server or account is required.

Student records contain a string ID, full name, email, course, and enrollment status, plus a numeric age. Records are JavaScript objects held in an array. Form input values begin as strings, and the age is validated and converted to a number before it is stored. React state uses booleans for student-modal visibility, `null` or a student object for the selected records, and strings for search and filter values.

## JavaScript and React notes

- `const` is used for values and functions that are not reassigned. `let` is used for the highest student ID accumulator because its value is updated while student records are checked.
- `var` is intentionally not used: it has function scope and redeclaration behavior that is unnecessary in this modern module-based React app. The assignment asks for `var` where appropriate, not for its use where it offers no benefit.
- Reusable functions handle validation, ID creation, searching/filtering, and CRUD state updates. Array methods such as `filter`, `map`, `reduce`, and `some` keep these operations declarative.
- `Sidebar`, `StatCard`, `StudentRow`, `StudentModal`, and `DeleteModal` separate the UI into reusable components. Props communicate record data and event handlers; `useState` drives changes and `useEffect` persists records.
- State updates are immutable, so React renders the current records immediately after each operation.

## Manual test checklist

1. Load the dashboard and verify the sample records and summary counts appear.
2. Add a student with valid details; confirm the record and counts update.
3. Try saving with missing fields, an invalid email, or an age outside 16–100; confirm clear errors appear and the record is not saved.
4. Edit a student and confirm the changed values appear in the table.
5. Open the delete dialog, cancel, and verify the student remains; reopen it, confirm deletion, and verify the student is removed.
6. Search by name, ID, email, and course; change the status filter and verify results.
7. Search for a non-existent student, then remove the search/filter and verify the records return.
8. Delete all students and verify the empty state and its add button work.
9. Refresh the page and verify changes persist in the same browser.
10. Resize to mobile width and verify the dashboard remains usable.

## Publish

Push the project to a GitHub repository (do not include `node_modules`). On Netlify or Vercel, import the repository and use:

- Build command: `npm run build`
- Publish/output directory: `dist`

After deployment, open the public URL and repeat the CRUD and validation checks. Submit both the repository URL and the deployed application URL.
