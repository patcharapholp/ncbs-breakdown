// NCBS Breakdown — LMS Integration epic data (BR-UCBS-03)
// ⚠️ Spec ที่บางที่สุดในทั้ง wiki — ไม่มี Sprint feature ของตัวเอง ไม่มี SCR ไม่มี decision draft
// ส่วนใหญ่ของ epic นี้คือ "งาน discovery/design" ไม่ใช่ "งาน dev" เพราะยังไม่รู้แม้แต่ว่าคู่สนทนาคือใคร

const LMS_INTEGRATION_DATA = {
  epicDeps: [
    { name:"Multi-Channel Data Ingestion Epic", why:"ผลการเรียนจาก LMS ภายนอกเป็น Non-formal credit ที่ต้องไหลผ่าน canonical course/credit pipeline เดียวกัน", blocker:false },
    { name:"Learner Identity Linking Epic", why:"ต้อง resolve ตัวตนผู้เรียนของ Thai MOOC เข้ากับ NCBS learner_identifier", blocker:false },
  ],
  features: [
    {
      id:"F1", name:"Thai MOOC / TCU Integration Discovery",
      sources:["entities/thai-mooc.md","sources/external-integration-landscape.md"],
      note:"สถานะล่าสุดที่เห็นในวิกิ (23 ก.ค. 69): 'คุยแนวทางแล้ว ก.พ. 69 · ยังไม่มี contract' — เป็นงาน discovery ไม่ใช่งาน dev ในตอนนี้",
      tasks:[
        {id:"1.1", task:"สอบถามยืนยันหน่วยงานเจ้าของระบบ Thai MOOC (Thai MOOC Discovery - Owner Confirmation)", desc:"สป.อว. โดยตรง หรือ TCU (Thai Cyber University)?", dep:"—", src:"entities/thai-mooc.md Open Questions", c:"red", note:"ยังไม่มีคำตอบที่ไหนในวิกิ"},
        {id:"1.2", task:"สำรวจข้อมูล API ของ Thai MOOC ที่มีอยู่ (Thai MOOC Discovery - API Spec Research)", desc:"Course/Completion/Certificate schema, authentication method", dep:"1.1", src:"entities/thai-mooc.md Integration Spec ที่ต้องรู้", c:"red"},
        {id:"1.3", task:"ยืนยันแนวทางตรวจสอบผลการเรียนนอกระบบผ่าน TCU (Thai MOOC Discovery - Verification Approach)", desc:"คุยแนวทางแล้ว ก.พ. 69 แต่ยังไม่มี contract — เกี่ยวตรงกับ CTP non-formal path", dep:"1.1", src:"sources/external-integration-landscape.md", c:"red", note:"ล่าสุดที่เห็นในวิกิ (23 ก.ค. 69) — ยังไม่คืบหน้าไปกว่า 'คุยแนวทางแล้ว'"},
        {id:"1.4", task:"ตัดสินใจรูปแบบส่งข้อมูลแบบทันทีหรือเป็นชุด (Thai MOOC Discovery - Push Model Decision)", desc:"สอบผ่าน → push ทันที หรือ batch?", dep:"1.2", src:"entities/thai-mooc.md", c:"red"},
      ]
    },
    {
      id:"F2", name:"Generic LMS Integration Pattern (Design)",
      sources:["entities/thai-mooc.md"],
      tasks:[
        {id:"2.1", task:"จับคู่บัญชีผู้ใช้ระหว่างระบบ LMS กับผู้เรียนใน NCBS (Generic LMS Pattern - Identity Mapping)", desc:"ผูกด้วยเลขประชาชน/email", dep:"F1, Learner Identity Linking Epic", src:"entities/thai-mooc.md Integration Spec ที่ต้องรู้", c:"red", note:"ควร reuse pattern เดียวกับ learner_identifier ของ Learner Identity Linking epic แทนคิดใหม่"},
        {id:"2.2", task:"จับคู่ข้อมูลรายวิชาระหว่างระบบ LMS กับ NCBS (Generic LMS Pattern - Course Catalog Mapping)", desc:"", dep:"F1, Multi-Channel Data Ingestion Epic F1", src:"entities/thai-mooc.md Open Questions", c:"red"},
        {id:"2.3", task:"ออกแบบตัวเชื่อมต่อกลางสำหรับ LMS ภายนอกในอนาคต (Generic LMS Pattern - Generic Connector Design)", desc:"Coursera, edX ฯลฯ", dep:"2.1, 2.2", src:"entities/thai-mooc.md Open Questions (Future)", c:"red", note:"ยังไม่มี timeline — เป็นแค่ direction ในอนาคต"},
      ]
    },
    {
      id:"F3", name:"Non-formal Credit Ingestion",
      sources:["entities/thai-mooc.md, systems/ucbs.md BR-UCBS-03"],
      tasks:[
        {id:"3.1", task:"นำเข้าผลการเรียนจาก LMS ภายนอกเข้าสู่ระบบเทียบโอน (Non-formal Credit Ingestion - LMS Result Ingestion)", desc:"ผลผ่าน Thai MOOC → UCBS → NCBS → เทียบโอนผ่าน CTP", dep:"F1, F2, Multi-Channel Data Ingestion Epic", src:"entities/thai-mooc.md ที่ตั้งใน Learning Hierarchy", c:"red", note:"ต้องรอ F1/F2 มีคำตอบก่อนถึงจะออกแบบ ingestion จริงได้"},
      ]
    },
  ],
  priority: [
    "<b>F1 (discovery)</b> — ต้องทำก่อนสุดและเป็นงานที่ไม่ใช่ dev effort ในความหมายปกติ — เป็นงานประสานงาน/วิจัยที่ควรมอบให้ PM/BA ไม่ใช่ dev team",
    "<b>ทั้ง epic ควร deprioritize เทียบ epic อื่น</b> — ไม่มี Sprint feature รองรับ ไม่มี SCR ไม่มี business urgency ที่ระบุไว้ที่ไหน ต่างจาก Result-upload Integration ที่แม้ spec จะไม่ลึกกว่ากันมาก แต่มี adoption-blocker priority ชัดเจนจาก FG Round 2",
  ],
  flags: [
    "<b>Epic นี้บางที่สุดในทั้ง wiki</b> — ไม่มี Sprint feature, ไม่มี SCR, ไม่มี decision draft ใดๆ รองรับ มีแค่ concept doc entity เดียวที่เต็มไปด้วย Open Questions ล้วนๆ — ก่อน estimate manday ควรทำ discovery ให้เสร็จก่อน ไม่ใช่พยายามเดา spec เอง",
    "<b>เจ้าของระบบยังไม่ชัด (1.1)</b> — สป.อว. หรือ TCU — กระทบว่าจะประสานกับใครแม้แต่ในขั้นแรกสุด",
    "<b>สถานะล่าสุดคือ 'คุยแนวทางแล้ว ไม่มี contract' (1.3)</b> — ข้อมูลนี้มาจาก external-integration-landscape.md (23 ก.ค. 69) ซึ่งเป็นแหล่งข้อมูลใหม่สุดในวิกิ — แปลว่าแม้จะผ่านมาหลายเดือนตั้งแต่โครงการเริ่ม การเจรจากับ TCU ยังไม่คืบหน้าไปกว่าขั้นคุยกัน",
  ]
};


// ---------- register into multi-epic registry ----------
window.NCBS_EPICS = window.NCBS_EPICS || {};
window.NCBS_EPICS['lms-integration'] = {
  id: 'lms-integration',
  system: 'UCBS',
  name: 'LMS Integration',
  thaiName: 'การเชื่อมต่อระบบ LMS ภายนอก',
  status: 'Discovery only — ไม่มี Sprint feature/SCR รองรับ',
  epicDeps: LMS_INTEGRATION_DATA.epicDeps,
  features: LMS_INTEGRATION_DATA.features,
  priority: LMS_INTEGRATION_DATA.priority,
  flags: LMS_INTEGRATION_DATA.flags,
};
