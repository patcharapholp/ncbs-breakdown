# ncbs-breakdown (v2 — Planning Console)

Dashboard สำหรับติดตาม task breakdown ของโครงการ NCBS/UCBS/CTP ครบทั้ง 21 epic
พร้อมโมดูล **Timeline & Planning** (กำหนด start date, ใส่ manday ต่อ role, ดู schedule ที่คำนวณให้)
และ **Overview dashboard** (สรุป readiness ข้ามทุก epic + cross-epic flags)

แยกออกจาก `ncbs-wiki` โดยเจตนา — ที่นี่คือ **PM/planning artifact** ที่แก้ไขบ่อย ไม่ใช่ source of truth ของ spec

---

## ⚠️ Migration จาก v1 (ที่มี epic tab แถวยาวด้านบน)

ไฟล์ `index.html` ตัวนี้เป็น**คนละสถาปัตยกรรม**กับตัวเดิม — ใช้ **sidebar ด้านซ้าย** แทน tab แถวยาวด้านบน
และ**ไม่ต้องแก้ไฟล์ `index.html` เพื่อเพิ่ม epic ใหม่อีกต่อไป** (อ่านหัวข้อ "ระบบ manifest" ด้านล่าง)

**ทำตามนี้เพื่ออัปเดต repo ของคุณ:**

```bash
cd ~/ncbs-breakdown

# 1) เอา index.html เก่าออก แทนที่ด้วยตัวใหม่ (ดาวน์โหลดจากแชท)
#    data/*.js เดิมทั้ง 21 epic ไม่ต้องแก้ไฟล์ไหนเลย ใช้ต่อได้ทันที (field/format เหมือนเดิมทุกอย่าง)

# 2) เพิ่มไฟล์ใหม่ 3 ไฟล์ (ดาวน์โหลดจากแชท):
#    - data/_cross-epic-flags.js
#    - update-manifest.sh   (ไว้ที่ root ของ repo, ไม่ใช่ใน data/)
#    - data/manifest.json    (จะถูกเขียนทับใหม่ในขั้นตอนถัดไปอยู่ดี ข้ามได้)

# 3) สร้าง manifest.json ให้ตรงกับไฟล์ epic ทั้ง 21 ที่มีจริงในเครื่องคุณ (คำสั่งเดียวจบ)
chmod +x update-manifest.sh
./update-manifest.sh

# 4) ทดสอบก่อน commit
open index.html
# ควรเห็น sidebar ซ้ายมือมี "Overview / Timeline & Planning / Epics" + epic ทั้ง 21 อันใน list ค้นหาได้

# 5) commit + push
git add -A
git commit -m "redesign: sidebar nav + Jira-style theme + Timeline/Planning module + Overview dashboard"
git push
```

---

## โครงสร้างไฟล์

```
ncbs-breakdown/
├── index.html                    # Planning Console — sidebar nav, 3 view (Overview/Timeline/Epic)
├── update-manifest.sh            # รันทุกครั้งหลังเพิ่ม/ลบไฟล์ epic ใน data/
├── data/
│   ├── manifest.json             # รายชื่อไฟล์ epic ทั้งหมด — generate อัตโนมัติ ห้ามแก้มือ
│   ├── _template.js              # ต้นแบบสำหรับสร้าง epic ใหม่
│   ├── _cross-epic-flags.js      # ประเด็นที่กระทบมากกว่า 1 epic (แสดงใน Overview)
│   ├── credit-transfer.js
│   └── <อีก 20 ไฟล์ epic>.js
└── README.md
```

## ระบบ manifest — เพิ่ม epic ใหม่โดยไม่ต้องแตะ index.html

เดิมต้องเพิ่ม `<script src="data/xxx.js">` เองใน `index.html` ทุกครั้งที่มี epic ใหม่ — ตอนนี้ไม่ต้องแล้ว
`index.html` จะ `fetch('data/manifest.json')` ตอนเปิดหน้า แล้วโหลดทุกไฟล์ที่ระบุไว้ให้อัตโนมัติ

**เวิร์กโฟลว์เพิ่ม epic ใหม่:**
1. สร้าง `data/<epic-slug>.js` (copy จาก `data/_template.js`)
2. รัน `./update-manifest.sh` — จะ scan ไฟล์ `.js` ทั้งหมดใน `data/` แล้วเขียน `manifest.json` ใหม่ให้ตรง
3. เปิด `index.html` — เห็น epic ใหม่ใน sidebar ทันที ไม่ต้องแก้โค้ดที่ไหนเลย

---

## หน้าจอทั้ง 3 ส่วน

### 1. Overview
สรุปภาพรวมทั้งโครงการ (auto-generate จากทุก epic ที่โหลดอยู่):
- Stat cards: จำนวน epic/feature/task รวม, % พร้อม dev, % ยังเป็นแค่ proposed
- **Epic Readiness heatmap** — เรียง epic จาก "เสี่ยงสุด" (สัดส่วน 🟡🔴 เยอะสุด) ไปหา "พร้อมสุด" คลิกแถวเพื่อเปิด epic นั้น
- **Cross-epic Flags** — ประเด็นที่กระทบมากกว่า 1 epic (จาก `data/_cross-epic-flags.js`) เช่น "Enforcement = mock ทั้งชุด RBAC/ABAC", "Blockchain ค้าง 3 epic พร้อมกัน" ฯลฯ — แก้ไข/เพิ่มรายการได้ตรงไฟล์นั้น

