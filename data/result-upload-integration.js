// NCBS Breakdown — Result-upload Integration epic data (SCR-018)
// 🔴 Priority สูงสุดจาก FG Round 2 — adoption-blocker ของกลุ่มมหาวิทยาลัยใหญ่ (มช./สจล./มธ./เกษตร/มหาสารคาม)
// PM อนุมัติหลักการแล้ว (2026-07-09) แต่ "รายละเอียด technical รอ tech review" — status จริง = prototyped (mock) เท่านั้น

const RESULT_UPLOAD_INTEGRATION_DATA = {
  epicDeps: [
    { name:"Credit Transfer Epic (State Machine + Transfer Approval Detail)", why:"Mode B ต้อง apply กติกา กมอ. 2565 (cap/GPAX/re-transfer flag) เหมือน Mode A ทุกข้อ", blocker:false },
    { name:"Learner Identity Linking Epic", why:"validation ต้องเช็คว่า learner มีตัวตนในระบบก่อนรับผล", blocker:false },
    { name:"Multi-Channel Data Ingestion Epic", why:"วิชาปลายทางต้องมี data_state ≥ verified ก่อนรับผลพิจารณา", blocker:false },
  ],
  features: [
    {
      id:"F1", name:"Dual Integration Mode Architecture",
      sources:["decisions/scr-018-result-upload-integration.md §2"],
      tasks:[
        {id:"1.1", task:"channel flag (in_system | result_upload)", desc:"บน transfer_request — ไม่ต้องเพิ่มตารางใหม่", dep:"Credit Transfer Epic F1 (data model)", src:"scr-018 §3", c:"green"},
        {id:"1.2", task:"Mode B ไม่แตะ approval/payment UI ในระบบ", desc:"ยื่น/จ่าย/พิจารณาทั้งหมดเกิดนอกระบบ (มหาวิทยาลัยเอง)", dep:"1.1", src:"scr-018 §2", c:"green"},
      ]
    },
    {
      id:"F2", name:"Result Upload Channels",
      sources:["decisions/scr-018-result-upload-integration.md §2, §3"],
      tasks:[
        {id:"2.1", task:"File template (.xlsx) import wizard", desc:"3 ขั้น: เลือกช่องทาง → ตรวจสอบ/validate preview → ยืนยัน", dep:"F1", src:"scr-018 §3", c:"green"},
        {id:"2.2", task:"API bulk POST /transfer-results/import + template download", desc:"", dep:"F1, API Management Epic", src:"scr-018 §3", c:"green"},
      ]
    },
    {
      id:"F3", name:"Data Contract & Validation",
      sources:["decisions/scr-018-result-upload-integration.md §2"],
      tasks:[
        {id:"3.1", task:"Per-row data contract", desc:"referenceCode, learner id, target course, decision(approved/partial/rejected), awardedCredits/Grade/assessmentMethod(6วิธี), approvedDate, approver, attachments(optional)", dep:"F1", src:"scr-018 §2", c:"green"},
        {id:"3.2", task:"Validation: learner ต้องมีตัวตนในระบบ", desc:"", dep:"3.1, Learner Identity Linking Epic", src:"scr-018 §2", c:"green"},
        {id:"3.3", task:"Validation: วิชาปลายทางต้อง data_state ≥ verified", desc:"", dep:"3.1, Multi-Channel Data Ingestion Epic F1.2", src:"scr-018 §2", c:"green"},
        {id:"3.4", task:"Apply กติกา กมอ. 2565 เหมือน Mode A ทุกข้อ", desc:"cap เพดานเทียบโอน/GPAX exclusion/re-transfer flag", dep:"3.1, Credit Transfer Epic F4.3-4.6", src:"scr-018 §2", c:"yellow", note:"ผูกกับ Credit Transfer epic F4.3 ที่ตัวเองยังมี 6 open question ไม่เคาะ (notation เกรด, หน่วยกิตขาดจัดการยังไง) — ต้องรอ resolve ที่นั่นก่อน"},
      ]
    },
    {
      id:"F4", name:"Payment Boundary (Mode B ไม่มี Payment ในระบบ)",
      sources:["decisions/scr-018-result-upload-integration.md §4"],
      tasks:[
        {id:"4.1", task:"ระบุใน spec ว่าระบบกลางไม่ยุ่งเงินของ Mode B", desc:"ค่าธรรมเนียมเก็บนอกระบบโดยมหาวิทยาลัยเอง — ตัดปัญหา settlement", dep:"F1", src:"scr-018 §4.2", c:"green"},
      ]
    },
    {
      id:"F5", name:"Fast-track / Precedent Pool Integration",
      sources:["decisions/scr-018-result-upload-integration.md §4.3"],
      tasks:[
        {id:"5.1", task:"ผลจาก Mode B เข้า precedent pool เดียวกับ Mode A", desc:"ใช้ทำ recommendation/fast-track ได้", dep:"3.1, Credit Transfer Epic 4.9 (fast-track)", src:"scr-018 §4.3", c:"red", note:"พึ่ง fast-track feature ที่ Credit Transfer epic เองยัง 🔴 ('รอเคาะ 5 คำถามก่อน implement') — ไม่ควร estimate จนกว่าจะปลดล็อกที่ต้นทาง"},
      ]
    },
  ],
  priority: [
    "<b>F1, F3 (data contract+validation)</b> — ทำก่อนสุด เป็นแกนของ epic",
    "<b>F2 (channels)</b> — ทำต่อจาก F1/F3",
    "<b>F4</b> — เป็นแค่ spec clarity ทำเร็ว",
    "<b>F5</b> — รอ Credit Transfer epic ปลดล็อก fast-track ก่อน",
    "<b>Priority ทางธุรกิจสูงสุดในบรรดา epic ทั้งหมด</b> — แม้ technical detail ยังไม่ลึกเท่า epic อื่น เพราะเป็น adoption-blocker ของมหาวิทยาลัยใหญ่ที่สุด 5 แห่ง ควร fast-track การเคาะ tech review",
  ],
  flags: [
    "<b>Technical detail ยังรอ tech review</b> — PM อนุมัติแค่หลักการ (2026-07-09) เนื้อรายละเอียดยังไม่ผ่าน tech review จริง — status ตรงคือ 'prototyped (mock)' ไม่ใช่ 'implemented' อย่าประเมินมั่นใจเกินสถานะจริง",
    "<b>ผูกกับ open question ของ Credit Transfer epic (3.4)</b> — กติกา กมอ. 2565 ที่ต้อง apply เหมือนกันทั้ง 2 โหมด ยังมี 6 คำถามไม่เคาะที่ต้นทาง (Credit Transfer F4.3) — แก้ที่นั่นก่อนแล้วจะไหลมาที่นี่อัตโนมัติ",
    "<b>Data quality risk จากภายนอก</b> — เอกสารเองยอมรับความเสี่ยงนี้ (garbage-in concern) และวางแค่ validation gate + data_state ของวิชาปลายทางเป็นตัวกัน — ควรมี monitoring/alert เพิ่มเติมสำหรับ bulk import ผิดปกติ",
  ]
};


// ---------- register into multi-epic registry ----------
window.NCBS_EPICS = window.NCBS_EPICS || {};
window.NCBS_EPICS['result-upload-integration'] = {
  id: 'result-upload-integration',
  system: 'UCBS',
  name: 'Result-upload Integration',
  thaiName: 'การนำเข้าผลการพิจารณาเทียบโอน',
  status: 'PM อนุมัติหลักการแล้ว (2026-07-09) — รอ tech review รายละเอียด',
  epicDeps: RESULT_UPLOAD_INTEGRATION_DATA.epicDeps,
  features: RESULT_UPLOAD_INTEGRATION_DATA.features,
  priority: RESULT_UPLOAD_INTEGRATION_DATA.priority,
  flags: RESULT_UPLOAD_INTEGRATION_DATA.flags,
};
