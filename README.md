# Git-Swft 🚀  
*Smart Workflow For Teams — Simplify GitHub repository management from your terminal*

[![npm version](https://img.shields.io/npm/v/swft?color=blue)](https://www.npmjs.com/package/swft)
[![npm downloads](https://img.shields.io/npm/dt/swft?color=green)](https://www.npmjs.com/package/swft)
[![License](https://img.shields.io/badge/license-MIT-yellow)](LICENSE)

## Features ✨

🔑 Authenticate with GitHub using a Personal Access Token

📦 Create new repositories on GitHub instantly

🚀 Push existing local folders to GitHub easily

⚡ Quick add → commit → push

📥 Clone repositories by name or URL

🗑️ Delete repositories safely

🔒 Supports private/public repos

🔄 Automatically handles branches (main / master)

---

## How to Use

### Install the Tool

To install the package globally, run the following command:

```bash
npm install -g swft
```

Verify installation:

```bash
swft --version
```
### Commands

| Command                   | Description                                            |
| ------------------------- | ------------------------------------------------------ |
| `swft auth`               | Authenticate with GitHub using a personal access token |
| `swft create <repo>`      | Create a new GitHub repository (remote only)           |
| `swft create-push <repo>` | Create repo locally + push to GitHub                   |
| `swft init-push <url>`    | Push an existing local folder to GitHub                |
| `swft push "msg"`         | Quick add → commit → push                              |
| `swft clone <repo>`       | Clone by repo name                                     |
| `swft clone-url <url>`    | Clone by URL                                           |
| `swft delete <repo>`      | Delete repository (⚠ irreversible)                     |
| `swft status`             | Check login status                                     |
| `swft logout`             | Logout and remove token                                |


### 🚀 Usage Guide

### 1️⃣ Authenticate with GitHub

```bash
swft auth
```

Steps:

1. Open: https://github.com/settings/tokens

2. Click "Generate new token (classic)"

3. Give it a name (e.g. git-create-cli)

4. Select scopes:

   repo → full control of private and public repositories

   delete_repo → to allow deleting repositories

   read:user → to read your GitHub profile

5. Copy the token (⚠️ you won’t see it again).

### 2️⃣ Create a New Repository (Remote Only)

```bash
swft create <repo-name> --private --description "My awesome repo"
```

Options:

--private → make repository private

--description <text> → add repository description

### 3️⃣ Create & Push a Repository (Local + Remote)

```bash
swft create-push <repo-name> --private --description "My awesome repo"
```

Options:

--private → make repository private

--description <text> → add repository description

### 4️⃣ Push Existing Local Folder

```bash
swft init-push <repo-url> -b main
```

Automatically performs:

Initializes Git (if not already)

Adds all files

Commits with "Initial commit"

Creates/switches to branch (main by default)

Sets remote origin

Pushes to GitHub

### 5️⃣ Quick Add → Commit → Push

```bash
swft push "my commit message"
```

Adds all changes

Commits with message (default: "add")

Pushes to current branch

### 6️⃣ Clone a Repository

By GitHub username:

```bash
swft clone <repo-name>
```

By direct URL:

```bash
swft clone-url <repo-url>
```

### 7️⃣ Delete a Repository

```bash
swft delete <repo-name>
```

⚠️ Warning: This is irreversible!

### 8️⃣ Status & Logout

```bash
swft status  # Shows logged-in GitHub username

swft logout # Removes saved token and logs you out
```

Removes saved token and logs you out.

### Why Git-Swft CLI? ⚡

- Saves time on repetitive Git tasks

- Handles GitHub authentication seamlessly

- Automates branch creation and conflict handling

- Perfect for developers who want fast GitHub workflow

### Example Workflow

```bash
# Authenticate once
swft auth

# Create and push a new repo
swft create-push my-app --private --description "Cool app repo"

# Push updates
swft push "added login feature"

# Clone another repo
swft clone-url https://github.com/user/another-repo.git
```

