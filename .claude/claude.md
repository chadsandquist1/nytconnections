This application has a title screen at index.html. It is the portal for a series of React-based apps.

Most of the underlying apps will be standalone React apps.

Whenever you add a new folder, please always adjust the title screen accordingly.

## Deployment

**Always use the deployment script instead of raw S3 sync:**

```bash
./deploy.sh
```

This script:
1. Builds all React apps (connections, strands, jeopardy, whack-a-mole, usa-react)
2. Uploads built files to S3 with correct MIME types
3. Deploys static content (workouts, thanksgiving)

**Why not `aws s3 sync`?**
- S3 sync uploads source `index.html` files that reference `/src/main.tsx` (dev files)
- React apps need their `dist/` contents uploaded, not source files
- MIME types must be set correctly for JS/CSS files to load in browsers

**Adding a new React app:**
1. Create the app folder with Vite + React
2. Set `base: '/app-name/'` in vite.config.js
3. Add deployment commands to `deploy.sh`
4. Add the app card to `index.html`
5. Run `./deploy.sh`

If terraform changes are needed, re-run `terraform apply` in the TF folder.

## Security

NEVER check in any .aws credentials, terraform statefiles, or secret keys.

Use modern quality practices.
