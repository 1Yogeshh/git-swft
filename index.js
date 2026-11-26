#!/usr/bin/env node
const fs = require("fs");
const { Command } = require("commander");
const inquirer = require("inquirer");
const chalk = require("chalk");
const fetch = require("node-fetch");
const { saveToken, getToken, Logout } = require("./utils/config");
const simpleGit = require("simple-git");
const path = require("path");
const { exec } = require("child_process");
const pkg = require("./package.json");

const program = new Command();


program
  .name("swft")
  .description("A custom CLI to manage GitHub repos from terminal")
  .version(pkg.version);

// Auth Command
program
  .command("auth")
  .description("Authenticate with GitHub using a personal access token")
  .action(async () => {
    console.log(chalk.blue("\n🔑 GitHub Authentication Guide\n"));
    console.log(
      "1. Open: " + chalk.yellow("https://github.com/settings/tokens")
    );
    console.log("2. Click on " + chalk.cyan("'Generate new token (classic)'"));
    console.log("3. Give it a name (e.g. 'swft').");
    console.log("4. Select these required scopes:\n");
    console.log(
      "   - " +
        chalk.green("repo") +
        " (Full control of private and public repositories)"
    );
    console.log(
      "   - " + chalk.green("delete_repo") + " (To allow deleting repositories)"
    );
    console.log(
      "   - " + chalk.green("read:user") + " (To read your GitHub profile)"
    );
    console.log(
      "\n⚠️ Copy the token and keep it safe, you won’t see it again!"
    );
    console.log(
      "-----------------------------------------------------------\n"
    );
    const { token } = await inquirer.prompt([
      {
        type: "password",
        name: "token",
        message: "Enter your GitHub Personal Access Token:",
        mask: "*",
      },
    ]);
    await saveToken(token);
  });

// Logout Command
program
  .command("logout")
  .description("Logout from GitHub (remove saved token)")
  .action(() => {
    Logout();
  });

// Check status command
program
  .command("status")
  .description("Check if user is logged in")
  .action(async () => {
    const token = getToken();
    if (!token) {
      console.log(chalk.red("❌ You are not logged in. Run `swft auth`."));
      return;
    }

    try {
      const res = await fetch("https://api.github.com/user", {
        headers: { Authorization: `token ${token}` },
      });

      if (res.status === 200) {
        const data = await res.json();
        console.log(chalk.green(`✅ Logged in as ${data.login}`));
      } else {
        console.log(
          chalk.red("❌ Invalid or expired token. Please re-authenticate.")
        );
      }
    } catch (err) {
      console.error(chalk.red("⚠️ Error checking login status"), err);
    }
  });

// 🔹 Repo Create Command
program
  .command("create <name>")
  .option("-p, --private", "Make repository private")
  .option("-d, --description <description>", "Repository description")
  .description("Create a new GitHub repository")
  .action(async (name, options) => {
    const token = getToken();

    if (!token) {
      console.log(
        chalk.red("❌ You must be logged in! Run `swft auth` first.")
      );
      return;
    }

    try {
      // Repo create request
      const res = await fetch("https://api.github.com/user/repos", {
        method: "POST",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          private: !!options.private,
          description: options.description || "",
        }),
      });

      if (res.status === 201) {
        const data = await res.json();
        console.log(chalk.green(`✅ Repo created: ${data.html_url}`));
      } else {
        const errData = await res.json();
        console.log(
          chalk.red("❌ Failed to create repo:"),
          errData.message || res.statusText
        );
      }
    } catch (err) {
      console.error(chalk.red("⚠️ Error creating repo"), err);
    }
  });

