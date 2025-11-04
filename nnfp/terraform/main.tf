# NNFP AWS Infrastructure
# Simple, cost-optimized serverless deployment
# - S3 + CloudFront for React frontend
# - Lambda with Function URL for Express backend (no API Gateway!)

terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.4"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

locals {
  app_name = "nnfp"
  environment = var.environment

  common_tags = {
    Application = local.app_name
    Environment = local.environment
    ManagedBy   = "Terraform"
  }
}

# ============================================================================
# S3 Bucket for Frontend (React App)
# ============================================================================

resource "aws_s3_bucket" "frontend" {
  bucket = "${local.app_name}-frontend-${local.environment}"

  tags = merge(local.common_tags, {
    Name = "${local.app_name}-frontend"
  })
}

resource "aws_s3_bucket_public_access_block" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_website_configuration" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html"  # For React Router
  }
}

resource "aws_s3_bucket_policy" "frontend" {
  bucket = aws_s3_bucket.frontend.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.frontend.arn}/*"
      }
    ]
  })

  depends_on = [aws_s3_bucket_public_access_block.frontend]
}

# ============================================================================
# IAM Role for Lambda
# ============================================================================

resource "aws_iam_role" "lambda" {
  name = "${local.app_name}-lambda-role-${local.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })

  tags = local.common_tags
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
  role       = aws_iam_role.lambda.name
}

# ============================================================================
# Lambda Function (Express Backend)
# ============================================================================

# Package the Lambda function code
data "archive_file" "lambda" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda-package"  # We'll create this
  output_path = "${path.module}/lambda-function.zip"
}

resource "aws_lambda_function" "backend" {
  filename         = data.archive_file.lambda.output_path
  function_name    = "${local.app_name}-backend-${local.environment}"
  role            = aws_iam_role.lambda.arn
  handler         = "index.handler"
  source_code_hash = data.archive_file.lambda.output_base64sha256
  runtime         = "nodejs20.x"
  timeout         = 30
  memory_size     = 512

  environment {
    variables = {
      NODE_ENV      = var.environment
      USE_MOCK_DATA = var.use_mock_data
    }
  }

  tags = merge(local.common_tags, {
    Name = "${local.app_name}-backend"
  })
}

# Lambda Function URL (No API Gateway needed!)
resource "aws_lambda_function_url" "backend" {
  function_name      = aws_lambda_function.backend.function_name
  authorization_type = "NONE"  # Public access

  cors {
    allow_credentials = false
    allow_origins     = ["*"]  # In production, restrict to your CloudFront domain
    allow_methods     = ["*"]
    allow_headers     = ["*"]
    max_age          = 3600
  }
}

# CloudWatch Log Group for Lambda
resource "aws_cloudwatch_log_group" "lambda" {
  name              = "/aws/lambda/${aws_lambda_function.backend.function_name}"
  retention_in_days = 7  # Cost optimization: 7 days retention

  tags = local.common_tags
}

# ============================================================================
# Outputs
# ============================================================================

output "frontend_bucket_name" {
  description = "S3 bucket name for frontend"
  value       = aws_s3_bucket.frontend.bucket
}

output "frontend_website_url" {
  description = "S3 website URL for frontend"
  value       = aws_s3_bucket_website_configuration.frontend.website_endpoint
}

output "backend_function_url" {
  description = "Lambda Function URL for backend (use this as VITE_API_URL)"
  value       = aws_lambda_function_url.backend.function_url
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.backend.function_name
}

output "deployment_instructions" {
  description = "How to deploy the application"
  value       = <<-EOT
    Frontend Deployment:
    1. Build frontend: npm run build
    2. Deploy to S3: aws s3 sync dist/ s3://${aws_s3_bucket.frontend.bucket} --delete
    3. Access at: http://${aws_s3_bucket_website_configuration.frontend.website_endpoint}

    Backend Deployment:
    1. Package Lambda: npm run package:lambda
    2. Update Lambda: terraform apply

    Configure React app:
    - Set VITE_API_URL=${aws_lambda_function_url.backend.function_url} in .env.production
  EOT
}
