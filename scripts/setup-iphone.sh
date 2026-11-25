#!/usr/bin/env bash
set -euo pipefail

echo "🍽️  What's for Dinner — iPhone Local Setup"
echo "============================================"

if [[ "$(uname)" != "Darwin" ]]; then
  echo "⚠️  Building a native iOS app with Xcode requires a Mac (macOS)."
  echo "💡 Tip: Without a Mac, you can still install the app on your iPhone right now"
  echo "   using Safari -> Share -> Add to Home Screen (see IPHONE_TESTING_GUIDE.md)."
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js is not installed. Please install Node.js 20+ from https://nodejs.org/"
  exit 1
fi

if ! command -v xcodebuild >/dev/null 2>&1; then
  echo "❌ Xcode is not installed. Please install Xcode (free) from the Mac App Store,"
  echo "   open it once to finish setup, then re-run this script."
  exit 1
fi

echo "📦 Step 1/3: Installing dependencies..."
npm install

echo "🔨 Step 2/3: Building web bundle & syncing iOS native project..."
npm run cap:sync

echo "🚀 Step 3/3: Opening iOS project in Xcode..."
echo ""
echo "Next steps inside Xcode:"
echo "  1. Click 'App' in the left sidebar -> 'Signing & Capabilities'"
echo "  2. Under Team, sign in with your free Apple ID and select your Personal Team"
echo "  3. Plug your iPhone into your Mac via USB and select your iPhone in the top bar"
echo "  4. Click the Play (▶) button to install and launch on your iPhone!"
echo ""
npx cap open ios
