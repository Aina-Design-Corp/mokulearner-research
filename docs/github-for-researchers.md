# GitHub for Researchers: A Plain-Language Guide

This guide explains the GitHub concepts you need to contribute data to the Mokunet Research Commons — no prior software development experience required.

You can complete the entire contribution process through the GitHub website. No software installation is needed.

## Key Concepts

### Repository

A **repository** (or "repo") is a shared folder stored on GitHub that tracks every change ever made to its files. Think of it like a shared Google Drive folder, but with a full history of who changed what and when. The Mokunet Research Commons is a repository where research data contributions are stored.

### Fork

A **fork** is your own personal copy of the repository. When you fork a repository, GitHub creates an identical copy under your account. You can make changes to your fork freely — nothing in the original repository is affected until you explicitly request to share your changes.

To fork this repository: click the **Fork** button at the top-right of the [repository page](https://github.com/Aina-Design-Corp/mokulearner-research).

### Commit

A **commit** is a saved snapshot of your changes. Every time you add or edit a file on GitHub's website and click "Commit changes", you're creating a record of what changed and why. Commits are the history entries that make the repository's provenance trackable.

### Pull Request

A **pull request** (PR) is how you propose that your changes — sitting in your fork — be merged into the main shared repository. Think of it as submitting your dataset for review. Once you open a pull request, automated checks run on your files and a community maintainer reviews your contribution before it's accepted.

---

## Step-by-Step: Contributing via the GitHub Website

### Step 1: Create a GitHub account

If you don't have one, sign up at [github.com/signup](https://github.com/signup). A free account is all you need.

### Step 2: Register as a contributor

Before adding data, you need to register your organization. Open a [New Contributor Registration issue](https://github.com/Aina-Design-Corp/mokulearner-research/issues/new?template=new-contributor.yml) and fill out the form. A maintainer will review your registration and add your contributor slug to the registry.

You only do this once.

### Step 3: Fork the repository

1. Go to [github.com/Aina-Design-Corp/mokulearner-research](https://github.com/Aina-Design-Corp/mokulearner-research).
2. Click the **Fork** button at the top-right of the page.
3. GitHub creates a copy of the repository at `github.com/YOUR-USERNAME/mokulearner-research`. This is your fork.

### Step 4: Create your contribution folder and add your metadata.json

1. In your fork, click the **`contributions/`** folder.
2. Click **Add file → Create new file**.
3. In the filename box at the top, type the full path:
   ```
   your-slug/dataset-slug/metadata.json
   ```
   Replace `your-slug` with your registered contributor slug and `dataset-slug` with a short descriptive name for your dataset (e.g., `koolaupoko-soil-survey-2025`). GitHub creates the folders automatically when you type `/` in the filename.
4. In the large text box below, paste in your completed `metadata.json`. Start from the [template](../templates/metadata-template.json) and fill in each field.
5. Scroll down and click **Commit changes** (you can leave the commit message as-is or add a note).

### Step 5: Upload your data file

1. Navigate to `contributions/your-slug/dataset-slug/` in your fork.
2. Click **Add file → Upload files**.
3. Drag and drop (or browse for) your CSV or GeoJSON data file.
4. Click **Commit changes**.

### Step 6: Open a pull request

1. Go back to the **original** repository at [github.com/Aina-Design-Corp/mokulearner-research](https://github.com/Aina-Design-Corp/mokulearner-research).
2. GitHub will show a yellow banner that your fork has new commits — click **"Compare & pull request"**.
3. Fill in the PR template: add your contributor slug, dataset title, topics, record count, quality level, and moku districts covered.
4. Check off each item in the checklist.
5. Click **"Create pull request"**.

### Step 7: Automated validation

After you open the PR, GitHub Actions automatically validates your `metadata.json` and data file. Within a minute or two you'll see a green checkmark (passed) or a red X (errors found). If there are errors, the automated check posts a comment on your PR explaining what to fix.

**To fix a validation error:**
1. Go to your fork.
2. Navigate to the file with the error and click the pencil icon to edit it.
3. Make the correction and click **Commit changes**.
4. The PR updates automatically and validation re-runs.

### Step 8: Review and merge

A community maintainer reviews your contribution and either approves it or leaves feedback. Once approved, your data is merged into the main repository and enters the Mokunet provenance graph.

---

## Frequently Asked Questions

**Can I edit my files after opening a PR?**
Yes. Any changes you commit to your fork while the PR is open automatically appear in the PR. You don't need to close and re-open it.

**What if I make a mistake in my metadata?**
Edit the `metadata.json` in your fork (click the pencil icon), fix the error, and commit. The PR and automated checks update automatically.

**I uploaded the wrong data file. How do I replace it?**
Navigate to the file in your fork, click the pencil icon (for text files) or the "..." menu for other options, delete the old file if needed, then upload the correct one. Both operations appear as new commits in your fork and sync to your open PR.

**My PR has been open for a while with no response. What should I do?**
Post a comment on the PR asking for a review, or open a [discussion](https://github.com/Aina-Design-Corp/mokulearner-research/discussions).

**I need to add new records to a dataset I already contributed. Do I open a new PR?**
Yes — replace your data file with the updated version and open a new PR. The ingestion system uses MERGE operations, so existing records stay and new records are added. See [CONTRIBUTING.md](../CONTRIBUTING.md#updating-existing-contributions) for details.

---

## Getting Help

- [GitHub's own "Hello World" guide](https://docs.github.com/en/get-started/quickstart/hello-world) — 10-minute intro to GitHub concepts
- [Open a discussion](https://github.com/Aina-Design-Corp/mokulearner-research/discussions) — general questions about the Research Commons
- [Open an issue](https://github.com/Aina-Design-Corp/mokulearner-research/issues) — bug reports or requests

For the full contribution workflow, see [CONTRIBUTING.md](../CONTRIBUTING.md).
