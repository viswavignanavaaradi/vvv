# Production Credential Management Guide

This document explains how to obtain and configure all necessary credentials for your production deployment on **Render** (Backend) and **Vercel** (Frontend).

## 1. Multi-Platform Setup Summary

| Service | Platform | Scope | Secret Keys Required |
| :--- | :--- | :--- | :--- |
| **Backend** | Render | Server & API | `MONGODB_URI`, `CLOUDINARY_*`, `RAZORPAY_*`, `JWT_SECRET` |
| **Frontend** | Vercel | Client UI | `VITE_API_BASE_URL`, `VITE_GOOGLE_CLIENT_ID`, `VITE_RAZORPAY_KEY_ID` |

---

## 2. Where to get your Credentials

### 🟢 MongoDB Atlas (Database)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Click **Connect** on your Cluster.
3. Select **Drivers** (Node.js).
4. Copy the connection string.
5. **How to change**: Replace `<password>` with your database user password.
6. **Set in**: Render environment variables as `MONGODB_URI`.

### 🟢 Cloudinary (Images)
1. Log into [Cloudinary](https://cloudinary.com/console).
2. Copy **Cloud Name**, **API Key**, and **API Secret** from the Dashboard header.
3. **Set in**: Render environment variables as:
   - `CLOUDINARY_CLOUD_NAME`
   - `CLOUDINARY_API_KEY`
   - `CLOUDINARY_API_SECRET`

### 🟢 Google Cloud (Social Login)
1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Select **APIs & Services** > **Credentials**.
3. Edit your OAuth 2.0 Client ID.
4. **Authorized JavaScript origins**: Add your **Vercel domain** (e.g., `https://your-app.vercel.app`).
5. **Authorized redirect URIs**: Add the same Vercel domain.
6. Copy the **Client ID**.
7. **Set in**: Vercel environment variables as `VITE_GOOGLE_CLIENT_ID`.

### 🟢 Razorpay (Payments)
1. Log into [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Go to **Settings** > **API Keys**.
3. Generate **Live Key**.
4. **Set in**:
   - **Render**: `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET`.
   - **Vercel**: `VITE_RAZORPAY_KEY_ID` (Only the ID, never the secret!).

---

## 3. How to Apply to Render (Backend)

1. Open your **Dashboard** on [Render](https://dashboard.render.com/).
2. Select your **Web Service**.
3. Click **Environment** in the sidebar.
4. Click **Add Environment Variable** for each key listed in `.env.example`.
5. Click **Save Changes**. This will trigger a re-deploy automatically.

## 4. How to Apply to Vercel (Frontend)

1. Open your **Dashboard** on [Vercel](https://vercel.com/dashboard).
2. Select your project.
3. Go to **Settings** > **Environment Variables**.
4. Add the following:
   - `VITE_API_BASE_URL`: The URL of your Render service (e.g., `https://vvv-backend.onrender.com`).
   - `VITE_GOOGLE_CLIENT_ID`: Your production Client ID.
   - `VITE_RAZORPAY_KEY_ID`: Your production Razorpay Key ID.
5. **Important**: You must trigger a new deployment for these to take effect.

---

## 5. Local to Production Check

> [!CAUTION]
> NEVER push your actual `.env` file to GitHub. It is already in `.gitignore`, but double-check that you only edit the Dashboard settings on Vercel/Render, not the files themselves in the repo.

### Verification Command
Once deployed, you can check if your frontend is talking to the correct backend by checking the Network tab in your browser inspector. All requests should go to your `onrender.com` URL.
