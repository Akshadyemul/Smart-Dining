# 🍽️ Smart Dining System

A full-stack **Smart Dining platform** that enables **table reservations, QR-based ordering, and restaurant management**.

> This project is **open-source and learning-focused**. It was built with the help of AI tools, and I primarily worked on the **frontend (React + TypeScript + Tailwind CSS)**. Feel free to fork and improve it.

---

## 🚀 Overview

The system has **three parts**:

1. **Customer App** (`smart-dining-user-app`)
2. **Restaurant/Admin App** (`smart-dining-restaurant-app`)
3. **Backend API** (`backend`)

It allows users to:

* Discover restaurants
* Book tables in advance
* Pre-order food before arrival
* Scan QR codes at tables to order instantly

Restaurants can:

* Manage menus, tables, and orders
* Accept/decline incoming orders
* Track reservations and earnings

---

## 🎯 Features

### 👤 Customer Side

* User authentication (login)
* View registered restaurants
* Book tables for a specific time
* (Optional) Pre-order food before visiting
* Scan **QR code on table** to access menu
* Place orders directly from table

---

### 🧑‍🍳 Restaurant/Admin Side

* Restaurant login & registration
* Manage menu items
* Manage tables (each table is unique)
* Handle incoming orders (accept / decline)
* Track reservations
* View earnings and order history

---

## ⚙️ How the System Works (End-to-End)

1. User logs in and browses restaurants
2. User books a table for a specific time
3. User can optionally pre-order food
4. When user reaches restaurant:

   * Scans QR code on table
   * Opens menu of that specific table
5. User places order → sent to backend
6. Restaurant dashboard receives order
7. Restaurant accepts/declines and updates status
8. Order is prepared and served

---

## 🧠 Tech Stack

### Frontend

* React + TypeScript
* Tailwind CSS
* Vite

### Backend

* Node.js
* Express.js

### Database

* MongoDB

---

## 🗂️ Project Structure

```
smart-dining-user-app/
smart-dining-restaurant-app/
backend/
```

---

## 🛠️ Setup & Installation

### 1. Clone the repository

```
git clone https://github.com/Akshadyemul/Smart-Dining.git
cd smart-dining
```

---

### 2. Install dependencies

Run in **each folder separately**:

```
cd smart-dining-user-app
npm install

cd ../smart-dining-restaurant-app
npm install

cd ../backend
npm install
```

---

### 3. Setup MongoDB

* Make sure MongoDB is running locally
* Create a connection using:

```
mongodb://localhost:27017/smart_dining
```

---

### 4. Run the project (3 terminals required)

#### Terminal 1

```
cd smart-dining-user-app
npm run dev
```

#### Terminal 2

```
cd smart-dining-restaurant-app
npm run dev
```

#### Terminal 3

```
cd backend
npm run dev
```

---

## 📌 Key Concepts Used

* Component-based architecture
* State management (React Hooks)
* Props & data flow
* Event handling
* QR-based system design
* Full-stack communication (Frontend ↔ Backend ↔ DB)

---

## 🧪 Purpose of This Project

This project was built to:

* Learn how **AI can help build software systems**
* Understand real-world **frontend + backend integration**
* Practice **system design thinking**
* Build a strong **portfolio project for interviews**

---

## 🛠️ Future Improvements

* Real-time updates (WebSockets)
* Payment integration
* Role-based access control
* Advanced analytics for restaurant earnings
* Notifications for order status
* Better authentication & security
* Deployment (cloud)
* UI/UX improvements

---

## 🤝 Contribution

This project is **open source for learning and improvements 🚀**

You are encouraged to:

* Fork the repo
* Improve features
* Fix bugs
* Optimize code
* Add new ideas

---

## 🙌 Acknowledgement

This project was built independently with the assistance of AI tools.

My contribution:

* Designed and developed the frontend using React, TypeScript, and Tailwind CSS
* Integrated and adapted AI-generated code to build a complete working system

---

## ⭐ Support

If you found this helpful:

* ⭐ Star the repo
* 🍴 Fork it
* 📢 Share with others

---

## 📬 Contact

Open for collaboration and learning!
