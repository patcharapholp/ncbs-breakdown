# ncbs-breakdown

Dashboard สำหรับติดตาม task breakdown ของโครงการ NCBS/UCBS/CTP (เริ่มจาก Epic: Credit Transfer)
แยกออกจาก `ncbs-wiki` โดยเจตนา — ที่นี่คือ **PM/planning artifact** ที่แก้ไขบ่อย ไม่ใช่ source of truth ของ spec
(spec/decision ที่ authoritative ยังอยู่ที่ `ncbs-wiki` เหมือนเดิม ที่นี่แค่ reference กลับไป)

## โครงสร้าง

```
ncbs-breakdown/
├── index.html                    # dashboard — รองรับหลาย epic พร้อม tab สลับด้านบน
├── data/
│   ├── credit-transfer.js        # ข้อมูล breakdown ของ Epic Credit Transfer
│   └── _template.js              # ต้นแบบสำหรับสร้าง epic ใหม่ (ไม่ถูกโหลดใน index.html)
└── README.md
```

`index.html` อ่านข้อมูลจาก **registry กลาง** ชื่อ `window.NCBS_EPICS` — แต่ละไฟล์ใน `data/` จะ
"ลงทะเบียน" epic ของตัวเองเข้า registry นี้ตอนโหลด (ดูท้ายไฟล์ `credit-transfer.js`) ตัว dashboard
จะ auto-generate epic tab ด้านบนจาก key ทั้งหมดที่ลงทะเบียนไว้ — ไม่ต้องแก้โค้ด `index.html` เวลาเพิ่ม epic ใหม่

### เพิ่ม Epic ใหม่ (เช่น User Management, Role Management, API Management)

1. คัดลอก `data/_template.js` เป็น `data/<epic-slug>.js` เช่น `data/user-management.js`
2. แก้เนื้อหาข้างในให้ตรงกับ epic นั้น (โครงสร้างเหมือนกับ `credit-transfer.js` ทุกกระเบียดนิ้ว)
3. เปิด `index.html` แล้วเพิ่มบรรทัดเดียวตรงส่วน `<!-- โหลด data file -->`:
   ```html
   <script src="data/user-management.js"></script>
   ```
4. รีเฟรชหน้า — จะเห็น tab epic ใหม่ขึ้นที่แถบด้านบน คลิกสลับได้ทันที ไม่กระทบข้อมูล epic เดิม

## การ re-check ให้ครอบคลุมโมดูลอื่นของ NCBS (User Management, Role Management, API Management ฯลฯ)

Prompt เดิมที่ใช้กับ Claude Code (session ใน `~/ncbs-wiki`) เลือกโฟกัสที่ Epic ที่ "สเปกสมบูรณ์ที่สุด" คือ
Credit Transfer ก่อน ตามที่ Claude สรุปไว้ตอนต้น session — โมดูลอื่นเลยยังไม่ถูกสำรวจเลย ให้ทำ 2 phase ต่อ:

**Phase 1 — สำรวจภาพรวมทั้ง wiki ก่อน (inventory)**

เปิด Claude Code ใน `~/ncbs-wiki` แล้วสั่งประมาณนี้:

> สำรวจโครงสร้าง repo `~/ncbs-wiki` ทั้งหมดอีกครั้ง แต่รอบนี้ขอ **รายการ epic/โมดูลทั้งหมด** ที่มีอยู่จริงในระบบ NCBS/UCBS/CTP ไม่ใช่แค่ Credit Transfer — เช่น User Management, Role & Access Management, API Management, Notification Service, Institution Structure & Master Data, Identity & Auth ฯลฯ
>
> สำหรับแต่ละ epic ขอสรุปแค่:
> 1. ชื่อ epic และ system ที่เกี่ยวข้อง (NCBS/UCBS/CTP)
> 2. มี spec/decision file ครบแค่ไหน (สมบูรณ์ / มีบางส่วน / แทบไม่มี)
> 3. สถานะ dev จริง (จาก Jira/PM sources ถ้ามี) เทียบกับ prototype
> 4. ประเมินคร่าวๆ ว่าน่าจะมีกี่ feature/task ระดับใหญ่
>
> ยังไม่ต้อง breakdown ละเอียดตอนนี้ ขอแค่ inventory เพื่อเลือกว่าจะ breakdown อันไหนต่อก่อน

ผลลัพธ์ที่ได้จะเป็น "แผนที่" ของทั้งโปรเจกต์ — เอาไปตัดสินใจว่าจะ breakdown epic ไหนก่อนตาม priority จริง
(เช่น Identity & Auth น่าจะต้องมาก่อน เพราะ Credit Transfer เองก็ list เป็น dependency ไว้แล้ว)

**Phase 2 — breakdown ทีละ epic ด้วย prompt แบบเดิม**

ใช้ prompt เดิมที่เคยได้ผลดี (แบบที่ใช้ตอน breakdown Credit Transfer) แต่ระบุ epic ให้ชัดเจน:

