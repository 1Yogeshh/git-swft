# Git-Swft( Smart Workflow For Teams ) CLI Tool🚀

Git-Quick CLI is a powerful command-line tool that simplifies GitHub repository management. With just a few commands, you can authenticate, create repositories, push changes, clone repositories, delete repositories, and more — all directly from your terminal.

## Features ✨

🔑 Authenticate with GitHub using a Personal Access Token

📦 Create new repositories on GitHub instantly

🚀 Push existing local folders to GitHub easily

⚡ Quick add → commit → push workflswft-push)

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

### Commands & Usage 🛠️

### 1️⃣ Authenticate with GitHub

```bash
swft auth
```

Follow the instructions to generate and save your Personal Access Token.

### 2️⃣ Create a New Repository

```bash
swft create <repo-name> --private --description "My awesome repo"
```

Options:

--private → make repository private

--description <text> → add repository description

### 3️⃣ Push Existing Local Folder

```bash
swft push <repo-url> -b main
```

Automatically performs:

Initializes Git if not done already

Adds all files

Commits with "Initial commit"

Creates/switches to branch (main by default)

Sets remote origin

Pushes to GitHub

### 4️⃣ Quick Add → Commit → Push

```bash
swft-push "my commit message"
```

Adds all changes

Commits with message (default: "add")

Pushes to current branch

### 5️⃣ Clone a Repository

By GitHub username:

```bash
swft clone <repo-name>
```

By direct URL:

```bash
swft clone-url <repo-url>
```

### 6️⃣ Delete a Repository

```bash
swft delete <repo-name>
```

⚠️ Warning: This is irreversible!

### ️7️⃣ Check Login Status

```bash
swft status
```

Shows the currently logged-in GitHub username.

### 8️⃣ Logout

```bash
swft logout
```

Removes saved token and logs you out.

### Why Git-Quick CLI? ⚡

- Saves time on repetitive Git tasks

- Handles GitHub authentication seamlessly

- Automates branch creation and conflict handling

- Perfect for developers who want fast GitHub workflow

### Contributing 🤝

Contributions are welcome!

1. Fork the repository

2. Create a branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Add new feature"
```

4. Push branch

```bash
git push origin feature-name
```

5. Open a Pull Request
