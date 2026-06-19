import { execSync } from "child_process";
import fs from "fs";
import path from "path";

// Helper to run shell commands with full stdio inheritance (enables interactive login/publish)
function runCommand(command) {
	try {
		execSync(command, { stdio: "inherit", shell: true });
		return true;
	} catch (error) {
		return false;
	}
}

// Helper to run commands and capture stdout
function captureCommand(command) {
	try {
		return execSync(command, { stdio: ["ignore", "pipe", "ignore"], encoding: "utf8", shell: true }).trim();
	} catch (error) {
		return null;
	}
}

// Bump the patch segment of a semver string (e.g. "1.0.2" → "1.0.3")
// This replaces `npm version patch` since pnpm has no equivalent subcommand.
function bumpPatch(version) {
	const parts = version.split(".").map(Number);
	if (parts.length !== 3 || parts.some(isNaN)) {
		throw new Error(`Invalid semver: "${version}"`);
	}
	parts[2] += 1;
	return parts.join(".");
}

const pkgPath = path.resolve(process.cwd(), "package.json");

if (!fs.existsSync(pkgPath)) {
	console.error("❌ package.json not found in the current working directory.");
	process.exit(1);
}

// 1. Read package.json metadata
const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const packageName = pkg.name;
const currentVersion = pkg.version;

console.log("================================================");
console.log(`📦 Package: ${packageName}`);
console.log(`🏷️  Current Version: ${currentVersion}`);
console.log("================================================\n");

// 2. Check pnpm login status
console.log("🔄 Checking pnpm login status...");
const username = captureCommand("pnpm whoami");

if (username) {
	console.log(`✅ Already logged in as: ${username}\n`);
} else {
	console.log("⚠️  Not logged in to npm registry. Starting login process...\n");
	const loginSuccess = runCommand("pnpm login");
	if (!loginSuccess) {
		console.error("❌ Login failed or was aborted. Exiting.");
		process.exit(1);
	}
	console.log("✅ Login successful!\n");
}

// 3. Check if current version is already published
console.log(`🔄 Checking if version ${currentVersion} is already published...`);
const versionsRaw = captureCommand(`pnpm view ${packageName} versions --json`);

let publishedVersions = [];
if (versionsRaw) {
	try {
		const parsed = JSON.parse(versionsRaw);
		publishedVersions = Array.isArray(parsed) ? parsed : [parsed];
	} catch (e) {
		// If it's a single version string not parsed as array
		if (versionsRaw.trim()) {
			publishedVersions = [versionsRaw.replace(/"/g, "").trim()];
		}
	}
}

let publishVersion = currentVersion;
if (publishedVersions.includes(currentVersion)) {
	console.log(
		`⚠️  Version ${currentVersion} is already published on the npm registry.`,
	);
	console.log("🔄 Bumping patch version in package.json...");

	// Bump patch version directly in package.json (pure JS — no npm/pnpm version command needed)
	try {
		publishVersion = bumpPatch(currentVersion);
		pkg.version = publishVersion;
		fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 4) + "\n", "utf8");
		console.log(`✅ Version bumped to: ${publishVersion}\n`);
	} catch (err) {
		console.error(`❌ Failed to bump version: ${err.message}`);
		process.exit(1);
	}
} else {
	console.log(
		`✅ Version ${currentVersion} is available to publish (no bump needed).\n`,
	);
}

// 4. Run pnpm publish
// --no-git-checks skips the "working tree is dirty" guard, which would otherwise
// block publishing when package.json has an uncommitted version bump.
console.log("🚀 Initiating build and publish process...");

// Choose proper command based on scoped package vs unscoped package
const isScoped = packageName.startsWith("@");
const publishCommand = isScoped
	? "pnpm publish --access public --no-git-checks"
	: "pnpm publish --no-git-checks";

const publishSuccess = runCommand(publishCommand);

if (publishSuccess) {
	console.log(
		`\n🎉 Successfully published ${packageName}@${publishVersion} to npm!`,
	);

	// 5. Commit the version bump and create a git tag for traceability
	console.log(`\n🔄 Committing version bump and tagging v${publishVersion}...`);
	const commitSuccess =
		runCommand(`git add package.json`) &&
		runCommand(`git commit -m "chore: release v${publishVersion}"`) &&
		runCommand(`git tag v${publishVersion}`) &&
		runCommand(`git push && git push --tags`);

	if (commitSuccess) {
		console.log(`✅ Git commit and tag v${publishVersion} pushed successfully!`);
	} else {
		console.warn(
			"⚠️  Publish succeeded but git commit/tag/push failed. You may need to commit and push manually.",
		);
	}
} else {
	console.error(
		"\n❌ Publish failed. Please check the logs above for details.",
	);
	process.exit(1);
}
