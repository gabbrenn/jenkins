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
                bat 'npm install'
            }
        }

        stage('Run Automated Tests') {
            steps {
                bat 'npm test'
            }
        }

        stage('Build & Package') {
            steps {
                echo 'Build and verification completed successfully.'
            }
        }
    }

    post {
        always {
            echo 'Pipeline execution finished.'
        }
        success {
            echo 'Jenkins Build and Test Passed!'
        }
        failure {
            echo 'Pipeline Failed. Check logs.'
        }
    }
}
