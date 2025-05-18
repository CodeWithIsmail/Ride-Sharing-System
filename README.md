# Ride-Sharing System MVP

## Project Overview
The Ride-Sharing System is a platform that connects passengers with drivers for transportation services. Passengers can post ride requests, drivers apply to these requests, and passengers select their preferred driver or directly request a specific driver. The Minimum Viable Product (MVP) focuses on core functionality to enable this driver-bidding and direct-request model with minimal complexity.

## MVP Feature List

### 1. User Account Management
- **Registration**: Passengers and drivers sign up with an email, password, and name.
- **Login/Logout**: Secure authentication for users to access and exit the system.

### 2. Ride Posting and Selection (Passenger Features)
- **Post Ride Request**: Passengers create a ride request by entering pickup and drop-off locations (as text, e.g., “Main Street” or “City Park”) and desired time.
- **View Driver Applications**: Passengers see a list of drivers who apply to their ride request, including driver details (name, phone number).
- **Select Driver**: Passengers choose one driver from the applicants to confirm the ride.
- **Ride Cancellation**: Passengers can cancel a ride before it starts.

### 3. Ride Application and Fulfillment (Driver Features)
- **Browse Ride Requests**: Drivers view available ride requests posted by passengers.
- **Apply to Ride**: Drivers apply to a passenger’s ride request, submitting their details.
- **Ride Completion**: Drivers mark the ride as finished after dropping off the passenger.
- **Ride Cancellation**: Drivers can cancel a confirmed ride before pickup (e.g., due to unforeseen issues).

### 4. Payment Processing
- **Fixed Fare**: A flat rate is used for all rides to simplify pricing.
- **Cash Payment**: Passengers pay drivers in cash at the end of the ride.
- **Receipt**: A basic digital receipt (e.g., via email) is generated with ride details and fare.

### 5. Admin Dashboard
- **User Oversight**: Admins can view and deactivate passenger or driver accounts.
- **Ride Monitoring**: Admins can see a list of posted, ongoing, and completed rides.

## Additional Features (Non-MVP)
The following features are excluded from the MVP to keep it simple but may be considered for future iterations:
- Profile Management: Editing user or driver details.
- Geolocation: Using GPS for location detection.
- Map Integration: Third-party map APIs for location or routing.
- Real-Time Tracking: Tracking driver or passenger location.
- Navigation: In-app directions for drivers.
- Fare Estimation: Calculating ride costs dynamically.
- Notifications: Push or in-app alerts for ride updates.
- Driver Verification: Admin approval of driver documents.
- Emergency Contact: In-app emergency service option.
- Support: In-app help or email-based customer support.
- Reporting: Admin reports on ride volume or user activity.
- Route Optimization: Suggesting shortest routes.

## Assumptions
- The system operates in a small area (e.g., a single town) where drivers know locations without needing maps.
- Locations are entered as text (e.g., “Library Entrance” or “Central Square”).
- Passengers and drivers coordinate pickup details directly (e.g., via phone).
- Users have smartphones with internet access.
- A flat fare simplifies payment processing.

## Conclusion
This MVP provides a simple, functional ride-sharing system based on a driver-bidding and direct-request model. It supports essential features for ride posting, driver selection, and ride completion, with basic admin oversight. Future enhancements can build on this foundation based on user feedback and requirements.