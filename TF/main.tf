terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Apps bucket - Apps Portal
module "website_apps" {
  source = "./modules/s3-website"

  bucket_name       = var.bucket_name_apps
  environment       = var.environment
  source_files_path = ".."

  bucket_tags = {
    Purpose = "Apps Portal"
    Bucket  = "apps"
  }
}
