# Apps bucket outputs
output "website_endpoint" {
  description = "Apps website endpoint URL"
  value       = module.website_apps.website_endpoint
}

output "bucket_name" {
  description = "Name of the apps S3 bucket"
  value       = module.website_apps.bucket_name
}

output "bucket_arn" {
  description = "ARN of the apps S3 bucket"
  value       = module.website_apps.bucket_arn
}

output "bucket_region" {
  description = "AWS region where the apps bucket is located"
  value       = module.website_apps.bucket_region
}

output "deployment_command" {
  description = "Command to deploy the built application to apps bucket"
  value       = module.website_apps.deployment_command
}
