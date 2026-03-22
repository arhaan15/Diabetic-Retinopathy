pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "virajchoudhary/dr-app"
        DOCKER_TAG   = "latest"
    }

    stages {
        stage('Clone Repo') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/arhaan15/Diabetic-Retinopathy.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'pip install --no-cache-dir -r requirements.txt'
            }
        }

        stage('Run Tests') {
            steps {
                bat 'python -m pytest tests/ -v'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t %DOCKER_IMAGE%:%DOCKER_TAG% .'
            }
        }

        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    bat 'docker login -u %DOCKER_USER% -p %DOCKER_PASS%'
                    bat 'docker push %DOCKER_IMAGE%:%DOCKER_TAG%'
                }
            }
        }

        stage('Deploy to Azure VM') {
            steps {
                sshagent(['azure-vm-key']) {
                    bat '''
                    ssh -o StrictHostKeyChecking=no azureuser@20.197.42.126 "docker pull virajchoudhary/dr-app:latest && docker stop dr-app || true && docker rm dr-app || true && docker run -d -p 8000:8000 --restart unless-stopped --name dr-app virajchoudhary/dr-app:latest"
                    '''
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed. Container running on port 8000.'
        }
        failure {
            echo 'Pipeline failed. Check logs above.'
        }
    }
}