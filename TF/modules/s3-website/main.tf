# Local variables for MIME type mapping
locals {
  mime_types = {
    "html" = "text/html"
    "css"  = "text/css"
    "js"   = "application/javascript"
    "json" = "application/json"
    "svg"  = "image/svg+xml"
    "png"  = "image/png"
    "jpg"  = "image/jpeg"
    "jpeg" = "image/jpeg"
    "webp" = "image/webp"
    "txt"  = "text/plain"
  }
}

# S3 bucket for website hosting
resource "aws_s3_bucket" "this" {
  bucket = var.bucket_name

  tags = merge(
    {
      Name        = var.bucket_name
      Environment = var.environment
      ManagedBy   = "Terraform"
    },
    var.bucket_tags
  )
}

# Enable versioning for backup/recovery
resource "aws_s3_bucket_versioning" "this" {
  bucket = aws_s3_bucket.this.id

  versioning_configuration {
    status = "Enabled"
  }
}

# Enable server-side encryption
resource "aws_s3_bucket_server_side_encryption_configuration" "this" {
  bucket = aws_s3_bucket.this.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# Configure website hosting
resource "aws_s3_bucket_website_configuration" "this" {
  bucket = aws_s3_bucket.this.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "index.html" # SPA routing: all errors redirect to index.html
  }
}

# Block public ACLs but allow public access through bucket policy
resource "aws_s3_bucket_public_access_block" "this" {
  bucket = aws_s3_bucket.this.id

  block_public_acls       = true
  block_public_policy     = false # Allow bucket policy to grant public access
  ignore_public_acls      = true
  restrict_public_buckets = false # Allow public bucket policies
}

# Bucket policy to allow public read access
resource "aws_s3_bucket_policy" "this" {
  bucket = aws_s3_bucket.this.id

  # Ensure public access block is configured first
  depends_on = [aws_s3_bucket_public_access_block.this]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.this.arn}/*"
      }
    ]
  })
}

# CORS configuration for web assets
resource "aws_s3_bucket_cors_configuration" "this" {
  bucket = aws_s3_bucket.this.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# Lifecycle policy to manage old versions (optional cost optimization)
resource "aws_s3_bucket_lifecycle_configuration" "this" {
  bucket = aws_s3_bucket.this.id

  rule {
    id     = "delete-old-versions"
    status = "Enabled"

    noncurrent_version_expiration {
      noncurrent_days = 90
    }

    filter {}
  }

  rule {
    id     = "abort-incomplete-multipart-uploads"
    status = "Enabled"

    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }

    filter {}
  }
}

# Upload root index.html
resource "aws_s3_object" "index" {
  bucket       = aws_s3_bucket.this.id
  key          = "index.html"
  source       = "${var.source_files_path}/index.html"
  content_type = "text/html"
  etag         = filemd5("${var.source_files_path}/index.html")

  depends_on = [aws_s3_bucket.this]
}

# Upload public/home.html
resource "aws_s3_object" "home" {
  bucket       = aws_s3_bucket.this.id
  key          = "public/home.html"
  source       = "${var.source_files_path}/public/home.html"
  content_type = "text/html"
  etag         = filemd5("${var.source_files_path}/public/home.html")

  depends_on = [aws_s3_bucket.this]
}

# Upload Thanksgiving interactive HTML
resource "aws_s3_object" "thanksgiving_interactive" {
  bucket       = aws_s3_bucket.this.id
  key          = "thanksgiving_interactive.html"
  source       = "${var.source_files_path}/thanksgiving/thanksgiving_interactive.html"
  content_type = "text/html"
  etag         = filemd5("${var.source_files_path}/thanksgiving/thanksgiving_interactive.html")

  depends_on = [aws_s3_bucket.this]
}

# Upload game.html for connections
resource "aws_s3_object" "game" {
  bucket       = aws_s3_bucket.this.id
  key          = "game.html"
  source       = "${var.source_files_path}/game.html"
  content_type = "text/html"
  etag         = filemd5("${var.source_files_path}/game.html")

  depends_on = [aws_s3_bucket.this]
}

# Upload all connections files
resource "aws_s3_object" "connections_files" {
  for_each = fileset("${var.source_files_path}/connections", "**/*")

  bucket       = aws_s3_bucket.this.id
  key          = "connections/${each.value}"
  source       = "${var.source_files_path}/connections/${each.value}"
  content_type = lookup(local.mime_types, reverse(split(".", each.value))[0], "application/octet-stream")
  etag         = filemd5("${var.source_files_path}/connections/${each.value}")

  depends_on = [aws_s3_bucket.this]
}

# Upload all jeopardy app files
resource "aws_s3_object" "jeopardy_files" {
  for_each = fileset("${var.source_files_path}/jeopardy/dist", "**/*")

  bucket       = aws_s3_bucket.this.id
  key          = "jeopardy/${each.value}"
  source       = "${var.source_files_path}/jeopardy/dist/${each.value}"
  content_type = lookup(local.mime_types, reverse(split(".", each.value))[0], "application/octet-stream")
  etag         = filemd5("${var.source_files_path}/jeopardy/dist/${each.value}")

  depends_on = [aws_s3_bucket.this]
}

# Upload all strands app files
resource "aws_s3_object" "strands_files" {
  for_each = fileset("${var.source_files_path}/strands/dist", "**/*")

  bucket       = aws_s3_bucket.this.id
  key          = "strands/${each.value}"
  source       = "${var.source_files_path}/strands/dist/${each.value}"
  content_type = lookup(local.mime_types, reverse(split(".", each.value))[0], "application/octet-stream")
  etag         = filemd5("${var.source_files_path}/strands/dist/${each.value}")

  depends_on = [aws_s3_bucket.this]
}
