# MongoDB Production Setup Guide

Based on the screenshot you provided, here is the exact step-by-step process to configure your database.

## Step 1: Extract the Connection String
From your image, your unique connection string is:
`mongodb+srv://viswavignanavaaradi_db_user:lvncmYPYwZdFv3Aw@cluster0.e7my8yd.mongodb.net/?appName=Cluster0`

## Step 2: Update your Server configuration
Open your `server/.env` file and replace the old `MONGODB_URI` with this one. 

**Recommended Format (Adding a database name):**
To keep your data organized, add a name for the database (like `vvv_ngo`) right before the question mark.

```env
MONGODB_URI=mongodb+srv://viswavignanavaaradi_db_user:lvncmYPYwZdFv3Aw@cluster0.e7my8yd.mongodb.net/vvv_ngo?appName=Cluster0
```

## Step 3: Network Access (Crucial)
1. In your MongoDB Atlas Dashboard, go to **Network Access** (under the "Security" section in the left sidebar).
2. Click **Add IP Address**.
3. Select **Allow Access From Anywhere** (IP `0.0.0.0/0`) and click **Confirm**.
   - *Note: This is required for Render/Vercel to connect to your database.*

## Step 4: Verify the Connection
1. Restart your local server if it's running.
2. If you see `Connected to MongoDB` in the terminal, it's successful!

---

## What to do next?
After MongoDB is set up, we should repeat this for your other credentials:
1. **Cloudinary**: Get your Cloud Name, API Key, and Secret from your Cloudinary dashboard.
2. **Google**: Update your OAuth JavaScript origins in Google Cloud to include your Vercel URL.
3. **Razorpay**: Get your Live Key and Secret.
