pipeline {
    agent any 
    stages { 
        stage('Build') { 
            steps { 
                echo "===> [STAGE 1: BUILD] Compiling and packaging Node.js app..." 
                bat 'node build.js'
            } 
        } 
        stage('Test') { 
            steps { 
                echo "===> [STAGE 2: TEST] Executing automated test suite..." 
                bat 'node test.js'
            } 
        } 
        stage('Deploy') { 
            steps { 
                echo "===> [STAGE 3: DEPLOY] Deploying application to target environment..." 
                bat 'node deploy.js'
            } 
        } 
    }
    post {
        always {
            echo "Pipeline finished execution."
        }
        success {
            echo "=== CI/CD SUCCESS: Build, Test, and Deploy Stages Completed! ==="
        }
        failure {
            echo "=== CI/CD FAILED: Check the stage output for details. ==="
        }
    }
}