// Repo Create and push command
program
  .command("create-push <name>")
  .option("-p, --private", "Make repository private")
  .option("-d, --description <description>", "Repository description")
  .description(
    "Create a new GitHub repository and push current folder automatically"
  )
  .action(async (name, options) => {
    const token = getToken();

    if (!token) {
      console.log(
        chalk.red("❌ You must be logged in! Run `swft auth` first.")
      );
      return;
    }

    try {
      // 1️⃣ Create Repo
      const res = await fetch("https://api.github.com/user/repos", {
        method: "POST",
        headers: {
          Authorization: `token ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          private: !!options.private,
          description: options.description || "",
        }),
      });

      if (res.status === 201) {
        const data = await res.json();
        console.log(chalk.green(`✅ Repo created: ${data.html_url}`));

        // 2️⃣ Automatically push current folder to the new repo
        const git = simpleGit(process.cwd());
        const branch = "main"; // default branch

        // Init git if not exists
        if (!fs.existsSync(path.join(process.cwd(), ".git"))) {
          await git.init();
          console.log(chalk.green("✅ Git initialized"));
        }

        // Checkout branch
        const currentBranchSummary = await git.branchLocal();
        if (!currentBranchSummary.all.includes(branch)) {
          await git.checkoutLocalBranch(branch);
        } else {
          await git.checkout(branch);
        }

        // Add, commit, and push
        await git.add(".");
        const status = await git.status();
        if (status.staged.length > 0) {
          await git.commit("Initial commit");
        }

        await git.addRemote("origin", data.clone_url).catch(async (err) => {
          if (err.message.includes("remote origin already exists")) {
            await git.remote(["set-url", "origin", data.clone_url]);
          } else throw err;
        });

        await git.push(["-u", "origin", branch]);
        console.log(chalk.green(`✅ Pushed to ${branch} successfully!`));
      } else {
        const errData = await res.json();
        console.log(
          chalk.red("❌ Failed to create repo:"),
          errData.message || res.statusText
        );
      }
    } catch (err) {
      console.error(chalk.red("⚠️ Error creating repo"), err);
    }
  });

// Initial Push Command
program
  .command("init-push <repoUrl>")
  .description(
    "Initialize current folder, link to an existing GitHub repo, and push"
  )
  .option("-b, --branch <branch>", "Branch name to push", "main")
  .action(async (repoUrl, options) => {
    const cwd = process.cwd();
    const branch = options.branch;
    const git = simpleGit(cwd);

    try {
      console.log("1️⃣ Initializing Git...");
      if (!fs.existsSync(path.join(cwd, ".git"))) {
        await git.init();
        console.log(chalk.green("✅ Git initialized"));
      } else {
        console.log(chalk.yellow("⚠️ Git already initialized"));
      }

      // Ensure we are on the correct branch
      const currentBranchSummary = await git.branchLocal();
      if (!currentBranchSummary.all.includes(branch)) {
        console.log(`2️⃣ Creating and switching to branch '${branch}'...`);
        await git.checkoutLocalBranch(branch);
      } else {
        console.log(`2️⃣ Switching to existing branch '${branch}'...`);
        await git.checkout(branch);
      }

      console.log("3️⃣ Adding all files...");
      await git.add(".");

      // Commit only if there are staged changes
      const status = await git.status();
      if (status.staged.length > 0) {
        console.log("4️⃣ Committing files...");
        await git.commit("Initial commit");
        console.log(chalk.green("✅ Files committed"));
      } else {
        console.log(chalk.yellow("⚠️ Nothing to commit"));
      }

      console.log("5️⃣ Adding remote repository...");
      await git.addRemote("origin", repoUrl).catch(async (err) => {
        if (err.message.includes("remote origin already exists")) {
          await git.remote(["set-url", "origin", repoUrl]);
        } else throw err;
      });
      console.log(chalk.green(`✅ Remote 'origin' set to ${repoUrl}`));

      console.log(`6️⃣ Pushing to GitHub on branch '${branch}'...`);
      await git.push(["-u", "origin", branch]);
      console.log(chalk.green(`✅ Pushed to ${branch} branch successfully!`));
    } catch (err) {
      console.error(
        chalk.red("❌ Failed to push to GitHub"),
        err.message || err
      );
    }
  });

// 🔹 Delete Repo Command
program
  .command("delete <name>")
  .description("Delete a GitHub repository")
  .action(async (name) => {
    const token = getToken();
    if (!token) {
      console.log(chalk.red("❌ You are not logged in. Run `swft auth`."));
      return;
    }

    try {
      // Get username (OWNER)
      const userRes = await fetch("https://api.github.com/user", {
        headers: { Authorization: `token ${token}` },
      });
      const userData = await userRes.json();
      const owner = userData.login;

      console.log(chalk.yellow(`⚠️ Deleting repo: ${owner}/${name}...`));

      const res = await fetch(`https://api.github.com/repos/${owner}/${name}`, {
        method: "DELETE",
        headers: {
          Authorization: `token ${token}`,
          Accept: "application/vnd.github.v3+json",
        },
      });

      if (res.status === 204) {
        console.log(
          chalk.green(`✅ Repository ${owner}/${name} deleted successfully`)
        );
      } else {
        const errorText = await res.text();
        console.log(chalk.red(`❌ Failed to delete repo: ${res.status}`));
        console.log(chalk.gray(errorText));
      }
    } catch (err) {
      console.error(chalk.red("⚠️ Error deleting repo"), err);
    }
  });

// List all repos
program
  .command("list")
  .description("List all your GitHub repositories")
  .action(async () => {
    const token = getToken();
    if (!token) {
      console.log(chalk.red("❌ You are not logged in. Run `swft auth`."));
      return;
    }

    try {
      const res = await fetch("https://api.github.com/user/repos", {
        headers: { Authorization: `token ${token}` },
      });

      if (res.status === 200) {
        const repos = await res.json();
        if (repos.length === 0) {
          console.log(chalk.yellow("No repositories found."));
        } else {
          console.log(chalk.green("Your Repositories:"));
          repos.forEach((repo) => {
            console.log(`- ${repo.name} (${repo.html_url})`);
          });
        }
      } else {
        const errData = await res.json();
        console.log(
          chalk.red("❌ Failed to fetch repositories:"),
          errData.message || res.statusText
        );
      }
    } catch (err) {
      console.error(chalk.red("⚠️ Error fetching repositories"), err);
    }
  });

// Clone a repo by name
program
  .command("clone <repoName>")
  .description("Clone one of your GitHub repositories")
  .option("-d, --dir <directory>", "Directory to clone into", ".")
  .action(async (repoName, options) => {
    const token = await getToken();
    if (!token) {
      console.log(
        chalk.red("❌ You must be logged in! Run `swft auth` first.")
      );
      return;
    }

    try {
      // Get username
      const resUser = await fetch("https://api.github.com/user", {
        headers: { Authorization: `token ${token}` },
      });
      const userData = await resUser.json();
      const username = userData.login;

      // Construct repo HTTPS URL with token
      const repoUrl = `https://${token}@github.com/${username}/${repoName}.git`;

      // Clone into target directory
      const targetDir = path.resolve(options.dir);
      const git = simpleGit();
      await git.clone(repoUrl, path.join(targetDir, repoName));

      console.log(
        chalk.green(`✅ Repo cloned into ${path.join(targetDir, repoName)}`)
      );
    } catch (err) {
      console.error(chalk.red("❌ Failed to clone repo"), err.message || err);
    }
  });

// Clone a repo by URL
program
  .command("clone-url <repoUrl>")
  .description("Clone a repo by URL into current directory and run npm install")
  .action((repoUrl) => {
    const cwd = process.cwd();
    const repoName = path.basename(repoUrl, ".git");

    console.log(chalk.cyan(`📥 Cloning ${repoUrl} into ${cwd}...`));

    exec(`git clone ${repoUrl}`, (err, stdout, stderr) => {
      if (err) {
        console.error(chalk.red("❌ Failed to clone repo"), stderr);
        return;
      }

      console.log(
        chalk.green(`✅ Repo cloned into ${path.join(cwd, repoName)}`)
      );

      // Check if package.json exists
      const pkgPath = path.join(cwd, repoName, "package.json");
      if (fs.existsSync(pkgPath)) {
        console.log(chalk.cyan("📦 Installing npm dependencies..."));

        exec(`cd ${repoName} && npm install`, (err2, out, errOut) => {
          if (err2) {
            console.error(chalk.red("❌ npm install failed"), errOut);
            return;
          }
          console.log(chalk.green("✅ npm install completed successfully"));
        });
      } else {
        console.log(
          chalk.yellow("⚠️ No package.json found, skipping npm install")
        );
      }
    });
  });

// Quick push command
program
  .command("push [message]")
  .description("Add, commit, and push changes on the current branch")
  .action(async (message = "add") => {
    const cwd = process.cwd();
    const git = simpleGit(cwd);
    const commitMsg = message;

    try {
      console.log("1️⃣ Adding all changes...");
      await git.add(".");

      const status = await git.status();
      if (status.staged.length === 0) {
        console.log(chalk.yellow("⚠️ No changes to commit."));
        return;
      }

      console.log(`2️⃣ Committing with message: "${commitMsg}"...`);
      await git.commit(commitMsg);
      console.log(chalk.green("✅ Changes committed"));

      console.log("3️⃣ Pushing to remote...");
      await git.push();
      console.log(chalk.green("✅ Changes pushed successfully!"));
    } catch (err) {
      console.error(chalk.red("❌ Failed to push changes"), err.message || err);
    }
  });

program.parse();
