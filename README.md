# Shared Wishlist App

A collaborative product wishlist platform where multiple users can **create**, **manage**, and **interact with wishlists in real-time**. Perfect for group gift planning, shopping sprees, or event coordination — all through a modern, mobile-friendly interface!

---

##  Features

-  User Sign-up/Login with JWT Authentication
-  Create, edit, and delete wishlists
-  Add products with name, image, price, URL, and priority
-  Show who added which item username
-  Mock invite functionality to collaborate with others
-  Fully responsive and mobile-friendly UI using **Tailwind CSS**

---

## Tech Stack

### Frontend
- React 18 + TypeScript
- Tailwind CSS
- Axios
- React Router
- Socket.io-client

### Backend
- Node.js + Express + TypeScript
- MongoDB + Mongoose
- JWT (Authentication)
- Socket.io
- CORS

---

## 📂 Project Structure

```

Shared\_Wishlist\_App/
├── frontend/
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── types/
│       └── utils/
├── backend/
│   └── src/
│       ├── controllers/
│       ├── models/
│       ├── routes/
│       ├── middleware/
│       └── utils/
└── README.md

## 🖼️ UI Snapshots

### 🔐 Login Page
![Screenshot (560)](https://github.com/user-attachments/assets/f5039980-2e43-4a09-b67f-803206f4b9a8)
![Screenshot (559)](https://github.com/user-attachments/assets/e730c73b-3198-4813-a70c-fa2dbfa2995c)

### 🧾 Create Wishlist Page
![Screenshot (554)](https://github.com/user-attachments/assets/d29b4475-d9fc-4ea5-b6cb-2ee5d7b77473)
![Screenshot (555)](https://github.com/user-attachments/assets/48b65d73-19ad-440b-ab37-f1c15e844d04)
![Screenshot (556)](https://github.com/user-attachments/assets/9e7adea0-6c92-4f48-ab04-41352cdac914)

### 🛍️ Wishlist with Products
![Screenshot (557)](https://github.com/user-attachments/assets/4650a983-47ed-43cf-b656-dbe20d142733)
![Screenshot (558)](https://github.com/user-attachments/assets/88282624-0303-44ac-9de8-fe11da48515c)
![Screenshot (561)](https://github.com/user-attachments/assets/a0b23943-0f05-456c-a780-98d23ca0a5ea)

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v16+
- MongoDB (local or cloud)
- npm or yarn

---

### 🔧 Backend Setup

```bash
cd backend
npm install
````

Create a `.env` file:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/Shared_Wishlist_app
JWT_SECRET=your-secret-key
```

Start server:

```bash
npm run dev
```

---

### 🌐 Frontend Setup

```bash
cd frontend
npm install
npm start
```

App runs at: `http://localhost:3000`
Backend at: `http://localhost:5000`

---


## 📈 Scaling Considerations

### Performance

* Redis for caching
* Pagination on large wishlists
* MongoDB indexing
* CDN for static assets

### Architecture

* Microservices support
* Load balancer for availability
* API Gateway
* DB sharding at scale

### Security

* Input validation
* Rate limiting & auth middleware
* Secure HTTPS production
* File validation for uploads

---

## 🙋‍♂️ Author

**Umesh**
📧 `umeshyadav7988@gmail.com`
🔗 [GitHub Profile](https://github.com/umeshyadav7988)

