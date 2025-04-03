# Vehicle Tracking System  

## 🚀 Overview  
The **Vehicle Tracking System** allows users to register vehicles and track their real-time locations on a map. It provides authentication, location updates, distance calculation, and data visualization using charts.  

## ✨ Features  
- **User Authentication:** JWT-based login, register, and protected routes.  
- **Vehicle Management:** Register, update, delete vehicles.  
- **Real-time Location Tracking:** Google Maps API for live location tracking.  
- **Distance Calculation:** Calculate the distance and estimated travel time between two vehicles.  
- **Efficient Pagination:** Cursor-based pagination for handling large datasets.  
- **Data Visualization:** Charts to analyze vehicle movements and distances.  
- **Scalable Backend:** Express.js REST API with MongoDB.  

## 🏠 Tech Stack  
### Frontend  
- **Next.js** (React Framework)  
- **Google Maps API** (for vehicle tracking)  
- **Chart.js** (for data visualization)  

### Backend  
- **Node.js & Express.js** (API development)  
- **MongoDB**
- **JWT Authentication** (Secure user access)  
- **Google Maps API** (for distance calculations)  

## 🌜 Installation & Setup  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/your-repo/vehicle-tracker.git
cd vehicle-tracker
```

### 2️⃣ Backend Setup  
```bash
cd backend
npm install
```
#### Set up environment variables (`.env` file)  
```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_MAPS_API_KEY=your_google_maps_api_key
```
#### Start the Backend  
```bash
npm start
```

### 3️⃣ Frontend Setup  
```bash
cd ../frontend
npm install
```
#### Set up environment variables (`.env.local` file)  
```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```
#### Start the Frontend  
```bash
npm run dev
```

## 🛠️ API Endpoints  

### Authentication (`/api/auth`)
| Method | Endpoint    | Description |
|--------|------------|-------------|
| POST   | `/register` | User Registration |
| POST   | `/login`    | User Login |
| GET    | `/profile`  | Get User Profile |

### Vehicles (`/api/vehicles`)
| Method | Endpoint     | Description |
|--------|-------------|-------------|
| POST   | `/register` | Register a new vehicle |
| GET    | `/`         | Get list of vehicles |
| PUT    | `/:id`      | Update vehicle details |
| DELETE | `/:id`      | Delete a vehicle |

### Location Tracking (`/api/locations`)
| Method | Endpoint     | Description |
|--------|-------------|-------------|
| POST   | `/update`   | Add a new location update |
| GET    | `/:vehicleId` | Get vehicle location history |

## 📊 Data Visualization  
- **Total Distance Per Vehicle (Bar Chart)**  
- **Top 10 Vehicles by Distance (Leaderboard)**  


## 📌 Additional Features  
✅ **Lazy Loading with Infinite Scrolling** for vehicle list pagination.  
✅ **Google Maps API for distance calculation.**  


## 🗂️ Project Structure  
```
/vehicle-tracker
 ├── backend
 │   ├── models
 │   ├── routes
 │   ├── controllers
 │   ├── middleware
 │   ├── config
 │   └── server.js
 ├── frontend
 │   ├── components
 │   ├── pages
 │   ├── styles
 │   ├── context
 │   ├── hooks
 │   └── app.js
```

## 🎯 Future Improvements  
🔹 Implement WebSocket for real-time updates.  
🔹 Improve UI/UX with Tailwind CSS.  
🔹 Implement AI-based route prediction.  

## 🐜 License  
This project is **open-source** and free to use.  

---
