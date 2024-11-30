### **Getting Started**

Follow these steps to set up and use the VaultGuard password manager:

### **1. Clone the Repository**

Begin by cloning the project repository from GitHub:

```bash
git clone https://github.com/bakmyradov/pass-vault
```

Navigate into the cloned project directory:

```bash
cd pass-vault
```

### **2. Install Dependencies**

### Backend:

Install the backend dependencies by running the following command in the root directory:

```bash
npm install
```

### Frontend:

Navigate to the frontend folder and install the dependencies:

```bash
cd frontend
npm install
```

### **3. Set Up Environment Variables**

Return to the root folder:

```bash
cd ..
```

Create a `.env` file in the root directory and configure it with the required environment variables:

```
NODE_ENV=
MONGO_URI=
PORT=
JWT_SECRET=
SERVER_PASSWORD=
```

- `NODE_ENV`: Set to `development` or `production` based on your environment.
- `MONGO_URI`: Provide the MongoDB connection URI for the database.
- `PORT`: Define the port for the backend server.
- `JWT_SECRET`: A secure string for JWT token encryption.
- `SERVER_PASSWORD`: A strong password used for encrypting the master password.

### **4. Run the Application**

Use the following command to start both the server and the frontend concurrently:

```bash
npm run dev
```

This will:

- Start the backend server (default: `http://localhost:5000`).
- Serve the frontend application (default: `http://localhost:3000`).

### **5. Access the Application**

- Open a web browser and navigate to `http://localhost:3000` to interact with the VaultGuard application.
