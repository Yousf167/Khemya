#!/bin/bash
# Maven wrapper script that uses local repository in project directory

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOCAL_REPO="${SCRIPT_DIR}/repository"

# Use local repository in project directory
export MAVEN_OPTS="${MAVEN_OPTS} -Dmaven.repo.local=${LOCAL_REPO}"

# Run Maven with all arguments passed to this script
mvn "$@"
