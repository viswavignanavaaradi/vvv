# Razorpay Webhook Setup Guide

The **Webhook Secret** is a password that *you* create. It ensures that the messages sent to your backend are actually from Razorpay.

## Step 1: Push your code to Render first
It is **highly recommended** to push your code to Render and ensure the service is "Live" before adding the webhook to Razorpay. Razorpay often verifies that the URL is active before saving.

## Step 2: Go to Razorpay Dashboard
1. Log into your [Razorpay Dashboard](https://dashboard.razorpay.com/).
2. Navigate to **Account & Settings** > **Webhooks** (under the "Product Settings" section).

## Step 2: Add New Webhook
1. Click the **+ Add New Webhook** button.
2. **Webhook URL**: Enter your production backend URL followed by `/api/razorpay-webhook`.
   - *Example: `https://vvv-backend.onrender.com/api/razorpay-webhook`*
3. **Secret**: Create a strong, random password here (e.g., `MyUltraSecureSecret123!`). 
   - **IMPORTANT**: Copy this secret now! You will need it for your `.env` file.
4. **Active Events**: Select the following events to support subscriptions and donations:
   - `subscription.charged`
   - `subscription.cancelled`
   - `payment.failed`
5. Click **Create Webhook**.

## Step 3: Update your Server configuration
Open your `server/.env` file and paste the **Secret** you just created:

```env
RAZORPAY_WEBHOOK_SECRET=the_secret_you_typed_in_razorpay
```

## Step 4: Verify
1. Once deployed, Razorpay will send a notification to this URL whenever a payment happens.
2. You can check the "Webhook Logs" in your Razorpay dashboard to see if they are being delivered successfully (Status 200).

---

## Final Checklist Before Deployment
- [ ] MongoDB URI Updated?
- [ ] Cloudinary Credentials Updated?
- [ ] Razorpay Key ID & Secret Updated?
- [ ] **Razorpay Webhook Secret** Matches?
