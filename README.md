Git-Quick CLI 🚀

Git-Quick CLI is a powerful command-line tool that simplifies GitHub repository management. With just a few commands, you can authenticate, create repositories, push changes, clone repositories, delete repositories, and more — all directly from your terminal.

Features ✨

🔑 Authenticate with GitHub using a Personal Access Token

📦 Create new repositories on GitHub instantly

🚀 Push existing local folders to GitHub easily

⚡ Quick add → commit → push workflow (quick-push)

📥 Clone repositories by name or URL

🗑️ Delete repositories safely

🔒 Supports private/public repos

🔄 Automatically handles branches (main / master)

Installation 💻

Install globally via npm:

npm install -g git-quick-cli


Verify installation:

git-quick --version

Commands & Usage 🛠️
1️⃣ Authenticate with GitHub
git-quick auth


Follow the instructions to generate and save your Personal Access Token.

2️⃣ Create a New Repository
git-quick create <repo-name> --private --description "My awesome repo"


Options:

--private → make repository private

--description <text> → add repository description

3️⃣ Push Existing Local Folder
git-quick push <repo-url> -b main


Automatically performs:

Initializes Git if not done already

Adds all files

Commits with "Initial commit"

Creates/switches to branch (main by default)

Sets remote origin

Pushes to GitHub

4️⃣ Quick Add → Commit → Push
git-quick quick-push -m "my commit message"


Adds all changes

Commits with message (default: "add")

Pushes to current branch

5️⃣ Clone a Repository

By GitHub username:

git-quick clone <repo-name>


By direct URL:

git-quick clone-url <repo-url>

6️⃣ Delete a Repository
git-quick delete <repo-name>


⚠️ Warning: This is irreversible!

7️⃣ Check Login Status
git-quick status


Shows the currently logged-in GitHub username.

8️⃣ Logout
git-quick logout


Removes saved token and logs you out.

Why Git-Quick CLI? ⚡

Saves time on repetitive Git tasks

Handles GitHub authentication seamlessly

Automates branch creation and conflict handling

Perfect for developers who want fast GitHub workflow

Screenshots / Demo 📸

(Optional: add screenshots or animated GIFs of your CLI in action here)

Contributing 🤝

Contributions are welcome!

Fork the repository

Create a branch

git checkout -b feature-name


Commit changes

git commit -m "Add new feature"


Push branch

git push origin feature-name


Open a Pull Request

License 📄

MIT License © [Your Name]
