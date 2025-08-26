Here’s a clean, **brief README** draft for your **noah** repo, tailored to what you’ve built so far:

---

# Noah 🦁🕊️🐇

Noah is a mobile app (built with Expo + React Native + TypeScript) where players collect animals by scanning QR codes. Each captured animal has attributes like category, diet, rarity, and gender.

Captured animals are stored locally in SQLite and can be displayed on the ark deck.

---

## 🚀 Installation

### 1. Clone the repo

```bash
git clone https://github.com/seancannon/noah.git
cd noah
```

### 2. Install dependencies

We use **Yarn** (not npm).

```bash
yarn install
```

### 3. Set up environment variables

Create a `.env` file in the root directory. Example:

```env
# Local dev IP (your computer's LAN address)
IMAGE_SERVER=http://192.168.1.3:8000
```

Make sure your phone/device running the Expo app is on the **same Wi-Fi network** as your dev machine.

### 4. Serve animal images

Noah expects pixel art animal images (e.g. `a_male_Ant.png`) to be available over HTTP.
From inside your `pixelArt/` directory:

```bash
cd pixelArt
python3 -m http.server 8000
```

Then images will be available at:

```
http://192.168.1.3:8000/a_male_Ant.png
```

(Replace `192.168.1.3` with your machine’s LAN IP.)

### 5. Run the app

```bash
yarn start
```

This starts Expo. Use the Expo Go app on your device or an emulator to test.

---

## 📦 Local Database

* Uses **SQLite** to persist captured loot.
* The table `loot` stores scanned animals.
* Example query:

  ```sql
  SELECT * FROM inventory;
  ```

---

## 🔑 Notes

* Always use **Yarn**, not npm.
* The `IMAGE_SERVER` env var must point to your Python static server.
* Ensure phone/emulator and dev machine are on the same LAN.

---

Would you like me to also add a **quickstart developer script** section (like `yarn dev` that runs Expo *and* the Python server together)? That could make setup smoother for you.
