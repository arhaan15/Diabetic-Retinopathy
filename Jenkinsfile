pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'virajchoudhary/dr-app:latest'
        AZURE_RG = 'dr-detection-rg'
        AZURE_LOCATION = 'centralindia'
        ACI_NAME = 'dr-app-container'
        DNS_LABEL = 'dr-app-viraj-c'
    }

    stages {
        stage('Clone Repo') {
            steps {
                git branch: 'main', url: 'https://github.com/virajchoudhary/diabetic-retinopathy-detector.git'
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
                bat "docker build -t %DOCKER_IMAGE% ."
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
                    bat "docker push %DOCKER_IMAGE%"
                }
            }
        }

        stage('Login to Azure') {
            steps {
                withCredentials([
                    string(credentialsId: 'azure-client-id', variable: 'AZURE_CLIENT_ID'),
                    string(credentialsId: 'azure-client-secret', variable: 'AZURE_CLIENT_SECRET'),
                    string(credentialsId: 'azure-tenant-id', variable: 'AZURE_TENANT_ID'),
                    string(credentialsId: 'azure-subscription-id', variable: 'AZURE_SUB_ID')
                ]) {
                    bat 'az login --service-principal -u %AZURE_CLIENT_ID% -p %AZURE_CLIENT_SECRET% --tenant %AZURE_TENANT_ID%'
                    bat 'az account set --subscription %AZURE_SUB_ID%'
                }
            }
        }

        stage('Deploy to Azure') {
            steps {
                bat "az group create --name %AZURE_RG% --location %AZURE_LOCATION%"
                bat "az container delete --resource-group %AZURE_RG% --name %ACI_NAME% --yes || ver > nul"
                bat "az container create --resource-group %AZURE_RG% --name %ACI_NAME% --image %DOCKER_IMAGE% --ports 80 --dns-name-label %DNS_LABEL% --cpu 2 --memory 4 --restart-policy Always --environment-variables PYTHONUNBUFFERED=1 --os-type Linux"
            }
        }

        stage('Verify Deployment') {
            steps {
                bat "curl -s http://%DNS_LABEL%.%AZURE_LOCATION%.azurecontainer.io/health || echo Container is starting up..."
            }
        }
    }

    post {
        success {
            echo '============================================'
            echo '  DEPLOYMENT SUCCESSFUL!'
            echo '============================================'
            echo "  API URL: http://%DNS_LABEL%.%AZURE_LOCATION%.azurecontainer.io"
            echo '============================================'
        }
        failure {
            echo 'Pipeline failed. Check logs above.'
        }
    }
}