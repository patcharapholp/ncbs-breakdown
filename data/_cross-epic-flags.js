// ============================================================================
// Cross-epic flags — ประเด็นที่กระทบมากกว่า 1 epic พร้อมกัน
// มาจากสรุปท้าย session Phase 2 breakdown ครบ 21 epic (28 ก.ค. 2026)
// แก้ไข/เพิ่มรายการได้ตรงนี้โดยตรง — เป็น registry แยกจาก data ต่อ epic เพราะระดับผลกระทบเป็น "โครงการ" ไม่ใช่ "epic เดียว"
// ============================================================================

window.NCBS_CROSS_EPIC_FLAGS = [
  {
    title: "\"Enforcement = mock, ของจริงอยู่ที่ API layer\"",
    detail: "ประโยคนี้ชี้ว่ามากที่สุดในทั้งชุด ปรากฏใน Role & Access Management (1.4 — ใหญ่สุด), Institution Structure (2.3), Faculty ABAC (4.4), Menu/Data Scope (5.1–5.2) — แปลว่า RBAC/ABAC \"implemented\" ทั้งหมดที่เห็นใน wiki คือ UI demo ล้วนๆ ตัว authorization จริงยังไม่เริ่มเลยสักบรรทัด นี่คือก้อนงานเดียวที่ใหญ่ที่สุดที่ซ่อนอยู่หลัง \"implemented\" status",
    epics: ["Role & Access Management", "Institution Structure & Master Data", "Identity & Authentication"],
  },
  {
    title: "Blockchain Anchoring ค้าง 3 epic พร้อมกัน",
    detail: "Credit Transfer (F7.3/7.4), Learner Profile/Portfolio (F7.2/F9.4), และตัว Blockchain epic เอง (F1–F4) — ทั้งหมดรอ Technical Workshop เคาะสถาปัตยกรรม (chain type/Fabric flavor/node hosting) และ Prime PM ยืนยันว่าอยู่งวด 4 — ควร coordinate ให้ build backend anchor ที่เดียว ไม่ใช่ 3 epic ต่างคนต่างทำ",
    epics: ["Credit Transfer", "Learner Profile, Portfolio & Public Profile", "Blockchain & Credential Verification"],
  },
  {
    title: "Payment/Money-flow Regulatory Blocker ระดับ Prime PM",
    detail: "Credit Transfer (F3), Result-upload Integration (F4), University Payment epic — ทั้งหมดรอมติ Centralized vs Direct Routing (ติด พ.ร.บ.วินัยการเงินการคลัง + PSP license) ที่ไม่ใช่ dev decision",
    epics: ["Credit Transfer", "Result-upload Integration", "University Payment Config & White-label Branding"],
  },
  {
    title: "Gateway layer ambiguity (APISIX vs Oracle API Management)",
    detail: "Data & Service Foundation (3.3) → กระทบ API Management epic (8.2 base URL/onboarding docs) ตรงๆ — ถ้าไม่เคาะก่อน เอกสาร external partner อาจผิดทั้งชุด",
    epics: ["Data & Service Foundation", "API Management & Integration Standards"],
  },
  {
    title: "PDPA legal-basis กระจัดกระจาย ควรตอบเป็นชุดเดียว",
    detail: "Shadow record (Learner Identity Linking 2.4), blockchain hashing (PDPA F6.1), consent ทั่วไป (PDPA F3) — ทุกจุดรอฝ่ายกฎหมายตอบแยกกัน เสี่ยงตอบขัดกันเองถ้าไม่รวมเป็น policy เดียว",
    epics: ["Learner Identity Linking", "PDPA & Compliance"],
  },
  {
    title: "Track A (real PRD) vs Track B (AI-generated draft) — มีแค่ไม่กี่ epic ที่เป็น Track A จริง",
    detail: "Identity & Auth core, User Management, Grade & Credit Management, Notification Service (F1) เท่านั้นที่มี real Confluence PRD/Jira รองรับ — ที่เหลือ (Institution Structure, Learner Identity Linking, API external standards, Payment/Whitelabel ฯลฯ) เป็น draft ที่ AI เขียนย้อนจาก prototype รอ BA/PO sign-off ทั้งหมด — ควรจัดคิว sign-off เป็น batch เดียวไม่ใช่ทีละ epic",
    epics: ["Institution Structure & Master Data", "Learner Identity Linking", "API Management & Integration Standards", "University Payment Config & White-label Branding"],
  },
  {
    title: "นโยบาย \"ไม่มีงบ AI\" ขัดกับ feature ที่ขอ AI ในหลายจุด",
    detail: "Course Matching (ตั้งใจเลี่ยง AI) vs Learner Dashboard Career Insights/Skills/Recommendations vs Personalized Recommendation (BR-NCBS-07) — ควร reconcile นโยบายครั้งเดียวระดับโครงการ",
    epics: ["Dashboards & Analytics", "Landing Pages / CMS / Recommendation"],
  },
  {
    title: "Storage backend ไม่เคยถูกระบุที่ไหนเลย",
    detail: "Evidence file (Credit Transfer 1.7), Avatar (Learner Profile 4.1), Logo (Whitelabel 2.3) — ทุก epic เจอปัญหาเดียวกัน ควรตัดสินที่ Foundation level ครั้งเดียว",
    epics: ["Credit Transfer", "Learner Profile, Portfolio & Public Profile", "University Payment Config & White-label Branding", "Data & Service Foundation"],
  },
  {
    title: "FR/SCR numbering hygiene มีปัญหาซ้ำ",
    detail: "SCR-021 ชนกับ SCR-020 ต้อง renumber, LER-02/05 สลับกันใน Credit Portfolio PRD, SRS version mismatch ใน Registration PRD — เป็นสัญญาณว่า SCR registry governance ต้องการความรัดกุมกว่านี้",
    epics: [],
  },
  {
    title: "External/legal blockers ที่ไม่ใช่ dev work แต่ค้างอยู่ใน backlog",
    detail: "Blocked Integrations (LLRS/Credit Port), Skill Matrix taxonomy standard, LMS/TCU integration — ทั้งหมดต้องการ PM escalation ไม่ใช่ sprint capacity",
    epics: ["Blocked Integrations (LLRS + Credit Port)", "Skill Matrix / Skill Database", "LMS Integration"],
  },
];
