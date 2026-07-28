# ncbs-breakdown

Dashboard สำหรับติดตาม task breakdown ของโครงการ NCBS/UCBS/CTP (เริ่มจาก Epic: Credit Transfer)
แยกออกจาก `ncbs-wiki` โดยเจตนา — ที่นี่คือ **PM/planning artifact** ที่แก้ไขบ่อย ไม่ใช่ source of truth ของ spec
(spec/decision ที่ authoritative ยังอยู่ที่ `ncbs-wiki` เหมือนเดิม ที่นี่แค่ reference กลับไป)

## โครงสร้าง

```
ncbs-breakdown/
├── index.html                    # dashboard (เปิดตรงจากเครื่อง หรือผ่าน GitHub Pages)
├── data/
│   └── credit-transfer.js        # ข้อมูล breakdown ของ Epic นี้ — แก้ไฟล์นี้เพื่ออัปเดต
└── README.md
```

เวลาจะเพิ่ม Epic ใหม่ (เช่น Identity & Auth, Institution Structure) ให้เพิ่มไฟล์ใหม่ใน `data/`
เช่น `data/identity-auth.js` แล้วปรับ `index.html` ให้โหลดหลายไฟล์ / มี epic selector — บอกได้ถ้าต้องการให้ผมขยายส่วนนี้ให้

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
