# Using Project-Local Maven Repository

By default, Maven stores dependencies in `~/.m2/repository` (system-wide). This project is configured to use a **local repository in the project directory** instead.

## Quick Start

### Option 1: Use the Wrapper Scripts (Recommended)

**Linux/Mac:**
```bash
./mvn-local.sh clean install
./mvn-local.sh spring-boot:run
```

**Windows:**
```cmd
mvn-local.bat clean install
mvn-local.bat spring-boot:run
```

### Option 2: Use Maven with Environment Variable

**Linux/Mac:**
```bash
# IMPORTANT: run this from inside kheyma_backend/
cd /path/to/Khemya/kheyma_backend
export MAVEN_OPTS="-Dmaven.repo.local=$(pwd)/repository"
mvn clean install
```

**Windows:**
```cmd
REM IMPORTANT: run this from inside kheyma_backend\
cd \path\to\Khemya\kheyma_backend
set MAVEN_OPTS=-Dmaven.repo.local=%CD%\repository
mvn clean install
```

### Option 3: Use Maven with Command-Line Flag

```bash
# IMPORTANT: run this from inside kheyma_backend/
cd /path/to/Khemya/kheyma_backend
mvn -Dmaven.repo.local=./repository clean install
```

## Benefits

- ✅ Dependencies stored in project directory (like `node_modules`)
- ✅ Easy to clean up: just delete the `repository/` folder
- ✅ Project is self-contained
- ✅ No conflicts with other projects

## Repository Location

Dependencies will be stored in:
```
kheyma_backend/repository/
```

This directory is automatically added to `.gitignore` and won't be committed to version control.

## Notes

- The first build will download all dependencies (this may take a few minutes)
- Subsequent builds will be faster as dependencies are cached locally
- The `repository/` directory can be safely deleted and recreated
- Each Maven module (kheyma-service, api-gateway, eureka-server) will share the same repository
