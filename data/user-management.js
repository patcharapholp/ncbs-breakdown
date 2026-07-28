// NCBS Breakdown — User Management epic data
// Sprint Details #8-9 (NCBS/UCBS User Management) v0.6.0
// Real PRD track: 2 PRD จริง (Admin + Learner, Nattaya PO/BA) — status "In Progress"
// ต่างจาก Epic "Learner Profile" (ผู้เรียนแก้ไขข้อมูลตัวเอง) — epic นี้คือ Admin มองเห็น/จัดการ user คนอื่น

const USER_MANAGEMENT_DATA = {
  epicDeps: [
    { name:"Identity & Authentication", why:"User ต้องถูกสร้างผ่าน registration ก่อนถึงจะมีให้ list/search/manage", blocker:false },
    { name:"Role & Access Management", why:"Edit Role ของ admin ต้องพึ่ง role list + confirmation flow ที่ถูกต้อง", blocker:false },
    { name:"PDPA & Compliance", why:"Citizen ID masking, export/audit log rules เป็น cross-cutting policy ที่ epic นี้ต้อง apply", blocker:false },
    { name:"Grade & Credit Management", why:"Learner Detail tab 'รายการสะสมหน่วยกิต' ดึงข้อมูลจาก epic นี้", blocker:false },
  ],
  features: [
    {
      id:"F1", name:"Admin User List & Search",
      sources:["external/confluence-prd-summaries/prd-user-management.md (real PRD, Nattaya)"],
      tasks:[
        {id:"1.1", task:"List view (default sort + pagination)", desc:"เรียงตามวันที่ลงทะเบียนล่าสุด, 10 รายการ/หน้า", dep:"—", src:"prd-user-management.md List View", c:"green"},
        {id:"1.2", task:"Search (min 2 chars, partial match)", desc:"ชื่อ, อีเมล", dep:"1.1", src:"prd-user-management.md Search", c:"green"},
        {id:"1.3", task:"Filters: Role / Account Status / Date Range", desc:"", dep:"1.1", src:"prd-user-management.md Filters", c:"green"},
      ]
    },
    {
      id:"F2", name:"Learner User List & Search",
      sources:["external/confluence-prd-summaries/prd-user-management.md (real PRD, Nattaya)"],
      tasks:[
        {id:"2.1", task:"List view (default sort + pagination)", desc:"pattern เดียวกับ Admin list", dep:"—", src:"prd-user-management.md List View", c:"green"},
        {id:"2.2", task:"Search (min 2 chars, partial match)", desc:"", dep:"2.1", src:"prd-user-management.md Search", c:"green"},
        {id:"2.3", task:"Filters: User Type / Account Status / Date Range", desc:"User Type = นักเรียน/นักศึกษา/ทั่วไป", dep:"2.1", src:"prd-user-management.md Filters", c:"green"},
      ]
    },
    {
      id:"F3", name:"User Detail View (Tab Structure)",
      sources:["external/confluence-prd-summaries/prd-user-management.md"],
      tasks:[
        {id:"3.1", task:"Admin Detail page", desc:"tab เดียว: ข้อมูลส่วนตัว (ชื่อ, citizen ID masked, email, role, สังกัด, ตำแหน่ง, status, consent+opt-in date, registration/last-active)", dep:"F1", src:"prd-user-management.md Detail Fields", c:"green"},
        {id:"3.2", task:"Learner Detail page (3 tabs)", desc:"ข้อมูลส่วนตัว + รายการสะสมหน่วยกิต + รายการเทียบโอน", dep:"F2, Grade & Credit Management Epic", src:"prd-user-management.md Tab Structure", c:"green",
          subs:[
            {id:"3.2.1", task:"Tab รายการสะสม", desc:"หน่วยกิต, เกรด, รายวิชา, สถาบัน, ประเภทการได้รับ (เรียน/เทียบโอน)", dep:"3.2, Grade & Credit Management Epic", src:"prd-user-management.md", c:"green"},
            {id:"3.2.2", task:"Tab รายการเทียบโอน", desc:"วันที่ส่งคำร้อง, source↔target, สถานะ, วันอนุมัติ/ปฏิเสธ", dep:"3.2, Credit Transfer Epic", src:"prd-user-management.md", c:"green"},
          ]},
      ]
    },
    {
      id:"F4", name:"Edit Permissions",
      sources:["external/confluence-prd-summaries/prd-user-management.md"],
      tasks:[
        {id:"4.1", task:"Common restricted fields", desc:"ห้ามแก้ข้อมูลจาก ThaID/Unicon + email/citizenID ของ user ที่ verified แล้ว (unverified แก้ได้)", dep:"F3", src:"prd-user-management.md Common — ห้ามแก้", c:"green"},
        {id:"4.2", task:"Admin-specific edit (Role change + confirmation dialog)", desc:"+ สังกัด manual, email w/ resend, account status", dep:"4.1, Role & Access Epic", src:"prd-user-management.md Admin-specific", c:"green"},
        {id:"4.3", task:"Learner-specific edit", desc:"สังกัด manual, email w/ resend, account status(opt-out), consent state", dep:"4.1", src:"prd-user-management.md Learner-specific", c:"green"},
      ]
    },
    {
      id:"F5", name:"Account Status Management",
      sources:["external/confluence-prd-summaries/prd-user-management.md"],
      tasks:[
        {id:"5.1", task:"3 account statuses", desc:"เปิดใช้งาน(Active)/ปิดใช้งาน(Inactive)/ยังไม่ยืนยันตัวตน(Unverified)", dep:"—", src:"prd-user-management.md Account Statuses", c:"green"},
        {id:"5.2", task:"Re-send invitation pattern", desc:"Status=Unverified → ปุ่มส่งอีเมลซ้ำ, ลิงก์เก่า invalidate ทันที", dep:"5.1, Notification Epic", src:"prd-user-management.md Re-send Invitation Pattern", c:"green"},
      ]
    },
    {
      id:"F6", name:"Privacy Controls (cross-ref PDPA)",
      sources:["external/confluence-prd-summaries/prd-user-management.md","concepts/pdpa-actions.md"],
      note:"รายละเอียดเต็มของ masking/export/audit อยู่ใน epic PDPA & Compliance — ในนี้ระบุแค่จุดที่ User Management ต้อง integrate",
      tasks:[
        {id:"6.1", task:"Citizen ID always-masked display", desc:"xxx-x-xxxx-x123-4 ทุกจุดที่แสดง", dep:"—", src:"prd-user-management.md Citizen ID Display", c:"green"},
        {id:"6.2", task:"Export (Excel/PDF) จากหน้า list/detail", desc:"", dep:"6.1, PDPA Epic (rate limit/permission)", src:"prd-user-management.md Common Scope", c:"yellow", note:"export rate limit ระบุเป็น open question — ยังไม่มีค่า"},
        {id:"6.3", task:"Bulk operations (mass edit role/status)", desc:"Feature List ระบุว่าทำได้ แต่ PRD ไม่ครอบคลุม", dep:"—", src:"prd-user-management.md Open Questions", c:"red", note:"scope ขัดกันเองระหว่าง Feature List กับ PRD จริง ต้องเคาะก่อนว่าเอาไหม"},
        {id:"6.4", task:"Citizen ID full-reveal super-permission", desc:"", dep:"6.1, Role & Access Epic", src:"prd-user-management.md Open Questions", c:"red", note:"ยังไม่มีคำตอบว่ามี permission พิเศษเห็นเลข 13 หลักครบไหม"},
        {id:"6.5", task:"Soft delete vs Hard delete decision", desc:"In-Scope บอก 'การลบ' แต่ไม่ระบุ pattern", dep:"—", src:"prd-user-management.md Open Questions", c:"red", note:"น่าจะเป็น soft delete ตาม Data Dictionary แต่ยังไม่ confirm เป็นทางการ"},
      ]
    },
  ],
  priority: [
    "<b>F1, F2 (list/search)</b> — ทำก่อนสุด ไม่มี dependency ซับซ้อน spec ชัดเจนสุดในเอพิคนี้",
    "<b>F3 Learner Detail tabs</b> — ต้องรอ Grade & Credit Management + Credit Transfer epic มี data source ให้ดึงจริงก่อนถึงจะ integrate ได้เต็ม (ทำ shell UI ไปก่อนได้)",
    "<b>F4, F5</b> — ทำคู่ขนานกับ F1-F3 ได้ เป็น business rule ที่ไม่ผูก epic อื่นมาก",
    "<b>6.3, 6.4, 6.5</b> — เป็น open question ที่ควรเคาะกับ BA ก่อน sprint planning ไม่ใช่ assume เอาเองระหว่าง build",
  ],
  flags: [
    "<b>Bulk operations scope ขัดกัน (6.3)</b> — Feature List บอกทำได้ PRD จริงไม่ครอบคลุม เป็นตัวอย่าง scope drift ระหว่าง 2 เอกสารทีมจริง",
    "<b>Citizen ID full-reveal permission (6.4)</b> และ <b>soft/hard delete (6.5)</b> — ทั้งคู่เป็น open question ที่ PRD จริงเขียนไว้เองแต่ไม่มีคำตอบ กระทบ compliance review ถ้าไม่เคาะก่อน launch",
    "<b>Export rate limit (6.2)</b> ไม่มีค่า — เสี่ยง performance/security ถ้าไม่ตั้ง limit ก่อน production",
  ]
};


// ---------- register into multi-epic registry ----------
window.NCBS_EPICS = window.NCBS_EPICS || {};
window.NCBS_EPICS['user-management'] = {
  id: 'user-management',
  system: 'NCBS',
  name: 'User Management',
  thaiName: 'การจัดการผู้ใช้งาน',
  status: 'Real PRD In Progress (Nattaya PO/BA, Confluence)',
  epicDeps: USER_MANAGEMENT_DATA.epicDeps,
  features: USER_MANAGEMENT_DATA.features,
  priority: USER_MANAGEMENT_DATA.priority,
  flags: USER_MANAGEMENT_DATA.flags,
};
