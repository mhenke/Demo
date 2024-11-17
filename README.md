This is a demo project for containerize a NextJS web-app.

# Test run docker build on your local machine

- Step 1, install docker on your local machine.
- Step 2, 
  - Option 1: Run the application
    Inside the project root directory, run the following command in a terminal.
    ```bash
    docker compose up --build
    ```
    Open a browser and view the application at http://localhost:3000. 
    You should see our web application.

    In the terminal, press ctrl+c to stop the application.
  - Option 2: Run the application in the background
    You can run the application detached from the terminal by adding the -d option. 
    Inside the project root directory, run the following command in a terminal.
  
    ```bash
    docker compose up --build -d
    ```
    Open a browser and view the application at http://localhost:3000.
    You should see our web application.
    In the terminal, run the following command to stop the application.
  
    ```bash
     docker compose down
    ```
  - For more information about Compose commands, see the [Compose CLI reference](https://docs.docker.com/compose/reference/).


# Build an Image and push to the Docker Hub

- Step 1, create a docker hub account (in my case: "xiaoqianuno"") and a repository (in my case, "cloud-computing-demo") for it. 
- Step 2, build an image with a name and a tag (<name:tag>) using docker file within current folder "."
  ```bash
  docker build -t webapp:latest .
  ```
- Step 3, tag local image with online repo by docker tag command
  ```bash
  # syntax: docker tag <local-image-name:tag> <dockerhub-username/repo:tag>
  docker tag webapp:latest xiaoqianuno/cloud-computing-demo:latest
  ```
- Step 4, push to docker hub
  ```bash
  docker push xiaoqianuno/cloud-computing-demo:latest
  ```
  
Now this image can be shared via the internet [xiaoqianuno
/
cloud-computing-demo](https://hub.docker.com/repository/docker/xiaoqianuno/cloud-computing-demo/general)

# Deploy Docker container to AWS

1. **Verify AWS Credentials and Setup**:
   - Ensure you have an AWS account with the necessary permissions to deploy Docker containers.
   - Set up the AWS CLI with your credentials on your local machine.

2. **Set Up AWS Environment**:
   - Create an Amazon ECS Cluster or use an existing one.
   - Define a task definition for your Docker image in Amazon ECS.
   - Create or use an existing service in Amazon ECS to run the task definition.

3. **Deploy and Verify**:
   - Ensure the Docker image is correctly pushed to Docker Hub and accessible.
   - Deploy the service and verify the deployment to ensure the Docker container is running properly in AWS.
