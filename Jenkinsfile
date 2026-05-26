pipeline {
    agent any

    environment {
        DOCKERHUB_USERNAME = "gopinathbca35"
        DOCKERHUB_REPO = "mern_stack_with_docker"
        IMAGE_TAG = "latest"
        EC2_IP = "65.1.92.125"
        EC2_USER = "ubuntu"
    }

    stages {

        stage('Clone Code') {
            steps {
                git credentialsId: 'git-cred', url: 'https://github.com/gopinathbca35/mern_stack_with_docker.git'
            }
        }

        stage('Docker Login') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-cred',
                    usernameVariable: 'DOCKER_USER',
                    passwordVariable: 'DOCKER_PASS'
                )]) {
                    sh '''
                    echo $DOCKER_PASS | docker login -u $DOCKER_USER --password-stdin
                    '''
                }
            }
        }

        stage('Build Images') {
            steps {
                sh 'docker compose build'
            }
        }

        stage('Tag Images') {
            steps {
                sh '''
                docker tag $DOCKERHUB_REPO-backend:$IMAGE_TAG $DOCKERHUB_USERNAME/$DOCKERHUB_REPO-backend:$IMAGE_TAG
                docker tag $DOCKERHUB_REPO-frontend:$IMAGE_TAG $DOCKERHUB_USERNAME/$DOCKERHUB_REPO-frontend:$IMAGE_TAG
                '''
            }
        }

        stage('Push Images to DockerHub') {
            steps {
                sh '''
                docker push $DOCKERHUB_USERNAME/$DOCKERHUB_REPO-backend:$IMAGE_TAG
                docker push $DOCKERHUB_USERNAME/$DOCKERHUB_REPO-frontend:$IMAGE_TAG
                '''
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-cred']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${EC2_USER}@${EC2_IP} '

                    cd /home/ubuntu/mern_stack_with_docker

                    echo "Pulling latest images"
                    docker pull $DOCKERHUB_USERNAME/$DOCKERHUB_REPO-backend:$IMAGE_TAG
                    docker pull $DOCKERHUB_USERNAME/$DOCKERHUB_REPO-frontend:$IMAGE_TAG

                    echo "Stopping old containers"
                    docker compose down || true

                    echo "Starting new containers"
                    docker compose up -d
                    '
                    """
                }
            }
        } 
    }

    post {
        always {
            sh 'docker ps'
        }

        success {
            echo "Application Deployed Successfully on EC2"
        }

        failure {
            echo "Pipeline Failed"
        }
    }
}
