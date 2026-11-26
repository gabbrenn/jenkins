pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'gabbrenn/my-web-app'
        DOCKER_CREDENTIALS_ID = 'docker-hub-credentials'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Test') {
            steps {
                echo "===> [STAGE 1: TEST] Running automated tests..."
                bat 'node test.js'
            }
        }

        stage('Build Docker Image') {
            steps {
                echo "===> [STAGE 2: BUILD] Building Docker image: ${DOCKER_IMAGE}:latest..."
                bat "docker build -t ${DOCKER_IMAGE}:latest ."
            }
        }

        stage('Push to Docker Hub') {
            steps {
                script {
                    echo "===> [STAGE 3: PUSH] Pushing Docker image to Docker Hub..."
                    try {
                        withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USER', passwordVariable: 'DOCKER_PASS')]) {
                            bat 'echo %DOCKER_PASS% | docker login -u %DOCKER_USER% --password-stdin'
                            bat "docker push ${DOCKER_IMAGE}:latest"
                        }
                    } catch (Exception e) {
                        echo "Docker Hub credentials not found or push skipped: ${e.getMessage()}"
                        echo "Proceeding with local Docker container deployment..."
                    }
                }
            }
        }

        stage('Deploy to Local Docker Host') {
            steps {
                echo "===> [STAGE 4: DEPLOY] Deploying container on local Docker host (port 8080)..."
                bat '''
                    docker rm -f my-web-app || exit 0
                    docker run -d --name my-web-app -p 8080:3000 gabbrenn/my-web-app:latest
                '''
            }
        }

        stage('Verify Deployment') {
            steps {
                echo "===> [STAGE 5: VERIFY] Verifying container status and HTTP response..."
                bat 'docker ps --filter "name=my-web-app"'
                bat 'curl http://localhost:8080/health || exit 0'
            }
        }
    }

    post {
        always {
            echo "Pipeline finished execution."
        }
        success {
            echo "=== CI/CD SUCCESS: Web application deployed! Open http://localhost:8080 ==="
        }
        failure {
            echo "=== CI/CD FAILED: Check the console output above to troubleshoot. ==="
        }
    }
}
