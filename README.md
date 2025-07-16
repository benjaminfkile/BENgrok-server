# BENgrok Tunnel Server

This is the server-side component of the BENgrok tunneling system. It enables remote access to locally hosted services through a public URL via WebSockets. It acts as a reverse proxy that forwards HTTP requests from the internet to connected tunnel clients.

---

## 📦 Prerequisites

Before running the server, make sure you have:

* [Node.js](https://nodejs.org/) (version 16 or higher recommended)
* npm (comes with Node.js)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone git@github.com:benjaminfkile/BENgrok-server.git
cd BENgrok-server
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file (if needed) and specify any desired port:

```env
PORT=8000
```

If omitted, the server defaults to port `8000`.

### 4. Run the Server

```bash
npm start
```

The server will start and listen for HTTP and WebSocket connections:

```text
⚡️[server]: BENgrok Tunnel Server running on http://localhost:8000
```

---

## 🔧 API Endpoints

### `GET /`

Basic health check. Returns:

```text
BENgrok Tunnel Server is running...
```

### `ALL /tunnel/:id/*`

Used by tunnel clients to proxy all requests for the given tunnel ID.

---

## 📡 WebSocket Usage

Tunnel clients connect to:

```txt
ws://<server-host>:<port>?id=<tunnelId>
```

Each connected tunnel is tracked by ID and can be used to forward traffic to a specific port on the client machine.

---

## 🧠 Features

* Express server with Helmet, CORS, and logging middleware
* WebSocket tunnel registration
* Bi-directional request forwarding
* Graceful error handling

---

## 📄 License

This project is licensed under the MIT License.
