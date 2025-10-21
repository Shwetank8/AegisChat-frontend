# AegisChat — Encrypted Real-Time Chat (Frontend)

A sleek, secure, and real-time chat frontend built with **Next.js** and **Socket.IO Client**, designed to work with the **Node.js + Express + Socket.IO backend**.  
This app allows users to create and join private chat rooms, exchange **end-to-end encrypted messages**, and experience instant communication — all within a modern, responsive UI.

---
## 📸 Preview
<img width="1739" height="829" alt="image" src="https://github.com/user-attachments/assets/e8e5df23-df75-46fb-bf6b-638bb7a403ae" />



<img width="1498" height="814" alt="image" src="https://github.com/user-attachments/assets/a446d1ff-30eb-4a7a-8665-fdf53120f1bd" />

---

## 🚀 Features

- 🔒 **End-to-End Encryption (E2EE)** using AES via `crypto-js`
- ⚡ Real-time chat powered by **Socket.IO**
- 🏠 Create or join private chat rooms with unique IDs
- 💬 Persistent encrypted message history using redis
- 🧑‍💻 Simple and clean UI with React Hooks
- 📱 Fully **responsive** and mobile-friendly layout
- 🔁 Reconnects automatically if disconnected

---

## 🧩 Tech Stack

| Technology | Purpose |
|-------------|----------|
| **Next.js 14+** | React-based frontend framework |
| **Socket.IO Client** | Real-time communication |
| **Redis** | Data Persistance |
| **CryptoJS** | Encryption & decryption of messages |
| **Tailwind CSS** | Modern, utility-first styling |
| **Lucide React** | Icon set for UI components |

---

## 📦 Installation & Setup

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/aegischat-frontend.git
cd aegischat-frontend

Environment Variable(.env): NEXT_PUBLIC_SOCKET_URL=http://localhost:5000


npm install
# or
yarn install
```

## Backend for AegisChat- https://github.com/Shwetank8/AegisChat-backend
