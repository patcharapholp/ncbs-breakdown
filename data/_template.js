// ============================================================================
// TEMPLATE — คัดลอกไฟล์นี้เป็น data/<epic-slug>.js (เช่น data/user-management.js)
// แล้วแก้เนื้อหาข้างในให้ตรงกับ epic นั้น ไม่ต้องแก้ index.html เลย
// จากนั้นเพิ่มบรรทัดเดียวใน index.html:
//   <script src="data/<epic-slug>.js"></script>
// (วางไว้ก่อนบรรทัด <script src="data/credit-transfer.js"> หรือหลังก็ได้ ลำดับไม่สำคัญ)
// ============================================================================

const TEMPLATE_EPIC_DATA = {
  epicDeps: [
    // Epic อื่นที่ epic นี้ต้องพึ่งพา แต่ยังไม่ breakdown ในรอบนี้
    { name: "ชื่อ Epic ที่ต้องพึ่ง", why: "เหตุผลว่าทำไมต้องรอ/พึ่งพา", blocker: false },
  ],

  features: [
    {
      id: "F1",                         // ต้อง unique ภายใน epic นี้ (จะใช้เป็น DOM id)
      name: "ชื่อ Feature",
      sources: ["decisions/xxx.md"],    // อ้างอิงเอกสาร source หลัก (ไม่บังคับ)
      note: "",                          // หมายเหตุระดับ feature ถ้ามี (ไม่บังคับ)
      tasks: [
        {
          id: "1.1",
          task: "ชื่อ task",
          desc: "คำอธิบายสั้นๆ",
          dep: "dependency ของ task นี้",
          src: "source ที่อ้างอิง เช่น scr-xxx §y",
          c: "green",                    // "green" | "yellow" | "red"
          note: "",                       // เหตุผลถ้า clarity ไม่ใช่ green (ไม่บังคับ)
          subs: [                        // sub-task ถ้ามี (ไม่บังคับ)
            { id: "1.1.1", task: "sub-task ย่อย", desc: "", dep: "1.1", src: "", c: "green" },
          ],
        },
      ],
    },
  ],

  // ลำดับความสำคัญตาม technical dependency (ไม่ใช่ business value) — เป็น array ของ string (รองรับ <b> ได้)
  priority: [
    "<b>1.1</b> เหตุผลว่าทำไมต้องทำก่อน",
  ],

  // จุดที่ spec ขัดกัน เป็น regulatory blocker หรือยังไม่มีดีไซน์ — ต้อง confirm ก่อนประเมิน manday จริง
  flags: [
    "<b>หัวข้อ flag</b> — รายละเอียดว่าทำไมต้องเอาไปถามทีมก่อน",
  ],
};

// ---------- register into multi-epic registry ----------
window.NCBS_EPICS = window.NCBS_EPICS || {};
window.NCBS_EPICS['REPLACE-WITH-SLUG'] = {           // เช่น 'user-management'
  id: 'REPLACE-WITH-SLUG',
  system: 'NCBS',                                     // NCBS | UCBS | CTP แล้วแต่ scope
  name: 'REPLACE — ชื่อ Epic ภาษาอังกฤษ',
  thaiName: 'REPLACE — ชื่อ Epic ภาษาไทย',
  status: 'REPLACE — สถานะปัจจุบันของ epic นี้ (เริ่มพัฒนาหรือยัง)',
  epicDeps: TEMPLATE_EPIC_DATA.epicDeps,
  features: TEMPLATE_EPIC_DATA.features,
  priority: TEMPLATE_EPIC_DATA.priority,
  flags: TEMPLATE_EPIC_DATA.flags,
};
