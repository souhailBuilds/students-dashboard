# Student & Payment Tracker

This is a web application I am building to help a small school (Maternelle & Tutoring Center) manage their business.

## Why I built this

My aunt called Amina runs a school and used to track everything on paper. I built this app to help her digitize her student records and track monthly payments more easily. This is my first real-world project using Node.js.

## Current Status: Work in Progress (WIP) 🚧

I am still a student and I am learning every day. This project is **not finished yet**. I am constantly adding new features and improving the code as I learn more about backend development.

## Features

- **Student Management:** Add and view student information.
- **Payment Tracking:** Keep track of who has paid and who has not.
- **Digital Records:** Moving from paper to a digital database.

## Technologies Used

- **Node.js**
- **Express.js**
- **JavaScript**
- **HTML/CSS**

## What is new in this version

----Split one big dashboard Script into smaller scripts using import and export.
---- Added Vite for frontend Dev
---- Organized Backend with controllers for students and Teachers.
---- Adopted MVC structure ( Models, Views,Controllers)

## How to use it

1. Clone the folder.
2. Install dependencies:
3. Start both frontend and backend together:
   (This runs the script: `"start": "concurrently \"npm run dev\" \"npm run backend\""`)

4. Open the app in your browser:

- Frontend (login page): http://localhost:5173/
- Backend API: http://localhost:9000/login

👉 To log in, go to **http://localhost:5173/** and enter username=0 and password=0.  
The frontend will send your login data to the backend API at **http://localhost:9000/login**.
