@echo off
REM Maven wrapper script for Windows that uses local repository in project directory

setlocal enabledelayedexpansion

set "SCRIPT_DIR=%~dp0"
set "LOCAL_REPO=%SCRIPT_DIR%repository"

REM Use local repository in project directory
set "MAVEN_OPTS=%MAVEN_OPTS% -Dmaven.repo.local=%LOCAL_REPO%"

REM Run Maven with all arguments passed to this script
mvn %*
