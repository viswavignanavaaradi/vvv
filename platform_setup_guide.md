# Platform Deployment Guide: Render & Vercel

Follow these steps to link your GitHub repo and go live.

---

## 1. Render Setup (Backend/Server)

1. **Login**: Go to [Render Dashboard](https://dashboard.render.com/).
2. **New Service**: Click **New +** > **Web Service**.
3. **Connect Repo**: Select your `vvv` repository.
4. **Configuration**:
   - **Name**: `vvv-backend`
   - **Root Directory**: `server`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node index.js`
5. **Environment Variables**:
   - Click **Advanced** > **Add Environment Variable**.
   - Copy all keys from your `server/.env` file.
   - **Crucial**: Ensure `MONGODB_URI` and `JWT_SECRET` are there.
6. **Deploy**: Click **Create Web Service**. 
7. **Copy URL**: Once it shows "Live", copy the URL (e.g., `https://vvv-backend.onrender.com`). **You need this for Vercel.**

---

## 2. Vercel Setup (Frontend/Client)

1. **Login**: Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. **New Project**: Click **Add New** > **Project**.
3. **Import Repo**: Select your `vvv` repository.
4. **Configuration**:
   - **Root Directory**: Click "Edit" and select the `client` folder.
   - **Framework Preset**: Should auto-detect **Vite**.
5. **Environment Variables**:
   - Create these three keys:
     - `VITE_API_BASE_URL`: Paste your Render URL from Step 1 (e.g., `https://vvv-backend.onrender.com`).
     - `VITE_GOOGLE_CLIENT_ID`: Your production Google ID.
     - `VITE_RAZORPAY_KEY_ID`: Your production Razorpay ID.
6. **Deploy**: Click **Deploy**.

---

## 3. Final Verification (Smoke Test)

1. **Link in Bio**: Go to your Vercel URL.
2. **Google Login**: Try logging in.
   - *If it fails: Make sure you added your Vercel URL to the "Authorized JavaScript Origins" in Google Console.*
3. **Payments**: Open the Donate Modal.
   - *If it fails: Check that your `RAZORPAY_KEY_ID` is correct in both Render and Vercel.*
4. **Webhooks**: Go back to Razorpay and add your Render Webhook URL as we discussed.

---

### Need help with a specific box?
If you get stuck on any screen, send me a screenshot and I'll tell you exactly what to type! 🚀
