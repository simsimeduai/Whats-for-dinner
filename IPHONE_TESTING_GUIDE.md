# How to Test "What's for Dinner" on Your iPhone

You can test the mobile app on your iPhone in **two ways**. If you have never built an iPhone app before, start with **Option 1** (2 minutes, no Mac needed) or follow **Option 2** for the full native iOS app with Xcode.

---

## Option 1: Fastest Way (2 Minutes — No Mac or Xcode Needed)

Your app is now a **Progressive Web App (PWA)** that installs onto your iPhone Home Screen and works offline.

1. Once this branch is merged to `main`, GitHub Pages automatically builds and publishes your app to:
   `https://simsimeduai.github.io/Whats-for-dinner/`
2. Open that URL in **Safari** on your iPhone.
3. Tap the **Share** button (the square with an upward arrow at the bottom of Safari).
4. Scroll down and tap **Add to Home Screen** → **Add**.
5. Open **What's for Dinner** from your Home Screen — it launches full-screen like a native app and works offline!

*(Tip: You can also test locally on the same Wi-Fi without deploying by running `npm run dev` on any computer and opening the `Network: http://<your-ip>:5000` URL in iPhone Safari.)*

---

## Option 2: Full Native iOS App on Your iPhone (Requires a Mac, Free Apple ID)

You do **not** need a paid \$99 Apple Developer account to test on your own iPhone — any regular free Apple ID works.

### What You Need
- A **Mac** with **Xcode** installed (free from the Mac App Store — open Xcode once after installing so it finishes downloading iOS tools)
- **Node.js 20+** installed ([nodejs.org](https://nodejs.org/))
- Your **iPhone** + a USB cable

### Step-by-Step Instructions

#### 1. Get the Mobile Branch on Your Mac
Open **Terminal** on your Mac and run:

```bash
git clone https://github.com/simsimeduai/Whats-for-dinner.git
cd Whats-for-dinner
git checkout mobile-iphone-app
```

*(If you already have the folder cloned on your Mac, just run `cd Whats-for-dinner && git fetch && git checkout mobile-iphone-app`.)*

#### 2. Run the One-Command Setup Script
```bash
./scripts/setup-iphone.sh
```
This installs dependencies, builds the app, syncs all 10 native iOS plugins, and opens the project in **Xcode** automatically.

#### 3. Sign In with Your Free Apple ID in Xcode
1. In Xcode's left sidebar, click the blue **App** icon at the very top.
2. In the center pane, click the **Signing & Capabilities** tab.
3. Check **Automatically manage signing**.
4. Click **Team** → **Add an Account...** → sign in with your regular Apple ID → select **Your Name (Personal Team)**.
5. If Xcode says the Bundle Identifier is already taken, change `com.simsimeduai.whatsfordinner` to something unique like `com.yourname.whatsfordinner`.

#### 4. Enable Developer Mode on Your iPhone (One-Time)
1. Plug your iPhone into your Mac via USB and tap **Trust This Computer** on your iPhone.
2. On your iPhone, open **Settings → Privacy & Security → Developer Mode**, turn it **ON**, and restart your iPhone when prompted.

#### 5. Run on Your iPhone!
1. In Xcode's top toolbar, click the device selector next to **App** and pick **your iPhone** (or pick an **iPhone Simulator** if you want to preview on your Mac screen first!).
2. Click the **Play (▶)** button (or press `Cmd + R`).
3. **First launch trust step**: If iPhone says *"Untrusted Developer"*, go to **Settings → General → VPN & Device Management**, tap your Apple ID, and tap **Trust**.
4. Tap the **What's for Dinner** icon on your iPhone — you're running the full native iOS app with native Camera receipt scanning, Share Sheet, Calendar export, haptics, and offline storage!

---

## Making Changes Later
Whenever you edit HTML, CSS, or JS files, run:
```bash
npm run cap:sync
```
Then press **Play (▶)** in Xcode to update your iPhone.
