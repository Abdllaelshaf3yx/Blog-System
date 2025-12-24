# 📝 Minimalist Blog System

A modern, full-featured blogging platform built with **React**, **Vite**, and **Firebase**. This application allows users to publish their thoughts, engage with the community through comments and likes, and manage their own public profiles.

## ✨ Features

### 🎨 Modern UI/UX
- **Clean & Minimalist Design**: Focused on readability and user experience.
- **Glassmorphism Effects**: Premium visual aesthetic.
- **Responsive Layout**: Seamless experience on desktop, tablet, and mobile.
- **Animations**: Smooth transitions and interactive elements.

### 👤 User Management
- **Authentication**: Secure Login and Signup powered by Firebase Auth.
- **Public Profiles**: Dedicated pages for users displaying their bio and published blogs (`/user/:userId`).
- **Privacy Focused**: User email addresses are hidden from public view.

### ✍️ Content Creation (CRUD)
- **Create & Edit Blogs**: A streamlined, single-column editor for a distraction-free writing experience.
- **Rich Media**: Support for cover image uploads (integrated with ImgBB).
- **Markdown Support**: (Future) Write content using Markdown syntax.
- **Delete Support**: Authors can manage and delete their own posts.

### 🤝 Engagement
- **Comments System**: Real-time comments on posts.
- **Reactions**: Like/Heart blogs to show appreciation.
- **Search**: Real-time filtering of blogs by title and content.

## 🛠️ Tech Stack

- **Frontend**: [React](https://reactjs.org/) (Vite)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with DaisyUI
- **Backend / Database**: [Firebase](https://firebase.google.com/) (Firestore, Auth)
- **Icons**: [React Icons](https://react-icons.github.io/react-icons/)
- **Notifications**: `react-hot-toast`

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/blog-system.git
   cd blog-system
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Firebase**
   - Create a project in [Firebase Console](https://console.firebase.google.com/).
   - Enable **Authentication** (Email/Password).
   - Enable **Firestore Database**.
   - Create a `src/firebase.js` file (or update the existing one) with your credentials.

4. **Run the development server**
   ```bash
   npm run dev
   ```

## 🔒 Firebase Security Rules

To ensure proper permissions for users (posting, commenting, profiling), make sure your Firestore rules are configured correctly.

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read all profiles/posts, but only edit their own
    match /users/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    // ... complete rules in firestore_rules.txt
  }
}
```

## 📸 Screenshots

*(Add your screenshots here)*

---

Developed with ❤️ using React & Firebase.
