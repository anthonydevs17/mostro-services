#!/bin/bash

# Configuration
MASTRA_REPO_PATH="../mastra"
PACKAGES_DIR="src/packages"

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to print colored messages
print_message() {
    echo -e "${2}${1}${NC}"
}

# Function to update a specific package
update_package() {
    local package_name=$1
    local source_path=$2
    local target_path="${PACKAGES_DIR}/${package_name}"
    
    print_message "Updating package: ${package_name}" "${YELLOW}"
    
    # Check if source exists
    if [ ! -d "${MASTRA_REPO_PATH}/${source_path}" ]; then
        print_message "Error: Source path ${source_path} not found in Mastra repository" "${RED}"
        return 1
    fi
    
    # Check if target exists
    if [ ! -d "${target_path}" ]; then
        print_message "Creating new package: ${package_name}" "${YELLOW}"
        mkdir -p "${target_path}"
    fi
    
    # Copy files
    cp -r "${MASTRA_REPO_PATH}/${source_path}/"* "${target_path}/"
    print_message "✓ Package ${package_name} updated successfully" "${GREEN}"
}

# Main script
print_message "Starting package update process..." "${YELLOW}"

# Check if Mastra repository exists
if [ ! -d "${MASTRA_REPO_PATH}" ]; then
    print_message "Error: Mastra repository not found at ${MASTRA_REPO_PATH}" "${RED}"
    print_message "Please make sure you have cloned the Mastra repository to ../mastra" "${RED}"
    exit 1
fi

# Update Mastra repository
print_message "Updating Mastra repository..." "${YELLOW}"
cd "${MASTRA_REPO_PATH}"
git pull
cd - > /dev/null

# Update packages
# Format: update_package "package_name" "source_path"
update_package "playground" "packages/cli/src/playground"
update_package "deployers/vercel" "deployers/vercel"

print_message "Update process completed!" "${GREEN}" 