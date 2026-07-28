// NCBS Breakdown — Learner Profile, Portfolio & Public Profile epic data
// Sprint Details #57 (NCBS Learner Portal) Phase 2 — แต่ spec ฝั่ง wiki ละเอียดกว่านั้นมาก
// ⚠️ ทั้ง 2 PRD หลัก (Profile Settings, Credit Portfolio) เป็น "AI Draft, Human Decide" — prototype-first, รอ BA/PO review
// ต่างจาก User Management (admin มองผู้ใช้อื่น) และ Grade & Credit Management (admin search/view) — นี่คือผู้เรียนจัดการ/ดูข้อมูลตัวเอง

const LEARNER_PROFILE_PORTFOLIO_DATA = {
  epicDeps: [
    { name:"Identity & Authentication", why:"Identity Fields ดึงจาก ThaID/DOPA + password change ผูกกับ auth session", blocker:false },
    { name:"Grade & Credit Management Epic", why:"Portfolio/Transcript ดึงข้อมูล credit record + Grade System (16 ระดับ) จาก epic นั้น", blocker:false },
    { name:"Credit Transfer Epic (Blockchain Anchoring)", why:"'Verify on Chain' ทั้งใน Course Modal และ Public Profile ต้องพึ่ง blockchain anchoring ที่ยัง 🔴 ใน Credit Transfer epic", blocker:true },
    { name:"Notification Service", why:"Password-change email, notification preference ต้องมี infra ส่งจริง", blocker:false },
    { name:"PDPA & Compliance Epic", why:"Public Profile ต้องมี 2-layer consent model ที่สอดคล้องกัน", blocker:false },
  ],
  features: [
    {
      id:"F1", name:"Personal Info & Identity Display",
      sources:["sources/prd-learner-profile-settings.md (Track B, AI Draft — รอ BA/PO)"],
      tasks:[
        {id:"1.1", task:"Identity Fields display (read-only)", desc:"ชื่อ-สกุล/เลขบัตร(masked)/วันเกิด จาก ThaID/DOPA", dep:"Identity & Auth Epic F3", src:"prd-learner-profile-settings.md UC-PRO-LER-01", c:"green"},
        {id:"1.2", task:"Contact Fields edit (email/phone/address)", desc:"validate real-time: email regex, phone 10 หลัก, ที่อยู่ ≥10 ตัวอักษร", dep:"1.1", src:"prd-learner-profile-settings.md UC-PRO-LER-01", c:"green"},
        {id:"1.3", task:"ThaID Verification Badge", desc:"เขียว=verified / เหลือง=รอยืนยัน+CTA", dep:"1.1", src:"prd-learner-profile-settings.md M3", c:"green"},
        {id:"1.4", task:"Unsaved-changes dialog เมื่อออกจากหน้า", desc:"", dep:"1.2", src:"prd-learner-profile-settings.md Edge Cases", c:"green"},
        {id:"1.5", task:"Edge cases: ThaID ยังไม่ verify / email ซ้ำ / ThaID API down", desc:"", dep:"1.1-1.3", src:"prd-learner-profile-settings.md Edge Cases", c:"green"},
      ]
    },
    {
      id:"F2", name:"Notification Preferences",
      sources:["sources/prd-learner-profile-settings.md UC-PRO-LER-02","decisions/scr-002-notification-channels-sms-removal.md","decisions/scr-003-notification-toggle-matrix.md"],
      tasks:[
        {id:"2.1", task:"Toggle Matrix (4 ประเภท × ช่องทาง)", desc:"คำร้องเทียบโอน/การชำระเงิน/สถานะหน่วยกิต/ข่าวสาร", dep:"—", src:"prd-learner-profile-settings.md, scr-003", c:"yellow", note:"⚠️ ขัดกันเอง: PRD นี้(30 พ.ค.)ระบุ 3 ช่องทาง(Email/Push/SMS) แต่ SCR-002(31 พ.ค., อนุมัติทีหลัง)ตัด SMS ออกทั้งหมดเหลือ 2 ช่องทาง — ต้องยึด SCR-002/003 เป็นตัวล่าสุด ไม่ใช่ PRD"},
        {id:"2.2", task:"Auto-save เมื่อ toggle เปลี่ยน", desc:"ไม่ต้องกดปุ่ม save", dep:"2.1", src:"prd-learner-profile-settings.md", c:"green"},
        {id:"2.3", task:"Edge cases", desc:"ปิดทุกช่องทาง(คำเตือนไม่ block) · push ถูก browser block · autosave fail(rollback+toast)", dep:"2.1", src:"prd-learner-profile-settings.md Edge Cases", c:"green"},
        {id:"2.4", task:"Default state ต่อประเภท", desc:"Email=ON ทุกประเภท, Push=ON (SMS ตัดออกตาม SCR-002)", dep:"2.1", src:"prd-learner-profile-settings.md, scr-002", c:"green"},
      ]
    },
    {
      id:"F3", name:"Password Change (Learner Self-Service)",
      sources:["sources/prd-learner-profile-settings.md UC-PRO-LER-03","decisions/scr-004-change-password-scope.md"],
      tasks:[
        {id:"3.1", task:"Change password form (current+new+confirm)", desc:"ขั้นต่ำ 8 ตัว + ตัวอักษร+ตัวเลข", dep:"Identity & Auth Epic F2", src:"prd-learner-profile-settings.md", c:"green"},
        {id:"3.2", task:"Password history check (≠ 5 รหัสล่าสุด)", desc:"", dep:"3.1", src:"prd-learner-profile-settings.md Open Questions #4", c:"yellow", note:"open question จริง: เป็น requirement ตาม PDPA หรือแค่ best practice — ต้องเคาะกับ security team"},
        {id:"3.3", task:"Rate limit (3 ครั้ง/10 นาที → lock 30 นาที)", desc:"", dep:"3.1", src:"prd-learner-profile-settings.md Business Rules", c:"green"},
        {id:"3.4", task:"Email notification เมื่อเปลี่ยนสำเร็จ (non-blocking)", desc:"เปลี่ยนสำเร็จแล้วแม้ email ส่งไม่ถึง ไม่ rollback", dep:"3.1, Notification Epic", src:"prd-learner-profile-settings.md Edge Cases", c:"green"},
        {id:"3.5", task:"Audit log (session ไม่ invalidate หลังเปลี่ยน)", desc:"", dep:"3.1", src:"prd-learner-profile-settings.md Business Rules", c:"green"},
      ]
    },
    {
      id:"F4", name:"Avatar / Profile Photo",
      sources:["sources/prd-learner-profile-settings.md M6"],
      tasks:[
        {id:"4.1", task:"Upload (max 2MB, jpg/png) + preview ก่อนบันทึก", desc:"", dep:"Data & Service Foundation (storage)", src:"prd-learner-profile-settings.md M6", c:"yellow", note:"storage backend (S3/CDN vs base64 in DB) เป็น open question ที่กระทบ cost — ต้องเคาะร่วมกับ infra"},
      ]
    },
    {
      id:"F5", name:"Credit Portfolio View",
      sources:["sources/prd-learner-credit-portfolio.md (Track B, AI Draft — รอ BA/PO) UC-CPF-LER-01"],
      tasks:[
        {id:"5.1", task:"KPI Cards", desc:"หน่วยกิตรวม, จำนวนวิชา, สถาบัน, GPAX (เฉพาะ Formal เท่านั้น)", dep:"Grade & Credit Management Epic F6", src:"prd-learner-credit-portfolio.md UC-CPF-LER-01", c:"green"},
        {id:"5.2", task:"Portfolio table (filter ปี/ภาค/ประเภท/สถาบัน)", desc:"client-side filter", dep:"5.1", src:"prd-learner-credit-portfolio.md UC-CPF-LER-01", c:"green"},
        {id:"5.3", task:"Empty/Loading/Error states", desc:"", dep:"5.1", src:"prd-learner-credit-portfolio.md Edge Cases", c:"green"},
        {id:"5.4", task:"Status badges (verified/pending/disputed)", desc:"", dep:"5.2", src:"prd-learner-credit-portfolio.md Edge Cases", c:"green"},
      ]
    },
    {
      id:"F6", name:"E-Transcript View",
      sources:["sources/prd-learner-credit-portfolio.md UC-CPF-LER-02"],
      tasks:[
        {id:"6.1", task:"5-level hierarchy grouping", desc:"University→Faculty→Program→Year→Semester", dep:"5.1, Institution Structure Epic", src:"prd-learner-credit-portfolio.md UC-CPF-LER-02", c:"green"},
        {id:"6.2", task:"Multi-institution tabs", desc:"เรียงตามหน่วยกิตมาก→น้อย", dep:"6.1", src:"prd-learner-credit-portfolio.md Edge Cases", c:"green"},
        {id:"6.3", task:"Term GPAX + Cumulative GPAX แยกตาม ม.", desc:"", dep:"6.1, Grade & Credit Mgmt Epic F6", src:"prd-learner-credit-portfolio.md", c:"yellow", note:"open question จริง: สูตรตรงกับระเบียบแต่ละ ม. หรือไม่ — แต่ละ ม. อาจมีรูปแบบต่างกัน"},
        {id:"6.4", task:"Grade Legend (collapsible, 16 ระดับ)", desc:"", dep:"Grade & Credit Management Epic F6", src:"prd-learner-credit-portfolio.md M5", c:"green"},
        {id:"6.5", task:"Other Credits section (นอกหลักสูตร)", desc:"", dep:"6.1", src:"prd-learner-credit-portfolio.md M7", c:"green"},
        {id:"6.6", task:"Expand/Collapse all + default 2 ภาคล่าสุด", desc:"", dep:"6.1", src:"prd-learner-credit-portfolio.md Edge Cases", c:"green"},
      ]
    },
    {
      id:"F7", name:"Course Detail Modal (Learner, + Blockchain)",
      sources:["sources/prd-learner-credit-portfolio.md UC-CPF-LER-03"],
      tasks:[
        {id:"7.1", task:"Full course detail + CLO list + instructor + assessment type", desc:"", dep:"5.1, Grade & Credit Management Epic F4", src:"prd-learner-credit-portfolio.md UC-CPF-LER-03", c:"green"},
        {id:"7.2", task:"Blockchain TX Hash display + Verify on Chain", desc:"'รอการบันทึกลง Blockchain' state เมื่อยังไม่ sync", dep:"Credit Transfer Epic F7 (Blockchain Anchoring)", src:"prd-learner-credit-portfolio.md UC-CPF-LER-03", c:"red", note:"ต้องพึ่ง Blockchain Anchoring ที่ยัง 🔴 ใน Credit Transfer epic (chain tech ยังไม่เคาะ) — ทำได้แค่ 'placeholder pending state' ก่อน"},
        {id:"7.3", task:"Evidence file link + broken-file handling", desc:"", dep:"7.1", src:"prd-learner-credit-portfolio.md Edge Cases", c:"green"},
      ]
    },
    {
      id:"F8", name:"Export Transcript PDF",
      sources:["sources/prd-learner-credit-portfolio.md UC-CPF-LER-04"],
      tasks:[
        {id:"8.1", task:"PDF generation จาก E-Transcript", desc:"engine ยังไม่เลือก (server-side vs client-side)", dep:"F6", src:"prd-learner-credit-portfolio.md Open Questions #1", c:"red", note:"open question เขียนไว้ตรงๆ ว่า High impact — client-side อาจมีปัญหาไฟล์ใหญ่ ต้องเคาะก่อน implement"},
        {id:"8.2", task:"QR code สำหรับตรวจสอบเอกสาร", desc:"", dep:"8.1", src:"prd-learner-credit-portfolio.md Business Rules", c:"green"},
        {id:"8.3", task:"Multi-institution PDF sectioning", desc:"", dep:"8.1", src:"prd-learner-credit-portfolio.md Edge Cases", c:"green"},
        {id:"8.4", task:"Progress indicator + mobile auto-download fallback", desc:"", dep:"8.1", src:"prd-learner-credit-portfolio.md Edge Cases", c:"green"},
      ]
    },
    {
      id:"F9", name:"Public Learning Profile (SCR-014)",
      sources:["decisions/scr-014-public-learning-profile.md"],
      note:"⭐ strategic feature — ตอบ 'value proposition' ที่มหาวิทยาลัยกลุ่ม skeptical ต้องการเห็น (GAP-006) และตรง Regulator policy ('อว. ไม่ใช่ผู้ออก report — เจ้าของข้อมูล display เอง')",
      tasks:[
        {id:"9.1", task:"Public profile page (/p/{handle})", desc:"learner-owned, เปิด/ปิดจาก Settings", dep:"F1, F5", src:"scr-014 §3 FR-NCBS-LER-08", c:"green"},
        {id:"9.2", task:"Visibility toggle ต่อองค์ประกอบ", desc:"identity/ThaID badge/summary/skill portfolio/learning records(ต่อ record)/เกรด(default ปิด)/formal-nonformal-informal grouping/verification/contact — ตารางจริงมี 9 แถวแม้เอกสารอื่นเรียก '7 องค์ประกอบ'", dep:"9.1", src:"scr-014 §6", c:"green", note:"เอกสารเขียนไม่ตรงกันเอง: หัวข้อพูดถึง '7 องค์ประกอบ round-trip' แต่ตาราง §6 มี 9 แถว (รวม Contact ที่เพิ่มทีหลัง) — ไม่กระทบ dev ถ้ายึดตาราง §6 เป็นหลัก แต่ควรรู้ไว้เผื่อสับสน"},
        {id:"9.3", task:"QR + share link generation", desc:"", dep:"9.1", src:"scr-014 §1", c:"green"},
        {id:"9.4", task:"Verifiable credential display (blockchain verify ไม่เปิดเผย PII อื่น)", desc:"", dep:"9.1, Credit Transfer Epic F7 (Blockchain Anchoring)", src:"scr-014 §3 FR-NCBS-LER-09", c:"red", note:"เดียวกับ 7.2 — พึ่ง Blockchain Anchoring ที่ยัง 🔴 — 'Verify badge = หัวใจ' ตามที่เอกสารเขียนเอง ถ้าไม่มี blockchain จริง ความน่าเชื่อถือต่อ employer หายไปเลย"},
        {id:"9.5", task:"2-layer PDPA consent (สถาบัน + NCBS)", desc:"", dep:"9.1, PDPA & Compliance Epic", src:"scr-014 §5 Impact Analysis", c:"yellow", note:"high impact ตามที่ระบุเอง แต่รายละเอียด consent flow ยังไม่ลึกเท่า Foreign Identity (SCR-019) — ต้องออกแบบเพิ่ม"},
      ]
    },
  ],
  priority: [
    "<b>F1, F2, F3, F4 (account settings)</b> — ทำก่อนสุด เป็น self-contained ไม่ผูก epic ใหญ่",
    "<b>2.1 (reconcile SCR-002/003 กับ PRD)</b> — ต้องยึด SCR-002/003 (อนุมัติทีหลัง) เป็นตัวจริง ไม่ใช่ PRD เดิมที่ยังพูดถึง SMS",
    "<b>F5, F6 (Portfolio/Transcript)</b> — ทำหลัง Grade & Credit Management epic มี data source จริง",
    "<b>F7.2, F9.4 (blockchain verify)</b> — ห้าม promise ทำเต็มจนกว่า Credit Transfer epic ปลดล็อก Blockchain Anchoring — ทำแค่ 'pending' placeholder ก่อนได้",
    "<b>F8 (PDF export)</b> — ต้องเคาะ engine (server/client-side) ก่อน estimate เพราะกระทบ effort ต่างกันมาก",
    "<b>F9 (Public Profile)</b> — strategic แต่ทำทีหลัง F1-F8 เพราะพึ่งพาข้อมูลจาก Portfolio (F5) + ต้องรอ PDPA consent design",
  ],
  flags: [
    "<b>SMS channel ขัดกันจริงระหว่าง 2 เอกสาร (2.1)</b> — prd-learner-profile-settings.md (30 พ.ค.) ระบุ 3 ช่องทางรวม SMS แต่ SCR-002 (31 พ.ค., อนุมัติทีหลัง 1 วัน) ตัด SMS ออกทั้งหมด — เป็นตัวอย่าง concrete ของ 2 เอกสารในระบบเดียวกันขัดกันเอง ต้องยึดเอกสารใหม่กว่า (SCR) เป็นหลักเสมอ",
    "<b>Blockchain dependency กระทบ 2 จุดในเอพิคนี้ (7.2, 9.4)</b> — ทั้ง Course Detail Modal และ Public Profile ต้องมี blockchain anchoring จริงถึงจะ 'Verify on Chain' ได้ความหมาย — Credit Transfer epic เองยัง flag ว่า chain technology ไม่เคาะ (งวด 4) ดังนั้น 2 feature นี้ควรทำแค่ placeholder ก่อน ไม่ estimate เป็นงานเสร็จสมบูรณ์รอบนี้",
    "<b>PDF generation engine ยังไม่เลือก (8.1)</b> — ระบุเป็น High impact open question ในเอกสารเอง (server-side vs client-side) กระทบ effort ต่างกันมาก ต้องเคาะก่อน sprint planning",
    "<b>GPAX formula ต่อสถาบันยังไม่ confirm (6.3)</b> — แต่ละมหาวิทยาลัยอาจมีกฎคำนวณต่างกัน ถ้าไม่ confirm ก่อน อาจต้อง rework GPAX logic ทีหลัง",
    "<b>Password history requirement ไม่ชัด (3.2)</b> — เป็น PDPA mandate จริงหรือ best practice เฉยๆ ยังไม่เคาะกับ security team",
    "<b>เอกสารไม่ตรงกันเองเรื่องจำนวนองค์ประกอบ Public Profile (9.2)</b> — ไม่กระทบ dev โดยตรง แต่เป็นสัญญาณว่าเอกสารชุดนี้แก้ไขบ่อยและ note/หัวข้อบางจุดตกหล่นไม่ sync กับตารางละเอียด ควร cross-check กับ prototype จริงก่อน build",
    "<b>FR code hygiene</b> — SCR-005 (อ้างใน portfolio PRD) เขียนไว้ว่าต้องแก้ 'PRD↔SRS code ที่สลับกัน (LER-02/05)' — เป็นหลักฐานว่า FR numbering ในโดเมนนี้เคยผิดพลาดมาก่อน ควร double-check FR code ก่อนอ้างอิงในการวางแผน sprint",
  ]
};


// ---------- register into multi-epic registry ----------
window.NCBS_EPICS = window.NCBS_EPICS || {};
window.NCBS_EPICS['learner-profile-portfolio'] = {
  id: 'learner-profile-portfolio',
  system: 'NCBS',
  name: 'Learner Profile, Portfolio & Public Profile',
  thaiName: 'โปรไฟล์ผู้เรียน คลังหน่วยกิต และโปรไฟล์สาธารณะ',
  status: 'Track B (AI Draft, Human Decide) — รอ BA/PO review',
  epicDeps: LEARNER_PROFILE_PORTFOLIO_DATA.epicDeps,
  features: LEARNER_PROFILE_PORTFOLIO_DATA.features,
  priority: LEARNER_PROFILE_PORTFOLIO_DATA.priority,
  flags: LEARNER_PROFILE_PORTFOLIO_DATA.flags,
};
