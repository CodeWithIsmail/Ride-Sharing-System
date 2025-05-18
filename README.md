# 🚖 Ride-Sharing System MVP Feature List

## 📌 Project Overview
The ride-sharing system enables passengers to post ride requests, allows drivers to apply for those requests, and lets passengers choose their preferred driver.

## 🚀 MVP Feature List

### 👥 1. User Account Management
- ✅ **Registration**: Passengers and drivers sign up with email, password, and name.
- 🔒 **Login/Logout**: Secure authentication for users to access and exit the system.

### 🚕 2. Ride Posting and Selection (Passenger Features)
- 📌 **Post Ride Request**: Passengers create a ride request by entering pickup and drop-off locations (as text, e.g., “Shahbag” or “Dhanmondi”) with a target time and desired fare.
- 👀 **View Driver Applications**: Passengers see a list of drivers who apply to their ride request, including driver details (name, phone number).
- ✅ **Select Driver**: Passengers choose one driver from the applicants to confirm the ride.
- ❌ **Ride Cancellation**: Passengers can cancel a ride before it starts.

### 🚗 3. Ride Application and Fulfillment (Driver Features)
- 📋 **Browse Ride Requests**: Drivers view available ride requests posted by passengers.
- 📩 **Apply to Ride**: Drivers can apply to a passenger’s ride request, submitting their details.
- 🏁 **Ride Completion**: Drivers mark the ride as finished after dropping off the passenger.
- ❌ **Ride Cancellation**: Drivers can cancel a confirmed ride before pickup (e.g., due to unforeseen issues).

### 💰 4. Payment Processing
- 💸 **Cash Payment**: Passengers pay drivers in cash at the end of the ride.
- 📧 **Receipt**: Generate a basic digital receipt (e.g., via email) with ride details and fare.

### 🛡️ 5. Admin Dashboard
- 👥 **User Oversight**: Admins can view and deactivate passenger or driver accounts.
- 🚦 **Ride Monitoring**: Admins can see a list of posted, ongoing, and completed rides.

## 🚀 Additional Features (Non-MVP)
- ✏️ **Profile Management**: Editing user or driver details.
- 🗺️ **Map Integration**: Third-party map APIs for location or routing.
- 🚦 **Real-Time Tracking**: Tracking driver or passenger location.
- 🧭 **Navigation**: In-app directions for drivers.
- 💰 **Fare Estimation**: Calculating ride costs dynamically.
- 🔔 **Notifications**: Push or in-app alerts for ride updates.
- ✅ **Driver Verification**: Admin approval of driver documents.
- 📩 **Support**: In-app help or email-based customer support.
- 📊 **Reporting**: Admin reports on ride volume or user activity.
- 🛣️ **Route Optimization**: Suggesting shortest routes.

## 🛠️ Tech Stack
- Frontend: Reactjs
- Backend: Node.js+Express
- Database: MongoDB
- Styling: Tailwind CSS
