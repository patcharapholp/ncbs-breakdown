// NCBS Breakdown — Identity & Authentication epic data
// Sprint Details #3-6 (NCBS/UCBS Registration+Login), #15-16 (ThaID Integration) — v0.5.0/v0.8.0
// Real PRD track (Confluence, Nattaya PO/BA) มีครบ 3 PRD จริง: Authentication, User Registration — status "In Progress" (last update เม.ย. 69)
// SCR-019 (Foreign Learner Identity) เป็น prototype/wiki-side spec ที่ PM เคาะจริงแล้ว (2026-07-11) แต่ยัง Track B

const IDENTITY_AUTH_DATA = {
  epicDeps: [
    { name:"Data & Service Foundation (K8s สำหรับ Better Auth, Oracle IAM สำหรับ OAM/OIG)", why:"Auth service ต้องมี compute + IAM license พร้อมก่อน deploy", blocker:false },
    { name:"Role & Access Management", why:"หลัง login สำเร็จต้อง resolve role/permission ทันที", blocker:false },
    { name:"Notification Service (shared)", why:"Email verify, reset password, invitation ทั้งหมดต้องส่งผ่าน notification infra", blocker:false },
    { name:"Learner Identity Linking", why:"ผลลัพธ์ของ registration (ThaID/Unicon/manual) ต้อง resolve เข้า NCBS ID spine", blocker:false },
  ],
  features: [
    {
      id:"F1", name:"User Registration (3 Persona Paths)",
      sources:["external/confluence-prd-summaries/prd-user-registration.md (real PRD, Nattaya)"],
      tasks:[
        {id:"1.1", task:"Central Admin Invitation flow", desc:"อว. กรอก email + เลข ปชช. + Role → ส่ง invite", dep:"Role & Access Epic (role list ต้องมีก่อน)", src:"prd-user-registration.md UC1", c:"green"},
        {id:"1.2", task:"Central Admin Invitee Registration", desc:"ThaID → citizen ID ต้อง match invite เป๊ะ → ตั้ง password", dep:"1.1, F3 (ThaID)", src:"prd-user-registration.md UC2", c:"green"},
        {id:"1.3", task:"Institution Admin/API User Access Request", desc:"ThaID → Unicon auto-check → กรอกฟอร์ม", dep:"F3 (ThaID), Unicon integration", src:"prd-user-registration.md UC3", c:"green"},
        {id:"1.4", task:"Central Admin Review Request (approve/reject)", desc:"บังคับกรอกเหตุผลเมื่อ reject + audit log", dep:"1.3", src:"prd-user-registration.md UC4", c:"green"},
        {id:"1.5", task:"Institution Admin/API User Invitee Registration", desc:"ThaID + password setup", dep:"1.4", src:"prd-user-registration.md UC5", c:"green"},
        {id:"1.6", task:"Learner Self-Registration", desc:"ThaID + Unicon check (ถ้าเป็นนักศึกษา) + email verify", dep:"F3 (ThaID)", src:"prd-user-registration.md UC6", c:"green",
          subs:[
            {id:"1.6.1", task:"One-pending-request rule (Institution Admin)", desc:"ห้ามมี pending request >1 พร้อมกัน ตรวจด้วยเลข ปชช.", dep:"1.6", src:"prd-user-registration.md Business Rules", c:"green"},
            {id:"1.6.2", task:"Email verification token (Learner)", desc:"บัญชี Unverified จนกว่าคลิกลิงก์", dep:"1.6, Notification Epic", src:"prd-user-registration.md", c:"yellow", note:"Token expiry ระบุเป็น TBD ตรงๆ ใน PRD จริง"},
          ]},
        {id:"1.7", task:"Password Policy enforcement", desc:"≥8 ตัวอักษร + ตัวพิมพ์ใหญ่/เล็ก/ตัวเลข/อักขระพิเศษ", dep:"—", src:"prd-user-registration.md FR-NCBS-SEC-01", c:"green"},
        {id:"1.8", task:"Invitation link security review (no-expiry gap)", desc:"link เชิญปัจจุบันไม่มีวันหมดอายุ", dep:"1.1", src:"prd-user-registration.md ⚠️ Invitation Link", c:"red", note:"PRD จริงเขียน ⚠️ ไว้เอง — เป็นช่องโหว่ความปลอดภัยที่ยังไม่มีข้อเสนอแก้ ต้องถาม BA/security ก่อน implement ตามที่เขียนไว้เฉยๆ"},
      ]
    },
    {
      id:"F2", name:"Login / Authentication Session",
      sources:["external/confluence-prd-summaries/prd-authentication.md (real PRD, Nattaya, Jira NCBS-20)"],
      tasks:[
        {id:"2.1", task:"Email+Password login (Backoffice+Learner)", desc:"", dep:"F1", src:"prd-authentication.md UC1", c:"green"},
        {id:"2.2", task:"Account lockout (brute-force)", desc:"5 ครั้งผิด → lock 15 นาที", dep:"2.1", src:"prd-authentication.md", c:"green"},
        {id:"2.3", task:"Forgot/Reset Password flow", desc:"token หมดอายุ 30 นาที, single-use, resend cooldown 1 นาที", dep:"2.1, Notification Epic", src:"prd-authentication.md UC3", c:"green"},
        {id:"2.4", task:"User enumeration prevention", desc:"อีเมลไม่มีในระบบ → ข้อความเดียวกับอีเมลมีในระบบ", dep:"2.3", src:"prd-authentication.md", c:"green"},
        {id:"2.5", task:"Login audit log (success+failed)", desc:"timestamp/IP/status/method/user_id", dep:"2.1", src:"prd-authentication.md Login Log Fields", c:"green"},
        {id:"2.6", task:"Multi-session support (หลาย device พร้อมกัน)", desc:"", dep:"2.1", src:"prd-authentication.md", c:"green"},
        {id:"2.7", task:"MFA/2FA", desc:"", dep:"2.1", src:"prd-authentication.md Open Questions", c:"red", note:"Feature List พูดถึง 2FA แต่ PRD Authentication จริงไม่ครอบคลุม — scope ขัดกันเองระหว่าง 2 เอกสาร ต้องเคาะว่าเอาไหม"},
        {id:"2.8", task:"Session expiry + concurrent session limit config", desc:"", dep:"2.6", src:"prd-authentication.md Open Questions", c:"red", note:"ระบุเป็น open question ตรงๆ ใน PRD จริง ไม่มีคำตอบที่ไหนเลย"},
        {id:"2.9", task:"API Key authentication (machine-to-machine)", desc:"", dep:"API Management Epic", src:"prd-authentication.md Out of Scope → cross-ref", c:"yellow", note:"อยู่นอก scope ของ PRD Authentication นี้ — จริงๆ อยู่ epic API Management"},
      ]
    },
    {
      id:"F3", name:"ThaID/DOPA e-KYC & Better Auth Engine",
      sources:["concepts/thaid-integration.md","concepts/ekyc.md","decisions/2026-07-identity-plane-map-draft.md"],
      note:"Better Auth (learner auth-service ใน K8s) ยืนยันเป็นสถาปัตยกรรมจริงจาก deck ก.ค. 69 — แต่ยังไม่มี implementation detail ใดๆ ในเอกสารนอกจากชื่อ",
      tasks:[
        {id:"3.1", task:"Better Auth engine setup (learner auth-service)", desc:"session/credential engine ฝั่ง learner บน K8s — scale ไม่จำกัด license (ต่างจาก staff ที่มี license cap)", dep:"Data & Service Foundation (K8s)", src:"identity-plane-map-draft.md §1", c:"yellow", note:"ชื่อ/ตำแหน่งสถาปัตยกรรม confirm แล้ว แต่ไม่มี implementation spec เลย"},
        {id:"3.2", task:"ThaID authentication flow implementation", desc:"prototype design = QR + polling · deck ก.ค. 69 หน้า 81 = OAM-brokered redirect 11 ขั้น (Login→redirect→callback→auth code→user mapping→session)", dep:"3.1", src:"identity-plane-map-draft.md §4 คำถามเปิด #1, tech-infra-alignment §A2", c:"red", note:"CRITICAL — 2 สถาปัตยกรรมขัดกันเต็มๆ (QR+poll vs redirect/callback) ถ้าเลือกผิดทาง contract /auth/thaid/* + UI login ทั้งหมดต้องรื้อใหม่ ห้าม build จนกว่า Technical Workshop จะเคาะ (คำถาม #2)"},
        {id:"3.3", task:"DOPA data retrieval + read-only profile display", desc:"ชื่อ-สกุล/เลขบัตร(masked)/วันเกิด — read-only ห้ามแก้", dep:"3.2", src:"thaid-integration.md", c:"green", note:"data contract ชัดเจนไม่ว่า flow จะเป็นแบบไหน"},
        {id:"3.4", task:"ThaID Verified badge status", desc:"เขียว=ยืนยันแล้ว / เหลือง=ยังไม่ยืนยัน (บาง feature ถูกจำกัด)", dep:"3.3", src:"thaid-integration.md", c:"green"},
        {id:"3.5", task:"Fallback to Unicon เมื่อ ThaID ไม่พร้อม", desc:"", dep:"3.2", src:"thaid-integration.md ข้อควรระวัง", c:"yellow", note:"ระบุว่ามี fallback แต่ไม่มี trigger condition/UX ระบุไว้"},
      ]
    },
    {
      id:"F4", name:"Foreign / Non-Thai Learner Identity (SCR-019)",
      sources:["decisions/scr-019-foreign-learner-identity.md"],
      note:"requirement ยังไม่นิ่งตามที่ SCR ระบุเอง แต่ PM เคาะ Q1-Q4 แล้ว (2026-07-11) — spec ละเอียดกว่า SCR อื่นๆ ส่วนใหญ่ในหมวดนี้",
      tasks:[
        {id:"4.1", task:"Identity channel/status schema", desc:"identity_channel enum(thaid/unicon/manual_review) · identity_status enum(verified/pending_review/needs_docs/rejected) · ตาราง identity_verification_request ใหม่", dep:"F1", src:"scr-019 §3 D1-D3", c:"green", note:"field-level schema ให้ไว้ครบ พร้อม dev"},
        {id:"4.2", task:"Foreign registration form (evidence upload)", desc:"passport photo + เซลฟี่ถือ passport (≤2 ไฟล์ ≤5MB) + PDPA consent", dep:"4.1, F1.6 (Unicon lookup ล้มเหลวก่อน)", src:"scr-019 §3 A1-A3", c:"green"},
        {id:"4.3", task:"Admin identity review queue + decision actions", desc:"side-by-side passport/selfie compare + approve/reject(บังคับเหตุผล)/ขอเอกสารเพิ่ม + audit log", dep:"4.1", src:"scr-019 §3 B1-B2", c:"green"},
        {id:"4.4", task:"Verification policy switch (3 โหมด)", desc:"require_approval(default) / auto_approve / disabled — เก็บใน ncbs-sys-settings", dep:"4.1", src:"scr-019 §3 C1", c:"green"},
        {id:"4.5", task:"Login gate สำหรับบัญชี pending/rejected", desc:"gate เดียวที่จุด login (ไม่ใช่กระจายหลายจุด) — ตาม PM ตอบ Q1", dep:"F2 (login core), 4.1", src:"scr-019 §5 Q1", c:"green", note:"PM ปรับ design ตรงนี้เองระหว่างทาง (จากเดิม gate ที่ CTP/profile → ย้ายมา gate เดียวที่ login) — เป็นตัวอย่างที่ดีว่า requirement เปลี่ยนได้เร็ว"},
        {id:"4.6", task:"PDPA retention policy (evidence file)", desc:"ลบไฟล์หลักฐาน 90 วันหลัง decision — เก็บเฉพาะผล+audit", dep:"4.3", src:"scr-019 §5 Q2", c:"green"},
        {id:"4.7", task:"SLA tracking สำหรับคิวตรวจ", desc:"ไฮไลต์แถวเมื่อเกินเกณฑ์", dep:"4.3", src:"scr-019 §3 B4", c:"yellow", note:"เป้า SLA (กี่วันทำการ) เป็น config ที่ยังไม่มีค่า default ชัดเจน"},
      ]
    },
    {
      id:"F5", name:"Staff/Backoffice Identity Plane (OAM/OIG SSO)",
      sources:["decisions/2026-07-identity-plane-map-draft.md"],
      note:"ระนาบนี้ควบคุมโดย สป.อว./Sirisoft เป็นหลัก (Oracle IAM license) — ทีม dev integrate เท่านั้น ไม่ได้ build ระบบ IAM เอง",
      tasks:[
        {id:"5.1", task:"OAM/OIG SSO integration setup", desc:"license 20,000 users — ครอบเฉพาะ staff active ไม่ใช่ทั้งหมด 205,907 คน", dep:"Data & Service Foundation (Oracle Stack procurement)", src:"identity-plane-map-draft.md §1", c:"red", note:"การ scope ว่า role ไหนได้ seat เป็น governance decision ของ สป.อว. ที่ยังไม่เคาะ (คำถาม #3) — ห้าม assume ว่าครอบทุกคน"},
        {id:"5.2", task:"Staff login UI → SSO redirect (แทน mock form)", desc:"admin-login.html ปัจจุบันเป็น mock password form", dep:"5.1", src:"identity-plane-map-draft.md §2", c:"yellow", note:"คงรูปแบบ mock ไว้ได้ระหว่าง design validation — แต่ real SSO redirect ยังไม่ implement"},
        {id:"5.3", task:"Identity governance integration (OIG provision/deprovision)", desc:"", dep:"5.1", src:"identity-plane-map-draft.md §1", c:"yellow", note:"เจ้าของ process = สป.อว./สถาบัน — ทีม dev แค่ทำจุดเชื่อม ไม่ใช่เจ้าของ workflow"},
        {id:"5.4", task:"Account linking ข้ามระนาบ (staff ที่เป็น learner ด้วย)", desc:"บุคลากรที่เรียนต่อ/upskill — ถือ 2 บัญชีแยกหรือ link กัน", dep:"5.1, F3 (Better Auth)", src:"identity-plane-map-draft.md §4 คำถามเปิด #4", c:"red", note:"ไม่มีดีไซน์เลย เป็นคำถามเปิดตรงๆ"},
        {id:"5.5", task:"Session policy ต่างระนาบ (timeout/refresh/step-up auth)", desc:"เช่น step-up auth ตอนอนุมัติเทียบโอน (transaction สำคัญ)", dep:"5.1, F2", src:"identity-plane-map-draft.md §4 คำถามเปิด #5", c:"red", note:"ไม่มีดีไซน์เลย"},
      ]
    },
  ],
  priority: [
    "<b>F1, F2 (core green items)</b> — มี real PRD ละเอียดพร้อม dev ตรงๆ ทำก่อนสุดได้เลย ไม่ต้องรอ decision อะไรเพิ่ม",
    "<b>3.2 ThaID flow decision</b> — ต้องเคาะก่อนเริ่ม build ThaID ทั้งชุด (3.1-3.5, 1.2, 1.3, 1.6, 4.2) เพราะ QR+poll กับ OAM redirect เป็นสถาปัตยกรรมคนละแบบ build ผิดทางเสีย effort เต็มๆ",
    "<b>F4 (Foreign Identity)</b> — spec ชัดกว่า SCR ส่วนใหญ่ในระบบ (PM เคาะ Q1-Q4 แล้ว) ทำได้เร็วขนานกับ F1/F2 core",
    "<b>F5 (Staff SSO)</b> — พึ่งพา Oracle procurement + สป.อว. governance เป็นหลัก ลำดับความสำคัญของทีม dev ต่ำกว่า F1-F4 เพราะควบคุมไม่ได้เยอะ",
    "<b>2.7, 2.8 (MFA, session policy)</b> — ยังเป็น open question ทั้งคู่ ควรเคาะพร้อมกับ 3.2 เพราะเกี่ยวเนื่องกัน (step-up auth ต้องรู้ session policy ก่อน)",
  ],
  flags: [
    "<b>ThaID flow architecture ขัดกันเต็มๆ (3.2)</b> — prototype design = QR+polling · deck ทีมจริง ก.ค. 69 = OAM-brokered redirect 11 ขั้น — เป็น flag ที่ใหญ่ที่สุดในทั้ง epic เพราะกระทบ contract, UI login/register, และ Better Auth service ทั้งหมด ต้องรอ Technical Workshop เคาะก่อนเริ่ม build",
    "<b>Invitation link ไม่มีวันหมดอายุ (1.8)</b> — security gap ที่ real PRD เขียนเตือนไว้เองแต่ไม่มีข้อเสนอแก้ — ควรถาม security/BA ก่อน",
    "<b>MFA/2FA scope ขัดกัน (2.7)</b> — Feature List พูดถึงแต่ PRD Authentication จริงไม่ครอบคลุม เป็นตัวอย่างเอกสารสองชุดขัดกันเรื่อง scope",
    "<b>Session policy ไม่เคยถูกตอบ (2.8, 5.5)</b> — ทั้ง PRD จริงและ identity-plane-map ระบุเป็น open question ตรงๆ กระทบทุก epic ที่มี transaction สำคัญ (เช่น approve เทียบโอน)",
    "<b>OAM/OIG seat governance (5.1)</b> — license 20,000 ที่นั่ง vs staff population จริง 205,907 คน ใครได้ seat เป็น governance decision ที่ สป.อว. ยังไม่เคาะ — ห้าม assume ว่า staff ทุกคนได้ SSO",
    "<b>Account linking ข้ามระนาบ (5.4)</b> — บุคลากรที่เป็นผู้เรียนด้วย ไม่มีดีไซน์เลย เป็นคำถามเปิดที่ไม่มีใครตอบ",
    "<b>SRS version mismatch</b> — PRD User Registration จริงอ้าง FR code (FR-NCBS-AAC-01/04, FR-REG-04) ที่ไม่อยู่ใน SRS outline ที่ ingest ไว้ — แสดงว่ามี SRS เวอร์ชันใหม่กว่าที่ wiki ไม่เคยเห็น ควรตามหาก่อนอ้างอิง FR code ในการวางแผน sprint",
  ]
};


// ---------- register into multi-epic registry ----------
window.NCBS_EPICS = window.NCBS_EPICS || {};
window.NCBS_EPICS['identity-auth'] = {
  id: 'identity-auth',
  system: 'NCBS',
  name: 'Identity & Authentication',
  thaiName: 'การยืนยันตัวตนและเข้าสู่ระบบ',
  status: 'Real PRD In Progress (Jira NCBS-20) — ThaID flow ยังไม่เคาะสถาปัตยกรรม (QR+poll vs OAM redirect)',
  epicDeps: IDENTITY_AUTH_DATA.epicDeps,
  features: IDENTITY_AUTH_DATA.features,
  priority: IDENTITY_AUTH_DATA.priority,
  flags: IDENTITY_AUTH_DATA.flags,
};
