// NCBS Breakdown — Grade & Credit Management epic data
// Sprint Details #11, #22, #23 (NCBS/UCBS/CTP Grade & Credit Mgmt) v0.7.0-v0.9.0
// Real PRD track: 1 PRD จริง (Nattaya PO/BA) — "core domain PRD" ตามที่ระบุเอง
// ต่างจาก Credit Transfer epic: นี่คือ search/view/export ข้อมูลที่มีอยู่แล้ว ไม่ใช่ workflow เทียบโอน

const GRADE_CREDIT_MANAGEMENT_DATA = {
  epicDeps: [
    { name:"User Management Epic", why:"Learner Detail tab 'รายการสะสมหน่วยกิต' เรียกข้อมูลจาก epic นี้", blocker:false },
    { name:"Credit Transfer Epic", why:"Credit Record Detail ต้องแสดงประวัติการเทียบโอน (source↔target)", blocker:false },
    { name:"Institution Structure Epic", why:"faculty_department_id (SCR-009) ต้องพึ่ง faculty master data", blocker:false },
    { name:"Role & Access Management + PDPA Epic", why:"data scope ต่อ role + citizen ID masking/export permission", blocker:false },
  ],
  features: [
    {
      id:"F1", name:"Central Admin Search Views (3 Tabs)",
      sources:["external/confluence-prd-summaries/prd-grade-credit-management.md (real PRD, Nattaya — 'core domain')"],
      tasks:[
        {id:"1.1", task:"Tab 1: View by Institution", desc:"ม. dropdown autocomplete + รหัสนศ./ปชช. — ดึงจาก UCBS sync", dep:"—", src:"prd-grade-credit-management.md UC1", c:"green"},
        {id:"1.2", task:"Tab 2: View by Individual (Lifelong Record)", desc:"เลข ปชช. 13 หลัก หรือชื่อ-สกุล — ข้ามสถาบัน National Transcript", dep:"—", src:"prd-grade-credit-management.md UC2", c:"green", note:"⭐ unique capability — Central Admin เท่านั้นที่เห็นข้าม-สถาบันได้"},
        {id:"1.3", task:"Tab 3: View by External LMS/System", desc:"Thai MOOC, GenEd — ชื่อ Platform dropdown + ปชช./ชื่อ", dep:"—", src:"prd-grade-credit-management.md UC3", c:"green"},
      ]
    },
    {
      id:"F2", name:"Institution Admin Search Views (2 Tabs)",
      sources:["external/confluence-prd-summaries/prd-grade-credit-management.md"],
      tasks:[
        {id:"2.1", task:"Tab 1: By Curriculum/Course", desc:"รหัสวิชา/ชื่อวิชา/หลักสูตร + filter ปีการศึกษา/ภาคเรียน — เฉพาะสถาบันตัวเอง", dep:"—", src:"prd-grade-credit-management.md UC4", c:"green"},
        {id:"2.2", task:"Tab 2: By Individual (institution-scoped)", desc:"เลข ปชช./รหัสนักศึกษา/ชื่อ — เฉพาะของสถาบันตัวเอง", dep:"—", src:"prd-grade-credit-management.md UC5", c:"green"},
      ]
    },
    {
      id:"F3", name:"Cross-Institution Privacy Enforcement",
      sources:["external/confluence-prd-summaries/prd-grade-credit-management.md Critical Data Privacy Rules"],
      tasks:[
        {id:"3.1", task:"Institution Admin ห้ามเห็น credit ข้ามสถาบัน", desc:"แม้ learner เคยเรียน ม.นี้มาก่อน", dep:"F2", src:"prd-grade-credit-management.md", c:"green"},
        {id:"3.2", task:"No-existence-disclosure", desc:"ค้นไม่พบ → 'ไม่พบข้อมูลในสังกัดสถาบันท่าน' — ห้ามบอกว่า learner ไปเรียนที่ไหน", dep:"3.1", src:"prd-grade-credit-management.md", c:"green"},
        {id:"3.3", task:"Citizen ID always masked", desc:"xxx-x-xxxx-x123-4", dep:"—", src:"prd-grade-credit-management.md (cross-ref PDPA Epic)", c:"green"},
        {id:"3.4", task:"URL parameter tampering defense", desc:"ตรวจสิทธิ์ทุกครั้งที่กดเข้า detail", dep:"3.1", src:"prd-grade-credit-management.md", c:"green"},
      ]
    },
    {
      id:"F4", name:"Credit Record Detail Page (Drill-down)",
      sources:["external/confluence-prd-summaries/prd-grade-credit-management.md UC6"],
      tasks:[
        {id:"4.1", task:"Full detail display", desc:"รายวิชา/ผลการเรียน/ประเภทการศึกษา/สถาบัน", dep:"F1, F2", src:"prd-grade-credit-management.md UC6", c:"green"},
        {id:"4.2", task:"Transfer history display (source↔target)", desc:"", dep:"4.1, Credit Transfer Epic", src:"prd-grade-credit-management.md UC6", c:"green"},
        {id:"4.3", task:"Evidence file display (Transcript/Certificate)", desc:"", dep:"4.1", src:"prd-grade-credit-management.md UC6", c:"green"},
        {id:"4.4", task:"Edge cases", desc:"record ถูกลบระหว่างเปิดดู · URL tampering block · broken evidence file (ปุ่ม download disabled)", dep:"4.1-4.3", src:"prd-grade-credit-management.md Edge cases", c:"green"},
      ]
    },
    {
      id:"F5", name:"Export",
      sources:["external/confluence-prd-summaries/prd-grade-credit-management.md Export"],
      tasks:[
        {id:"5.1", task:"PDF export (เอกสารราชการ สป.อว.)", desc:"", dep:"F1-F4", src:"prd-grade-credit-management.md", c:"green"},
        {id:"5.2", task:"Excel export", desc:"", dep:"F1-F4", src:"prd-grade-credit-management.md", c:"green"},
        {id:"5.3", task:"Export ตาม role permission + rate limit", desc:"", dep:"5.1, 5.2, Role & Access Epic", src:"prd-grade-credit-management.md Open Questions", c:"yellow", note:"เดียวกับ flag ใน User Management epic 6.2 — rate limit ยังไม่มีค่า ควรเคาะร่วมกัน (policy กลางไม่ใช่ต่อ epic)"},
      ]
    },
    {
      id:"F6", name:"Grade System & GPAX",
      sources:["concepts/grade-system.md"],
      tasks:[
        {id:"6.1", task:"16-grade data model", desc:"8 GPA(A-F) + 8 Non-GPA(S/U/P/W/V/I/IP)", dep:"—", src:"grade-system.md", c:"green"},
        {id:"6.2", task:"GPAX calculation", desc:"ผลรวม(GPA×หน่วยกิต)/ผลรวมหน่วยกิต — exclude non-GPA grades", dep:"6.1", src:"grade-system.md GPAX Calculation", c:"green"},
        {id:"6.3", task:"Grade legend UI (collapsible, แยกกลุ่ม GPA/Non-GPA)", desc:"", dep:"6.1", src:"grade-system.md", c:"green"},
      ]
    },
    {
      id:"F7", name:"Extended Credit Data Fields (SCR-009)",
      sources:["decisions/scr-009-credit-data-fields.md"],
      note:"⚠️ ทั้งฟีเจอร์นี้ยัง status=proposed ไม่ใช่ implemented — ต่างจาก F1-F6 ที่มาจาก real PRD ที่ 'In Progress' จริง อย่าประเมินมั่นใจเท่ากัน",
      tasks:[
        {id:"7.1", task:"grade_method field", desc:"วิธีตัดเกรดต่างกันแต่ละมหาลัย (เช่น ลาดกระบังใช้ขั้นต่ำ C+ ภายนอก vs C ภายใน)", dep:"Data Dictionary v2→v2.1 approval", src:"scr-009 §3", c:"yellow", note:"ยัง proposed — รอ approve เข้า Data Dictionary v2.1 ก่อน"},
        {id:"7.2", task:"curriculum_version + curriculum_year fields", desc:"snapshot ตาม version หลักสูตร ณ เวลาเทียบโอน", dep:"7.1, Institution Structure Epic", src:"scr-009 §3", c:"yellow"},
        {id:"7.3", task:"credit_validity_years/expiry_date (configurable ต่อสถาบัน)", desc:"เช่น แพทย์มหิดล ≤5 ปี + warning UI เมื่อใกล้หมด", dep:"7.1", src:"scr-009 §3, §4", c:"yellow", note:"มีแค่ field เสนอ ยังไม่มี policy engine ว่า 'ใกล้หมด' เตือนยังไง/expired แล้วเกิดอะไรกับ credit นั้น"},
        {id:"7.4", task:"faculty_department_id field", desc:"สำหรับ revenue split ส่วนกลาง vs คณะ", dep:"7.1, Institution Structure Epic", src:"scr-009 §3", c:"red", note:"downstream consumer หลัก (SCR-011 Faculty Revenue Split) ถูกระบุใน Phase 1 inventory ว่า 'prototype build cut' แล้ว — field นี้อาจไม่มีที่ใช้จริงในเร็วๆ นี้ ควรเช็คก่อนลงทุน"},
        {id:"7.5", task:"course_syllabus_url field", desc:"ใช้ทั้ง GAP-003 (syllabus link ใน review modal) และ GAP-004", dep:"7.1", src:"scr-009 §3, §10", c:"yellow", note:"ผูกกับ Credit Transfer Epic 2.x (matching algorithm SCR-013 fallback) — ทำคู่กันได้"},
      ]
    },
  ],
  priority: [
    "<b>F6 (Grade System)</b> — เป็น data model พื้นฐานที่ F1-F5 ต้องใช้ ควรทำก่อนแม้จะดูเป็น feature เล็ก",
    "<b>F1, F2 (search views)</b> — ทำคู่กับ F3 (privacy enforcement) เสมอ ห้ามแยกทำทีหลัง เพราะเป็นความเสี่ยง privacy สูงถ้า enforcement ตามหลัง",
    "<b>F4, F5</b> — ทำหลัง F1-F3 มีของจริงให้ drill-down/export",
    "<b>F7 (SCR-009 extended fields)</b> — priority ต่ำกว่า F1-F6 เพราะยัง proposed ไม่ approved — ควรรอ Data Dictionary v2.1 sign-off ก่อน โดยเฉพาะ 7.4 ที่ downstream ถูก cut ไปแล้ว",
  ],
  flags: [
    "<b>SCR-009 ทั้งชุดยัง proposed (F7)</b> — ต่างจาก F1-F6 ที่อิง real PRD 'In Progress' จริง F7 อิง SCR ที่ยังไม่ approve เข้า Data Dictionary — ห้าม estimate มั่นใจเท่ากับ F1-F6",
    "<b>faculty_department_id downstream ถูก cut แล้ว (7.4)</b> — SCR-011 (Faculty Revenue Split) ที่เป็นเหตุผลหลักของ field นี้ถูกระบุใน Phase 1 ว่า build cut แล้ว — ควรถามทีมว่ายังต้องการ field นี้อยู่ไหมก่อนลงทุน schema change",
    "<b>Export rate limit + citizen ID full-reveal (5.3)</b> — เป็น open question เดียวกับที่ flag ไว้ใน User Management epic — ควรเคาะเป็น policy กลางระดับโครงการครั้งเดียว ไม่ใช่แยกเคาะต่อ epic",
    "<b>Credit expiry policy engine ไม่มี (7.3)</b> — มีแค่ field เสนอ ไม่มี logic ว่า warning เตือนล่วงหน้ากี่วัน หรือ credit ที่ expired แล้วใช้เทียบโอนได้ไหม ต้องออกแบบเพิ่มก่อน implement",
    "<b>Performance ที่ scale ใหญ่ยังไม่มีคำตอบ</b> — PRD จริงเองถามไว้เป็น open question: ดึงผู้เรียน 1,000+ คนใน 1 รายวิชา ต้องมี caching/pagination strategy อะไร — ควรตอบก่อนขึ้น production จริง",
  ]
};


// ---------- register into multi-epic registry ----------
window.NCBS_EPICS = window.NCBS_EPICS || {};
window.NCBS_EPICS['grade-credit-management'] = {
  id: 'grade-credit-management',
  system: 'NCBS',
  name: 'Grade & Credit Management',
  thaiName: 'การจัดการเกรดและหน่วยกิต',
  status: 'Real PRD In Progress ("core domain", Nattaya PO/BA)',
  epicDeps: GRADE_CREDIT_MANAGEMENT_DATA.epicDeps,
  features: GRADE_CREDIT_MANAGEMENT_DATA.features,
  priority: GRADE_CREDIT_MANAGEMENT_DATA.priority,
  flags: GRADE_CREDIT_MANAGEMENT_DATA.flags,
};
