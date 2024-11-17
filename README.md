# NextJS Web App Containerization and AWS Deployment Guide

This guide demonstrates how to containerize a NextJS web application and deploy it to AWS ECS.

## Local Development

### Prerequisites
- Docker installed on your local machine
- Node.js and npm (for local development)
- AWS CLI configured with appropriate credentials
- Docker Hub account

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

## AWS Deployment

### 1. Configure AWS Environment
1. Verify AWS credentials and permissions:
```bash
aws iam list-attached-user-policies --user-name YOUR_USER_NAME
```

2. Create an ECS cluster:
```bash
aws ecs create-cluster --cluster-name my-cluster
```

### 2. Set Up ECS Infrastructure

#### Option 1: Using AWS Console (Easiest Method)
1. Open the Amazon ECS console at https://console.aws.amazon.com/ecs/
2. Click "Create Cluster"
3. Select "EC2 Linux + Networking"
4. Configure basic cluster settings:
   - Cluster name: `my-cluster`
   - EC2 instance type: `t2.micro` (for testing)
   - Number of instances: 1
   - VPC: Create new VPC (or select existing)
5. Click "Create"

This will automatically:
- Create the ECS cluster
- Launch EC2 instances
- Configure IAM roles
- Set up networking
- Configure security groups

#### Option 2: Using AWS CLI (Advanced Method)
If you prefer using the CLI, use this simplified command:
```bash
# Create cluster with EC2 capacity provider
aws ecs create-cluster \
    --cluster-name my-cluster \
    --capacity-providers FARGATE EC2 \
    --default-capacity-provider-strategy capacityProvider=EC2,weight=1 \
    --configuration executeCommandConfiguration={logging=DEFAULT}

# Create an EC2 instance for the cluster
aws cloudformation deploy \
    --stack-name ecs-ec2-instances \
    --template-file ecs-ec2-instance.yml \
    --parameters \
        "ClusterName=my-cluster" \
        "InstanceType=t2.micro" \
        "MinSize=1" \
        "MaxSize=1"
```

Verify setup completion:
```bash
# Check if instances are registered
aws ecs list-container-instances --cluster my-cluster
```

Note: For the CLI method, you'll need the CloudFormation template (`ecs-ec2-instance.yml`). Contact your DevOps team for this template or use the console method.

### 3. Deploy the Application

1. Register the task definition:
```bash
aws ecs register-task-definition \
    --cli-input-json file://task-definition.json
```

2. Create the ECS service:
```bash
aws ecs create-service \
    --cluster my-cluster \
    --service-name my-service \
    --task-definition cloud-computing-demo \
    --desired-count 1 \
    --launch-type EC2
```

3. Verify deployment:
```bash
# Check service status
aws ecs describe-services \
    --cluster my-cluster \
    --services my-service
```

### 4. Troubleshooting

If deployment fails, check:
1. EC2 instances are running and registered with the cluster
2. IAM roles and policies are correctly configured
3. Security groups allow necessary traffic
4. Docker image is accessible from ECR/Docker Hub
5. Task definition is correctly configured
6. VPC and subnet configurations are correct

### 5. Cleaning Up Resources

If you need to remove the deployment and try again, follow these steps in order:

1. Delete the ECS service:
```bash
# Delete the service (force flag removes service even with running tasks)
aws ecs delete-service \
    --cluster my-cluster \
    --service my-service \
    --force

# Verify service deletion
aws ecs describe-services \
    --cluster my-cluster \
    --services my-service
```

2. Deregister the task definition:
```bash
# Get task definition ARN
aws ecs list-task-definitions

# Deregister the task definition
aws ecs deregister-task-definition \
    --task-definition cloud-computing-demo:1
```

3. Delete the cluster (and associated resources):

If using Console method:
- Go to AWS Console → ECS
- Select your cluster
- Click "Delete Cluster"

If using CLI method:
```bash
# Delete CloudFormation stack if used
aws cloudformation delete-stack --stack-name ecs-ec2-instances

# Delete the cluster
aws ecs delete-cluster --cluster my-cluster

# Verify cluster deletion
aws ecs describe-clusters --clusters my-cluster
```

4. Additional cleanup (if needed):
```bash
# List any remaining EC2 instances
aws ec2 describe-instances \
    --filters "Name=tag:aws:ecs:cluster-name,Values=my-cluster"

# Terminate specific instances if any remain
aws ec2 terminate-instances --instance-ids <instance-id>
```

Wait a few minutes after cleanup before attempting to redeploy.

## Additional Resources
- [Docker Documentation](https://docs.docker.com/)
- [AWS ECS Documentation](https://docs.aws.amazon.com/ecs/)
- [NextJS Documentation](https://nextjs.org/docs)

## Contributing
Please submit issues and pull requests for any improvements to this guide.

## License
[Include your license information here]
