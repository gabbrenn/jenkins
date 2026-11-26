# Jenkins Node.js Web Application

A lightweight Node.js web application configured for DevOps automation, continuous integration (CI), and continuous deployment (CD) using **Jenkins**.

---

## 📌 Project Overview

- **Name:** `jenkins-node-app`
- **Platform:** Node.js (v18+)
- **Author:** Gabiro Vladimir Brenn
- **Repository:** [https://github.com/gabbrenn/jenkins](https://github.com/gabbrenn/jenkins)

This project includes built-in endpoints and automated unit/integration tests designed to run seamlessly in a Jenkins declarative pipeline.

---

## 🚀 Features & Endpoints

| Route | Method | Description |
| :--- | :--- | :--- |
| `/` | `GET` | Home page with application status |
| `/health` | `GET` | JSON health check (`{"status": "UP"}`) for uptime monitoring |
| `/about` | `GET` | Application metadata and information |

---

## 🛠️ Local Development & Quick Start

### 1. Prerequisites
- **Node.js** (v16.0.0 or later)
- **Git**

### 2. Run Locally
```bash
# Start the web server
npm start
```
The application will start at: `http://localhost:3000/`

### 3. Run Automated Tests
```bash
# Execute tests (used by Jenkins CI pipeline)
npm test
```

---

## ⚙️ Jenkins CI/CD Pipeline

The project includes automated testing suitable for a declarative `Jenkinsfile`.

### Sample Jenkins Pipeline (`Jenkinsfile`):
```groovy
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/gabbrenn/jenkins.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install' // Use 'sh' on Linux
            }
        }

        stage('Run Tests') {
            steps {
                bat 'npm test' // Use 'sh' on Linux
            }
        }

        stage('Build / Package') {
            steps {
                echo 'Build completed successfully.'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully!'
        }
        failure {
            echo 'Pipeline failed. Check test logs.'
        }
    }
}
```

---

## 📂 Project Structure

```text
jenkins/
├── .gitignore          # Files ignored by Git (node_modules, logs)
├── index.js            # Main application server & route handlers
├── package.json        # Project metadata, scripts, and dependencies
├── test.js             # Automated unit & integration test suite
├── Jenkinsfile         # Sample declarative Jenkins CI/CD pipeline
└── README.md           # Project documentation
```
