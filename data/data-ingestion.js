// NCBS Breakdown — Multi-Channel Data Ingestion epic data (Master Data Onboarding spec)
// Sprint Details #56 (File Upload) Phase 2 — แต่ spec ฝั่ง wiki (Track B) ครอบคลุมกว้างกว่านั้นมาก (4 ช่องทาง)
// ⚠️ Track B ล้วน — ไม่มี real Confluence PRD คู่กัน

const DATA_INGESTION_DATA = {
  epicDeps: [
    { name:"Data & Service Foundation", why:"schema + async job backbone (NATS/Outbox) ที่ pipeline ต้องใช้", blocker:false },
    { name:"Institution Structure & Master Data", why:"รายวิชาต้องผูกกับ campus/faculty/curriculum ที่ epic นั้นสร้าง", blocker:false },
    { name:"API Management & Integration Standards", why:"Channel 1 (API) ใช้ OpenAPI contract + API User role จาก SCR-016", blocker:false },
    { name:"Credit Transfer Epic", why:"Channel 3 (Just-in-time) เป็นส่วนหนึ่งของ transfer request flow", blocker:false },
  ],
  features: [
    {
      id:"F1", name:"Canonical Course Schema & Data Lifecycle",
      sources:["decisions/2026-07-master-data-onboarding.md §2, §3(ค)"],
      tasks:[
        {id:"1.1", task:"โครงสร้างข้อมูลกลางของรายวิชา (Canonical Schema - Course Master Data Structure)", desc:"univ_id, course_code, title/description TH-EN, credit(ทฤษฎี-ปฏิบัติ-ศึกษาเอง), category, content_topics[], CLO[](text+bloom+keywords), data_state, source_channel, audit", dep:"Institution Structure Epic", src:"master-data-onboarding.md §2", c:"green"},
        {id:"1.2", task:"สถานะวงจรชีวิตข้อมูลวิชา จากโครงร่างจนถึงยืนยันทางการ (Canonical Schema - Data Lifecycle State Machine)", desc:"skeleton→enriched→verified→official · แก้ record official = revision ใหม่ผูก curriculum_version เดิม", dep:"1.1", src:"master-data-onboarding.md §3(ค)", c:"green"},
        {id:"1.3", task:"กฎลำดับความน่าเชื่อถือของข้อมูลเมื่อมาจากหลายช่องทาง (Canonical Schema - Merge Precedence Rule)", desc:"just-in-time verified = file-import verified > API enriched > skeleton · sync ใหม่จาก UniCon ห้าม downgrade state", dep:"1.2", src:"master-data-onboarding.md §3.2", c:"green"},
      ]
    },
    {
      id:"F2", name:"Channel 0 — Central Bootstrap (UniCon)",
      sources:["decisions/2026-07-master-data-onboarding.md §1, §3.1, §7"],
      tasks:[
        {id:"2.1", task:"ซิงค์ข้อมูลสถาบันจาก UniCon ปีละครั้ง (Channel 0 UniCon - Institution Sync)", desc:"ปีละ 1 ครั้ง (หลัง 1 ต.ค.) — full snapshot + diff report", dep:"—", src:"master-data-onboarding.md §3.1-3.2", c:"yellow", note:"ต้องยืนยัน UniCon read access ระดับไหนก่อน (Open Item O1)"},
        {id:"2.2", task:"ซิงค์ข้อมูลบุคลากรจาก UniCon ปีละ 2 ครั้ง (Channel 0 UniCon - Personnel Sync)", desc:"ปีละ 2 ครั้ง (21 ก.ย./24 ก.พ.) — delta ต่อ UNIV_ID เทียบ CITIZEN_ID", dep:"—", src:"master-data-onboarding.md §3.1-3.2", c:"green"},
        {id:"2.3", task:"สร้างโครงร่างข้อมูลรายวิชาเบื้องต้นจาก UniCon (Channel 0 UniCon - Course Skeleton Derivation)", desc:"distinct-merge ต่อ univ+course_code, ไม่ overwrite record ที่ enrich แล้ว", dep:"2.1", src:"master-data-onboarding.md §1, §3.2", c:"green", note:"⚠️ freshness gap โดยธรรมชาติ: ครอบเฉพาะวิชาที่มีผู้สำเร็จการศึกษาแล้ว วิชาใหม่ไม่ขึ้น skeleton ทันที (~1 ปี) — ต้องพึ่ง Channel 2/3 ปิด gap เสมอ ไม่ใช่ของเสริม"},
        {id:"2.4", task:"จัดการรหัสหลักสูตรแบบอ้างอิงชั่วคราวจนกว่าจะมีระบบยืนยันจริง (Channel 0 UniCon - Curriculum ID Placeholder)", desc:"เก็บเป็น reference จนกว่าจะมี resolver (UniCon internal master หรือ CISA)", dep:"2.3", src:"master-data-onboarding.md Open Items O2/O3", c:"red", note:"CISA (ระบบใหม่แทน CHECO) — 'ยังไม่เห็นสเปคเลย ต๊ะไว้สืบ ไม่ตัดออก' เป็น external unknown ที่แท้จริง ไม่ใช่แค่ยังไม่เคาะ"},
      ]
    },
    {
      id:"F3", name:"Channel 1 — API Ingestion (Advanced Tier)",
      sources:["decisions/2026-07-master-data-onboarding.md §3"],
      tasks:[
        {id:"3.1", task:"API รับส่งข้อมูลรายวิชาและ CLO ตามมาตรฐาน OpenAPI (Channel 1 API - OpenAPI Contract)", desc:"ใช้ api-layer/ncbs-api-spec.yaml + API User role (SCR-016)", dep:"API Management Epic", src:"master-data-onboarding.md §3 ช่องทาง 1", c:"green"},
        {id:"3.2", task:"ตั้งรอบดึงข้อมูลรายวันหรือรับข้อมูลแบบทันทีตามที่สถาบันเลือก (Channel 1 API - Sync Schedule Option)", desc:"delta ตาม updated_at ฝั่งสถาบัน", dep:"3.1", src:"master-data-onboarding.md §3.2", c:"yellow", note:"คอขวดจริงคือรอบปรับหลักสูตรของสถาบันเอง (ต่อภาคเรียน) ไม่ใช่ technical limitation"},
      ]
    },
    {
      id:"F4", name:"Channel 2 — File Template Import",
      sources:["decisions/2026-07-master-data-onboarding.md §3, §3.0"],
      note:"ระบุตรงๆ ว่าเป็น 'ช่องทางหลัก คาดว่าครอบมากสุด' — ควรได้ priority สูงกว่า Channel 1",
      tasks:[
        {id:"4.1", task:"สร้างแบบฟอร์มนำเข้าข้อมูลที่เติมข้อมูลเบื้องต้นให้แล้ว (Channel 2 File Import - Pre-filled Template Generator)", desc:"รหัส+ชื่อ+หน่วยกิตเติมให้แล้ว สถาบันเติมแค่คำอธิบาย/หัวข้อ/CLO", dep:"F2.3", src:"master-data-onboarding.md §3", c:"green"},
        {id:"4.2", task:"ขั้นตอนนำเข้าไฟล์ ตรวจสอบ เปรียบเทียบ และเผยแพร่ข้อมูล (Channel 2 File Import - Import Wizard)", desc:"", dep:"4.1, F6 (validation pipeline)", src:"master-data-onboarding.md §3", c:"green"},
        {id:"4.3", task:"ขั้นตอนคัดลอกข้อมูลจากเอกสาร มคอ.3/Syllabus ด้วยคน (Channel 2 File Import - Manual Extraction Workflow)", desc:"rule-based, ไม่ใช้ AI (ข้อจำกัดงบ) — เจ้าหน้าที่เปิดเอกสารคู่กันแล้วคีย์เอง", dep:"4.1", src:"master-data-onboarding.md §3.0, Open Item O5", c:"yellow", note:"ความเป็นไปได้จริงที่ scale ประเทศ (มคอ.3 จำนวนมหาศาล) ยังไม่ประเมิน — ระบุเป็น open item ตรงๆ ว่า 'ต้องประเมินว่า template import (คนคีย์) พอไหม'"},
      ]
    },
    {
      id:"F5", name:"Channel 3 — Just-in-Time (ผ่านงานเทียบโอน)",
      sources:["decisions/2026-07-master-data-onboarding.md §3"],
      tasks:[
        {id:"5.1", task:"ผู้เรียนกรอก/แนบเอกสารสำหรับวิชาที่ยังไม่มีข้อมูลตอนยื่นคำร้อง (Channel 3 Just-in-Time - Learner Data Entry)", desc:"", dep:"Credit Transfer Epic F1", src:"master-data-onboarding.md §3 ช่องทาง 3", c:"green"},
        {id:"5.2", task:"ระบบจับคู่ข้อมูลที่กรอกกับข้อมูลโครงร่างที่มีอยู่ กันกรอกผิด (Channel 3 Just-in-Time - Skeleton Matching)", desc:"", dep:"5.1, F1", src:"master-data-onboarding.md §3", c:"green"},
        {id:"5.3", task:"เจ้าหน้าที่ตรวจสอบและยืนยันข้อมูลระหว่างพิจารณาคำร้อง (Channel 3 Just-in-Time - Officer Verification)", desc:"", dep:"5.2, Credit Transfer Epic F4", src:"master-data-onboarding.md §3", c:"green"},
        {id:"5.4", task:"ไม่ต้องกรอกข้อมูลซ้ำสำหรับวิชาเดิมในครั้งถัดไป (Channel 3 Just-in-Time - Data Reuse for Repeat Cases)", desc:"", dep:"5.3, Credit Transfer Epic 4.9 (fast-track)", src:"master-data-onboarding.md §3", c:"yellow", note:"ผูกกับ fast-track ใน Credit Transfer epic ที่ตัวเองยัง 🔴 (รอเคาะ 5 คำถาม) — ถ้า fast-track ไม่ทัน อานิสงส์ 'ไม่กรอกซ้ำ' นี้ก็ยังไม่เกิด"},
      ]
    },
    {
      id:"F6", name:"Validation Pipeline (ทุกช่องทาง 1-3)",
      sources:["decisions/2026-07-master-data-onboarding.md §4"],
      tasks:[
        {id:"6.1", task:"ตรวจสอบรูปแบบและช่องข้อมูลบังคับ (Validation Pipeline - Schema Check)", desc:"ช่องบังคับ, ชนิดข้อมูล, หน่วยกิตรูปแบบ x(y-z-w)", dep:"F1", src:"master-data-onboarding.md §4.1", c:"green"},
        {id:"6.2", task:"ตรวจสอบว่าข้อมูลอ้างอิงมีอยู่จริงในระบบ (Validation Pipeline - Reference Check)", desc:"univ_id/faculty/CURR_ID ต้องมีจริง · dedup key = univ_id+course_code+curriculum_version", dep:"6.1, Institution Structure Epic", src:"master-data-onboarding.md §4.2", c:"green"},
        {id:"6.3", task:"ตรวจสอบความสอดคล้องของข้อมูลระหว่างแหล่งที่มา (Validation Pipeline - Consistency Check)", desc:"หน่วยกิตขัดกับ DS1003 → flag ไม่ block · ชื่อ TH/EN สลับช่อง (charset heuristic)", dep:"6.2", src:"master-data-onboarding.md §4.3", c:"green"},
        {id:"6.4", task:"พักข้อมูลรอตรวจสอบโดยเจ้าหน้าที่ก่อนเผยแพร่จริง (Validation Pipeline - Staging & Human Verification)", desc:"เจ้าหน้าที่สถาบันเห็น diff ก่อน publish · manifest+audit ทุกรอบ", dep:"6.3", src:"master-data-onboarding.md §4.4", c:"green"},
        {id:"6.5", task:"เก็บประวัติเวอร์ชันเมื่อแก้ไขข้อมูลที่เผยแพร่แล้ว (Validation Pipeline - Versioning)", desc:"คำร้องเก่าอ้าง snapshot เดิม", dep:"6.4", src:"master-data-onboarding.md §4.5", c:"green"},
      ]
    },
    {
      id:"F7", name:"NCBS Backoffice — Master Data Governance",
      sources:["decisions/2026-07-master-data-onboarding.md §6"],
      note:"prototype มี UI mock ครบมาก (nudge modal เต็ม, reference table 8 ชุด, job monitor) — แต่ตารางเทียบ §6.3 เองระบุ gap ระหว่าง demo กับของจริงชัดเจนที่สุดในทั้ง epic",
      tasks:[
        {id:"7.1", task:"หน้าติดตามคุณภาพข้อมูลรายสถาบันพร้อมแจ้งเตือน (Governance Backoffice - Institution Data Quality Monitor)", desc:"จำนวนวิชา/%Verified+/skeleton ค้าง/ซิงค์ล่าสุด + nudge action", dep:"F1-F5", src:"master-data-onboarding.md §6.1", c:"yellow", note:"prototype = nudge flow เต็ม (modal+template+SLA+ประวัติ) mock — ของจริงต้องส่งอีเมล/in-app จริง + ตรวจ SLA อัตโนมัติ (ดู §6.3 ตาราง)"},
        {id:"7.2", task:"ตารางข้อมูลอ้างอิงกลาง 8 ชุดที่ทุกระบบใช้ร่วมกัน (Governance Backoffice - Central Reference Tables)", desc:"Thesaurus, Bloom verb table, เกรดเทียบต่อสถาบัน, ชั่วโมง→หน่วยกิต, พารามิเตอร์กลาง, ISCED, 7 รหัสวิธีเทียบโอน (CS-CO), Skill & Skill Criteria(117 fields)", dep:"—", src:"master-data-onboarding.md §6.1", c:"yellow", note:"prototype = ตาราง+ประวัติเวอร์ชัน+ฉบับร่าง mock — ของจริงต้องมี approval flow จริง(ผู้มีอำนาจกด)+export+diff ระหว่างเวอร์ชัน · Skill Criteria รอมาตรฐาน TPQI/ESCO ตัดสินใจ"},
        {id:"7.3", task:"หน้าติดตามสถานะงานซิงค์/นำเข้าข้อมูลทุกช่องทาง (Governance Backoffice - Job Monitor)", desc:"รายการ job ต่อช่องทาง: เวลา/ขอบเขต/จำนวน/สถานะ", dep:"F2-F5", src:"master-data-onboarding.md §6.1", c:"yellow", note:"prototype = mock 6 แถว — ของจริงต้องเชื่อม log จริงของ pipeline + retry + alert-on-failure"},
        {id:"7.4", task:"ตั้งค่าเกณฑ์ติดตามและรอบเวลาซิงค์ข้อมูลของระบบ (Governance Backoffice - System Settings)", desc:"stale 90 วัน, skeleton 40/60% threshold", dep:"7.1", src:"master-data-onboarding.md §6.3", c:"yellow", note:"ของจริงต้องมี scheduler จริง + สิทธิ์แก้ค่าแยกละเอียด"},
      ]
    },
    {
      id:"F8", name:"Course Document Attachments",
      sources:["decisions/2026-07-master-data-onboarding.md §2.1"],
      tasks:[
        {id:"8.1", task:"อัปโหลดไฟล์แนบประกอบรายวิชา สูงสุด 5 ไฟล์ (Course Attachments - File Upload)", desc:"pdf/doc/docx/xls/xlsx/png/jpg — ไม่รับ zip", dep:"F1, Service Foundation (storage)", src:"master-data-onboarding.md §2.1", c:"green"},
        {id:"8.2", task:"บันทึกข้อมูลรายละเอียดและประวัติไฟล์แนบ (Course Attachments - Metadata & Audit)", desc:"ชื่อ/ประเภทเอกสาร/ขนาด/ที่มา(เจ้าหน้าที่หรือ JIT)/ผู้อัปโหลด+เวลา", dep:"8.1", src:"master-data-onboarding.md §2.1", c:"green"},
        {id:"8.3", task:"ลบไฟล์แนบพร้อมบันทึกประวัติการลบ (Course Attachments - Deletion & Audit)", desc:"", dep:"8.1", src:"master-data-onboarding.md §2.1", c:"green"},
      ]
    },
  ],
  priority: [
    "<b>F1 (canonical schema)</b> — ทำก่อนสุด",
    "<b>F2 (Channel 0 UniCon)</b> — เริ่มประสานเร็วที่สุดเพราะมี lead time ภายนอก (รอบส่งข้อมูลปีละ 1-2 ครั้งเท่านั้น) — พลาดหน้าต่างรอบหนึ่งเสียเวลาเป็นเดือน",
    "<b>F6 (validation pipeline)</b> — ทำคู่กับ F2 เพราะทุกช่องทางต้องพึ่ง",
    "<b>F4 (Channel 2 Template)</b> — ควร priority สูงกว่า F3 (API) เพราะเอกสารเองระบุว่าเป็นช่องทางที่ครอบมากสุด ไม่ใช่ Advanced tier แคบๆ แบบ Channel 1",
    "<b>F5 (Channel 3 JIT)</b> — ทำคู่กับ Credit Transfer epic โดยตรง ไม่แยกทำเดี่ยว",
    "<b>F7 (governance backoffice)</b> — ทำหลังช่องทางหลักพร้อม เพราะต้องมีข้อมูลจริงไหลเข้ามาก่อนถึงจะมีอะไรให้ governance",
    "<b>2.4 (CURR_ID resolver)</b> — ติดตามความคืบหน้า CISA อย่างต่อเนื่อง แต่อย่า block งานอื่นรอ เพราะเป็น unknown ภายนอกที่ประเมินเวลาไม่ได้",
  ],
  flags: [
    "<b>DS1003 freshness gap เป็นข้อจำกัดโครงสร้าง ไม่ใช่บั๊ก (2.3)</b> — Course Skeleton จาก UniCon สดแค่ปีละ 2 ครั้งและครอบเฉพาะวิชาที่มีผู้จบแล้ว — วิชาเปิดใหม่จะไม่ปรากฏใน skeleton เกือบปี ต้องสื่อสารกับ stakeholder ว่านี่คือ design limitation ที่ Channel 2/3 ถูกออกแบบมาเพื่อชดเชยโดยเฉพาะ",
    "<b>CISA curriculum resolver = unknown จริง (2.4)</b> — ไม่ใช่แค่ยังไม่เคาะ แต่ 'ยังไม่เห็นสเปคเลย' เป็น external dependency ที่ timeline ประเมินไม่ได้ ควร track แยกเป็น risk item ระดับโครงการ",
    "<b>Manual PDF/Word extraction feasibility ที่ scale ประเทศยังไม่ประเมิน (4.3)</b> — ด้วยจำนวนวิชาระดับหมื่น (~48,000 วิชาตามที่อ้างอิงในเอกสารอื่น) และไม่มีงบ AI extraction การพึ่งคนคีย์มืออาจไม่ scale ได้จริง ควรทำ feasibility estimate ก่อน commit timeline",
    "<b>Master Data Governance (F7) มี gap ระหว่าง demo กับของจริงชัดที่สุดในทั้ง epic</b> — เอกสารทำตารางเปรียบเทียบ 'prototype vs ระบบจริงต้องเพิ่ม' ไว้ตรงๆ ทุกแถว (nudge flow, approval flow, job monitor, scheduler) — ห้ามใช้ความสมบูรณ์ของ prototype UI เป็นตัวประเมิน manday ของงานจริงในฟีเจอร์นี้เด็ดขาด",
    "<b>Skill & Skill Criteria standard ยังไม่เคาะ (7.2)</b> — รอมาตรฐาน TPQI/ESCO ตัดสินใจ กระทบ 1 ใน 8 ตารางอ้างอิงกลาง",
  ]
};


// ---------- register into multi-epic registry ----------
window.NCBS_EPICS = window.NCBS_EPICS || {};
window.NCBS_EPICS['data-ingestion'] = {
  id: 'data-ingestion',
  system: 'UCBS',
  name: 'Multi-Channel Data Ingestion',
  thaiName: 'การนำเข้าข้อมูลหลายช่องทาง',
  status: 'Track B — Sprint #56 (File Upload) Phase 2 ยังไม่เริ่ม',
  epicDeps: DATA_INGESTION_DATA.epicDeps,
  features: DATA_INGESTION_DATA.features,
  priority: DATA_INGESTION_DATA.priority,
  flags: DATA_INGESTION_DATA.flags,
};
