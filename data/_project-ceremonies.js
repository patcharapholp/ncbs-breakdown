// ============================================================================
// Project Ceremonies & Go-Live Readiness — SIT / UAT / Pen Test & Performance
// Test / Training & Adoption. These are NOT dev tasks from ncbs-wiki — they are
// project-level milestones, kept as their own "epic" so they fit the existing
// Epic > Feature > Task structure without any code changes.
//
// Duration model: 1 เดือน ≈ 20 working days, 2 เดือน ≈ 40 working days (business
// days, matches the scheduler's own weekday-only model). ตัวเลข manday ที่ตั้งไว้
// เป็นแค่ตัวเลขเริ่มต้นจาก PO — ปรับได้อิสระในหน้า Timeline & Planning
// ============================================================================

const CEREMONIES_DATA = {
  epicDeps: [
    { name: "Development ของทุก epic หลัก (NCBS/UCBS/CTP)", why: "SIT/UAT/Pen Test ต้องรอ build เสร็จระดับ MVP ก่อนถึงจะทดสอบได้จริง", blocker: true },
  ],

  features: [
    {
      id: "F1",
      name: "Testing & Certification",
      note: "โมเดลปัจจุบันคำนวณแบบ \"เรียงต่อกัน\" (sequential) เท่านั้น — ถ้าต้องการให้ Pen Test ทำคู่ขนานกับ SIT/UAT จริง (แนวทางที่พบบ่อยในทางปฏิบัติ) ให้ใช้ปุ่ม hide/reorder ในหน้า Timeline จำลองสถานการณ์เพิ่มเติมเอง เพราะ tool นี้ยังไม่รองรับ parallel track อัตโนมัติ",
      tasks: [
        {
          id: "CER-1", task: "SIT (System Integration Testing)",
          desc: "ทดสอบการเชื่อมต่อระหว่างระบบ NCBS/UCBS/CTP ทั้งหมดแบบ end-to-end",
          dep: "Dev เสร็จระดับ MVP ของ epic หลัก (Credit Transfer, Identity & Auth, Role & Access เป็นอย่างน้อย)",
          src: "-", c: "yellow", note: "ระยะเวลาประมาณ 1 เดือน (20 วันทำการ) — ตัวเลขเริ่มต้นจาก PO ปรับได้",
        },
        {
          id: "CER-2", task: "UAT (User Acceptance Testing)",
          desc: "ให้ผู้ใช้จริง (เจ้าหน้าที่มหาวิทยาลัย/อว.) ทดสอบตาม business scenario จริง",
          dep: "CER-1 (SIT ผ่าน)",
          src: "-", c: "yellow", note: "ระยะเวลาประมาณ 1 เดือน (20 วันทำการ) — ตัวเลขเริ่มต้นจาก PO ปรับได้",
        },
        {
          id: "CER-3", task: "Pen Test & Performance/Load Test",
          desc: "ทดสอบความปลอดภัย (penetration test) และการรับน้ำหนักโหลดจริง (load/performance test)",
          dep: "Dev เสร็จระดับ MVP — ในทางปฏิบัติมักทำคู่ขนานกับ SIT/UAT ได้บางส่วน (ดู note ด้านบน)",
          src: "-", c: "yellow", note: "ระยะเวลาประมาณ 1 เดือน (20 วันทำการ) — ทีมภายนอก (security vendor) มักต้องจองคิวล่วงหน้าหลายสัปดาห์ ควรเริ่มประสานเร็ว",
        },
      ],
    },
    {
      id: "F2",
      name: "Training & Adoption",
      note: "รวม Training กับ อว. และมหาวิทยาลัยนำร่องเป็น task เดียว เพราะ PO ระบุระยะเวลารวมกันประมาณ 2 เดือน (สมมติว่าจัดคู่ขนาน/ทับซ้อนกันได้บางส่วนในทางปฏิบัติ) — ถ้าต้องการแยก track ชัดเจน แจ้งได้ จะช่วยแยกเป็น 2 task",
      tasks: [
        {
          id: "TRN-1", task: "Training กระทรวง อว. และมหาวิทยาลัยนำร่อง",
          desc: "อบรมการใช้งานระบบสำหรับเจ้าหน้าที่ อว. (Steering/Admin) และเจ้าหน้าที่/อาจารย์ผู้ใช้งานจริงในมหาวิทยาลัยนำร่อง รวมถึงจัดทำคู่มือ/สื่อการสอน",
          dep: "CER-2 (UAT ผ่าน) — ควรสอนระบบที่เสถียรแล้ว",
          src: "-", c: "yellow", note: "ระยะเวลาประมาณ 2 เดือน (40 วันทำการ) รวมทั้งสองกลุ่มเป้าหมาย — ตัวเลขเริ่มต้นจาก PO ปรับได้",
        },
      ],
    },
  ],

  priority: [
    "<b>CER-1 (SIT)</b> ต้องรอ dev หลักเสร็จระดับ MVP ก่อนสุด",
    "<b>CER-2 (UAT)</b> ต้องรอ SIT ผ่านก่อน",
    "<b>CER-3 (Pen Test/Performance)</b> ทำคู่ขนานกับ SIT/UAT ได้บางส่วนในทางปฏิบัติ แต่ต้องจองคิวทีมภายนอกล่วงหน้า — เริ่มประสานได้ทันทีแม้ยังไม่ถึงคิวทดสอบจริง",
    "<b>TRN-1 (Training)</b> ควรทำหลัง UAT ผ่านเพื่อสอนระบบเวอร์ชันที่เสถียรแล้ว",
  ],

  flags: [
    "<b>ระยะเวลาที่ระบุ (1-2 เดือนต่อรายการ) เป็นตัวเลขเริ่มต้นจาก PO</b> — ปรับได้อิสระผ่านช่อง manday ในหน้า Timeline & Planning (1 เดือน ≈ 20 วันทำการ, 2 เดือน ≈ 40 วันทำการ)",
    "<b>Tool นี้ยัง schedule แบบ sequential เท่านั้น</b> — ถ้า Pen Test/Performance Test ทำคู่ขนานกับ SIT/UAT จริงในทางปฏิบัติ ตัวเลข end date ที่คำนวณให้จะเป็น worst-case (ยาวกว่าความเป็นจริง) ควรใช้เป็นเพดานบนไว้ก่อน แล้วปรับ timeline จริงกับทีมอีกที",
    "<b>Pen Test vendor ภายนอกมักต้องจองคิวล่วงหน้า</b> — ควรเริ่มประสานตั้งแต่ช่วง dev ยังไม่เสร็จ ไม่ต้องรอถึงคิวจริงถึงจะเริ่มติดต่อ",
  ],
};

// ---------- register into multi-epic registry ----------
window.NCBS_EPICS = window.NCBS_EPICS || {};
window.NCBS_EPICS['project-ceremonies'] = {
  id: 'project-ceremonies',
  system: 'PMO',
  name: 'Testing, Training & Go-Live Readiness',
  thaiName: 'การทดสอบ ฝึกอบรม และเตรียมความพร้อมขึ้นระบบจริง',
  status: 'Ceremony/milestone ระดับโครงการ — ไม่ใช่ dev task จาก ncbs-wiki แยกออกมาต่างหากจาก epic พัฒนาระบบตามคำขอ PO',
  epicDeps: CEREMONIES_DATA.epicDeps,
  features: CEREMONIES_DATA.features,
  priority: CEREMONIES_DATA.priority,
  flags: CEREMONIES_DATA.flags,
};
