// NCBS Breakdown — Notification Service epic data (shared infra)
// ⭐ Epic ที่มี real dev evidence มั่นใจที่สุดในทั้งชุด — Jira NCBS-243 (real author: Jirayu/Artid, Tech), production SMTP confirmed จริง (23 ก.ค. 69)
// ใช้ร่วมกับแทบทุก epic อื่น (Identity&Auth, Credit Transfer, Learner Identity Linking, Data Ingestion, User Mgmt)

const NOTIFICATION_SERVICE_DATA = {
  epicDeps: [
    { name:"Data & Service Foundation (NATS JetStream/Outbox backbone)", why:"Email pipeline ใช้ Transactional Outbox → NATS pattern เดียวกับที่ Foundation epic วางไว้ (F5)", blocker:false },
  ],
  features: [
    {
      id:"F1", name:"Email Delivery Pipeline (Jira NCBS-243 — Real, In Progress)",
      sources:["sources/email-delivery-solution.md (real ticket, Jirayu/Artid — Tech)"],
      note:"⭐ ความเชื่อมั่นสูงสุดในทั้ง epic นี้ — สถาปัตยกรรมตัดสินใจแล้วจริง + production SMTP endpoint ยืนยันแล้ว (workD/Zimbra อว., ncbs-noreply@mhesi.go.th, ทดสอบส่งสำเร็จ มี.ค. 69)",
      tasks:[
        {id:"1.1", task:"Outbox pattern (write ในทรานแซคชันเดียวกับ command)", desc:"", dep:"Data & Service Foundation F5", src:"email-delivery-solution.md Architecture Pipeline", c:"green"},
        {id:"1.2", task:"OutboxPublisherService (poll ทุก 5s → publish NATS JetStream)", desc:"@Interval decorator", dep:"1.1", src:"email-delivery-solution.md Components", c:"green"},
        {id:"1.3", task:"EmailPort/SmtpAdapter (Port/Adapter pattern)", desc:"swappable — business logic ขึ้นกับ EmailPort เท่านั้น", dep:"1.2", src:"email-delivery-solution.md", c:"green"},
        {id:"1.4", task:"5 email types", desc:"invitation(7d), verification(24h), resend-verification, password-reset-request(1h single-use jti), password-reset-confirm", dep:"1.3", src:"email-delivery-solution.md Email Types", c:"green"},
        {id:"1.5", task:"Production SMTP integration (workD/Zimbra อว.)", desc:"ncbs-noreply@mhesi.go.th — ทดสอบส่งสำเร็จแล้ว", dep:"1.3", src:"email-delivery-solution.md อัปเดต 2026-07-23", c:"green", note:"✅ confirmed จริง ไม่ใช่แค่ design — Mailpit เหลือไว้แค่ dev/test"},
        {id:"1.6", task:"JWT jti single-use enforcement", desc:"เก็บ used jti ใน outbox/cache", dep:"1.4", src:"email-delivery-solution.md Risks", c:"yellow", note:"ระบุเป็น risk ที่ 'ยังไม่ enforce' ในเอกสารเอง — ต้องปิดก่อน production จริง"},
        {id:"1.7", task:"NATS retry (3×) → DLQ + onDeadLetter log", desc:"", dep:"1.2", src:"email-delivery-solution.md Risks", c:"yellow"},
        {id:"1.8", task:"Handlebars template injection escaping", desc:"escape ทุกค่าที่มาจาก user input", dep:"1.4", src:"email-delivery-solution.md Risks", c:"green"},
        {id:"1.9", task:"Oracle outbox migration", desc:"ต้องเพิ่มใน Phase 1 + block CI ถ้าลืม", dep:"1.1, Data & Service Foundation F1", src:"email-delivery-solution.md Risks", c:"yellow"},
      ]
    },
    {
      id:"F2", name:"Notification Toggle Matrix (SCR-003)",
      sources:["decisions/scr-003-notification-toggle-matrix.md","decisions/scr-002-notification-channels-sms-removal.md"],
      tasks:[
        {id:"2.1", task:"4 ประเภท × 2 ช่องทาง matrix", desc:"คำร้องเทียบโอน/การชำระเงิน/สถานะหน่วยกิต/ข่าวสาร × Email/Push (SMS ตัดออกตาม SCR-002)", dep:"—", src:"scr-003", c:"green"},
        {id:"2.2", task:"Auto-save เมื่อ toggle เปลี่ยน", desc:"ไม่ต้องกดปุ่ม save", dep:"2.1", src:"scr-003", c:"green"},
        {id:"2.3", task:"Default values", desc:"Email=ON ทุกประเภท, Push=ON ทุกประเภท", dep:"2.1", src:"scr-003", c:"green"},
        {id:"2.4", task:"All-channels-off warning (ไม่ block)", desc:"", dep:"2.1", src:"scr-003", c:"green"},
      ]
    },
    {
      id:"F3", name:"Push Notification Channel",
      sources:["sources/prd-learner-profile-settings.md Open Questions #3"],
      tasks:[
        {id:"3.1", task:"เลือก engine: Firebase Cloud Messaging vs Web Push API", desc:"", dep:"—", src:"prd-learner-profile-settings.md Open Questions", c:"red", note:"open question ที่ระบุตรงๆ ว่า 'มีผลต่อ implementation effort' — ต้องเคาะก่อน estimate ฟีเจอร์นี้ทั้งหมด"},
        {id:"3.2", task:"Browser-block detection + warning + disable toggle", desc:"", dep:"3.1", src:"prd-learner-profile-settings.md Edge Cases", c:"green", note:"spec ชัดเจนเมื่อเลือก engine แล้ว"},
      ]
    },
    {
      id:"F4", name:"Notification Trigger Catalog (Cross-Epic Aggregation)",
      sources:["decisions/2026-07-embedded-formulas-spec.md §4"],
      note:"trigger กระจายอยู่หลาย epic — ควรรวมเป็น catalog กลางเดียว ไม่ใช่ให้แต่ละ epic implement เอง เพื่อกัน drift ของ business rule เดียวกัน",
      tasks:[
        {id:"4.1", task:"Transfer status change (ทุก transition)", desc:"", dep:"Credit Transfer Epic F6", src:"embedded-formulas-spec.md §4", c:"green"},
        {id:"4.2", task:"Docs-requested + เตือนก่อน deadline 3 วัน", desc:"", dep:"Credit Transfer Epic F6", src:"embedded-formulas-spec.md §4", c:"green"},
        {id:"4.3", task:"คำขอใหม่เข้าคิว / ใกล้ครบ SLA (เจ้าหน้าที่)", desc:"", dep:"Credit Transfer Epic F4", src:"embedded-formulas-spec.md §4", c:"green"},
        {id:"4.4", task:"สถาบันข้อมูลต่ำกว่าเกณฑ์ (skeleton >40%/ไม่อัปเดต >90 วัน)", desc:"", dep:"Multi-Channel Data Ingestion Epic F7", src:"embedded-formulas-spec.md §4", c:"green"},
        {id:"4.5", task:"Bulk import เสร็จ/ล้มเหลว", desc:"", dep:"Multi-Channel Data Ingestion Epic F6", src:"embedded-formulas-spec.md §4", c:"green"},
        {id:"4.6", task:"ผลตรวจสอบตัวตน (Foreign Learner Identity)", desc:"อนุมัติ/ปฏิเสธ/ขอเอกสารเพิ่ม", dep:"Identity & Auth Epic F4", src:"scr-019 §3 A3", c:"green"},
        {id:"4.7", task:"Learner Identity Linking: claim สำเร็จ/ได้รับข้อมูลใหม่", desc:"", dep:"Learner Identity Linking Epic F7.2", src:"learner-identity-linking-spec-draft.md §5 gap#7", c:"red", note:"ระบุเป็น gap ที่ยังไม่ออกแบบในต้นทาง (Learner Identity Linking epic) — รอที่นั่นก่อน"},
      ]
    },
    {
      id:"F5", name:"Template Management",
      sources:["sources/email-delivery-solution.md Impact on Blocked Issues"],
      tasks:[
        {id:"5.1", task:"Email templates (ไทย, Handlebars .hbs)", desc:"invitation + verification", dep:"F1.4", src:"email-delivery-solution.md 'Still needed'", c:"yellow", note:"ระบุตรงๆ ว่า 'Still needed' แม้ pipeline หลักจะพร้อมแล้ว"},
        {id:"5.2", task:"In-app notification template registry", desc:"", dep:"F2", src:"—", c:"yellow"},
        {id:"5.3", task:"CMS-driven template editing (nudge/quality templates)", desc:"เช่น template แจ้งเตือนสถาบันข้อมูลต่ำกว่าเกณฑ์", dep:"5.1, Multi-Channel Data Ingestion Epic F7.2", src:"master-data-onboarding.md §6.3", c:"yellow"},
      ]
    },
  ],
  priority: [
    "<b>F1 (Email pipeline)</b> — มั่นใจสูงสุด ทำต่อให้เสร็จ (already In Progress) — เก็บ risk items (1.6-1.9) ให้ปิดก่อน production",
    "<b>F2 (Toggle Matrix)</b> — spec ชัดเจน ทำคู่ขนานกับ F1 ได้",
    "<b>F4 (Trigger catalog)</b> — ควรทำเป็น shared module ตั้งแต่ต้น ไม่ใช่รอให้แต่ละ epic implement แยกกันแล้วมา sync ทีหลัง",
    "<b>F3 (Push channel)</b> — รอเคาะ engine ก่อน (3.1) ถึงจะ estimate effort ได้แม่นยำ",
    "<b>F5 (Templates)</b> — ทำคู่ขนานได้ แต่ต้องเสร็จก่อน F1 จะใช้งานได้จริงในโปรดักชัน (ตอนนี้ยัง 'still needed')",
  ],
  flags: [
    "<b>Epic นี้น่าเชื่อถือที่สุดในทั้งชุด (F1)</b> — ต่างจาก epic อื่นส่วนใหญ่ที่เป็น Track B (AI-generated draft) F1 มีหลักฐาน real Jira ticket + real author + production endpoint ยืนยันแล้วจริง — ใช้เป็น baseline ความมั่นใจเวลาเทียบกับ epic อื่น",
    "<b>Push engine ยังไม่เคาะ (3.1)</b> — กระทบ effort ต่างกันมากระหว่าง FCM กับ Web Push API — ควรเคาะก่อนวาง sprint",
    "<b>Risk items ของ F1 ยังไม่ปิดหมด (1.6, 1.7, 1.9)</b> — โดยเฉพาะ JWT jti single-use enforcement ที่ยังไม่บังคับใช้จริง เป็นช่องโหว่ replay attack ถ้าไม่ปิดก่อน production",
    "<b>Trigger catalog กระจัดกระจาย (F4)</b> — ถ้าแต่ละ epic implement trigger ของตัวเองแยกกัน มีความเสี่ยงสูงที่ business rule (เช่น ข้อความ, ช่องทาง, เงื่อนไข) จะ drift ไม่ตรงกัน ควรรวมเป็น catalog เดียวให้เร็ว",
  ]
};


// ---------- register into multi-epic registry ----------
window.NCBS_EPICS = window.NCBS_EPICS || {};
window.NCBS_EPICS['notification-service'] = {
  id: 'notification-service',
  system: 'NCBS',
  name: 'Notification Service',
  thaiName: 'ระบบแจ้งเตือน',
  status: 'Real dev In Progress (Jira NCBS-243) — production SMTP confirmed แล้ว',
  epicDeps: NOTIFICATION_SERVICE_DATA.epicDeps,
  features: NOTIFICATION_SERVICE_DATA.features,
  priority: NOTIFICATION_SERVICE_DATA.priority,
  flags: NOTIFICATION_SERVICE_DATA.flags,
};
