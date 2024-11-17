# NextJS Web App Containerization and AWS Deployment Guide

This guide demonstrates how to containerize a NextJS web application and deploy it to AWS ECS.

## Local Development

### Prerequisites
- Docker installed on your local machine
- Node.js and npm (for local development)
- AWS CLI configured with appropriate credentials
- Docker Hub account
- Default VPC exists in your AWS account (most accounts have this)

### Running the Application Locally

#### Option 1: Interactive Mode
1. Navigate to the project root directory
2. Run the following command:
```bash
docker compose up --build
```
3. Open your browser and visit http://localhost:3000
4. Press `Ctrl+C` in the terminal to stop the application

#### Option 2: Detached Mode
1. Start the application in the background:
```bash
docker compose up --build -d
```
2. Open your browser and visit http://localhost:3000
3. Stop the application when finished:
```bash
docker compose down
```

For more information about Docker Compose commands, see the [Compose CLI reference](https://docs.docker.com/compose/reference/).

## Docker Image Creation and Publishing

### Building and Pushing to Docker Hub
1. Create a Docker Hub account and repository
2. Build the Docker image:
```bash
docker build -t webapp:latest .
```
3. Tag the image for Docker Hub:
```bash
# Syntax: docker tag <local-image-name:tag> <dockerhub-username/repo:tag>
docker tag webapp:latest your-username/your-repo:latest
```
4. Push to Docker Hub:
```bash
docker push your-username/your-repo:latest
```

## AWS Deployment Steps

### 1. Build and Push Docker Image
```bash
# Build image
docker build -t webapp:latest .

# Tag image
docker tag webapp:latest your-username/your-repo:latest

# Push to Docker Hub
docker push your-username/your-repo:latest
```

### 2. Set Up ECS Infrastructure
```bash
# Create cluster with Fargate
aws ecs create-cluster --cluster-name my-cluster

# Verify cluster creation
aws ecs describe-clusters --clusters my-cluster
```

### 3. Create Task Definition
Update the `task-definition.json` to your published Docker image.
```
Register the task definition:
```bash
aws ecs register-task-definition --cli-input-json file://task-definition.json
```

### 4. Create Security group and all inbound traffic
```bash
# Create security group
aws ec2 create-security-group \
    --group-name ecs-fargate-sg \
    --description "ECS Fargate security group"

# Allow inbound traffic on port 3000
aws ec2 authorize-security-group-ingress \
    --group-id $(aws ec2 describe-security-groups --group-names ecs-fargate-sg --query "SecurityGroups[0].GroupId" --output text) \
    --protocol tcp \
    --port 3000 \
    --cidr 0.0.0.0/0
```

### 4. Deploy Service
```bash
# Get default VPC subnets
export SUBNET_ID=$(aws ec2 describe-subnets --filters "Name=default-for-az,Values=true" --query "Subnets[0].SubnetId" --output text)

# Create service
aws ecs create-service \
    --cluster my-cluster \
    --service-name my-service \
    --task-definition cloud-computing-demo \
    --desired-count 1 \
    --launch-type FARGATE \
    --network-configuration "awsvpcConfiguration={subnets=[${SUBNET_ID}],securityGroups=[$(aws ec2 describe-security-groups --group-names ecs-fargate-sg --query 'SecurityGroups[0].GroupId' --output text)],assignPublicIp=ENABLED}"
```

### 5. Verify Deployment
```bash
# Check service status
aws ecs describe-services \
    --cluster my-cluster \
    --services my-service
```

### 6. Cleanup
When you're done with the deployment, clean up your resources:
```bash
# Delete service
aws ecs delete-service \
    --cluster my-cluster \
    --service my-service \
    --force

# Delete cluster
aws ecs delete-cluster --cluster my-cluster

# Delete task
aws ecs deregister-task-definition \                                         
    --task-definition cloud-computing-demo:1                               

# Delete security group
aws ec2 delete-security-group --group-name ecs-fargate-sg
```

## Troubleshooting
If deployment fails, check:
1. Docker image is accessible from Docker Hub
2. Security group was created successfully
3. Task definition is registered correctly
4. Service has the correct network configuration
5. AWS CLI has the necessary permissions

## Additional Resources
- [Docker Documentation](https://docs.docker.com/)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [NextJS Documentation](https://nextjs.org/docs)

## Contributing
Please submit issues and pull requests for any improvements to this guide.

## License
[Include your license information here]
