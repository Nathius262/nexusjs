# 🚀 NexusJS  

![NexusJS Logo](https://github.com/Nathius262/nexusjs/blob/main/logo.png) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white) 

A lightweight **Express.js framework** with **Sequelize**, **automatic module generation**, **authentication**, and a **CLI** for easy development.  

## ✨ Features  
- ⚡ **Express.js + Sequelize** integration  
- ⚙️ **Automatic module generation** via CLI  
- 🔑 **Built-in authentication** (JWT)  
- 📦 **Lightweight & modular** structure  

---

## 📥 Installation  
Install globally using NPM:  
```sh
npm install -g nexusjs
```

---

## 🚀 CLI Usage

NexusJS comes with an intuitive CLI to scaffold modules and boilerplate code.

### 🔧 Create a Full Module

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



## 📌 Examples
### Generate a full module:
```bash
nexus make-module product -mcrs
```

### Generate only admin controller, router, and service:
```bash
nexus make-module product -crs --admin
```

### Generate just a controller:
```bash
nexus make-controller product
```

### Generate a controller with admin flag:
```bash
nexus make-controller product --admin
```

## 📁 Output Structure

```mathematica
src/
└── modules/
    └── product/
        ├── controllers/
        │   ├── Product.controller.js
        │   └── admin.Product.controller.js
        ├── routes/
        │   ├── Product.routes.js
        │   └── admin.Product.routes.js
        ├── services/
        │   ├── Product.service.js
        │   └── admin.Product.service.js
        └── models/
            └── product.model.js
```

---

## 🛠️ Contributing  
We welcome contributions! Follow these steps to get started:  

### **1️⃣ Fork the repository**  
Click the **"Fork"** button at the top-right of this repo.  

### **2️⃣ Clone your fork**  
```sh
git clone https://github.com/Nathius262/nexusjs.git
cd nexusjs
```

### **3️⃣ Create a new branch**  
```sh
git checkout -b feature/your-feature
```

### **4️⃣ Make changes & commit**  
```sh
git add .
git commit -m "Added feature XYZ"
```

### **5️⃣ Push changes & create a Pull Request**  
```sh
git push origin feature/your-feature
```
Then go to **GitHub** and submit a **Pull Request (PR)**. 🚀  

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
Give this project a ⭐ **Star** on GitHub if you find it useful!  
For any questions, open an **Issue** or create a **Pull Request**.  

---

### **🚀 Let’s Build Together!**  
Happy coding! 💻✨  

