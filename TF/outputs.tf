output "website_endpoint" {
  description = "Website endpoint URL"
  value       = "http://${aws_s3_bucket_website_configuration.website.website_endpoint}"
}

output "bucket_name" {
  description = "Name of the S3 bucket"
  value       = aws_s3_bucket.website.id
}

output "bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.website.arn
}

output "bucket_region" {
  description = "AWS region where the bucket is located"
  value       = aws_s3_bucket.website.region
}

output "deployment_command" {
  description = "Command to deploy the built application"
  value       = "aws s3 sync ../dist s3://${aws_s3_bucket.website.id} --delete"
}
