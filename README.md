# 🚀 NexusJS

![NexusJS Logo](https://github.com/Nathius262/nexusjs/blob/main/logo.png)  
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)

A lightweight **Express.js framework** with **Sequelize**, **automatic module generation**, **authentication**, and a **CLI** for easy development.

---

## ✨ Features

- ⚡ **Express.js + Sequelize** integration  
- ⚙️ **Automatic module generation** via CLI  
- 🔑 **Built-in authentication** (JWT)  
- 📦 **Lightweight & modular** structure  

---

## 📥 Installation

Install using NPM:

```bash
npm i @nathius262/nexusjs
```

---

## 🚀 CLI Commands

### 🏗️ Project Scaffolding

| Command                               | Description             |
|---------------------------------------|-------------------------|
| `npx nexus create-project <name>`     | Creates new project     |
| `npx nexus init <name>`               | Alias for create-project|

### 🧩 Module Generation

| Command                                                   | Description                 |
|-----------------------------------------------------------|-----------------------------|
| `npx nexus make-module <name> [flags]`                    | Generate complete module    |
| `npx nexus make-controller <name> [--admin --api]`        | Generate controller         |
| `npx nexus make-service <name> [--admin --api]`           | Generate service            |
| `npx nexus make-router <name> [--admin --api]`            | Generate router             |
| `npx nexus make-model <name>`                             | Generate model + migration  |

### 🛠️ Generation Flags

| Flag       | Description                        |
|------------|------------------------------------|
| `-m`       | Generate model and migration       |
| `-c`       | Generate controller                |
| `-r`       | Generate router                    |
| `-s`       | Generate service                   |
| `--admin`  | Generate admin version             |
| `--api`    | Generate API version               |

---

## 📌 Usage Examples

### Create a new project

```bash
npx nexus create-project ecommerce-app
```

### Generate a complete `product` module with all components (admin + API)

```bash
npx nexus make-module product -mcrs --api --admin
```

### Generate only API components of `user` module

```bash
npx nexus make-module user -crs --api
```

### Generate only an admin controller for `payment`

```bash
npx nexus make-controller payment --admin
```

---

## 🔧 Create a Full Module

```bash
nexus make-module <moduleName> -mcrs
```

### 🛠️ Options

| Flag      | Description                    |
|-----------|--------------------------------|
| `-m`      | Generate model and migration   |
| `-c`      | Generate controller            |
| `-r`      | Generate router                |
| `-s`      | Generate service               |
| `--admin` | Generate admin version (CRS)   |
| `--api`   | Generate api version (CR)      |

---

## 📁 Output Structure

```
src/
├── config/
├── middlewares/
├── core/
├── controllers/
├── models/
├── views/
├── modules/
│   └── product/
│       ├── controllers/
│       │   ├── api/
│       │   │   └── product.controller.js
│       │   │   └── admin.product.controller.js
│       │   └── product.controller.js
│       │   └── admin.product.controller.js
│       ├── routes/
│       │   ├── api/
│       │   │   └── product.routes.js
│       │   └── admin.product.routes.js
│       │   └── product.routes.js
│       ├── services/
│       │   ├── product.service.js
│       │   └── admin.product.service.js
│       └── migrations/
│       │
│       └── models/
│           └── product.model.js
├── utils/
└── index.js
```

---

## 🛠️ Contributing

We welcome contributions! Follow these steps to get started:

### 1️⃣ Fork the repository

Click the **"Fork"** button at the top-right of this repo.

### 2️⃣ Clone your fork

```bash
git clone https://github.com/Nathius262/nexusjs.git
cd nexusjs
```

### 3️⃣ Create a new branch

```bash
git checkout -b feature/your-feature
```

### 4️⃣ Make changes & commit

```bash
git add .
git commit -m "Added feature XYZ"
```

### 5️⃣ Push changes & create a Pull Request

```bash
git push origin feature/your-feature
```

Then go to **GitHub** and submit a **Pull Request (PR)** 🚀

---

## 📝 License

This project is licensed under the **MIT License**.

```txt
MIT License

© 2025 Nathaniel

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction...
```

---

## ❤️ Support & Feedback

⭐ **Star this project** on GitHub if you find it useful!  
For questions, open an **Issue** or create a **Pull Request**.

---

### 🚀 Let’s Build Together!

Happy coding! 💻✨