### 2. Timeline & Planning
โมดูลวางแผนที่ให้:
- ตั้ง **Project Start Date** (บังคับ) และ **Target End Date** (ไม่บังคับ — ใช้เทียบ buffer/overrun)
- ใส่ **manday ต่อ role** (PO/BA, Tech Lead, Dev, QA Lead, QA, PM, DM) ในแต่ละ task โดยตรงในตาราง (จัดกลุ่มตาม epic แบบ accordion เหมือนหน้า Epic)
- แก้ **Seq** (ลำดับ) ต่อ task เพื่อจัดคิวใหม่ตามที่ทีมตัดสินใจจริง
- ระบบคำนวณ **start/end date ของแต่ละ task อัตโนมัติ** ตามลำดับ Seq (ข้ามเสาร์-อาทิตย์)
- **Gantt overview ระดับ Feature** ด้านบน (สรุปจาก task ย่อยในแต่ละ feature)
- **Workload strip** สรุป manday รวมต่อ role ทั้งโครงการ

**⚠️ ข้อจำกัดที่ต้องรู้ก่อนใช้จริง:** โมเดลนี้เป็น "sequential scheduling" แบบง่าย —
สมมติว่า 7 role ทำงาน**คู่ขนานกันภายใน task เดียว** (duration = manday สูงสุดในบรรดา 7 role)
และ task ต่างๆ เรียง**ต่อเนื่องกันตาม Seq** ไม่ใช่ critical-path/resource-leveling engine เต็มรูปแบบ
(เพราะ field `Dependency` ในข้อมูลปัจจุบันเป็น free text ไม่ใช่ graph ที่ machine เชื่อมโยงได้แม่นยำ)
เหมาะสำหรับ **วางแผนคร่าวๆ ระดับ ballpark** — ก่อน commit sprint จริงควรเอาไปคุยกับ Tech Lead/PM เพื่อจัด parallel track เอง

**การเก็บข้อมูล:** manday/seq/dates ที่กรอกจะ auto-save ใน `localStorage` ของเบราว์เซอร์ **เฉพาะเครื่องที่กรอก**
ถ้าต้องการแชร์ให้ทีมเห็นค่าเดียวกัน:
1. กด **⇩ Export planning (JSON)** ได้ไฟล์ `planning-state.json`
2. วางไฟล์นั้นที่ `data/planning-state.json` แล้ว commit + push
3. คนอื่นเปิด `index.html` ครั้งแรก จะโหลดค่านี้เป็น baseline อัตโนมัติ (ระบบ fetch ไฟล์นี้ก่อน localStorage เสมอ)
4. ถ้าใครแก้ต่อในเครื่องตัวเอง ค่าจะ diverge เป็น local จนกว่าจะ export/commit ทับอีกครั้ง — เหมาะกับจังหวะ "PO sync ทีมเป็นช่วงๆ" มากกว่า real-time sync

**Export CSV:** ปุ่ม **⇩ Export timeline (CSV)** ได้ตาราง flat ของทุก task ทุก epic พร้อม manday ต่อ role + วันที่ — เอาไป Google Sheets ได้ทันทีตามขั้นตอนเดิม (File → Import → Upload)

### 3. Epic detail (เหมือนเดิมแต่ layout ใหม่)
เปิดจาก sidebar (ค้นหา/กรองด้วย system tag NCBS/UCBS/CTP ได้) — เนื้อหาเดิมทั้งหมด (feature table, clarity filter, search, Export CSV ต่อ epic) ยังอยู่ครบ แค่ feature-index ย้ายจาก vertical rail มาเป็น chip แถวนอนด้านบนแทน เพื่อคืนพื้นที่ให้ตาราง

---

## Theme

Font: **IBM Plex Sans Thai** (heading/body) + **IBM Plex Mono** (ID/ตัวเลข/โค้ด) — เลือกเพราะรองรับภาษาไทยได้สวยและให้ความรู้สึกทันสมัยแบบ SaaS product มากกว่าฟอนต์เอกสารราชการ
สี: โทน Jira-inspired — พื้นขาว/เทาอ่อน (`#F7F8FA`) + น้ำเงินหลัก (`#0052CC`) + สถานะ clarity ใช้โทนเขียว/ส้ม/แดงแบบ Atlassian design token

---

## Export เป็นตารางสำหรับ Google Sheets (เหมือนเดิม)

- **ต่อ epic**: เปิด epic → กด Export CSV มุมขวาบน
- **รวมทุก epic (timeline)**: หน้า Timeline & Planning → กด Export timeline (CSV)

นำเข้า Google Sheets: File → Import → Upload → เลือกไฟล์ → เลือก "Insert new sheet"
