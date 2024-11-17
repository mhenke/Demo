# Demo Project for AWS CloudFormation and Node.js SDK

This project demonstrates how to use AWS CloudFormation templates and the Node.js SDK for interacting with AWS services.

Please reference the [official tutorial page](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cloudformation/) for more features.

## Set up the Environment

1. Clone this project to your local machine and within the project root folder, install dependencies:
    ```bash
    npm install
    ```

2. Set up the command line credentials for accessing your AWS services.

## Deploy on AWS using CloudFormation

1. Ensure you have the AWS CLI installed and configured on your local machine.

2. Upload the `cloudformation.yml` template to an S3 bucket.

3. Create a CloudFormation stack using the AWS Management Console or AWS CLI:
    ```bash
    aws cloudformation create-stack --stack-name MyStack --template-url https://s3.amazonaws.com/YOUR_BUCKET_NAME/cloudformation.yml --capabilities CAPABILITY_NAMED_IAM
    ```
    Replace `YOUR_BUCKET_NAME` with your S3 bucket name.

4. Once the stack creation is complete, note the outputs for the EC2 instance and RDS instance.

5. SSH into the EC2 instance:
    ```bash
    ssh -i your-key-pair.pem ec2-user@your-ec2-instance-public-dns
    ```

6. Clone this project to the EC2 instance and within the project root folder, install dependencies:
    ```bash
    npm install
    ```

7. Set up the database connection in `prisma/schema.prisma`:
    ```c
    datasource db {
      provider = "mysql"
      url      = "mysql://USER:PASSWORD@RDS_ENDPOINT:PORT/DATABASE"
    }
    ```
    Replace `USER`, `PASSWORD`, `RDS_ENDPOINT`, `PORT`, and `DATABASE` with your MySQL RDS details.

8. Run a migration to create your database tables with Prisma Migrate:
    ```bash
    npx prisma migrate dev --name init
    ```

9. Run the dev server to serve the Next.js web app:
    ```bash
    npm run dev
    ```

##
