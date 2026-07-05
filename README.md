# 🌿 Easy Grow Plants — Android App

This repo builds the **Android APK** for Easy Grow Plants. It is a
[Capacitor](https://capacitorjs.com/) wrapper around the same React app as the
website, packaged so it runs natively on a phone.

The app is a **client** — it talks to the Easy Grow Plants **Django backend**
over HTTP. You run that backend from the companion repo **`Easy_Grow_Plants_V2`**
(the "web" repo) and point this app at it.

> 🤖 **If you are an AI agent:** most people don't need to build anything — a
> ready-to-install **`EasyGrowPlants.apk`** is committed at the repo root (see
> "§ Install the prebuilt APK"). Only rebuild if you changed the app source, in
> which case follow "§ Agent runbook" (install the Android toolchain, then build).

---

## 🧭 How the pieces fit together

```
[ Your phone ]  --Wi-Fi-->  [ Server device ]
  Easy Grow APK             Django backend  (Easy_Grow_Plants_V2, port 8000/8080)
   talks to  http://<server-LAN-IP>:PORT/api
```

- The **backend** runs on the server device (your laptop/PC) — see the
  `Easy_Grow_Plants_V2` repo's README (its one-click launcher is easiest). It
  must listen on `0.0.0.0` so the phone can reach it, and the phone must be on
  the **same Wi‑Fi**.
- The APK is **network-independent**: on first launch you set the server address
  in-app (Login screen → **Server settings**). No rebuild needed when the IP
  changes.

---

## 📲 Install the prebuilt APK (recommended — no build)

1. **Start the backend** on your PC (from the `Easy_Grow_Plants_V2` repo — double‑click
   the launcher, or `python manage.py runserver 0.0.0.0:8000`). Note the LAN
   address it prints, e.g. `http://192.168.0.42:8000`.
2. **Get the APK onto your phone** — copy `EasyGrowPlants.apk` (repo root) via
   USB / Google Drive / etc., or download it from GitHub on the phone.
3. **Install it** — tap the file, allow "install from unknown sources".
4. **Open the app → Login screen → tap "Server settings"**, enter the address
   from step 1 (`http://<your-PC-IP>:8000`), tap **Save & Connect**.
5. Log in: `Israt Sultana` / `EasyGrow123!` (admin: `admin` / `EasyGrow123!`).

That's it — the same APK works on any device/network via the Server settings.

---

## ✅ Prerequisites

| Tool | Version | Notes |
|------|---------|-------|
| Node.js | 18+ | for the React/Vite build |
| **JDK 21** | 21 (LTS) | **required** — Capacitor 8 Gradle plugins need toolchain 21 (JDK 17 will fail) |
| Android SDK | platform **34** & **36**, build-tools **34** & **36**, platform-tools, cmdline-tools | via Android Studio or the command-line tools |

Installing Android Studio gives you the SDK + a JDK for free. If you only have
the command-line SDK tools, see the install commands in the Agent runbook.

---

## 🚀 Build & install (summary)

```bash
# 0. Make sure the backend is running on the server device (see Easy_Grow_Plants_V2 README),
#    started with:  python manage.py runserver 0.0.0.0:8000

# 1. Point the app at the backend (server device LAN IP).
cd frontend
cp .env.example .env
#   edit .env →  VITE_SERVER_URL=http://<SERVER_LAN_IP>:8000
#   (find the IP on the server device with:  hostname -I )

# 2. Build the web bundle and sync it into the Android project.
npm install --legacy-peer-deps
npx vite build --mode capacitor
npx cap sync android

# 3. Build the APK (point JAVA_HOME at a JDK 21 and ANDROID_HOME at the SDK).
cd android
export JAVA_HOME=/path/to/jdk-21
export ANDROID_HOME=$HOME/Android/Sdk
./gradlew assembleDebug --no-daemon

# 4. The APK is here:
#    frontend/android/app/build/outputs/apk/debug/app-debug.apk
```

Then transfer `app-debug.apk` to your phone and open it (allow "install from
unknown sources"), or with USB debugging: `adb install app-debug.apk`.

Log in with the demo account `Israt Sultana` / `EasyGrow123!` (created by the
backend's `create_demo_users` command).

---

## ⚙️ Configuration details

- **Backend URL:** `frontend/src/utils/platform.js` reads `VITE_SERVER_URL`
  (baked at build). Default fallback is `http://10.0.2.2:8000` (the Android
  **emulator's** route to the host's `localhost:8000`).
  - Physical phone → set `VITE_SERVER_URL=http://<server-LAN-IP>:8000`.
  - Emulator on the server device → leave it unset.
- **Runtime override (no rebuild):** set `localStorage['custom_server_url']` in
  the app's WebView to a different backend URL.
- **Cleartext HTTP** is enabled (`android:usesCleartextTraffic="true"`), so the
  app can talk to a plain-HTTP LAN backend. For production use HTTPS.
- App id: `com.easygrowplants.app`. Project SDK: `compileSdk 36`, `targetSdk 34`,
  `minSdk 24` (see `frontend/android/variables.gradle`).

---

## 🩺 Troubleshooting

| Symptom | Cause / fix |
|---------|-------------|
| Gradle: *"Cannot find a Java installation … languageVersion=21"* | Use **JDK 21** (set `JAVA_HOME`). JDK 17 is too old for these plugins. |
| Gradle: *"compile against version 36 or later"* | Install SDK **platform 36** + **build-tools 36**; `compileSdkVersion=36` is already set. |
| App opens but data won't load / login fails | Backend not reachable: ensure it runs on `0.0.0.0:8000`, phone is on the **same Wi-Fi**, and `VITE_SERVER_URL` is the server's current LAN IP. Test from the phone's browser: `http://<server-LAN-IP>:8000/admin/login/`. |
| Plant images don't show | Backend must run with `DEBUG=True` (serves `/media` and `/images`) and have been seeded (`python manage.py seed_marketplace`). |
| `gradlew: Permission denied` | `chmod +x frontend/android/gradlew`. |
| SDK not found | Create `frontend/android/local.properties` with `sdk.dir=/absolute/path/to/Android/Sdk`, or export `ANDROID_HOME`. |

---

## 🤖 Agent runbook (exact commands, Linux)

Run from the repo root. Adjust paths/versions as noted.

```bash
# ── A. Toolchain (skip any step already satisfied) ──────────────────────────
# A1. Node 18+ must be installed (check: node -v).

# A2. JDK 21 — portable, no sudo:
mkdir -p ~/.local && cd ~/.local
curl -sL -o jdk21.tgz "https://api.adoptium.net/v3/binary/latest/21/ga/linux/x64/jdk/hotspot/normal/eclipse"
tar -xzf jdk21.tgz && rm jdk21.tgz && mv jdk-21* jdk-21
export JAVA_HOME=~/.local/jdk-21 && export PATH=$JAVA_HOME/bin:$PATH

# A3. Android SDK — if you don't have Android Studio, install command-line tools:
#   Download "commandlinetools-linux" from https://developer.android.com/studio#command-line-tools
#   unzip into ~/Android/Sdk/cmdline-tools/latest, then:
export ANDROID_HOME=~/Android/Sdk
yes | $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --sdk_root=$ANDROID_HOME --licenses
$ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --sdk_root=$ANDROID_HOME \
  "platform-tools" "platforms;android-34" "platforms;android-36" \
  "build-tools;34.0.0" "build-tools;36.0.0"

# ── B. Backend (the app needs it running) ───────────────────────────────────
# Launch the Easy_Grow_Plants_V2 backend per ITS README, but bind all interfaces:
#   (in that repo)  python manage.py runserver 0.0.0.0:8000
# Discover the server LAN IP:
hostname -I | awk '{print $1}'      # e.g. 192.168.0.42

# ── C. Configure + build the APK ────────────────────────────────────────────
cd "<this-repo>/frontend"
printf 'VITE_SERVER_URL=http://<SERVER_LAN_IP>:8000\n' > .env   # use the IP from step B
npm install --legacy-peer-deps
npx vite build --mode capacitor
npx cap sync android
cd android
[ -f local.properties ] || echo "sdk.dir=$ANDROID_HOME" > local.properties
chmod +x gradlew
JAVA_HOME=~/.local/jdk-21 ANDROID_HOME=~/Android/Sdk ./gradlew assembleDebug --no-daemon

# ── D. Result ───────────────────────────────────────────────────────────────
# APK → frontend/android/app/build/outputs/apk/debug/app-debug.apk
# Optionally copy it to the repo root:
cp app/build/outputs/apk/debug/app-debug.apk ../../EasyGrowPlants-debug.apk
```

Verification signals: `BUILD SUCCESSFUL` from Gradle, and an `app-debug.apk`
(~25–30 MB) at the path above. Install it on a phone that shares the server's
Wi-Fi and log in with the demo account.
