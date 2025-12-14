# Where Maven Stores Files - Explained

## Before the Fix

### 1. **Maven Dependencies (JAR files)** - System-Wide Location
**Location:** `~/.m2/repository` (your home directory)
**Full path:** `/home/youssefmohammed/.m2/repository`
**Size:** ~295 MB (currently)

These are the **downloaded dependency JAR files** that Maven fetches from remote repositories (Maven Central, etc.). This is Maven's default behavior - it stores ALL dependencies for ALL projects in this single location.

**Structure:**
```
~/.m2/repository/
├── org/
│   ├── springframework/          (220MB - largest)
│   ├── spring-boot/
│   └── ...
├── com/
│   ├── kheyma/                   (23MB)
│   └── ...
├── io/
│   ├── jsonwebtoken/             (20MB)
│   └── ...
└── net/                          (18MB)
```

**Why this is a problem:**
- ❌ Dependencies are stored outside your project
- ❌ Shared across ALL Maven projects on your system
- ❌ Hard to clean up project-specific dependencies
- ❌ Not portable (can't easily move project with dependencies)

### 2. **Build Outputs (Compiled Classes)** - Project-Local
**Location:** `kheyma_backend/*/target/` (within each module)
**Examples:**
- `kheyma_backend/kheyma-service/target/` (356KB)
- `kheyma_backend/eureka-server/target/` (32KB)
- `kheyma_backend/api-gateway/target/` (32KB)

These are the **compiled .class files and generated JARs** from building your code. These are always stored in the project (in `target/` directories).

**Structure:**
```
kheyma_backend/kheyma-service/target/
├── classes/                      (compiled .class files)
├── kheyma-service-1.0.0.jar     (final JAR file)
└── maven-status/                (build metadata)
```

## After the Fix

### 1. **Maven Dependencies** - Now Project-Local
**Location:** `kheyma_backend/repository/` (in your project directory)
**Size:** Will be similar (~295MB) after first build

Dependencies are now stored **inside your project directory**, similar to how `node_modules` works in Node.js projects.

**Benefits:**
- ✅ Dependencies are in your project
- ✅ Self-contained project (can move/delete easily)
- ✅ Easy to clean: just delete `repository/` folder
- ✅ No conflicts with other projects

### 2. **Build Outputs** - Still Project-Local (unchanged)
**Location:** Still `kheyma_backend/*/target/` (no change)

## Summary

| Type | Before Fix | After Fix |
|------|-----------|-----------|
| **Dependencies (JARs)** | `~/.m2/repository` (system-wide) | `kheyma_backend/repository/` (project-local) |
| **Build Outputs** | `kheyma_backend/*/target/` | `kheyma_backend/*/target/` (unchanged) |

## What You Can Clean Up

If you want to free up space from the old system-wide repository:

```bash
# Check size first
du -sh ~/.m2/repository

# WARNING: This will delete dependencies for ALL Maven projects on your system
# Only do this if you're sure you want to clean everything
rm -rf ~/.m2/repository
```

**Note:** After deleting `~/.m2/repository`, Maven will re-download dependencies when you build any Maven project. With our fix, new dependencies will go to `kheyma_backend/repository/` instead.

## Current Storage Locations

**System-wide (old location):**
- `/home/youssefmohammed/.m2/repository` - 295MB

**Project-local (new location):**
- `kheyma_backend/repository/` - Will be created on first build with wrapper scripts

**Build outputs (always project-local):**
- `kheyma_backend/kheyma-service/target/` - 356KB
- `kheyma_backend/eureka-server/target/` - 32KB
- `kheyma_backend/api-gateway/target/` - 32KB
