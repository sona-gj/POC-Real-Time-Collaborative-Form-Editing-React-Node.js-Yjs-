# POC-Real-Time-Collaborative-Form-Editing-React-Node.js-Yjs-
### *React + Node.js + Yjs + WebSockets*

This repository contains a **Proof of Concept** demonstrating how to build **Google-Docs-style real-time collaboration** for **custom forms** (input fields, dropdowns, checkboxes, etc.) using **Yjs CRDTs**, **React**, and a **Node.js WebSocket backend**.

This POC shows that real-time sync is possible **without using a rich text editor** — it works directly on **any custom React form UI**.

---

## ⭐ **1. Overview**

This POC implements:

* **Multi-user real-time form editing**
  (Two or more users can fill out the same form at the same time)
* **Offline editing** (via IndexedDB, auto-sync when online)
* **Conflict-free merging** (CRDT-based, no overwriting)
* **User presence awareness**
  (“John is editing Severity field”)
* **Auto-reconnect with state recovery**
* **Custom fields support**
  Text, textarea, dropdown, radio, dynamic fields, etc.

This provides a foundation for building collaborative healthcare forms, survey panels, audit forms, or multi-user workflows.

---

## ⭐ **2. Technology Stack**

### **Frontend (React)**

* `yjs` — CRDT engine (Conflict-free replicated data type)
* `y-websocket` — Sync provider for real-time updates
* `y-indexeddb` — Offline persistence
* React functional components
* Awareness API for real-time user presence

### **Backend (Node.js)**

* `y-websocket` server (official Yjs server library)
* Node.js `ws` WebSocket server
* Express (optional for REST APIs)

> ⭐ Entirely open source — **no paid tools**, no vendor lock-in.

---

## ⭐ **3. What This POC Proves**

This POC demonstrates that:

* Real-time editing works **even on custom forms**, not only text editors.
* Yjs handles **conflicts, merges, ordering, syncing, and offline edits**.
* You can build collaborative forms similar to:

  * Airtable
  * Notion databases
  * Figma comments
  * Google Forms w/ live presence
* Offline changes sync cleanly without overwriting.

---

## ⭐ **4. Architecture**

### **High-Level Flow**

```
User A (React) ──┐
                 │ y-websocket (CRDT updates)
User B (React) ──┤
                 ▼
       Node.js Y-WebSocket Server
```

### **Frontend Responsibilities**

* Render form UI (React components)
* Maintain a shared Yjs document (`Y.Map` for form fields)
* Send updates through y-websocket
* Sync offline updates from IndexedDB
* Subscribe to awareness → show “who is editing what”

### **Backend Responsibilities**

* Host the y-websocket server (real-time sync)
* Relay CRDT updates to all connected clients
* Track connected clients (optional awareness)
* No merge logic needed by the backend

---

## ⭐ **5. Features Implemented**

### ✔ Real-time updates on:

* Text inputs
* Textareas
* Dropdown selects
* Checkboxes
* Radio buttons
* Dynamic lists/sections

### ✔ Conflict-Free Updates

No overwriting — Yjs merges all updates deterministically.

### ✔ Awareness Indicators

Shows active editors and what they are editing.

### ✔ Offline Editing

All inputs work offline → sync when online automatically.

### ✔ Auto-Reconnect

Network drop?
Reconnection restores sync state with no data loss.

---

## ⭐ **6. Getting Started**

### **1. Clone the Repository**

```bash
git clone https://github.com/your-username/realtime-collaborative-forms-poc.git
cd realtime-collaborative-forms-poc
```

---

## **🟦 Backend Setup**

```bash
cd backend
npm install
npm start
```

This starts the **Yjs WebSocket Server** on:

```
ws://localhost:1234
```

---

## **🟩 Frontend Setup**

```bash
cd frontend
npm install
npm start
```

Runs the React app on:

```
http://localhost:3000
```

---

## ⭐ **7. How To Test Collaboration**

Open **two browser windows**:

* Window 1 → [http://localhost:3000](http://localhost:5173)
* Window 2 → [http://localhost:3000](http://localhost:5173)

Try editing the same form:

* Inputs sync in real-time
* Selections sync
* Awareness updates show who is editing

Turn off your internet (offline mode):

* Form keeps working
* Turn internet back on
* Changes sync automatically

---

## ⭐ **8. Folder Structure**

```
realtime-collaborative-forms-poc/
│
├── backend/
│   └── server.js          # Y-WebSocket server
│
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── yjs-setup.js   # Setup for Yjs, IndexedDB & Websocket provider
    │   └── FormCollaborator.jsx
    └── package.json
```

---

## ⭐ **9. Roadmap / Next Steps**

These can be added on top of the POC:

* Snapshot-based version control
* Milestone versions (“v1.0 before meeting”)
* Field-level activity highlighting
* Role-based access (lead surveyor vs generalist)
* Server-side persistence of snapshots
* Multi-step form collaboration
* Operation logs for audit compliance

---

## ⭐ **10. License**

MIT License — free for commercial, academic, personal use.

---

