# Firebase CI/CD Deployment Guide

This guide will help you set up continuous deployment from GitHub to Firebase Hosting.

## Prerequisites

- Firebase CLI installed: `npm install -g firebase-tools`
- Firebase project already created (ui-tools-vue)
- GitHub repository set up

## Step 1: Generate Firebase Service Account

1. **Go to Firebase Console**:
   - Visit [Firebase Console](https://console.firebase.google.com/)
   - Select your project: `ui-tools-vue`

2. **Navigate to Project Settings**:
   - Click the gear icon ⚙️ next to "Project Overview"
   - Click "Project settings"

3. **Create Service Account**:
   - Go to the "Service accounts" tab
   - Click "Generate new private key"
   - Download the JSON file (keep it secure!)

4. **Convert JSON to base64** (for GitHub secret):
   ```bash
   # On Linux/Mac:
   cat path/to/service-account.json | base64

   # On Windows (PowerShell):
   [Convert]::ToBase64String([System.IO.File]::ReadAllBytes("path\to\service-account.json"))
   ```

## Step 2: Add GitHub Secrets

1. **Go to your GitHub repository**:
   - Navigate to your repository on GitHub
   - Go to "Settings" → "Secrets and variables" → "Actions"

2. **Add the following secret**:
   - Click "New repository secret"
   - Name: `FIREBASE_SERVICE_ACCOUNT`
   - Value: Paste the base64-encoded service account JSON

## Step 3: Deploy Firestore Rules and Indexes

Before the CI/CD pipeline can deploy, you need to manually deploy the Firestore rules and indexes once:

```bash
# Login to Firebase
firebase login

# Deploy Firestore rules and indexes
firebase deploy --only firestore:rules
firebase deploy --only firestore:indexes
```

## Step 4: Test the Pipeline

1. **Commit and push your changes**:
   ```bash
   git add .
   git commit -m "Add CI/CD pipeline for Firebase deployment"
   git push origin main
   ```

2. **Watch the GitHub Actions**:
   - Go to your repository on GitHub
   - Click on "Actions" tab
   - Watch your workflow run

3. **View your deployed app**:
   - After successful deployment, visit: `https://ui-tools-vue.web.app`
   - Or: `https://ui-tools-vue.firebaseapp.com`

## Workflow Behavior

- **On Pull Request**: Runs tests only (no deployment)
- **On Push to Main**: Runs tests + builds + deploys to Firebase Hosting

## Troubleshooting

### Tests Failing
- Run `npm run test:coverage` locally to debug
- Check test coverage requirements in `vitest.config.js`

### Build Failing
- Run `npm run build` locally to debug
- Check for TypeScript/ESLint errors

### Deployment Failing
- Verify `FIREBASE_SERVICE_ACCOUNT` secret is set correctly
- Check Firebase project permissions
- Ensure service account has "Firebase Hosting Admin" role

### Firestore Rules Error
- Deploy rules manually first: `firebase deploy --only firestore:rules`
- Check rules syntax in `firestore.rules`

## Local Testing

Test your build locally before pushing:

```bash
# Install dependencies
cd frontend
npm install

# Run tests
npm run test:coverage

# Build for production
npm run build

# Preview production build
npm run preview
```

## Firebase Hosting URLs

After deployment, your app will be available at:
- Production: `https://ui-tools-vue.web.app`
- Alternative: `https://ui-tools-vue.firebaseapp.com`

## Monitoring

- **Firebase Console**: Check hosting activity and analytics
- **GitHub Actions**: Monitor deployment history and logs
- **Firebase Performance**: Enable monitoring for production insights