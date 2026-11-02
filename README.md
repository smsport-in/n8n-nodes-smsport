# n8n-nodes-smsport

Official community node for **[SMSPort](https://smsport.in)** — Enterprise WhatsApp Cloud API platform for broadcasting, automated messaging, CRM notifications, and two-way customer communication.

![n8n Community Node](https://img.shields.io/badge/n8n-community--node-orange)
![License](https://img.shields.io/badge/license-MIT-blue)

---

## ⚡ Features

* **Send WhatsApp Messages**:
  * Plain text messages
  * Images (with captions)
  * Documents / PDFs (with custom file names and captions)
  * Interactive Quick Reply Buttons (up to 3 clickable buttons)
* **Send Approved Templates**:
  * Real-time sync with Meta WhatsApp Cloud API pre-approved templates
  * Dynamic body variables (`{{1}}`, `{{2}}`, etc.)
  * Header media URLs and dynamic CTA button URLs
* **Contact Management**:
  * Create or update contacts with phone numbers, display names, email, and tags
  * Get contact details by phone number
  * Search contacts by name or query
* **Real-time Webhook Triggers**:
  * New incoming WhatsApp messages from customers
  * Message status updates (`sent`, `delivered`, `read`, `failed`)
  * New contacts created in SMSPort

---

## 📦 Installation

### In n8n UI (Recommended)
1. In your n8n workspace, navigate to **Settings** ➔ **Community Nodes**.
2. Click **Install a community node**.
3. In the **npm package name** field, enter:
   ```text
   n8n-nodes-smsport
   ```
4. Agree to the risks of installing third-party nodes and click **Install**.

### In Self-Hosted / Docker Installations
Run inside your n8n installation directory:
```bash
npm install n8n-nodes-smsport
```

---

## 🔑 Authentication

1. In SMSPort, go to **Setup** ➔ **API Keys & Developer Settings** (`https://smsport.in/setup/api-integration`).
2. Generate an API Key (starts with `sk_live_...`).
3. In n8n, create a new credential for **SMSPort API** and paste your API Key.
4. Click **Test Connection** — n8n will verify connectivity to `https://api.smsport.in/api/v1/ping`.

---

## 🛠️ Operations

### 1. Message
* **Send**: Deliver text, image, document, or interactive button messages to any WhatsApp phone number.

### 2. Template
* **Send**: Send pre-approved Meta WhatsApp templates with positional body parameters and header media.

### 3. Contact
* **Create or Update**: Add or update customer phone numbers, names, tags, and marketing opt-out preferences.
* **Get by Phone**: Retrieve customer profile by international E.164 phone number.
* **Search**: Find contacts matching a phone or name substring.

### 4. Trigger
* **SMSPort Trigger**: Listen for live events (`message.inbound`, `message.status`, `contact.created`) via webhook streaming.

---

## 📄 License
[MIT](LICENSE) © [SMSPort](https://smsport.in)
