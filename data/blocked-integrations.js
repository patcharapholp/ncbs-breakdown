// NCBS Breakdown — Blocked Integrations epic data (LLRS + Credit Port)
// ทั้ง 2 รายการ "claim" อยู่ใน Phase 1 sprint scope แต่ spec ไม่มีจริง — ก่อน estimate manday ต้อง unblock ที่ระดับ PM/ownership ก่อน ไม่ใช่งาน dev

const BLOCKED_INTEGRATIONS_DATA = {
  epicDeps: [],
  features: [
    {
      id:"F1", name:"LLRS Integration",
      sources:["external/confluence-prd-summaries/prd-empty-templates-finding.md"],
      note:"🔴 PRD ว่างเปล่ามาตั้งแต่สร้าง (2026-04-02) — เกิน 4 สัปดาห์ไม่มีใครเติม ณ วันที่ finding ถูกเขียน (29 เม.ย. 69)",
      tasks:[
        {id:"1.1", task:"สอบถามยืนยันว่าระบบ LLRS คืออะไร ยังไม่มีคำตอบในเอกสาร (LLRS Integration - Requirement Clarification)", desc:"", dep:"—", src:"prd-empty-templates-finding.md Open Questions", c:"red", note:"ไม่มีคำตอบที่ไหนในวิกิ แม้แต่ชื่อเต็มยังเป็นคำถามเปิด"},
        {id:"1.2", task:"ติดต่อผู้รับผิดชอบ PRD เพื่อปลดล็อกความคืบหน้า (LLRS Integration - Owner Escalation)", desc:"ส่ง 2 template เปล่าใน 1 วันเดียวกัน — สัญญาณว่า overload หรือ blocked ด้วย dependency บางอย่าง", dep:"—", src:"prd-empty-templates-finding.md Risks", c:"red", note:"เป็นงาน PM/people-management ไม่ใช่งาน dev — ควร escalate หา backup PO/BA"},
        {id:"1.3", task:"เขียนเอกสารความต้องการจริงหลังปลดล็อกแล้ว (LLRS Integration - PRD Writing)", desc:"", dep:"1.1, 1.2", src:"prd-empty-templates-finding.md", c:"red", note:"ยังไม่มี requirement แม้แต่บรรทัดเดียวให้เริ่ม breakdown"},
      ]
    },
    {
      id:"F2", name:"Credit Port Integration",
      sources:["external/confluence-prd-summaries/prd-empty-templates-finding.md","sources/credit-port-api-contract.md"],
      note:"⚠️ Credit Port = ชื่อซ้ำ 2 ความหมาย: (1) PRD ภายในที่ empty template เหมือน LLRS (2) โครงการภายนอกจริง 'MVP Product' ที่มีแผนเชื่อมต่อแต่ PAUSED — อย่าสับสน 2 เรื่องนี้เข้าด้วยกัน",
      tasks:[
        {id:"2.1", task:"ยืนยันความสัมพันธ์ระหว่างชื่อ Credit Port ที่ใช้ 2 ความหมายซ้อนกัน (Credit Port Integration - Naming Clarification)", desc:"เอกสารเองตั้งคำถามนี้ไว้ตรงๆ", dep:"—", src:"prd-empty-templates-finding.md Open Questions", c:"red"},
        {id:"2.2", task:"ยืนยันสถานะและกำหนดการกลับมาทำโปรเจกต์กับผู้รับผิดชอบ (Credit Port Integration - Status Confirmation)", desc:"ยืนยันแล้ว(2026-06-27)ว่า PAUSED ไม่มีกำหนดรีซูม", dep:"2.1", src:"credit-port-api-contract.md", c:"red", note:"สถานะล่าสุดที่ยืนยันจาก PO คือ 'พักแผนไว้ก่อน' — ไม่ใช่แค่ยังไม่เริ่ม แต่ตั้งใจหยุดชั่วคราว"},
        {id:"2.3", task:"เก็บเอกสารสัญญา API อ้างอิงไว้ใช้เมื่อโปรเจกต์กลับมาทำต่อ (Credit Port Integration - Reference Documentation)", desc:"~16 endpoints มีเอกสารเปรียบเทียบ NCBS Prototype vs MVP Product ให้แล้วจากทีม tech (Kritpavin)", dep:"2.2", src:"credit-port-api-contract.md", c:"yellow", note:"เอกสารมีจริงและละเอียดกว่าที่คาด (16 endpoint mapping) — ถ้า resume จะมีจุดเริ่มต้นที่ดี แต่ 'ห้ามใช้เป็น API spec ของ NCBS' ตามที่ระบุไว้ตรงๆ จนกว่าจะ resume อย่างเป็นทางการ"},
      ]
    },
  ],
  priority: [
    "<b>ทั้ง epic ควร deprioritize เป็นงาน dev</b> — งานที่ทำได้จริงตอนนี้คือ escalation/clarification (1.1-1.2, 2.1-2.2) ไม่ใช่ sprint work — อย่าจัด sprint capacity ให้ epic นี้จนกว่าจะ unblock",
    "<b>2.3</b> — เก็บ reference ไว้เฉยๆ ไม่ต้องทำอะไรเพิ่มตอนนี้",
  ],
  flags: [
    "<b>ทั้งคู่ไม่ใช่ 'ยังไม่เริ่ม' แต่คือ 'blocked ที่ระดับ ownership/decision'</b> — ต่างจาก epic อื่นที่ spec บางเพราะยังไม่มีเวลาทำ epic นี้บางเพราะมีคนติดขัดจริง (LLRS) หรือมีการตัดสินใจ pause อย่างเป็นทางการ (Credit Port) — วิธีแก้คือ people/PM action ไม่ใช่ dev sprint",
    "<b>ชื่อ 'Credit Port' ซ้อนทับ 2 ความหมาย</b> — สร้างความสับสนได้ง่ายถ้าไม่แยกให้ชัดตอน planning — ต้องระบุเสมอว่ากำลังพูดถึง internal PRD (เปล่า) หรือ external MVP Product project (paused)",
    "<b>Patcharaphol overload signal</b> — 2 PRD templates ว่างเปล่าสร้างวันเดียวกัน (2026-04-02) เป็นสัญญาณเตือนที่ควรตรวจสอบ ไม่ใช่แค่ 'PRD ไม่มี'",
  ]
};


// ---------- register into multi-epic registry ----------
window.NCBS_EPICS = window.NCBS_EPICS || {};
window.NCBS_EPICS['blocked-integrations'] = {
  id: 'blocked-integrations',
  system: 'NCBS',
  name: 'Blocked Integrations (LLRS + Credit Port)',
  thaiName: 'การเชื่อมต่อที่ติดขัด (LLRS และ Credit Port)',
  status: 'Blocked ที่ระดับ ownership/decision — ไม่ใช่ dev backlog ตอนนี้',
  epicDeps: BLOCKED_INTEGRATIONS_DATA.epicDeps,
  features: BLOCKED_INTEGRATIONS_DATA.features,
  priority: BLOCKED_INTEGRATIONS_DATA.priority,
  flags: BLOCKED_INTEGRATIONS_DATA.flags,
};
