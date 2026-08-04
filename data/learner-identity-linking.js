// NCBS Breakdown — Learner Identity Linking epic data (SCR-022)
// ⚠️ โดเมนใหม่ทั้งหมด — "ยังไม่เคยมีเอกสาร/flow เรื่องนี้ในทั้ง 2 repo" ก่อน 2026-07-11
// ไม่มี real Confluence PRD คู่กันเลย — ไม่อยู่บน real dev roadmap ที่เห็นในทั้ง wiki ณ วันที่เขียนไฟล์นี้

const LEARNER_IDENTITY_LINKING_DATA = {
  epicDeps: [
    { name:"Identity & Authentication", why:"ThaID verification (IAL2+) เป็น precondition ของ auto-claim", blocker:false },
    { name:"Multi-Channel Data Ingestion", why:"institution feed (API/File/JIT) เป็นแหล่งสร้าง shadow record", blocker:false },
    { name:"Identity & Authentication → Foreign Learner Identity (SCR-019)", why:"passport identifier ของผู้เรียนต่างชาติเชื่อมกับ id_type=passport ของ epic นี้โดยตรง", blocker:false },
    { name:"Credit Transfer + Learner Profile/Portfolio Epics", why:"เป็นจุด 'ได้ประโยชน์' ที่ต้อง gate ด้วยบัญชี verified", blocker:false },
  ],
  features: [
    {
      id:"F1", name:"NCBS ID Spine & Linked Identifiers (Data Model)",
      sources:["decisions/scr-022-learner-identity-linking.md §2","decisions/2026-07-learner-identity-linking-spec-draft.md §2.2"],
      tasks:[
        {id:"1.1", task:"โครงสร้างตารางข้อมูลเลขประจำตัวผู้เรียน (Learner Identity Linking - Data Structure)", desc:"1 learner : N identifiers — id_type enum(citizen_id/passport/g_code), id_value(encrypted+pii), country, status enum(unverified/verified/superseded), verified_via enum(thaid/unicon/manual_review/institution_attested), verified_at, superseded_by", dep:"Data & Service Foundation", src:"spec-draft §2.2", c:"green", note:"schema field-level ให้ครบมาก พร้อม dev"},
        {id:"1.2", task:"กฎป้องกันเลขประจำตัวซ้ำในระบบ (Learner Identity Linking - Data Validation)", desc:"กันชนกันโดยโครงสร้าง — เลขหนึ่งผูก learner เดียว", dep:"1.1", src:"scr-022 §2.2", c:"green"},
        {id:"1.3", task:"ระบบแทนที่เลขประจำตัวเก่าด้วยเลขใหม่โดยไม่เสียประวัติ (Learner Identity Linking - Business Logic)", desc:"เพิ่ม identifier ใหม่ → ตัวเก่า superseded → ประวัติหน่วยกิตไม่ rekey (เช่น ต่างชาติได้สัญชาติไทย, รหัส G ได้เลขจริง)", dep:"1.1", src:"scr-022 §2.1", c:"green"},
      ]
    },
    {
      id:"F2", name:"Shadow Record & Auto-Claim",
      sources:["decisions/scr-022-learner-identity-linking.md §2.3"],
      tasks:[
        {id:"2.1", task:"สถานะบัญชีผู้เรียน: ยังไม่ยืนยัน/ใช้งานอยู่/ถูกระงับ (Learner Identity Linking - Data Structure)", desc:"", dep:"F1", src:"spec-draft §2.3, gap#2", c:"green"},
        {id:"2.2", task:"สร้างข้อมูลผู้เรียนล่วงหน้าก่อนสมัครใช้งานจริง (Learner Identity Linking - Business Logic)", desc:"ไม่มี credential · ไม่ปรากฏสาธารณะ · เก็บ achievement ตามปกติ", dep:"2.1, Multi-Channel Data Ingestion Epic", src:"scr-022 §2.3", c:"green"},
        {id:"2.3", task:"ผูกข้อมูลผู้เรียนที่มีอยู่ก่อนเข้ากับบัญชีใหม่โดยอัตโนมัติ (Learner Identity Linking - Business Logic)", desc:"identifier ตรง → merge เข้าบัญชีอัตโนมัติ ไม่มีหน้าจอแจ้ง/ปุ่ม dispute (ปรับจากข้อเสนอเดิมที่มีหน้าจอ+ปุ่ม dispute)", dep:"2.2, Identity & Auth Epic (ThaID IAL2+)", src:"scr-022 §2.3, spec-draft D3", c:"yellow", note:"เป็นตัวอย่าง design pivot ที่เกิดขึ้นจริงระหว่างทาง (D3 เปลี่ยนจาก 'หน้าจอ+dispute button' เป็น silent) — บอกว่า requirement โดเมนนี้ยังไม่นิ่งพอที่จะ lock UX"},
        {id:"2.4", task:"ตรวจสอบฐานกฎหมาย PDPA สำหรับการเก็บข้อมูลผู้เรียนล่วงหน้า (Learner Identity Linking - Legal/Compliance)", desc:"อ้างอิง ม.24(4)/(6) (ภารกิจรัฐ/หน้าที่ตามกฎหมาย) — เป็นข้อเสนอ ยังไม่ confirm", dep:"—", src:"scr-022 §4, spec-draft D2", c:"red", note:"Legal blocker ไม่ใช่ dev blocker — ระบุตรงๆ ว่า 'ต้องฝ่ายกฎหมายยืนยันฐานที่ใช้จริง' ถ้ากฎหมายไม่ยอมรับฐานนี้ ต้องออกแบบ consent flow ใหม่ทั้งชุด กระทบ F2 ทั้งฟีเจอร์"},
      ]
    },
    {
      id:"F3", name:"Ingest Matching Pipeline (Hybrid)",
      sources:["decisions/2026-07-learner-identity-linking-spec-draft.md §2.4"],
      tasks:[
        {id:"3.1", task:"ระบบจับคู่ข้อมูลผู้เรียนอัตโนมัติแบบผสมผสาน (Learner Identity Linking - Matching Engine)", desc:"identifier ตรง+ชื่อ/วันเกิดสอดคล้อง→ผูกอัตโนมัติ · identifier ตรงแต่ขัดกัน→conflict queue · ไม่มี identifier แต่คล้ายสูง→review queue · ไม่ match→unclaimed ใหม่", dep:"F1, F5 (import id_type)", src:"spec-draft §2.4", c:"green", note:"flowchart ชัดเจน"},
        {id:"3.2", task:"รวมข้อมูลผู้เรียนคนเดียวกันจากหลายสถาบันเข้าด้วยกัน (Learner Identity Linking - Data Merging)", desc:"", dep:"3.1", src:"scr-022 §2.4, Scenario S3", c:"green"},
      ]
    },
    {
      id:"F4", name:"Benefit-Point Account Gate",
      sources:["decisions/scr-022-learner-identity-linking.md §2.5 (D5)"],
      tasks:[
        {id:"4.1", task:"ด่านตรวจสอบยืนยันตัวตนก่อนใช้สิทธิ์สำคัญ (เทียบโอน/ใบผลการเรียนรวม/แชร์โปรไฟล์) (Learner Identity Linking - Access Control)", desc:"นำเข้าข้อมูลไม่บังคับมีบัญชี แต่ 3 จุดนี้ต้อง verified", dep:"F2, Credit Transfer Epic, Learner Profile/Portfolio Epic", src:"scr-022 §2.5", c:"green", note:"หลักการชัดเจน (บทเรียนจาก USI ออสเตรเลีย) — ต้อง implement cross-epic ในทั้ง 3 จุด"},
      ]
    },
    {
      id:"F5", name:"Import Enhancement (Institution Feed)",
      sources:["decisions/2026-07-learner-identity-linking-spec-draft.md §4"],
      tasks:[
        {id:"5.1", task:"แบบฟอร์มนำเข้าข้อมูลที่รองรับเลขประจำตัวหลายประเภท (Learner Identity Linking - Data Import)", desc:"ปลดล็อก passport (แก้ conflict กับ SCR-019 ที่ validator เดิมบังคับ 13 หลัก)", dep:"F1, Multi-Channel Data Ingestion Epic", src:"spec-draft §4, gap#4", c:"green"},
        {id:"5.2", task:"เพิ่มข้อมูลชื่อ-นามสกุลและวันเกิดเพื่อใช้ตรวจสอบไขว้ (Learner Identity Linking - Data Import)", desc:"ใช้ตรวจ identifier พิมพ์ผิด + fuzzy matching", dep:"5.1", src:"spec-draft §4", c:"green"},
        {id:"5.3", task:"เก็บรหัสนักศึกษาไว้อ้างอิง ไม่ใช้จับคู่ตัวตน (Learner Identity Linking - Data Structure)", desc:"", dep:"5.1", src:"spec-draft §4", c:"green"},
        {id:"5.4", task:"API ตรวจสอบตัวตนผู้เรียนล่วงหน้าก่อนส่งข้อมูลจริง (Learner Identity Linking - API)", desc:"ตอบแค่ match/no_match/conflict ไม่เปิดเผยข้อมูล — rate limit 10 req/นาที/key", dep:"F1, API Management Epic", src:"scr-022 §3 IDL-04, SCR-023 §3", c:"green"},
      ]
    },
    {
      id:"F6", name:"Match Review / Conflict Queue (Admin)",
      sources:["decisions/2026-07-learner-identity-linking-spec-draft.md §2.4, §6"],
      tasks:[
        {id:"6.1", task:"คิวตรวจสอบกรณีข้อมูลขัดแย้งกัน (Learner Identity Linking - Admin Review)", desc:"block auto-merge จนกว่าตรวจจบ", dep:"F3", src:"scr-022 §3 IDL-03", c:"green"},
        {id:"6.2", task:"คิวตรวจสอบกรณีข้อมูลคล้ายกันแต่ไม่ตรงเป๊ะ (Learner Identity Linking - Admin Review)", desc:"สถาบันเจ้าของ record เป็นผู้ตรวจ (รู้ข้อมูลจริง)", dep:"F3", src:"scr-022 §3 IDL-03, spec-draft D4", c:"green", note:"reuse pattern คิวตรวจตัวตน SCR-019 ได้ (โครง UI เดียวกัน)"},
        {id:"6.3", task:"แดชบอร์ดภาพรวมสำหรับ อว. (Learner Identity Linking - Dashboard)", desc:"", dep:"6.1, 6.2", src:"spec-draft D4", c:"green"},
      ]
    },
    {
      id:"F7", name:"Remaining Explicit Gaps (§5 ข้อ 6-8 ของ spec)",
      sources:["decisions/2026-07-learner-identity-linking-spec-draft.md §5"],
      note:"SCR ระบุเองว่า 'quick wins implemented แล้ว เหลือ gap §5 ข้อ 6-8 เป็นงาน implement จริง' — นี่คือรายการที่ยังไม่มีการออกแบบเลย ไม่ใช่แค่ยังไม่ build",
      tasks:[
        {id:"7.1", task:"ขั้นตอนโต้แย้ง/รวม/แยกข้อมูลผู้เรียนที่ผูกผิดคน (Learner Identity Linking - Dispute Handling)", desc:"", dep:"F2, F6", src:"spec-draft §5 ข้อ 6", c:"red", note:"ไม่มีดีไซน์เลย — ระบุเป็น gap ตรงๆ"},
        {id:"7.2", task:"แจ้งเตือนผู้เรียนเมื่อมีข้อมูลถูกนำเข้าหรือยืนยันตัวตนสำเร็จ (Learner Identity Linking - Notification)", desc:"", dep:"F2.3, Notification Epic", src:"spec-draft §5 ข้อ 7", c:"red", note:"ไม่มีดีไซน์เลย — จำเป็นสำหรับ PDPA transparency"},
        {id:"7.3", task:"ปรับโครงสร้างข้อมูลจากเลขบัตรประชาชนเดี่ยวเป็นคู่ประเภท-ค่า (Learner Identity Linking - Data Migration)", desc:"studentId เปลี่ยนเป็น reference-only", dep:"F1", src:"spec-draft §5 ข้อ 5", c:"yellow", note:"mechanical แต่กระทบหลาย endpoint ที่มีอยู่แล้ว — breaking change ต่อ API consumer เดิม"},
        {id:"7.4", task:"ประสานงานข้อมูลภายนอก: UniCon และฝ่ายกฎหมาย (Learner Identity Linking - External Coordination)", desc:"ขอ data dict UniCon (schema key) · ตรวจประกาศ กมอ.2565 ฉบับเต็มว่าพูดถึง identifier ไหม · ฐาน PDPA (ฝ่ายกฎหมาย — เดียวกับ 2.4)", dep:"—", src:"spec-draft §5 ข้อ 8", c:"red", note:"external/legal dependency ไม่ใช่งาน dev"},
      ]
    },
  ],
  priority: [
    "<b>F1 (identifier data model)</b> — ต้องทำก่อนสุด เป็นฐานของทั้ง epic",
    "<b>F5 (import enhancement)</b> — ต้องทำก่อน F3 เพราะ matching pipeline พึ่ง id_type/ชื่อ/วันเกิดจาก import",
    "<b>2.4 (PDPA legal basis)</b> — ควรได้คำตอบจากฝ่ายกฎหมายเร็วที่สุด เพราะกระทบทั้งดีไซน์ F2 ถ้าฐานกฎหมายที่เสนอไม่ผ่าน",
    "<b>F3, F6</b> — ทำต่อจาก F1/F5 เป็นคู่กัน (matching pipeline + queue ที่รับผลจาก pipeline)",
    "<b>F4 (benefit gate)</b> — ทำพร้อมกับ epic ที่มีจุด gate จริง (Credit Transfer, Learner Profile/Portfolio) ไม่ใช่ทำแยกเดี่ยว",
    "<b>F7 (gap #6-8)</b> — priority ต่ำสุดตามที่ SCR เองจัดไว้ แต่ 7.4 (legal/external) ควร escalate เร็วเพราะเป็น blocker ข้ามฟีเจอร์",
  ],
  flags: [
    "<b>โดเมนใหม่ทั้งหมด ไม่มีใน real dev roadmap</b> — SCR-022 เขียนเองว่า 'ยังไม่เคยมีเอกสาร/flow เรื่องนี้ในทั้ง 2 repo' ก่อน ก.ค. 69 — ต่างจาก epic อื่นที่อย่างน้อยมี Track A (real PRD) คู่กันบางส่วน epic นี้เป็น Track B ล้วน 100% ควร treat เป็น 'requirement ที่เพิ่งค้นพบ' ไม่ใช่ backlog ที่มีมานาน",
    "<b>PDPA legal basis ยังไม่ confirm (2.4, 7.4)</b> — shadow record ก่อนเจ้าตัวสมัครอ้างฐาน ม.24(4)/(6) เป็นแค่ข้อเสนอ ถ้าฝ่ายกฎหมายไม่ยอมรับ ต้องออกแบบ consent flow ใหม่ทั้งชุด กระทบ F2 ทั้งฟีเจอร์และอาจกระทบ Multi-Channel Data Ingestion epic ด้วย",
    "<b>Design pivot ที่เกิดขึ้นแล้ว (2.3, D3)</b> — auto-claim UX เปลี่ยนจาก 'หน้าจอ+ปุ่ม dispute' เป็น 'silent resolve ไม่มี UI' ระหว่างการออกแบบ เป็นสัญญาณว่า domain นี้ requirement ยังไม่นิ่งพอ ควรคุยกับทีมก่อน lock ดีไซน์สุดท้าย",
    "<b>Dispute/merge/split workflow ไม่มีดีไซน์เลย (7.1)</b> — เป็น gap ที่ระบุตรงๆ ว่ายังไม่ทำ แต่จำเป็นมากถ้าเกิด case จริง (เลขชนกัน/ข้อมูลผิดคน) เพราะ Support Ticket system ถูกตัดออกจาก scope ทั้งระบบแล้ว (ไม่มีช่องทางแก้ปัญหานี้นอกระบบด้วยซ้ำ)",
    "<b>DTO migration (7.3) เป็น breaking change</b> — citizenId → idType/idValue กระทบทุก endpoint ที่มีอยู่แล้วซึ่งรับ citizenId ตรงๆ ควร sequence ให้ดีกับ API Management/Contract-sync epic",
  ]
};


// ---------- register into multi-epic registry ----------
window.NCBS_EPICS = window.NCBS_EPICS || {};
window.NCBS_EPICS['learner-identity-linking'] = {
  id: 'learner-identity-linking',
  system: 'NCBS',
  name: 'Learner Identity Linking',
  thaiName: 'การเชื่อมโยงตัวตนผู้เรียน',
  status: 'โดเมนใหม่ — quick wins ใน prototype เท่านั้น ไม่อยู่ใน real dev roadmap',
  epicDeps: LEARNER_IDENTITY_LINKING_DATA.epicDeps,
  features: LEARNER_IDENTITY_LINKING_DATA.features,
  priority: LEARNER_IDENTITY_LINKING_DATA.priority,
  flags: LEARNER_IDENTITY_LINKING_DATA.flags,
};
