# Git-Swift CLI Tool🚀

Git-Quick CLI is a powerful command-line tool that simplifies GitHub repository management. With just a few commands, you can authenticate, create repositories, push changes, clone repositories, delete repositories, and more — all directly from your terminal.

## Features ✨

🔑 Authenticate with GitHub using a Personal Access Token

📦 Create new repositories on GitHub instantly

🚀 Push existing local folders to GitHub easily

⚡ Quick add → commit → push workflow (quick-push)

📥 Clone repositories by name or URL

🗑️ Delete repositories safely

🔒 Supports private/public repos

🔄 Automatically handles branches (main / master)

---

## How to Use

### 1. Install the Tool

To install the package globally, run the following command:

````bash
npm install -g git-quick-cli
````

Verify installation:

```bash
git-quick --version
```

### 2. Commands & Usage 🛠️

Authenticate with GitHub

```bash
git-quick auth
```
Follow the instructions to generate and save your Personal Access Token.

--

Create a New Repository

```bash
git-quick create <repo-name> --private --description "My awesome repo"
```

Options:

--private → make repository private

--description <text> → add repository description

--

Push Existing Local Folder

```bash
git-quick push <repo-url> -b main
```
Automatically performs:

Initializes Git if not done already

Adds all files

Commits with "Initial commit"

Creates/switches to branch (main by default)

Sets remote origin

Pushes to GitHub

-

