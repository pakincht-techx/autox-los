# Git Guide for AutoX LOS Project 🚀

This guide contains the most frequently used Git commands for our project.

## 🌟 The Daily Workflow (3 Steps)
Most of your work will involve these three commands:

1. **`git pull`** ⬇️  
   Get the latest code from GitHub before you start working.
   * *Usage:* `git pull origin main`

2. **`git add .`** ➕  
   Tell Git which files you want to save.
   * *Usage:* `git add .` (for all files) or `git add filename.tsx`

3. **`git commit -m "your message"`** 💾  
   Save your changes with a description.
   * *Usage:* `git commit -m "feat: add new button"`

---

## 🛠 common Commands (คำสั่งที่ใช้บ่อย)

| Command | What it does (คำอธิบาย) |
| :--- | :--- |
| **`git status`** | Check which files are changed (ตรวจสอบไฟล์ที่แก้ไข) |
| **`git push`** | Upload your saved work to GitHub (ส่งไฟล์ขึ้น GitHub) |
| **`git log`** | View history of all changes (ดูประวัติการบันทึก) |
| **`git diff`** | See exact line changes in your code (ดูโค้ดส่วนที่ต่างกัน) |
| **`git checkout -b <name>`** | Create a new "branch" for a feature (สร้างกิ่งงานใหม่) |
| **`git checkout <branch>`** | Switch to another work branch (สลับกิ่งงาน) |

---

## 🆘 Troubleshooting (เมื่อเกิดปัญหา)

### 1. Permission Denied (403)
If you can't push, check:
* Did the owner invite you as a **Collaborator**?
* Did you accept the invite in your **Email** or at [github.com/notifications](https://github.com/notifications)?
* Are you using a **Personal Access Token (PAT)** instead of a password?

### 2. Merge Conflict (โค้ดชนกัน) ⚔️
If `git pull` fails because of a conflict:
1. Open the highlighted file.
2. Look for `<<<<<<< HEAD` (your version) and `=======` (their version).
3. Delete the markers and keep the correct code.
4. Run `git add .` and `git commit` to finish.

### 3. "Undo" changes (ยกเลิกการแก้ไข)
* Discard changes to one file: `git restore <filename>`
* Discard ALL unsaved changes: `git reset --hard HEAD` (⚠️ Use with care!)

---

## 📝 Commit Message Convention
Try to follow this style:
* `feat:` for new features (e.g., `feat: Add car appraisal logic`)
* `fix:` for bug fixes (e.g., `fix: Correct interest rate calculation`)
* `docs:` for documentation or labels (e.g., `docs: Change 'คศ' to 'ค.ศ.'`)
* `style:` for UI/CSS changes (e.g., `style: Update button colors`)
