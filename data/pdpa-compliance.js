// NCBS Breakdown — PDPA & Compliance epic data
// Cross-cutting — ใช้โดยแทบทุก epic (User Management, Learner Identity Linking, Blockchain, Grade & Credit Mgmt ฯลฯ)
// ความเสี่ยงจริง: ค่าปรับสูงสุด 5 ล้านบาท/case ตาม พ.ร.บ. PDPA — ไม่ควร deprioritize แม้ spec จะยังบางในหลายจุด

const PDPA_COMPLIANCE_DATA = {
  epicDeps: [
    { name:"ทุก epic ที่เก็บ/แสดงข้อมูลส่วนบุคคล", why:"masking/audit/consent policy ต้องเป็นมาตรฐานเดียวกันข้าม epic ไม่ใช่ต่างคนต่างทำ", blocker:false },
  ],
  features: [
    {
      id:"F1", name:"Data Subject Rights (Export / Erasure / Objection)",
      sources:["concepts/pdpa-actions.md"],
      tasks:[
        {id:"1.1", task:"ส่งออกข้อมูลส่วนบุคคลตามสิทธิ์เจ้าของข้อมูล (Data Subject Rights - Export Data)", desc:"CSV/JSON — ทุก field ที่ระบบเก็บของผู้เรียนคนนั้น", dep:"—", src:"pdpa-actions.md", c:"green"},
        {id:"1.2", task:"ลบหรือทำให้ข้อมูลไม่ระบุตัวตนตามสิทธิ์ขอลบ (Data Subject Rights - Anonymize/Delete)", desc:"delete หรือ anonymize", dep:"1.1", src:"pdpa-actions.md", c:"yellow", note:"edge case สำคัญ: credit บางส่วนอยู่ใน blockchain (immutable) — ต้องคิด pattern (เก็บ hash อย่างเดียว, raw data ลบจาก Oracle ได้) — cross-ref Blockchain Epic F6"},
        {id:"1.3", task:"สิทธิ์คัดค้านการประมวลผลข้อมูลส่วนบุคคล (Data Subject Rights - Right to Object)", desc:"ผู้เรียนคัดค้านการประมวลผลได้แค่ไหน", dep:"—", src:"pdpa-actions.md Open Questions", c:"red", note:"open question ที่ไม่เคยถูกตอบ"},
      ]
    },
    {
      id:"F2", name:"Citizen ID Masking (Canonical Policy)",
      sources:["concepts/pdpa-actions.md"],
      note:"ควรเป็น single source of truth ให้ทุก epic อ้างอิง (User Management, Grade & Credit Mgmt, Identity & Auth ฯลฯ ต่างอ้างถึง pattern เดียวกันนี้อยู่แล้ว)",
      tasks:[
        {id:"2.1", task:"รูปแบบมาตรฐานการปิดบังเลขบัตรประชาชนทั้งระบบ (Citizen ID Masking - Standard Masking Format)", desc:"บังคับใช้ทุกจุดที่แสดง citizen ID ทั้งระบบ", dep:"—", src:"pdpa-actions.md", c:"green"},
        {id:"2.2", task:"สิทธิ์พิเศษดูเลขเต็มพร้อมบันทึกการค้นหาทุกครั้ง (Citizen ID Masking - Full-Reveal Permission & Search Log)", desc:"เฉพาะสิทธิ์พิเศษ + log การค้นหาทุกครั้ง", dep:"2.1, Role & Access Management Epic", src:"pdpa-actions.md", c:"yellow", note:"cross-ref User Management epic 6.4 — open question เดียวกันว่ามี super-permission เห็นเลขครบไหม ควรเคาะเป็น policy กลางที่นี่ครั้งเดียว"},
      ]
    },
    {
      id:"F3", name:"Consent Management",
      sources:["concepts/pdpa-actions.md"],
      note:"⚠️ ไม่ระบุชัดใน Feature List เลย แต่ PDPA §19 บังคับ — เป็น gap ที่ต้องปิดก่อน launch จริง",
      tasks:[
        {id:"3.1", task:"ขอความยินยอม ณ จุดที่เก็บข้อมูล (Consent Management - Consent Collection)", desc:"", dep:"—", src:"pdpa-actions.md §4", c:"red", note:"ไม่มี design ที่ไหนเลย"},
        {id:"3.2", task:"ยกเลิกความยินยอมได้พร้อมเก็บประวัติเวอร์ชัน (Consent Management - Revocable Consent & Version Log)", desc:"", dep:"3.1", src:"pdpa-actions.md §4", c:"red"},
        {id:"3.3", task:"ขอความยินยอมสำหรับการส่งข้อมูลข้ามประเทศ (Consent Management - Cross-Border Transfer Consent)", desc:"กรณีนายจ้างต่างประเทศขอดูข้อมูล", dep:"3.1", src:"pdpa-actions.md Open Questions", c:"red", note:"เกี่ยว GDPR ที่ BRD reference ไว้แต่ไม่ใช่ user หลัก"},
      ]
    },
    {
      id:"F4", name:"Audit Logging (Sensitive Actions)",
      sources:["concepts/pdpa-actions.md"],
      note:"หลายชิ้นถูก implement แยกกันอยู่แล้วในหลาย epic (Role & Access 2.5, User Management ฯลฯ) — feature นี้คือการยืนยันว่าครอบคลุมครบตาม PDPA ไม่ใช่เริ่มจากศูนย์",
      tasks:[
        {id:"4.1", task:"บันทึกประวัติการเข้าถึงข้อมูลอ่อนไหว เช่น การดูเลขบัตรเต็ม (Audit Logging - Sensitive Action Log)", desc:"ใคร/เมื่อไหร่/ดู-แก้ของใคร", dep:"2.2", src:"pdpa-actions.md", c:"green", note:"ต้อง audit ว่า epic อื่นที่ implement audit log ของตัวเองครอบคลุมรายการนี้ครบหรือไม่ ไม่ใช่สร้างใหม่ซ้ำ"},
      ]
    },
    {
      id:"F5", name:"Privacy Policy Versioning",
      sources:["concepts/pdpa-actions.md"],
      tasks:[
        {id:"5.1", task:"เก็บประวัติเวอร์ชันของนโยบายความเป็นส่วนตัวและข้อกำหนด (Privacy Policy Versioning - Policy/Terms Versioning)", desc:"ใน CMS ของ Configurations", dep:"—", src:"pdpa-actions.md", c:"red", note:"ไม่มี design ที่ไหนเลย"},
        {id:"5.2", task:"ขอความยินยอมใหม่เมื่อนโยบายเปลี่ยนแปลง (Privacy Policy Versioning - Re-consent Trigger)", desc:"", dep:"5.1", src:"pdpa-actions.md", c:"red"},
      ]
    },
    {
      id:"F6", name:"Blockchain-PDPA Interplay (Cross-ref)",
      sources:["concepts/pdpa-actions.md Blockchain dilemma"],
      tasks:[
        {id:"6.1", task:"แนวทางลบข้อมูลต้นฉบับแต่เก็บหลักฐานแฮชไว้บนบล็อกเชน (Blockchain-PDPA - Erasure vs Immutability Pattern)", desc:"", dep:"Blockchain & Credential Verification Epic F1", src:"pdpa-actions.md Open Questions", c:"yellow", note:"เป็น tension พื้นฐานระหว่าง immutability กับ right-to-erasure ที่ pdpa-actions.md เขียนไว้ตรงๆ ว่า 'ต้อง design ตั้งแต่ต้น' — cross-ref Blockchain epic F1 (ยังไม่เคาะ architecture) และ F4.3 (PDPA-safe hashing)"},
        {id:"6.2", task:"ฐานกฎหมายสำหรับการเก็บข้อมูลผู้เรียนล่วงหน้า (Blockchain-PDPA - Shadow Record Legal Basis)", desc:"", dep:"Learner Identity Linking Epic F2.4", src:"—", c:"red", note:"cross-ref — เป็น open legal question ที่ epic นั้น flag ไว้แล้ว ไม่ duplicate ในนี้ แค่ชี้ว่าต้องแก้ร่วมกับนโยบาย PDPA กลางของ epic นี้"},
      ]
    },
  ],
  priority: [
    "<b>F2 (Citizen ID Masking canonical policy)</b> — ทำเร็วที่สุดเพราะทุก epic อื่นอ้างอิง pattern นี้อยู่แล้ว ควรมี single source of truth ก่อนที่แต่ละ epic จะ implement เองแยกกันจนไม่ตรงกัน",
    "<b>F4 (Audit logging)</b> — ทำคู่กับ F2 เพราะหลาย epic เริ่ม implement บางส่วนแล้ว ต้อง audit ให้ครบตาม checklist นี้",
    "<b>F1 (Data subject rights)</b> — ต้องมีก่อน launch จริงตามกฎหมาย โดยเฉพาะ 1.2 ที่ต้องแก้ปัญหา blockchain ก่อน",
    "<b>F3, F5 (Consent, Policy versioning)</b> — เป็น gap ที่ยังไม่มี design เลย แต่ PDPA บังคับ ควรเริ่ม design งานนี้เร็วแม้จะยังไม่ใช่ launch-blocker ทันที เพราะใช้เวลาออกแบบนาน",
    "<b>F6 (Blockchain interplay)</b> — ตามจังหวะ Blockchain epic (งวด 4) แต่ควรเริ่มคิด pattern เร็วกว่านั้นเพราะเป็น design decision ไม่ใช่ build",
  ],
  flags: [
    "<b>Blockchain vs Right-to-Erasure เป็น tension พื้นฐานที่ยังไม่ resolve (6.1)</b> — pdpa-actions.md เขียนไว้ตรงๆ ว่า 'ต้อง design ตั้งแต่ต้น' — ถ้าไม่ตกลง pattern (ลบ raw data, เก็บ hash) ก่อน blockchain epic เริ่ม build จะกลายเป็นปัญหาที่แก้ทีหลังยากมาก",
    "<b>Consent Management ไม่มีอยู่ใน Feature List เลย (F3)</b> — เป็น requirement ที่มาจาก PDPA กฎหมายตรงๆ ไม่ใช่จาก stakeholder request — เสี่ยงถูกมองข้ามเพราะไม่มีใครขอ แต่กฎหมายบังคับ",
    "<b>PDPA legal-basis questions กระจายอยู่หลาย epic</b> — shadow record (Learner Identity Linking), blockchain hashing (Blockchain epic), consent ทั่วไป (epic นี้) — ควรมีฝ่ายกฎหมายตอบทีเดียวเป็นชุดนโยบายกลาง ไม่ใช่ตอบแยกทีละ epic ที่อาจขัดกันเอง",
    "<b>ความเสี่ยงทางการเงิน/กฎหมายจริง</b> — ค่าปรับสูงสุด 5 ล้านบาท/case ตาม พ.ร.บ. PDPA — epic นี้ไม่ควรถูก deprioritize เป็นอันดับท้ายๆ แม้ spec จะดูบางกว่า epic อื่นที่มี UI prototype สวยงามกว่า",
  ]
};


// ---------- register into multi-epic registry ----------
window.NCBS_EPICS = window.NCBS_EPICS || {};
window.NCBS_EPICS['pdpa-compliance'] = {
  id: 'pdpa-compliance',
  system: 'NCBS',
  name: 'PDPA & Compliance',
  thaiName: 'การคุ้มครองข้อมูลส่วนบุคคลและการปฏิบัติตามกฎหมาย',
  status: 'Cross-cutting — Consent Management ยังไม่มี design เลย',
  epicDeps: PDPA_COMPLIANCE_DATA.epicDeps,
  features: PDPA_COMPLIANCE_DATA.features,
  priority: PDPA_COMPLIANCE_DATA.priority,
  flags: PDPA_COMPLIANCE_DATA.flags,
};
