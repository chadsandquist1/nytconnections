# Variables for NNFP Infrastructure

variable "aws_region" {
  description = "AWS region for resources"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Environment name (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "use_mock_data" {
  description = "Whether to use mock data in Lambda (true/false)"
  type        = string
  default     = "true"
}
