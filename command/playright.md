এখানে আপনার প্রজেক্টের জন্য একটি কমপ্লিট `playwright-guide.md` ফাইল দেওয়া হলো। এটি আপনার GitHub
Codespaces বা Ubuntu 24.04 (Noble) সিস্টেমে ভবিষ্যতে যেকোনো সমস্যা সমাধানে সাহায্য করবে।

---

````markdown
# 🎭 Playwright Final Fix & Command Guide

**Target OS:** Ubuntu 24.04 (Noble) **Environment:** GitHub Codespaces / Remote Linux

---

## 🛠️ ১. এক ক্লিকে সব ফিক্স (Setup & Dependencies)

যদি ব্রাউজার ওপেন না হয় বা "Missing Libraries" দেখায়, তবে এই স্ক্রিপ্টটি রান করুন। এটি Ubuntu
24.04-এর জন্য বিশেষভাবে তৈরি।

```bash
# ১. রিপোজিটরি ক্লিন এবং আপডেট
sudo rm -f /etc/apt/sources.list.d/yarn.list
sudo apt-get update -y

# ২. Noble (24.04) এর জন্য সব 't64' এবং Media লাইব্রেরি ইন্সটল
sudo apt-get install -y --no-install-recommends \
    libatk1.0-0t64 libatk-bridge2.0-0t64 libcups2t64 libdrm2 \
    libxkbcommon0 libxcomposite1 libxdamage1 libxrandr2 \
    libgbm1 libpango-1.0-0 libcairo2 libasound2t64 libgtk-3-0t64 \
    libxslt1.1 libwayland-client0 libwayland-server0 libmanette-0.2-0 libflite1 \
    libgtk-4-1 libvulkan1 libgraphene-1.0-0 libopus0 \
    libgstreamer1.0-0 libgstreamer-plugins-base1.0-0 \
    libgstreamer-plugins-bad1.0-0 gstreamer1.0-plugins-base \
    gstreamer1.0-plugins-good gstreamer1.0-gl \
    libwebpdemux2 libavif16 libharfbuzz-icu0 libwebpmux3 \
    libenchant-2-2 libhyphen0 libwoff2dec1 libgles2 libx264-164 xvfb

# ৩. Playwright ব্রাউজার এবং অতিরিক্ত ডিপেন্ডেন্সি
pnpm exec playwright install --with-deps
```
````

---

## 🚀 ২. টেস্ট রান করার কমান্ডসমূহ (Execution)

### ক) দ্রুত হেডলেস রান (CI/CD এর জন্য সেরা)

এটি কোনো উইন্ডো ছাড়াই ব্যাকগ্রাউন্ডে টেস্ট শেষ করবে।

```bash
pnpm exec playwright test
```

### খ) ভার্চুয়াল ডিসপ্লেসহ রান (Headed Mode)

Codespaces-এ সরাসরি ডিসপ্লে নেই, তাই `xvfb-run` ব্যবহার করতে হয়।

```bash
xvfb-run pnpm exec playwright test --headed
```

### গ) ইন্টারঅ্যাক্টিভ UI মোড (ব্রাউজারে দেখার জন্য)

এটি রান করার পর VS Code-এর **Ports** ট্যাব থেকে পোর্টে ক্লিক করে UI দেখতে পাবেন।

```bash
PW_TEST_HTML_REPORT_HOST=0.0.0.0 xvfb-run pnpm exec playwright test --ui
```

---

## 🔍 ৩. ডিবাগিং এবং রিপোর্ট (Debugging)

### ক) ট্রেস ভিউয়ার (ভিজ্যুয়ালি বাগ খোঁজার জন্য)

এটি রান করলে প্রতিটি টেস্টের একটি ভিডিও এবং টাইমলাইন রেকর্ড হবে।

```bash
# ট্রেসসহ রান
pnpm exec playwright test --trace on

# রিপোর্টটি ব্রাউজারে ওপেন করা
pnpm exec playwright show-report --host 0.0.0.0
```

### খ) নির্দিষ্ট ব্রাউজারে রান করা

```bash
pnpm exec playwright test --project=webkit
```

---

## 💡 প্রো-টিপস (Troubleshooting)

1. **Error: No XServer running** -> সবসময় কমান্ডের আগে `xvfb-run` যোগ করুন।
2. **Error: Unable to locate package** -> Ubuntu 24.04-এ প্যাকেজ নাম বদলে গেছে (যেমন: `libatk1.0-0`
   এখন `libatk1.0-0t64`)। উপরের লিস্টটি ফলো করুন।
3. **npm warn Unknown env config** -> এটি আপনার পিসির `.npmrc` ফাইলের পুরনো কনফিগারেশনের জন্য হয়।
   এটি টেস্টে বাধা দেয় না, ইগনোর করতে পারেন।

```

---

**আমি কি এই ফাইলটি সরাসরি আপনার বর্তমান ডিরেক্টরিতে `playwright-fix.md` নামে তৈরি করে দেব?**
```
