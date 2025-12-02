# GitHub Pages Deployment Instructions

## Prerequisites
- GitHub account with a repository for this project
- API keys for Groq and OpenRouter

## Setup Steps

### 1. Push Your Code to GitHub
If you haven't already, initialize a git repository and push your code:
```bash
git init
git add .
git commit -m "Initial commit - AI Daily News"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-daily-news.git
git push -u origin main
```

### 2. Add GitHub Secrets
1. Go to your repository on GitHub
2. Click on **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following secrets:
   - Name: `GROQ_API_KEY`, Value: Your Groq API key
   - Name: `OPENROUTER_API_KEY`, Value: Your OpenRouter API key

### 3. Enable GitHub Pages
1. Go to **Settings** → **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Select branch: **gh-pages**
4. Select folder: **/ (root)**
5. Click **Save**

### 4. Run the Workflow
1. Go to **Actions** tab in your repository
2. Click on **Daily AI News Update** workflow
3. Click **Run workflow** → **Run workflow**
4. Wait for the workflow to complete (it will scrape news, generate summaries, and deploy)

### 5. Access Your Site
After the workflow completes, your site will be available at:
```
https://YOUR_USERNAME.github.io/ai-daily-news/
```

## Automatic Updates
The workflow is scheduled to run daily at 12:00 UTC. It will:
1. Fetch and summarize new AI news
2. Update `data/news.json`
3. Redeploy the site to GitHub Pages

## Troubleshooting
- If the workflow fails, check the Actions logs for errors
- Ensure your API keys are correctly set in GitHub Secrets
- Make sure the `gh-pages` branch is created (first workflow run creates it)
