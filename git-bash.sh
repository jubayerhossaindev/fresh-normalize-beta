#!/bin/bash

# --- কনফিগারেশন (আপনার তথ্য এখানে দিন) ---
NEW_NAME="jubayerhossaindev"
NEW_EMAIL="jubayerhossainbook@gmail.com" # আপনার মেইন অ্যাকাউন্টের ইমেইল দিন
REPO_URL="https://github.com/jubayerhossaindev/fresh-normalize.git"

echo "🔄 Git configuration আপডেট করা হচ্ছে..."

# ১. লোকাল ইউজার সেট করা (যাতে আপনার নামে কম্মিট হয়)
git config --local user.name "$NEW_NAME"
git config --local user.email "$NEW_EMAIL"

# ২. রিমোট URL ঠিক করা (যাতে সঠিক রিপোতে পুশ হয়)
git remote set-url origin "$REPO_URL"

# ৩. GitHub CLI কে ক্রেডেনশিয়াল হেল্পার হিসেবে সেট করা
# এটি করলে VS Code আর আগের একাউন্টের পাসওয়ার্ড খুঁজবে না
gh auth setup-git

# ৪. আগের ভুল নামে করা কম্মিট থাকলে তা বর্তমান নামে ঠিক করা
if git log -1 >/dev/null 2>&1; then
    echo "🛠️ সর্বশেষ কম্মিটের Author আপডেট করা হচ্ছে..."
    git commit --amend --reset-author --no-edit
fi

echo "✅ সফলভাবে আপডেট হয়েছে!"
echo "👤 বর্তমানে সেট করা আছে: $(git config user.name) <$(git config user.email)>"
echo "🌐 রিমোট URL: $(git remote get-url origin)"
echo "🚀 এখন 'git push -f origin main' দিয়ে ট্রাই করুন।"
