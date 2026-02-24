# Professional NGO Website Implementation Plan

## 1. Project Overview
**Goal:** Build a high-trust, emotionally engaging NGO website that accepts public donations via Razorpay and issues instant tax-exemption/donation certificates.
**A esthetics:** Clean, Modern, "Teal & Orange" (Trust & Warmth), Rounded UI, Smooth Animations.

## 2. Technology Stack
*   **Frontend:** React (Vite) + Framer Motion (Animations) + CSS Modules.
*   **Backend:** Node.js + Express.
*   **Database:** **SQLite** (File-based relational database).
    *   *Why?* It acts like a "GitHub-style" database in that it is a single file (`donations.db`) that lives in your project folder, is easy to backup/move, but offers full SQL power for secure transaction handling.
*   **Payment Gateway:** **Razorpay** (Production-ready flow).
    *   Order Creation (Server) -> Checkout (Client) -> Signature Verification (Server).
*   **Certificate:** PDFKit (Server-side dynamic generation).

### Legal Request Tracking
Implemented a way for users to track their legal assistance requests.

### Backend [MODIFY] [index.js](file:///c:/ngo/server/index.js)
- [NEW] Add `/api/legal/status/:requestId` endpoint to fetch status and response by ID.

### Frontend [NEW] [LegalStatus.jsx](file:///c:/ngo/client/src/pages/LegalStatus.jsx)
- Create a status check page where users enter their Request ID.
- Display current status (Submitted, In Review, Resolved, Rejected).
- Show the `adminMessage` if provided.

### Frontend [MODIFY] [App.jsx](file:///c:/ngo/client/src/App.jsx)
- Register the `/legal-status` route.

### Frontend [MODIFY] [LegalAid.jsx](file:///c:/ngo/client/src/pages/LegalAid.jsx)
- Add a prominent "Track your Request" button/link.
ity.

## 3. Database Schema (SQLite)
We will use a robust Relational Schema to ensure financial data integrity.

### Table: `donations`
| Column | Type | Description |
| :--- | :--- | :--- |
| `id` | INTEGER PK | Auto-incrementing ID |
| `order_id` | TEXT | Razorpay Order ID (`order_...`) |
| `payment_id` | TEXT | Razorpay Payment ID (`pay_...`) |
| `amount` | REAL | Donation amount in INR |
| `donor_name` | TEXT | Full name for certificate |
| `email` | TEXT | For receipt delivery |
| `phone` | TEXT | For identification |
| `date` | TEXT | ISO Timestamp |
| `status` | TEXT | `Created`, `Success`, `Failed` |
| `certificate_id` | TEXT | Unique ID (`NGO-2026-X8Y7`) |

## 4. Payment Flow (Razorpay)
1.  **User** fills form (Name, Email, Phone, Amount).
2.  **Client** calls `POST /api/create-order`.
3.  **Server** calls Razorpay API to generate `order_id`.
4.  **Client** opens Razorpay standard checkout popup.
5.  **User** completes payment.
6.  **Client** sends `razorpay_payment_id`, `razorpay_order_id`, and `razorpay_signature` to `POST /api/verify-payment`.
7.  **Server** verifies signature using HMAC-SHA256 (Security Critical).
8.  **Server** saves status as `Success` and generates Certificate.
9.  **Client** redirects to `/success` with Certificate Download link.

## 5. UI/UX Design "Professional Polish"
*   **Typography:** 'Inter' for UI, 'Playfair Display' for Headings (Emotional/Professional pair).
*   **Components:**
    *   *Hero*: Parallax background, clear value proposition.
    *   *Stats*: Animated number counters to show scale.
    *   *Trust Markers*: "Secured by Razorpay" badge, NGO Registration number in footer.
    *   *Certificate*: Clean, printable A4 layout with border and signature.

## 6. Development Phasing
*   **Phase 1 (Done):** Project scaffolding, Basic UI, SQLite Setup.
*   **Phase 2 (Current):** Replace Mock Payment with Real Razorpay Integration.
*   **Phase 3:** Final Polish (Mobile Responsiveness, Loading States).