> ให้ breakdown งานพัฒนา (development tasks) ของ **Epic: User Management** ในระดับละเอียดที่สุดเท่าที่จะได้
> (fine-grained / smallest unit of work) ด้วยรูปแบบเดียวกับที่เคยทำกับ Credit Transfer
> (Epic → Feature → Task → Sub-task, พร้อม Dependency/Source/Clarity 3 ระดับ 🟢🟡🔴)
>
> ผลลัพธ์สุดท้ายขอเป็นไฟล์ JavaScript ตาม format ของ `data/_template.js` ที่แนบมา
> (แนบไฟล์ template หรือวาง path `~/ncbs-breakdown/data/_template.js` ให้ Claude Code อ่านเป็นตัวอย่าง)
> ตั้งชื่อไฟล์ `user-management.js` และลงทะเบียนเข้า `window.NCBS_EPICS['user-management']`

ทำซ้ำแบบนี้ทีละ epic — จะได้ข้อมูลรูปแบบเดียวกันทุก epic พร้อมใส่เข้า dashboard ได้ทันทีตามขั้นตอน
"เพิ่ม Epic ใหม่" ด้านบน

## แก้ไขข้อมูล

เปิด `data/credit-transfer.js` แล้วแก้ตรง object ได้เลย โครงสร้างคือ:

```js
const DATA = {
  epicDeps: [ { name, why, blocker } ],
  features: [
    {
      id: "F1", name: "...", sources: [...],
      tasks: [
        { id:"1.1", task:"...", desc:"...", dep:"...", src:"...", c:"green|yellow|red", note:"...",
          subs: [ { id:"1.1.1", ... } ] }
      ]
    }
  ],
  priority: [ "...html string..." ],
  flags: [ "...html string..." ]
}
```

`c` (clarity) ใช้ค่า `"green"` (พร้อม dev) / `"yellow"` (ต้องเช็คก่อน) / `"red"` (ยังเป็นแค่ proposed)

## Workflow แนะนำ (ใช้ Claude Code)

1. Clone repo นี้ลงเครื่อง (ครั้งเดียว)
2. ทุกครั้งที่มีการ confirm spec ใหม่ หรือ breakdown เพิ่ม → เปิด Claude Code ในโฟลเดอร์นี้ แล้วสั่งเช่น:
   > "อ่าน data/credit-transfer.js แล้วอัปเดต task 4.6 ให้ clarity เป็น green เพราะทีมเคาะ threshold เป็น 2.00 ทุกระดับแล้ว อ้างอิงจาก [ลิงก์/ข้อความ confirm]"
3. เปิด `index.html` ตรวจดูผลลัพธ์ (double-click เปิดในเบราว์เซอร์ได้เลย ไม่ต้อง build)
4. `git add -A && git commit -m "update: 4.6 grade gate confirmed 2.00 ทุกระดับ"`
5. `git push`

ข้อดีของการแยก `data/credit-transfer.js` ออกจาก `index.html`: `git diff` จะอ่านง่ายมาก เห็นชัดว่าบรรทัดไหนเปลี่ยน clarity จาก `yellow` → `green` และย้อนดู history ได้ว่า task ไหน confirm ตอนไหน

## Deploy เป็นลิงก์แชร์ได้ (GitHub Pages)

1. ใน repo settings → Pages → Source: เลือก branch `main`, folder `/ (root)`
2. รอ 1-2 นาที จะได้ลิงก์ประมาณ `https://<username>.github.io/ncbs-breakdown/`
3. แชร์ลิงก์นี้แทนการ export ไป Slides ทุกครั้ง (จะ export ไป Slides ตอน present กับ steering committee ก็ยังทำได้ตามปกติ)

## Export เป็นตารางสำหรับ Google Sheets

กดปุ่ม **⇩ Export CSV** มุมขวาบนของ dashboard:
- export เฉพาะ **epic ที่กำลังเปิดดูอยู่** (ตาม tab ด้านบน) — สลับ tab ก่อน export ถ้าต้องการ epic อื่น
- จะ export เฉพาะแถวที่ "มองเห็นอยู่บนจอตอนนั้น" ตามตัวกรอง/คำค้นหาที่ตั้งไว้ — ถ้าต้องการทั้งหมด ให้ล้างตัวกรอง (กดชิป "ทั้งหมด" + เคลียร์ช่องค้นหา) ก่อนกด export
- ได้ไฟล์ `.csv` พร้อม UTF-8 BOM (ภาษาไทยไม่เพี้ยนเวลาเปิดด้วย Excel/Sheets)
- คอลัมน์ที่ได้: Epic, Feature ID, Feature, Task ID, Task, Description, Dependency, Source, Clarity, Clarity Note

**นำเข้า Google Sheets:**
1. เปิด Google Sheets → File → Import → Upload → เลือกไฟล์ `.csv` ที่ export มา
2. เลือก "Replace current sheet" หรือ "Insert new sheet" ตามต้องการ
3. Separator type: เลือก "Comma" (ปกติ auto-detect ได้อยู่แล้ว)

**ถ้าอยาก sync อัตโนมัติ (ไม่ต้อง export มือทุกครั้ง):** หลัง deploy GitHub Pages แล้ว สามารถใช้สูตรใน Google Sheets:
```
=IMPORTHTML("https://<username>.github.io/ncbs-breakdown/", "table", 1)
```
แต่วิธีนี้ดึงได้ทีละ 1 ตาราง (1 feature) ต่อสูตร และไม่รองรับ filter/sub-task ที่ซ้อนกัน — สำหรับการใช้งานจริงแนะนำให้ export CSV ตอนต้องการ snapshot ไปคุยกับทีม จะควบคุมง่ายกว่า
