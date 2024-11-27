# Demo Project for AWS CloudFormation and Node.js SDK

## Prerequisites

1. AWS CLI installed and configured
2. AWS account with appropriate permissions
3. EC2 key pair created in your AWS account

## Initial Setup

```bash
git clone --branch cloudformation https://github.com/mhenke/Demo.git
cd Demo
npm install
```

## Export bucket name as environment variable

```bash
export BUCKET_NAME="YOUR-BUCKET-NAME"
export KEY_PAIR_NAME="YOUR_KEY_PAIR_NAME"
```

## Deploy on AWS using CloudFormation

1. Create an S3 bucket:

```bash
aws s3 mb s3://${BUCKET_NAME}
```

1. Upload the template:

```bash
aws s3 cp cloudformation/web-app-nextjs.yml s3://${BUCKET_NAME}/
```

1. Create the stack:

```bash
aws cloudformation create-stack \
  --stack-name MyStack \
  --template-url https://s3.amazonaws.com/$BUCKET_NAME/web-app-nextjs.yml \
  --parameters \
    ParameterKey=KeyName,ParameterValue=$KEY_PAIR_NAME \
  --capabilities CAPABILITY_NAMED_IAM
```

1. Watch stack creation status:

```bash
watch -n 10 'aws cloudformation describe-stacks --stack-name MyStack --query "Stacks[0].StackStatus"'
```

1. Get stack outputs:

```bash
aws cloudformation describe-stacks --stack-name MyStack --query "Stacks[0].Outputs" > stack-outputs.json
```

1. Access your application:
   - The application URL will be available in stack outputs as WebsiteURL
   - Database endpoint will be available in stack outputs as DatabaseEndpoint

## Architecture Components

The CloudFormation template provisions:

- VPC with public subnet
- EC2 instance running Node.js application
- PostgreSQL RDS instance
- Security groups for EC2 and RDS
- Necessary networking components (IGW, route tables)

## Application Access

The application is accessible on port 3000 of your EC2 instance's public DNS. The URL is provided in the stack outputs.

## Monitoring

- Application health is monitored via cron job
- PM2 process manager handles application runtime
- Application automatically restarts on system reboot
