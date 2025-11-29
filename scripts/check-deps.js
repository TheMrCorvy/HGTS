#!/usr/bin/env node

/**
 * Script to verify that HGTS maintains zero runtime dependencies
 * Run this before publishing to ensure no dependencies were accidentally added
 */

const fs = require("fs");
const path = require("path");

const packageJsonPath = path.join(__dirname, "..", "package.json");
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

console.log("🔍 Checking HGTS dependencies...\n");

// Check for runtime dependencies
const dependencies = packageJson.dependencies || {};
const dependencyCount = Object.keys(dependencies).length;

if (dependencyCount > 0) {
  console.error("❌ ERROR: Found runtime dependencies!");
  console.error("HGTS should have ZERO runtime dependencies.\n");
  console.error("Dependencies found:");
  Object.keys(dependencies).forEach((dep) => {
    console.error(`  - ${dep}: ${dependencies[dep]}`);
  });
  process.exit(1);
}

console.log("✅ No runtime dependencies - Perfect!");

// Check peer dependencies
const peerDependencies = packageJson.peerDependencies || {};
const peerDependenciesMeta = packageJson.peerDependenciesMeta || {};

console.log("\n📦 Peer Dependencies:");
Object.keys(peerDependencies).forEach((dep) => {
  const isOptional = peerDependenciesMeta[dep]?.optional;
  console.log(
    `  ${isOptional ? "(optional)" : "(required)"} ${dep}: ${
      peerDependencies[dep]
    }`
  );
});

// Verify React is optional
if (peerDependencies.react && !peerDependenciesMeta.react?.optional) {
  console.error("\n❌ ERROR: React should be an optional peer dependency!");
  process.exit(1);
}

console.log("\n✅ All peer dependencies are correctly configured!");

// Check dev dependencies
const devDependencies = packageJson.devDependencies || {};
console.log(`\n🛠️  Dev Dependencies: ${Object.keys(devDependencies).length}`);
Object.keys(devDependencies).forEach((dep) => {
  console.log(`  - ${dep}`);
});

console.log("\n🎉 All dependency checks passed!\n");
