// NCBS Breakdown — Institution Structure & Master Data epic data (SCR-021)
// ⚠️ ทั้ง epic นี้เป็น Track B ล้วน (AI-generated draft PRD, รอ BA/PO review) — ไม่มี real Confluence PRD คู่กัน
// ต่างจาก Epic "Multi-Channel Data Ingestion" ซึ่งโฟกัสช่องทางนำเข้าข้อมูลรายวิชา (API/File/JIT) — epic นี้คือ "รูปร่างโครงสร้าง" ขององค์กร

const INSTITUTION_STRUCTURE_DATA = {
  epicDeps: [
    { name:"Data & Service Foundation (DB schema/tenancy)", why:"เป็น breaking schema change ต้องผ่าน migration strategy ของ epic foundation ก่อน", blocker:false },
    { name:"Multi-Channel Data Ingestion", why:"โครงสร้างที่ epic นี้สร้าง (campus/faculty/curriculum) ต้องมีข้อมูลจริงจากช่องทางนำเข้าเข้ามา populate", blocker:false },
    { name:"Role & Access Management (Faculty-scoped ABAC)", why:"ใช้ attribute 'faculty' ชุดเดียวกัน (SCR-020) — ต้อง sync กัน", blocker:false },
  ],
  features: [
    {
      id:"F1", name:"Data Model Migration (Breaking Changes)",
      sources:["decisions/scr-021-institution-structure.md","decisions/2026-07-institution-structure-spec-draft.md"],
      note:"⚠️ ทั้งฟีเจอร์นี้เป็น Track B (AI-generated, รอ BA/PO review) — ไม่มี real PRD คู่กันใน Confluence catalog",
      tasks:[
        {id:"1.1", task:"campus table (ใหม่)", desc:"type enum(main/campus/off_site_center) + province + soft-delete", dep:"Data & Service Foundation", src:"scr-021 §2", c:"green"},
        {id:"1.2", task:"department table (ใหม่, ชั้น optional)", desc:"faculty_id fk, active+soft-delete", dep:"1.3", src:"scr-021 §2", c:"green"},
        {id:"1.3", task:"faculty table alter (+unit_type)", desc:"enum(faculty/college/school/institute) default faculty", dep:"1.1", src:"scr-021 §2", c:"green"},
        {id:"1.4", task:"curriculum table alter — BREAKING", desc:"id→uuid surrogate + checo_code varchar(14) + revision_year + unique(univ,checo,revision) + degree_level enum(6) + status enum(active/no_new_intake/retired)", dep:"1.3", src:"scr-021 §2, spec-draft §2", c:"yellow", note:"breaking change จาก model เดิม (curriculum.id เดิมผูกตรงกับ CHECO code) — ต้องมี migration plan สำหรับข้อมูลเดิมที่มีอยู่ ไม่ใช่แค่สร้างตารางใหม่ — ไม่มีที่ไหนพูดถึง migration script ของจริง"},
        {id:"1.5", task:"curriculum_campus M:N junction table", desc:"สถานที่จัดสอน", dep:"1.1, 1.4", src:"scr-021 §2", c:"green"},
        {id:"1.6", task:"curriculum_course M:N junction table", desc:"course_group enum(general_ed/specific/free_elective) + sub_group + required", dep:"1.4", src:"scr-021 §2", c:"green"},
        {id:"1.7", task:"course table alter — BREAKING", desc:"+owner_faculty_id(บังคับ) +owner_department_id(nullable) · curriculum_id/program_id deprecated แทนด้วย join", dep:"1.3, 1.6", src:"scr-021 §2", c:"yellow", note:"breaking change เดียวกับ 1.4 — ทุก record รายวิชาเดิมต้อง backfill owner_faculty_id ก่อน deploy จริง"},
      ]
    },
    {
      id:"F2", name:"UCBS \"โครงสร้างสถาบัน\" Management UI",
      sources:["decisions/2026-07-institution-structure-spec-draft.md §4"],
      tasks:[
        {id:"2.1", task:"4-tab structure page", desc:"วิทยาเขต · คณะ/หน่วยงาน(รวม unit_type+ภาควิชา expand) · หลักสูตร(checo_code+revision+สถานะ+สถานที่) · เมนูกลุ่มใหม่ 'จัดการข้อมูล'", dep:"F1", src:"spec-draft §4.1", c:"green"},
        {id:"2.2", task:"Curriculum CRUD (checo_code+revision_year+status+teaching locations)", desc:"", dep:"2.1, 1.4, 1.5", src:"spec-draft §4.1", c:"green"},
        {id:"2.3", task:"Lifecycle rules enforcement", desc:"active+soft-delete ทุกชั้น · ห้ามลบเมื่อมีลูก(ใช้'ยกเลิกการใช้งาน'แทน) · แก้มีผลกับ resolution ทันที+audit", dep:"2.1", src:"scr-021 §2 Ownership", c:"yellow", note:"หลักการชัดเจนแต่ 'Enforcement จริงที่ API layer = งาน dev (prototype = mock)' ตามที่ SCR ระบุเอง"},
      ]
    },
    {
      id:"F3", name:"Course Registry Integration",
      sources:["decisions/2026-07-institution-structure-spec-draft.md §4.2"],
      tasks:[
        {id:"3.1", task:"Course registration + owner faculty/department dropdown", desc:"", dep:"F1, F2", src:"spec-draft §4.2", c:"green"},
        {id:"3.2", task:"\"ใช้ในหลักสูตร\" panel (จัดการ curriculum_course)", desc:"เพิ่มหลักสูตร+หมวด+กลุ่มย่อยต่อรายวิชา", dep:"3.1, 1.6", src:"spec-draft §4.2", c:"green"},
      ]
    },
    {
      id:"F4", name:"NCBS Read-only Institution View + Quality Indicators",
      sources:["decisions/2026-07-institution-structure-spec-draft.md §4.3"],
      tasks:[
        {id:"4.1", task:"Institution detail \"โครงสร้าง\" tab (drill-down, read-only)", desc:"", dep:"F1-F3", src:"spec-draft §4.3", c:"green"},
        {id:"4.2", task:"Orphan indicators", desc:"รายวิชาไม่อยู่ในหลักสูตรใด · หลักสูตร active ไม่มีรายวิชา · checo_code ผิดรูปแบบ", dep:"4.1", src:"spec-draft §4.3", c:"green", note:"real quality-metric feature ที่มีคุณค่าจริง ไม่ใช่แค่ UI mock"},
      ]
    },
    {
      id:"F5", name:"Transfer Request Target-Curriculum Resolution",
      sources:["decisions/scr-021-institution-structure.md §2 Resolution chain"],
      tasks:[
        {id:"5.1", task:"target_curriculum_id field บน transfer_request + item", desc:"", dep:"F1, Credit Transfer Epic (F1 data model)", src:"scr-021 §2", c:"green"},
        {id:"5.2", task:"Resolution chain logic", desc:"target_curriculum → คณะเจ้าของหลักสูตร → override[faculty] → default · fallback (ไม่มี target curriculum) = คณะเจ้าของรายวิชา", dep:"5.1, 1.7", src:"scr-021 §2", c:"green", note:"logic ชัดเจน แก้ปัญหาเดิมที่ 'พังเมื่อวิชาอยู่หลายหลักสูตร'"},
        {id:"5.3", task:"CTP UI: เลือกหลักสูตรเป้าหมายเมื่อวิชาอยู่หลายหลักสูตร", desc:"dropdown จาก curriculum_course", dep:"5.2, Credit Transfer Epic F1", src:"spec-draft §4.4", c:"green"},
      ]
    },
  ],
  priority: [
    "<b>F1 (schema migration)</b> — ต้องทำก่อนสุด และต้องมี migration plan สำหรับ breaking change (1.4, 1.7) ก่อน ไม่ใช่แค่ CREATE TABLE ใหม่ — เสี่ยงสูงสุดในทั้ง epic",
    "<b>F2, F3</b> — ทำคู่ขนานกันได้หลัง F1 เสร็จ",
    "<b>F4 (orphan indicators)</b> — ทำได้เมื่อมีข้อมูลจริงจาก Multi-Channel Data Ingestion epic ไหลเข้ามาแล้ว ไม่งั้นจะไม่มีอะไรให้ตรวจ",
    "<b>F5</b> — ต้องรอ Credit Transfer epic (F1 data model) เสร็จคู่กัน เพราะแก้ schema transfer_request ร่วมกัน",
  ],
  flags: [
    "<b>Breaking schema migration ไม่มีแผน (1.4, 1.7)</b> — เปลี่ยน curriculum.id จาก CHECO code ตรงๆ เป็น uuid surrogate และ deprecate course.curriculum_id/program_id เป็น breaking change ที่กระทบข้อมูลเดิมทั้งหมด แต่ไม่มีที่ไหนในเอกสารพูดถึง migration script/rollback plan จริง — ควรถามทีมก่อนเริ่ม ว่าจะ migrate ข้อมูลเดิมยังไง",
    "<b>Track B ล้วน ไม่มี real PRD</b> — epic นี้ทั้งหมดมาจาก AI-generated draft (SCR-021 + spec-draft) ที่ 'รอ BA/PO review' ยังไม่เคยผ่านการ sign-off จริง ต่างจาก Identity/User Mgmt ที่มี real Confluence PRD คู่กัน — ควร treat เป็น proposed requirement ที่ต้อง confirm ก่อน commit sprint",
    "<b>CISA curriculum resolver ยังไม่มีสเปค (external)</b> — CURR_ID reference table เพื่อ resolve หลักสูตรจาก UniCon ยังไม่เห็นสเปคจาก CISA (ระบบใหม่แทน CHECO) — เอกสารเขียนตรงๆ ว่า 'ห้ามปิดตาย' เป็น external dependency ที่ควร track แยก",
    "<b>SRS FR numbering collision</b> — เดิมเสนอเป็น SCR-020 แต่เลขชนกับ Faculty-scoped ABAC จึงเลื่อนเป็น SCR-021 — ไม่กระทบงาน dev โดยตรง แต่เป็นสัญญาณว่า SCR registry ต้องการ governance ที่รัดกุมกว่านี้",
  ]
};


// ---------- register into multi-epic registry ----------
window.NCBS_EPICS = window.NCBS_EPICS || {};
window.NCBS_EPICS['institution-structure'] = {
  id: 'institution-structure',
  system: 'UCBS',
  name: 'Institution Structure & Master Data',
  thaiName: 'โครงสร้างสถาบันและข้อมูลหลัก',
  status: 'Track B (AI-generated draft, รอ BA/PO) — breaking schema migration ยังไม่มีแผน',
  epicDeps: INSTITUTION_STRUCTURE_DATA.epicDeps,
  features: INSTITUTION_STRUCTURE_DATA.features,
  priority: INSTITUTION_STRUCTURE_DATA.priority,
  flags: INSTITUTION_STRUCTURE_DATA.flags,
};
