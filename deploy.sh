#!/bin/bash
set -e

# Deployment script for Chad's Apps
# This script builds all React apps and uploads to S3 with correct MIME types

BUCKET="mojodojocasahouse-of-apps-67ba00d8ab4c-bucket"
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Chad's Apps Deployment Script ==="
echo "Bucket: $BUCKET"
echo "Root: $ROOT_DIR"
echo ""

# Function to upload a file with correct MIME type
upload_file() {
    local src="$1"
    local dest="$2"
    local content_type="$3"

    aws s3 cp "$src" "s3://$BUCKET/$dest" --content-type "$content_type"
}

# Function to upload directory with MIME types based on extension
upload_assets() {
    local src_dir="$1"
    local dest_prefix="$2"

    # Upload JS files
    find "$src_dir" -name "*.js" -type f | while read file; do
        rel_path="${file#$src_dir/}"
        upload_file "$file" "$dest_prefix/$rel_path" "application/javascript"
    done

    # Upload CSS files
    find "$src_dir" -name "*.css" -type f | while read file; do
        rel_path="${file#$src_dir/}"
        upload_file "$file" "$dest_prefix/$rel_path" "text/css"
    done

    # Upload PNG files
    find "$src_dir" -name "*.png" -type f | while read file; do
        rel_path="${file#$src_dir/}"
        upload_file "$file" "$dest_prefix/$rel_path" "image/png"
    done

    # Upload JPG files
    find "$src_dir" -name "*.jpg" -o -name "*.jpeg" -type f 2>/dev/null | while read file; do
        rel_path="${file#$src_dir/}"
        upload_file "$file" "$dest_prefix/$rel_path" "image/jpeg"
    done

    # Upload SVG files
    find "$src_dir" -name "*.svg" -type f | while read file; do
        rel_path="${file#$src_dir/}"
        upload_file "$file" "$dest_prefix/$rel_path" "image/svg+xml"
    done
}

# Function to build and deploy a React app
deploy_react_app() {
    local app_name="$1"
    local app_dir="$2"
    local s3_prefix="$3"

    echo "--- Deploying $app_name ---"

    # Build the app
    echo "Building $app_name..."
    cd "$app_dir"
    npm run build

    # Upload index.html
    upload_file "dist/index.html" "$s3_prefix/index.html" "text/html"

    # Upload assets
    if [ -d "dist/assets" ]; then
        upload_assets "dist/assets" "$s3_prefix/assets"
    fi

    # Upload other common files
    [ -f "dist/vite.svg" ] && upload_file "dist/vite.svg" "$s3_prefix/vite.svg" "image/svg+xml"

    cd "$ROOT_DIR"
    echo "$app_name deployed!"
    echo ""
}

# 1. Upload root index.html (landing page) with S3 paths
echo "--- Deploying landing page ---"
# Create temp file with S3-compatible paths (remove /dist/ from paths)
TEMP_INDEX=$(mktemp)
sed -e 's|href="/dist/game.html"|href="/game.html"|g' \
    -e 's|href="/strands/dist/"|href="/strands/"|g' \
    -e 's|href="/jeopardy/dist/"|href="/jeopardy/"|g' \
    -e 's|href="/usa-react/dist/"|href="/usa-react/"|g' \
    "$ROOT_DIR/index.html" > "$TEMP_INDEX"
upload_file "$TEMP_INDEX" "index.html" "text/html"
rm "$TEMP_INDEX"
echo ""

# 2. Build and deploy root connections game
echo "--- Deploying Connections Game ---"
cd "$ROOT_DIR"
npm run build
upload_file "dist/game.html" "game.html" "text/html"
upload_assets "dist/assets" "assets"
[ -f "dist/vite.svg" ] && upload_file "dist/vite.svg" "vite.svg" "image/svg+xml"
echo "Connections game deployed!"
echo ""

# 3. Deploy Strands
deploy_react_app "Strands" "$ROOT_DIR/strands" "strands"
# Upload strands-specific files
upload_file "$ROOT_DIR/strands/dist/strands-config.json" "strands/strands-config.json" "application/json"
upload_file "$ROOT_DIR/strands/dist/words.txt" "strands/words.txt" "text/plain"
upload_file "$ROOT_DIR/strands/dist/strands-logo.svg" "strands/strands-logo.svg" "image/svg+xml"
[ -f "$ROOT_DIR/strands/dist/celebration_overlay_gif.json" ] && upload_file "$ROOT_DIR/strands/dist/celebration_overlay_gif.json" "strands/celebration_overlay_gif.json" "application/json"
[ -f "$ROOT_DIR/strands/dist/NE_ALL_STAR_BG.jpg" ] && upload_file "$ROOT_DIR/strands/dist/NE_ALL_STAR_BG.jpg" "strands/NE_ALL_STAR_BG.jpg" "image/jpeg"

# 4. Deploy Jeopardy
deploy_react_app "Jeopardy" "$ROOT_DIR/jeopardy" "jeopardy"

# 5. Deploy Whack-a-mole (Pet-a-Pup) - note: uses /whack-a-mole/dist/ as base
echo "--- Deploying Pet-a-Pup ---"
cd "$ROOT_DIR/whack-a-mole"
npm run build
upload_file "dist/index.html" "whack-a-mole/dist/index.html" "text/html"
upload_assets "dist/assets" "whack-a-mole/dist/assets"
[ -f "dist/vite.svg" ] && upload_file "dist/vite.svg" "whack-a-mole/dist/vite.svg" "image/svg+xml"
cd "$ROOT_DIR"
echo "Pet-a-Pup deployed!"
echo ""

# 6. Deploy USA React
deploy_react_app "USA React" "$ROOT_DIR/usa-react" "usa-react"

# 7. Upload static folders (workouts, thanksgiving)
echo "--- Deploying static content ---"

# Workouts
upload_file "$ROOT_DIR/workouts/index.html" "workouts/index.html" "text/html"
upload_file "$ROOT_DIR/workouts/workouts.js" "workouts/workouts.js" "application/javascript"

# Thanksgiving
upload_file "$ROOT_DIR/thanksgiving/thanksgiving_interactive.html" "thanksgiving/thanksgiving_interactive.html" "text/html"
upload_file "$ROOT_DIR/thanksgiving/thanksgiving_timeline.pdf" "thanksgiving/thanksgiving_timeline.pdf" "application/pdf"

echo "Static content deployed!"
echo ""

# 8. Upload public folder assets (puzzle.csv, etc.)
echo "--- Deploying public assets ---"
if [ -d "$ROOT_DIR/public" ]; then
    for file in "$ROOT_DIR/public"/*; do
        if [ -f "$file" ]; then
            filename=$(basename "$file")
            case "$filename" in
                *.csv) upload_file "$file" "public/$filename" "text/csv" ;;
                *.json) upload_file "$file" "public/$filename" "application/json" ;;
                *.svg) upload_file "$file" "public/$filename" "image/svg+xml" ;;
                *.png) upload_file "$file" "public/$filename" "image/png" ;;
                *.jpg|*.jpeg) upload_file "$file" "public/$filename" "image/jpeg" ;;
                *) upload_file "$file" "public/$filename" "application/octet-stream" ;;
            esac
        fi
    done
fi
echo ""

echo "=== Deployment Complete ==="
echo "Site: http://$BUCKET.s3-website-us-east-1.amazonaws.com/"
