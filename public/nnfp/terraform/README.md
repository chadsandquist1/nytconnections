# NNFP Terraform Infrastructure

Simple, cost-optimized AWS serverless deployment using:
- **AWS Lambda with Function URLs** (no API Gateway!) for Express backend
- **AWS S3** for React frontend hosting

## Prerequisites

- AWS CLI configured with credentials
- Terraform >= 1.0
- Node.js 18+ and npm

## Quick Start

### 1. Initialize Terraform

```bash
cd terraform
terraform init
```

### 2. Deploy Infrastructure

```bash
terraform apply
```

Review the plan and type `yes` to proceed.

### 3. Note the Outputs

After deployment, Terraform will output:
- `frontend_bucket_name`: S3 bucket for frontend
- `frontend_website_url`: Public URL for your app
- `backend_function_url`: Lambda Function URL (API endpoint)

### 4. Configure React App

Create `.env.production` in the project root:

```
VITE_API_URL=<backend_function_url from terraform output>
```

### 5. Deploy Frontend

```bash
# Build React app
npm run build

# Deploy to S3
aws s3 sync dist/ s3://<frontend_bucket_name> --delete
```

### 6. Deploy Backend (Lambda)

First time:
```bash
# Package Lambda function
npm run package:lambda

# Terraform will deploy it
terraform apply
```

Updates:
```bash
npm run package:lambda
terraform apply
```

## Architecture

```
┌──────────────┐
│   Internet   │
└──────┬───────┘
       │
       ├──────────────────┐
       │                  │
       ▼                  ▼
┌─────────────┐    ┌──────────────┐
│  S3 Bucket  │    │   Lambda +   │
│  (React)    │◄───┤  Function URL │
└─────────────┘    │  (Express)   │
                   └──────────────┘
                          │
                          ▼
                   ┌──────────────┐
                   │ External APIs│
                   │ - MFL        │
                   │ - Dropbox    │
                   └──────────────┘
```

## Cost Estimate

### Development/Low Traffic
- S3: ~$0.50/month (storage + requests)
- Lambda: ~$0.20/month (compute time)
- CloudWatch Logs: ~$0.10/month
- **Total: ~$1/month**

### Medium Traffic (10K requests/month)
- S3: ~$2/month
- Lambda: ~$1/month
- CloudWatch Logs: ~$0.50/month
- **Total: ~$3.50/month**

## Variables

Edit `terraform.tfvars` or pass via command line:

```hcl
aws_region     = "us-east-1"
environment    = "dev"
use_mock_data  = "true"
```

## Cleanup

To destroy all resources:

```bash
terraform destroy
```

## Notes

- **No API Gateway**: Uses Lambda Function URLs (simpler and cheaper)
- **No Route 53**: Uses S3 website URL (add CloudFront/Route53 later if needed)
- **No EC2**: Fully serverless
- **7-day log retention**: Keeps costs low
- **Public S3 bucket**: For simple static hosting

## Next Steps (Optional Improvements)

1. **Add CloudFront** for HTTPS and better performance
2. **Add custom domain** with Route 53
3. **Add CI/CD** with GitHub Actions
4. **Add CloudWatch alarms** for monitoring
