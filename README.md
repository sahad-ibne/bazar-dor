# 🛒 BazarDor (বাজার দর)

A modern, fast, and user-friendly web application built to track daily market prices of essential groceries (rice, lentils, oil, vegetables, fish, meat, eggs, and spices) across various markets in Bangladesh.

---

## 📖 About the Project

**BazarDor** helps everyday shoppers stay informed about current market rates. By providing market-by-market comparisons, average price summaries, and daily price trends, the app helps users make smarter purchasing decisions.

---

## 🛠 Tech Stack

- **Framework:** Next.js (App Router) & React
- **Styling & UI:** Tailwind CSS & HeroUI
- **Authentication:** Better Auth (Email/Password, Google & GitHub OAuth)
- **Feedback & Toasts:** `react-hot-toast`
- **Icons:** React Icons

---

## ✨ Key Features

1. **Detailed Market Price Comparison**  
   View daily minimum, maximum, and average prices for essential grocery items categorized by different local markets.

2. **Smart Authentication & Protected Routes**  
   Seamless sign-in and sign-up with email or social logins (Google & GitHub), featuring dynamic `callbackUrl` redirection after logging in.

3. **Smooth Loading Skeletons**  
   Custom loading skeletons for the Home page, Product Detail page, and Auth screens to deliver a polished user experience with Next.js Suspense.

4. **Localized Bengali Formatting**  
   Automatic conversion of numbers, units, and price changes into Bengali numerals and localized formats.

5. **Instant Toast Notifications**  
   Real-time feedback for authentication actions (Sign In, Sign Up, Sign Out) and alerts when unauthenticated users try to access protected product pages.