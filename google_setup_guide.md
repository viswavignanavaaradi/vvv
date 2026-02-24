# Google OAuth Production Setup Guide

To ensure Google Login works on your live website, you must update your "Authorized Domains" in the Google Cloud Console.

## Step 1: Go to Google Cloud Console
1. Log into the [Google Cloud Console](https://console.cloud.google.com/).
2. Select your project from the top dropdown.

## Step 2: Update Credentials
1. Navigate to **APIs & Services** > **Credentials** in the left sidebar.
2. Under "OAuth 2.0 Client IDs", find your client and click the **pencil icon (Edit)**.

## Step 3: Add Production Domains
Scroll down to the **Authorized JavaScript origins** and **Authorized redirect URIs** sections and add these exact values:

### 1. Authorized JavaScript origins
Add these three (one for local testing, one for production, and your specific Vercel deployment):
- `http://localhost:5173`
- `https://vvv.vercel.app`
- `https://vvv-six-tawny.vercel.app` (This is your current active URL)

### 2. Authorized redirect URIs
Add the same two:
- `http://localhost:5173`
- `https://vvv.vercel.app` (Replace with your actual Vercel URL)

> [!TIP]
> You can find your **actual** Vercel URL in your Vercel Dashboard under the "Domains" section of your project. It usually ends in `.vercel.app`.

## Step 4: Extract and Update Client ID
1. On the same page, you will see your **Client ID** on the right side.
2. Copy this ID.
3. Open your `client/.env` file and replace the old ID:

```env
VITE_GOOGLE_CLIENT_ID=your_new_google_client_id_from_console.apps.googleusercontent.com
```

## Step 5: Verify
1. Once you push your changes to Vercel, try logging in with Google.
2. If you see an "Error 400: redirect_uri_mismatch", it means the URL in the Google Console doesn't *exactly* match your website URL (check for `https` vs `http` or a missing trailing slash).

---

## Final Credential Checklist
- [x] MongoDB URI Updated? ✅
- [x] Cloudinary Credentials Updated? ✅
- [x] Razorpay Webhook Secret Matches? ✅
- [x] **Google Client ID** Updated? ✅
