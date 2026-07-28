// NCBS Breakdown — Skill Matrix / Skill Database epic data
// Sprint Details #26 (Skill Database) + #46 (Skill Extractor Integration) — ทั้งคู่ Phase 2, ยังไม่เริ่ม
// หลักการยึด: "Design-ready ≠ Build-complete" — Phase 1 เตรียม infra เท่านั้น ไม่ต้อง build เต็มรูปแบบ

const SKILL_MATRIX_DATA = {
  epicDeps: [
    { name:"Multi-Channel Data Ingestion Epic (F7.2 — Skill & Skill Criteria reference table)", why:"artifact ที่เป็นรูปธรรมที่สุดของโดเมนนี้ (117 fields) อยู่ในนั้นแล้ว — ไม่ duplicate", blocker:false },
    { name:"Grade & Credit Management Epic", why:"course-to-skill mapping ต้องพึ่งข้อมูล course/CLO", blocker:false },
    { name:"Dashboards Epic (Intelligence Dashboard)", why:"ML forecast เป็น consumer ของ skill data model นี้", blocker:false },
  ],
  features: [
    {
      id:"F1", name:"Skill Data Model (Phase 1 — Design-Ready Infrastructure)",
      sources:["concepts/skill-matrix.md Scope Clarification"],
      note:"หลักการชัดเจน: Phase 1 = เตรียม data model + API skeleton ให้ extensible เท่านั้น — ไม่ต้อง build ML/taxonomy เต็มรูปแบบ",
      tasks:[
        {id:"1.1", task:"Data model เพิ่ม skill dimension (extensible)", desc:"", dep:"Multi-Channel Data Ingestion Epic F7.2", src:"concepts/skill-matrix.md Scope Clarification", c:"yellow", note:"หลักการชัด แต่ไม่มี concrete schema ระบุที่ไหน นอกจาก Skill & Skill Criteria reference table (117 fields) ใน Data Ingestion epic ที่ใกล้เคียงที่สุด"},
        {id:"1.2", task:"API endpoint skeleton สำหรับ skill-related data", desc:"เตรียมพร้อมสำหรับ Skill Engine ในอนาคต ไม่ต้องมี engine จริง", dep:"1.1", src:"concepts/skill-matrix.md Scope Clarification", c:"yellow"},
      ]
    },
    {
      id:"F2", name:"Skill Standard Selection & Governance (ภายนอก)",
      sources:["concepts/skill-matrix.md Skill Mapping Standard — Open, Reference Standards"],
      note:"⚠️ ไม่ใช่งาน dev — เป็นงาน PM/BA ประสานงานภายนอก ที่ block งานทุกอย่างในโดเมนนี้จนกว่าจะเคาะ",
      tasks:[
        {id:"2.1", task:"เลือก skill taxonomy standard", desc:"ESCO / O*NET / TPQI / WEF Future of Jobs / ทำเอง", dep:"—", src:"concepts/skill-matrix.md Reference Standards", c:"red", note:"เอกสารเขียนตรงๆ ว่า 'ต้องเลือก หรือทำ taxonomy เอง — รอ Reference Documents' — ไม่มีคำตอบเลย"},
        {id:"2.2", task:"ประสาน กมอ. เพื่อ endorse Skill Mapping standard", desc:"ตาม Delivery MOM งวด 1 Action 5.3.4", dep:"2.1", src:"concepts/skill-matrix.md Skill Mapping Standard", c:"red", note:"external dependency ที่ไม่มี timeline"},
        {id:"2.3", task:"ประสาน TPQI (Professional Qualification standard)", desc:"", dep:"2.1", src:"concepts/skill-matrix.md", c:"red"},
        {id:"2.4", task:"ยืนยันขอบเขต: skill taxonomy definition ไม่ใช่หน้าที่ทีม dev", desc:"ม./อว. เป็นคนกำหนดว่า skill อะไรบ้างที่ต้องเก็บ", dep:"—", src:"concepts/skill-matrix.md Out of Scope", c:"green", note:"เป็น scope boundary ที่ชัดเจนแล้ว — ทีม dev แค่ทำให้ระบบรองรับ ไม่ต้องนั่งออกแบบ taxonomy เอง"},
      ]
    },
    {
      id:"F3", name:"Skill Database (Sprint #26, Phase 2)",
      sources:["sources/gap-vs-sprint-cross-reference.md"],
      tasks:[
        {id:"3.1", task:"Skill Database schema + basic CRUD", desc:"", dep:"F1, F2.1", src:"gap-vs-sprint-cross-reference.md §3.3 (มีแค่ schema ยังไม่มี mapping engine)", c:"yellow", note:"ต้องรอ F2.1 (เลือก standard) ก่อนถึงจะออกแบบ schema จริงได้ — ตอนนี้มีแค่ 'partial' ตามที่ cross-reference ระบุ"},
      ]
    },
    {
      id:"F4", name:"Skill Extractor Integration (Sprint #46, Phase 2)",
      sources:["sources/gap-vs-sprint-cross-reference.md"],
      note:"🔴 thin — ชื่อ feature ใน sprint list เท่านั้น ไม่มี spec รายละเอียดที่ไหนเลย",
      tasks:[
        {id:"4.1", task:"Skill Extractor system integration", desc:"", dep:"F1, F2, F3", src:"gap-vs-sprint-cross-reference.md", c:"red", note:"ไม่มี spec ใดๆ — 'Skill Extractor' คืออะไร/ของใคร ยังไม่มีคำตอบ (คล้ายสถานการณ์เดียวกับ LLRS/Credit Port ใน Blocked Integrations epic)"},
      ]
    },
  ],
  priority: [
    "<b>F2 (standard selection)</b> — ควร escalate เร็วที่สุดเพราะเป็น external blocker แท้จริงที่ block F1, F3, F4 ทั้งหมด ไม่ใช่แค่ priority ต่ำเพราะเป็น Phase 2",
    "<b>F1 (Phase 1 infra)</b> — ทำแค่ระดับ 'design-ready' ตามหลักการที่ยึดไว้แล้ว อย่า over-invest เกิน Phase 1 scope",
    "<b>F3, F4</b> — Phase 2 ทั้งคู่ ไม่ต้อง estimate ละเอียดตอนนี้ รอ F2 เคาะก่อน",
  ],
  flags: [
    "<b>Skill taxonomy standard ไม่มีคำตอบเลย (2.1)</b> — เป็น external blocker ตัวจริงของทั้งโดเมน ไม่ใช่แค่ยังไม่ priority — ทุกอย่างในนี้ต้องรอ",
    "<b>Skill Extractor ไม่มี spec เลย (4.1)</b> — เป็นแค่ชื่อใน Sprint list เหมือนสถานการณ์ LLRS/Credit Port Integration ที่ blocked/empty ในที่อื่น",
    "<b>'Design-ready ≠ Build-complete' เป็นหลักการที่ต้องยึดตอน estimate</b> — อย่า estimate F1 เป็นงาน build เต็มรูปแบบ เพราะ Phase 1 ตั้งใจให้เป็นแค่ preparation",
    "<b>Skill taxonomy definition ไม่ใช่ scope ของทีม dev (2.4)</b> — ชัดเจนแล้วว่าเป็นหน้าที่ ม./อว. — กัน scope creep ถ้ามีใครขอให้ทีม dev ออกแบบ taxonomy เอง",
  ]
};


// ---------- register into multi-epic registry ----------
window.NCBS_EPICS = window.NCBS_EPICS || {};
window.NCBS_EPICS['skill-matrix'] = {
  id: 'skill-matrix',
  system: 'NCBS',
  name: 'Skill Matrix / Skill Database',
  thaiName: 'เมทริกซ์ทักษะและฐานข้อมูลทักษะ',
  status: 'Phase 1 = design-ready เท่านั้น — รอ taxonomy standard ตัดสินใจ',
  epicDeps: SKILL_MATRIX_DATA.epicDeps,
  features: SKILL_MATRIX_DATA.features,
  priority: SKILL_MATRIX_DATA.priority,
  flags: SKILL_MATRIX_DATA.flags,
};
