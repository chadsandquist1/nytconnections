# Terraform AWS S3 Static Website Deployment

This Terraform configuration deploys the NYT Connections game to AWS S3 as a static website.

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured (`aws configure`)
3. **Terraform** installed (version >= 1.0)
4. **Node.js and npm** to build the application

## Security Features

This configuration implements AWS best practices:

- ✅ Server-side encryption (AES256) enabled
- ✅ Versioning enabled for backup/recovery
- ✅ Public ACLs blocked (access only via bucket policy)
- ✅ Bucket policy allows only `GetObject` (read-only public access)
- ✅ CORS configured for web asset requests
- ✅ Lifecycle policies to manage old versions and incomplete uploads
- ✅ Minimal permissions (principle of least privilege)

## Quick Start

### 1. Configure Variables

Create a `terraform.tfvars` file with your configuration:

```bash
cp terraform.tfvars.example terraform.tfvars
```

Edit `terraform.tfvars` and set your unique bucket name:

```hcl
aws_region  = "us-east-1"
bucket_name = "nyt-connections-game-YOUR-UNIQUE-ID"  # Must be globally unique!
environment = "prod"
```

**Note:** S3 bucket names must be globally unique across all AWS accounts. Choose something like `nyt-connections-game-12345` or include your username.

### 2. Initialize Terraform

```bash
cd TF
terraform init
```

This downloads the required AWS provider plugins.

### 3. Review the Plan

```bash
terraform plan
```

Review the resources that will be created. You should see:
- S3 bucket
- Bucket versioning configuration
- Server-side encryption configuration
- Website configuration
- Public access block settings
- Bucket policy
- CORS configuration
- Lifecycle configuration

### 4. Apply the Configuration

```bash
terraform apply
```

Type `yes` when prompted. Terraform will create your S3 bucket and configure it for static website hosting.

### 5. Build the Application

From the project root directory:

```bash
cd ..
npm run build
```

This creates the production build in the `dist/` directory.

### 6. Deploy to S3

After applying Terraform, it will output a deployment command. Use it to sync your built files:

```bash
# From the TF directory
cd TF

# Get the deployment command from outputs
terraform output deployment_command

# Run the command (or copy it from the output)
aws s3 sync ../dist s3://YOUR-BUCKET-NAME --delete
```

**Important:** The `--delete` flag removes files from S3 that don't exist in your local build, keeping the bucket clean.

### 7. Access Your Website

Get the website URL:

```bash
terraform output website_endpoint
```

Visit the URL in your browser (e.g., `http://your-bucket-name.s3-website-us-east-1.amazonaws.com`)

## Deployment Workflow

### Initial Deployment
```bash
cd TF
terraform init
terraform apply
cd ..
npm run build
aws s3 sync dist s3://YOUR-BUCKET-NAME --delete
```

### Updating Content
```bash
npm run build
aws s3 sync dist s3://YOUR-BUCKET-NAME --delete
```

### Updating Infrastructure
```bash
cd TF
terraform plan
terraform apply
```

## Terraform Commands

| Command | Description |
|---------|-------------|
| `terraform init` | Initialize working directory |
| `terraform plan` | Preview changes |
| `terraform apply` | Create/update infrastructure |
| `terraform destroy` | Delete all resources |
| `terraform output` | Show all outputs |
| `terraform output website_endpoint` | Show website URL |

## Managing Multiple Environments

To deploy to different environments (dev, staging, prod), use separate tfvars files:

```bash
# Create environment-specific files
cp terraform.tfvars.example terraform.dev.tfvars
cp terraform.tfvars.example terraform.prod.tfvars

# Apply with specific environment
terraform apply -var-file="terraform.dev.tfvars"
terraform apply -var-file="terraform.prod.tfvars"
```

## Troubleshooting

### Bucket Name Already Exists
**Error:** `BucketAlreadyExists` or `BucketAlreadyOwnedByYou`

**Solution:** S3 bucket names are globally unique. Change `bucket_name` in your `terraform.tfvars` to something unique.

### Access Denied
**Error:** `AccessDenied` when running `terraform apply`

**Solution:** Ensure your AWS credentials have the necessary S3 permissions:
- `s3:CreateBucket`
- `s3:DeleteBucket`
- `s3:PutBucketPolicy`
- `s3:PutBucketWebsite`
- `s3:PutBucketVersioning`
- `s3:PutEncryptionConfiguration`

### Website Shows 404
**Error:** Website URL shows "404 Not Found"

**Solution:**
1. Ensure you've run `npm run build` and synced the files: `aws s3 sync dist s3://YOUR-BUCKET-NAME --delete`
2. Verify files exist: `aws s3 ls s3://YOUR-BUCKET-NAME/`
3. Check that `index.html` exists in the bucket root

### CORS Errors
**Error:** Browser console shows CORS errors

**Solution:** The CORS configuration in `main.tf` should handle this, but if issues persist, check that the `aws_s3_bucket_cors_configuration` resource applied successfully.

## Cost Considerations

S3 static website hosting is very cost-effective:
- **Storage:** ~$0.023/GB/month (first 50 TB)
- **Data Transfer Out:** First 100 GB/month free, then ~$0.09/GB
- **Requests:** ~$0.0004 per 1,000 GET requests

For a small game like this, expect costs under $1/month for moderate traffic.

## Cleanup

To delete all resources and stop incurring charges:

```bash
# Remove all files from the bucket first
aws s3 rm s3://YOUR-BUCKET-NAME --recursive

# Destroy infrastructure
cd TF
terraform destroy
```

Type `yes` when prompted. This will delete the S3 bucket and all associated configurations.

## Security Notes

### What's Secure
- ✅ Bucket is encrypted at rest
- ✅ Versioning enabled for recovery
- ✅ Public access limited to read-only via bucket policy
- ✅ No write/delete access from the internet
- ✅ ACLs are blocked; access only through policy

### What's Public
- ⚠️ Website content is publicly readable (required for hosting)
- ⚠️ No authentication/authorization
- ⚠️ HTTP only (not HTTPS)

### To Add HTTPS
If you need HTTPS later, you can add CloudFront:
1. Create a CloudFront distribution pointing to the S3 bucket
2. Use AWS Certificate Manager for SSL certificate
3. This is more advanced but Terraform can manage it

## File Structure

```
TF/
├── main.tf                    # Main resources (S3, policies, configs)
├── variables.tf               # Input variable definitions
├── outputs.tf                 # Output values (URLs, commands)
├── terraform.tfvars.example   # Example configuration
└── README.md                  # This file
```

## Additional Resources

- [Terraform AWS Provider Docs](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS S3 Website Hosting](https://docs.aws.amazon.com/AmazonS3/latest/userguide/WebsiteHosting.html)
- [Terraform Best Practices](https://www.terraform-best-practices.com/)
