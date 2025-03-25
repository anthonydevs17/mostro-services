import { readFileSync, writeFileSync, readdirSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const rootDir = join(__dirname, "..");

// Read the versions file
const versions = JSON.parse(
  readFileSync(join(rootDir, "versions.json"), "utf8")
);

// Function to update package.json
function updatePackageJson(packagePath) {
  const packageJsonPath = join(packagePath, "package.json");
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

  let modified = false;

  // Update dependencies
  if (packageJson.dependencies) {
    for (const [dep, version] of Object.entries(packageJson.dependencies)) {
      if (version.startsWith("workspace:") && versions.packages[dep]) {
        packageJson.dependencies[dep] = versions.packages[dep];
        modified = true;
      }
    }
  }

  // Update devDependencies
  if (packageJson.devDependencies) {
    for (const [dep, version] of Object.entries(packageJson.devDependencies)) {
      if (version.startsWith("workspace:") && versions.packages[dep]) {
        packageJson.devDependencies[dep] = versions.packages[dep];
        modified = true;
      }
    }
  }

  if (modified) {
    writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + "\n");
    console.log(`Updated versions in ${packageJsonPath}`);
  }
}

// Function to recursively find all package.json files in a directory
function findPackageJsonFiles(dir) {
  const files = readdirSync(dir);
  const packageJsonFiles = [];

  for (const file of files) {
    const fullPath = join(dir, file);
    if (file === "package.json") {
      packageJsonFiles.push(dir);
    } else {
      try {
        const stat = readdirSync(fullPath);
        if (stat) {
          packageJsonFiles.push(...findPackageJsonFiles(fullPath));
        }
      } catch (error) {
        // Skip if not a directory
      }
    }
  }

  return packageJsonFiles;
}

// Update all package.json files in the workspace
function updateWorkspaceVersions() {
  const packagesDir = join(rootDir, "src", "packages");
  const packageJsonDirs = findPackageJsonFiles(packagesDir);

  for (const packageDir of packageJsonDirs) {
    updatePackageJson(packageDir);
  }
}

updateWorkspaceVersions();
