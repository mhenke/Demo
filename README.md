# Demo Project for AWS CloudFormation and Node.js SDK

## Prerequisites

1. AWS CLI installed and configured
1. AWS account with appropriate permissions
1. EC2 key pair created in your AWS account

## Initial Setup

```bash
git clone --branch cloudformation https://github.com/mhenke/Demo.git
cd Demo
```

### Deploy locally (optional)

1. Install dependencies:

```bash
npm install
```

Rename [.env.example](.env.example) to .env and update the values:

```bash
cp .env.example .env
```

3. Run prisma migration using [schema.local.prisma](prisma/schema.local.prisma):

```bash
nnpx prisma migrate reset --force --schema=./prisma/schema.local.prisma && npx prisma migrate dev --name init --schema=./prisma/schema.local.prisma
```

4. Start the application:

```bash
npm run dev
```

## Export as environment variable

```bash
export STACK_NAME="MyStack"
export BUCKET_NAME="YOUR-BUCKET-NAME"
export KEY_PAIR_NAME="YOUR_KEY_PAIR_NAME"
export DB_USERNAME="YOUR_DB_USERNAME"
export DB_PASSWORD="YOUR_DB_PASSWORD"
```

## Get EC2 key pair name (optional)

```bash
aws ec2 describe-key-pairs --query 'KeyPairs[0].KeyName'
```

## Deploy on AWS using CloudFormation

0. Validate the template:

```bash
aws cloudformation validate-template --template-body file://cloudformation/web-app-nextjs.yml
```

1. Create an S3 bucket:

```bash
aws s3 mb s3://${BUCKET_NAME}
```

2. Upload the [web-app-nextjs.yml](cloudformation/web-app-nextjs.yml) template:

```bash
aws s3 cp cloudformation/web-app-nextjs.yml s3://${BUCKET_NAME}/
```

3. Create the stack (completed in about 10 minutes):

```bash
aws cloudformation create-stack \
  --stack-name $STACK_NAME \
  --template-url https://s3.amazonaws.com/$BUCKET_NAME/web-app-nextjs.yml \
  --parameters \
    ParameterKey=KeyName,ParameterValue=$KEY_PAIR_NAME \
    ParameterKey=DBUsername,ParameterValue=$DB_USERNAME \
    ParameterKey=DBPassword,ParameterValue=$DB_PASSWORD \
  --capabilities CAPABILITY_NAMED_IAM
```

4. Watch stack creation status (optional):

```bash
watch -n 10 'aws cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].StackStatus"'
```

5. Get stack outputs:

```bash
aws cloudformation describe-stacks --stack-name $STACK_NAME --query "Stacks[0].Outputs" > stack-outputs.json
```

6. Access your application:

- The application URL will be available in stack outputs as WebsiteURL
- Database endpoint will be available in stack outputs as DatabaseEndpoint

7. Delete the stack:

```bash
aws cloudformation delete-stack --stack-name $STACK_NAME
```

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
