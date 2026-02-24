# Cloudinary Production Setup Guide

Follow these steps to configure your production images and document storage.

## Step 1: Access your Dashboard
1. Log into your [Cloudinary Console](https://cloudinary.com/console).
2. On your main Dashboard, you will see a section called **Product Environment Details**.

## Step 2: Extract your Credentials
You need to copy three specific values:
1. **Cloud Name**
2. **API Key**
3. **API Secret** (Click the "v" or eye icon to reveal it)

## Step 3: Update your Server configuration
Open your `server/.env` file and replace the old values with your new production ones:

```env
CLOUDINARY_CLOUD_NAME=your_new_cloud_name
CLOUDINARY_API_KEY=your_new_api_key
CLOUDINARY_API_SECRET=your_new_api_secret
```

## Step 4: Verify the Connection
1. Restart your local server.
2. Try to upload a profile photo or submit a legal request with a document.
3. If the file appears in your Cloudinary **Media Library**, the setup is successful!

---

## What to do next?
1. **Google Credentials**: Have you updated your Google Client ID for the production domain?
2. **Razorpay**: Are you ready to switch to Razorpay Live mode keys?
3. **Deployment**: Once all credentials are set, we can proceed to push the code to your GitHub repo and configure Render/Vercel.
