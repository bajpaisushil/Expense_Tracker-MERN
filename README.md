# 💸 Expense Tracker Web Application

A full-stack expense tracker web application built with **Next.js**, **TailwindCSS**, **Shadcn UI** on the frontend and **Node.js**, **Express** on the backend. Both frontend and backend are written in **TypeScript**. It allows users to register, log in, and manage their daily expenses with ease.

![image](https://github.com/user-attachments/assets/07f31e30-4979-4861-9ece-a7cefc42eb7f)

![Screenshot 2025-04-25 203630](https://github.com/user-attachments/assets/e8dfff0b-8d40-4900-aa02-f1930ca50e61)

![Screenshot 2025-04-25 203656](https://github.com/user-attachments/assets/8b95c9dd-347b-41d4-84a5-d82dae48e693)

![Screenshot 2025-04-25 203713](https://github.com/user-attachments/assets/584e8574-455e-4228-a943-c30745f03f90)



## 🚀 Features

- User authentication (register/login/logout)
- Add, update, delete expenses
- Monthly expense overview
- Dashboard to visualize expenses
- Clean and modern UI with Shadcn UI
- Fully responsive design

## 🛠️ Tech Stack

**Frontend:**
- Next.js (App Router)
- TailwindCSS
- Shadcn UI
- TypeScript

**Backend:**
- Node.js
- Express.js
- TypeScript
- MongoDB (via Mongoose)

## 📁 Project Structure


Expense_Tracker-MERN/
├── frontend/               # Next.js frontend
│   ├── app/                # App router directory
│   ├── components/         # Reusable components
│   ├── lib/                # Utility functions
│   └── ...                 # Other Next.js folders
├── backend/                # Express backend
│   ├── src/
│   │   ├── controllers/    # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   └── ...            # Other backend files
├── docker-compose.yml      # Docker configuration
└── ...                     # Other project files


## Setup using simple frontend and backend files

1. Clone the Repository
```
git clone git@github.com:bajpaisushil/Expense_Tracker-MERN.git
cd Expense_Tracker-MERN
```

2. Change directory to frontend folder
```
cd frontend
```

3. Add environment variables as follows:
```
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

4. Install the frontend dependencies
```
npm install
```

5. Run the application
```
npm run dev
```

6. Now, Open another terminal and change directory to backend folder
```
cd backend
```

7. Add environment variables as follows:
```
PORT=5000
MONGODB_URI=mongodb+srv://mongodb_username:mongodb_password@cluster0.fce4vg7.mongodb.net/expense-db?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your_jwt_secret_key_change
JWT_EXPIRES_IN=30d
```

8. Install the backend dependencies
```
npm install
```

9. Run the application
```
npm run dev
```

10. Both the frontend and backend are now running on your localhost.
    Frontend on localhost:3000 and Backend on localhost:5000


## Setup using Docker

1. Clone the Repository
```
git clone git@github.com:bajpaisushil/Expense_Tracker-MERN.git
cd Expense_Tracker-MERN
```

2. Add .env file in the root directory of the project as provided in .env.example here in github. Just update the MONGODB_URI, rest can remain same.

3. Run the container using following command.
```
docker-compose up
```
It will take the environment variables from that .env file and proceed to start.

4. Now your application is running and you can access them at localhost:3000(Frontend) and localhost:5000(Backend)


# Potential Future Improvements:

Implement expense categorization (e.g., food, travel, utilities).
Add reporting features to visualize spending patterns by category and over time.
Introduce budgeting functionality to set spending limits.
Allow users to export their expense data in formats like CSV.
Enhance the dashboard with more detailed and interactive visualizations.
Include unit, integration, and end-to-end tests for better code reliability.
