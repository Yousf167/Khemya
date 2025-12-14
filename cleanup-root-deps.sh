#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Cleanup script for dependencies accidentally created under filesystem root (/).

This typically happens if you:
- ran Maven/NPM from "/" (so relative paths resolve into /)
- ran Maven/NPM with sudo (so caches go under /root)

Usage:
  ./cleanup-root-deps.sh                 # report only (no changes)
  ./cleanup-root-deps.sh --delete        # interactively delete found paths
  ./cleanup-root-deps.sh --delete --yes  # delete without prompts

Notes:
- To remove anything under /root, run with sudo:
    sudo ./cleanup-root-deps.sh --delete
EOF
}

DO_DELETE=0
ASSUME_YES=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --delete)
      DO_DELETE=1
      shift
      ;;
    --yes|-y)
      ASSUME_YES=1
      shift
      ;;
    --help|-h)
      usage
      exit 0
      ;;
    *)
      echo "Unknown arg: $1" >&2
      usage >&2
      exit 2
      ;;
  esac
done

# Common "oops" paths when dependency managers are run from / or as root.
CANDIDATES=(
  "/repository"
  "/package-lock.json"
  "/package.json"
  "/node_modules"
  "/root/.m2/repository"
  "/root/.m2/wrapper"
  "/root/.npm"
  "/root/.cache/npm"
  "/root/.cache/maven"
  "/root/.cache/node-gyp"
)

have_any=0

echo "Scanning for stray dependency directories/files under / ..."
for p in "${CANDIDATES[@]}"; do
  if [[ -e "$p" ]]; then
    have_any=1
    echo "FOUND: $p"
    # Try to print size if we can.
    if command -v du >/dev/null 2>&1; then
      if du -sh "$p" >/dev/null 2>&1; then
        du -sh "$p" | sed 's/^/  size: /'
      else
        echo "  size: (run with sudo to inspect)"
      fi
    fi
  fi
done

if [[ $have_any -eq 0 ]]; then
  echo "No matching stray paths found (at least from the common list)."
  echo "If you still suspect files under /root, rerun with: sudo $0"
  exit 0
fi

echo ""
if [[ $DO_DELETE -eq 0 ]]; then
  echo "Report-only mode. Re-run with --delete to remove the paths above."
  exit 0
fi

if [[ $EUID -ne 0 ]]; then
  echo "WARNING: You are not root. Deletes under /root will fail."
  echo "Re-run with: sudo $0 --delete"
  echo ""
fi

for p in "${CANDIDATES[@]}"; do
  [[ -e "$p" ]] || continue

  if [[ $ASSUME_YES -eq 0 ]]; then
    read -r -p "Delete '$p'? [y/N] " ans
    case "$ans" in
      y|Y|yes|YES) ;;
      *)
        echo "Skipping: $p"
        continue
        ;;
    esac
  fi

  echo "Deleting: $p"
  if [[ -d "$p" ]]; then
    rm -rf --one-file-system "$p"
  else
    rm -f "$p"
  fi
done

echo "Done."
