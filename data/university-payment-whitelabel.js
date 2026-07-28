// NCBS Breakdown — University Payment Config & White-label Branding epic data
// ⚠️ Track B ล้วน — ไม่มี real PRD คู่กัน
// หมายเหตุ: University Payment Configuration (fee structure model) breakdown เต็มอยู่ใน Credit Transfer Epic (F3) แล้ว — ในนี้ cross-ref เท่านั้น ไม่ duplicate

const UNIVERSITY_PAYMENT_WHITELABEL_DATA = {
  epicDeps: [
    { name:"Institution Structure & Master Data Epic", why:"institution entity + institution_id เป็นฐานของทุก config ในนี้", blocker:false },
    { name:"Role & Access Management Epic", why:"institution_id scope ต่อ record (ABAC) ต้องสอดคล้องกับ data ownership model", blocker:false },
    { name:"Credit Transfer Epic (F3 Payment)", why:"University Payment Config (fee structure) breakdown เต็มอยู่ที่นั่นแล้ว — epic นี้ไม่ duplicate", blocker:false },
  ],
  features: [
    {
      id:"F1", name:"Design Token Architecture (3-Layer)",
      sources:["decisions/2026-07-whitelabel-ci-review.md §1"],
      tasks:[
        {id:"1.1", task:"3-layer token system (primitive→semantic→brand)", desc:"หลักการถูกต้องแล้ว — ต้องคุมวินัยไม่ให้หน้าใหม่ bypass ไปอ้าง primitive ตรงๆ", dep:"—", src:"whitelabel-ci-review.md §1", c:"green"},
        {id:"1.2", task:"Purple-scale remap ใต้ :root[data-brand]", desc:"แก้ปัญหาที่เจอจริง (14 ไฟล์อ้าง var(--purple-500) ตรงๆ ข้าม semantic layer)", dep:"1.1", src:"whitelabel-ci-review.md §1", c:"green", note:"เป็นบทเรียนจริงที่ต้อง enforce เป็น code review rule ไม่ใช่แค่ fix ครั้งเดียว"},
        {id:"1.3", task:"institution_branding table", desc:"primary hex + logo + names — เฉดที่เหลือคำนวณจากสีเดียว ไม่ต้องให้สถาบันกรอก 16 ค่า", dep:"1.1, Institution Structure Epic", src:"whitelabel-ci-review.md §4 FR-UCBS-DB-04", c:"green", note:"พิสูจน์แล้วด้วย applyBrandColor function ใน prototype"},
      ]
    },
    {
      id:"F2", name:"Per-Institution CI Settings UI",
      sources:["decisions/2026-07-whitelabel-ci-review.md §2, §4.1","concepts/white-label-branding.md"],
      tasks:[
        {id:"2.1", task:"Color picker + WCAG AA contrast checker (real-time)", desc:"≥4.5=ผ่าน(เขียว) · 3-4.5=เตือน(ส้ม) · <3=ห้ามใช้(แดง) — เก็บ ratio ลง audit ตอนบันทึก", dep:"F1", src:"whitelabel-ci-review.md §2", c:"green"},
        {id:"2.2", task:"Per-institution isolated storage", desc:"ucbs-ci-overrides ต่อสถาบัน แทน key เดียวที่สี bleed ข้ามสถาบันตอนสลับ", dep:"2.1", src:"whitelabel-ci-review.md §4.1", c:"green", note:"bug จริงที่เจอและแก้แล้วใน prototype — verify E2E ผ่าน (TU custom ↔ BRU official ไม่ปนกัน)"},
        {id:"2.3", task:"Logo upload + 'คืนค่าสีทางการ' button", desc:"", dep:"2.1", src:"whitelabel-ci-review.md §4.1", c:"yellow", note:"โลโก้อัปโหลดยังไม่เก็บจริง (mock ใน prototype) — ต้องพึ่ง storage backend จริง (cross-ref Data & Service Foundation)"},
        {id:"2.4", task:"6 สถาบันนำร่อง color presets", desc:"bru/nmu/stc/thammasat/msu/bu — สีสกัดจากโลโก้จริง", dep:"2.1", src:"concepts/white-label-branding.md", c:"green"},
      ]
    },
    {
      id:"F3", name:"Institution Profile Settings (FR-UCBS-DB-03)",
      sources:["decisions/2026-07-whitelabel-ci-review.md §2"],
      tasks:[
        {id:"3.1", task:"ข้อมูลทางการ", desc:"ชื่อ TH/EN, รหัสสถาบัน(read-only), ประเภท 6 แบบ", dep:"Institution Structure Epic", src:"whitelabel-ci-review.md §2", c:"green"},
        {id:"3.2", task:"ที่ตั้ง/ออนไลน์", desc:"ที่อยู่, จังหวัด, เว็บไซต์, โดเมนอีเมลนักศึกษา", dep:"3.1", src:"whitelabel-ci-review.md §2", c:"green"},
        {id:"3.3", task:"ผู้ประสานงานหลักสำหรับ อว.", desc:"", dep:"3.1", src:"whitelabel-ci-review.md §2", c:"green"},
        {id:"3.4", task:"ช่องทางสนับสนุนผู้เรียน (นอกระบบ)", desc:"แสดงเป็นข้อมูลติดต่อ ไม่ใช่ ticket ในระบบ", dep:"3.1", src:"whitelabel-ci-review.md §2, §5", c:"green", note:"cross-ref API Management epic — Support Ticket ถูกตัดออกทั้งระบบแล้ว (มติ PM 2026-07-13)"},
        {id:"3.5", task:"การ์ดสถานะ sync", desc:"", dep:"3.1", src:"whitelabel-ci-review.md §2", c:"green"},
      ]
    },
    {
      id:"F4", name:"Data Ownership & Sync Model (UCBS↔NCBS)",
      sources:["decisions/2026-07-whitelabel-ci-review.md §3, §5"],
      tasks:[
        {id:"4.1", task:"institution.profile.updated event (UCBS→NCBS)", desc:"", dep:"F3, Data & Service Foundation (async backbone)", src:"whitelabel-ci-review.md §5 next step 3", c:"yellow", note:"ระบุตรงๆ ว่ายังต้อง 'ออกแบบ' — เป็น dev task ที่ยังไม่เริ่ม ไม่ใช่แค่ยังไม่ implement"},
        {id:"4.2", task:"NCBS institution detail — 'โปรไฟล์จากสถาบัน' section", desc:"read-only + badge เวลา sync", dep:"4.1", src:"whitelabel-ci-review.md §3", c:"green"},
        {id:"4.3", task:"Official name change approval workflow", desc:"ชื่อสถาบันเปลี่ยนเองได้เลย หรือต้องผ่าน อว. อนุมัติก่อน (กระทบ e-transcript/verify)", dep:"4.1", src:"whitelabel-ci-review.md §4 'ของที่ mock', §5 next step 1", c:"red", note:"open question ที่ยกให้ BA เคาะตรงๆ — มีผลกระทบจริงต่อความถูกต้องของ transcript/verify ที่ออกไปแล้ว ไม่ควร assume คำตอบเอง"},
      ]
    },
    {
      id:"F5", name:"Official CI 2026 (NCBS-owned Brand, SCR-017)",
      sources:["decisions/scr-017-official-ci-adoption.md"],
      note:"visual-only governance — ไม่กระทบ FR/requirement ใดๆ ตามที่ SCR ระบุเอง",
      tasks:[
        {id:"5.1", task:"Foundation design tokens update", desc:"--ci-trust(#661AE3)/innovation(#BA68C8)/clarity(#FFD740) + --font-display(Baloo Chettan 2)", dep:"F1", src:"scr-017 §3", c:"green"},
        {id:"5.2", task:"Official logo asset (hexagon) ทุก NCBS-owned mark", desc:"", dep:"5.1", src:"scr-017 §5", c:"green"},
        {id:"5.3", task:"White-label exception ยืนยัน", desc:"per-university logo (UCBS) ไม่ถูกทับด้วย CI ใหม่", dep:"5.2, F2", src:"scr-017 §6", c:"green"},
      ]
    },
  ],
  priority: [
    "<b>F1 (token architecture)</b> — ทำก่อนสุด และต้อง enforce เป็น dev discipline/lint rule ไม่ใช่แค่ fix ครั้งเดียว (บทเรียนจาก 14 ไฟล์ที่เคย bypass)",
    "<b>F3 (institution profile)</b> — ทำคู่ขนานกับ F2 ได้ เป็นคนละหมวด settings",
    "<b>4.3 (ชื่อทางการ approval)</b> — ควรถาม BA เคาะให้เร็ว เพราะกระทบ design ของ F4 ทั้งฟีเจอร์และมีผลจริงต่อเอกสารที่ออกไปแล้ว",
    "<b>F5 (Official CI)</b> — priority ต่ำสุดในแง่ dev effort เพราะเป็น asset swap ที่ 'applied แล้ว' ในระดับ design governance — งานที่เหลือคือทำให้ real backend เคารพ token เดียวกัน",
  ],
  flags: [
    "<b>Official name change approval (4.3)</b> — ยังไม่เคาะว่า self-service หรือต้องผ่าน อว. — กระทบความถูกต้องของ e-transcript/verify ที่อ้างชื่อสถาบัน ควร escalate ให้ BA ตอบก่อน implement F4 เต็มรูป",
    "<b>Logo upload ไม่ real (2.3)</b> — mock ใน prototype ทั้งหมด ต้องพึ่ง storage backend จริงที่ยังไม่มีสเปคที่ไหนในวิกิ (เดียวกับ evidence file storage ที่ flag ไว้ใน Credit Transfer/Learner Profile epic)",
    "<b>institution.profile.updated event ยังไม่ออกแบบ (4.1)</b> — เป็น real dev work ที่ระบุไว้ว่า 'ต้องออกแบบ' ไม่ใช่แค่ implement จาก spec ที่มีอยู่แล้ว",
    "<b>ทั้ง epic เป็น Track B</b> — ไม่มี real PRD คู่กัน เป็นผลจาก architecture review ที่ทีม product/wiki ทำเอง — ควร sign-off ก่อน commit sprint เหมือน epic อื่นที่เป็น Track B",
  ]
};


// ---------- register into multi-epic registry ----------
window.NCBS_EPICS = window.NCBS_EPICS || {};
window.NCBS_EPICS['university-payment-whitelabel'] = {
  id: 'university-payment-whitelabel',
  system: 'UCBS',
  name: 'University Payment Config & White-label Branding',
  thaiName: 'การตั้งค่าค่าธรรมเนียมมหาวิทยาลัยและแบรนด์',
  status: 'Track B — architecture review เสร็จแล้ว รอ implement จริง',
  epicDeps: UNIVERSITY_PAYMENT_WHITELABEL_DATA.epicDeps,
  features: UNIVERSITY_PAYMENT_WHITELABEL_DATA.features,
  priority: UNIVERSITY_PAYMENT_WHITELABEL_DATA.priority,
  flags: UNIVERSITY_PAYMENT_WHITELABEL_DATA.flags,
};
