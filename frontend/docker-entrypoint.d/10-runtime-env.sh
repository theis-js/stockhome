#!/bin/sh
set -eu

VITE_BACKEND_URL_VALUE="${VITE_BACKEND_URL:-/backend}"

cat > /usr/share/nginx/html/env.js <<EOF
window.__ENV = {
  VITE_BACKEND_URL: "${VITE_BACKEND_URL_VALUE}"
};
EOF
