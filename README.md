# NGO Donation Platform

A complete MERN-stack (SQLite variant) application for an NGO, featuring a public donation system, payment gateway integration (mock), and automatic certificate generation.

## Features

- **Public Donation System**: Secure form to accept donations.
- **Payment Gateway Integration**: Mock implemented for demonstration (Razorpay style flow).
- **Certificate Generation**: Automatically generates a PDF certificate upon successful donation.
- **Admin Dashboard**: View donations, filter donors, and export data to CSV.
- **Responsive Design**: Modern UI with animations, mobile-friendly layout.

## Tech Stack

- **Frontend**: React (Vite), Framer Motion, Vanilla CSS (Variables & Modules).
- **Backend**: Node.js, Express.
- **Database**: SQLite (File-based, zero configuration).
- **PDF Generation**: PDFKit.

## Prerequisites

- Node.js (v14 or higher)
- NPM

## Installation & Setup

1. **Clone/Download the Repository**
   Ensure you are in the project root directory.

2. **Install Dependencies**
   Run the following command in the root directory to install dependencies for both client and server:
   ```bash
   npm install
   cd client && npm install
   cd ../server && npm install
   cd ..
   ```

3. **Environment Setup**
   The application uses default mock keys. For a production setup, create a `.env` file in the `server` directory with:
   ```env
   RAZORPAY_KEY_ID=your_key_id
   RAZORPAY_KEY_SECRET=your_key_secret
   PORT=5000
   ```

4. **Run the Application**
   From the root directory, run:
   ```bash
   npm start
   ```
   This command uses `concurrently` to start both the backend (Port 5000) and frontend (Port 5173).

5. **Access the Application**
   - **Website**: http://localhost:5180
   - **Admin Panel**: http://localhost:5180/admin (Password: `admin123`)

## Project Structure

- `client/`: React Frontend
  - `src/pages/`: Home, Admin, Success, Failure pages.
  - `src/components/`: Reusable UI components (Navbar, Modal, etc.).
  - `src/index.css`: Global styles and strict CSS variables.
- `server/`: Express Backend
  - `index.js`: Main server file with API routes.
  - `donations.db`: SQLite database file (created on first run).
  - `utils/certificate.js`: PDF generation logic.
  - `certificates/`: Directory where generated PDFs are stored.

## API Endpoints

- `POST /api/create-order`: Initiates a donation order.
- `POST /api/payment-success`: Verifies payment and generates certificate.
- `GET /api/certificate/:id`: Downloads the certificate PDF.
- `GET /api/admin/donations`: Fetches all donation records.
- `GET /api/admin/export`: Exports donation data as CSV.
