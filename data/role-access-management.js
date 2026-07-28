// NCBS Breakdown — Role & Access Management epic data
// Sprint Details #12-13 (Role & Permission Mgmt Default) v0.7.0 + #27 (Custom Roles) Phase 2
// Real tech design (Confluence, Namatsawin) มีครบสำหรับ core CRUD — SCR-015/020 เป็น prototype/wiki-side (Track B)

const ROLE_ACCESS_MANAGEMENT_DATA = {
  epicDeps: [
    { name:"Identity & Authentication", why:"ต้องมี user login ก่อนถึงจะ assign role ได้", blocker:false },
    { name:"Institution Structure & Master Data", why:"faculty-scoped ABAC ต้องพึ่ง faculty master data (university_admin.faculty_scope FK)", blocker:false },
    { name:"Data & Service Foundation (APISIX gateway)", why:"x-userinfo header pattern ที่ RBAC ทั้งหมดพึ่งพา", blocker:false },
  ],
  features: [
    {
      id:"F1", name:"Core RBAC Data Model & Engine",
      sources:["external/confluence-prd-summaries/role-management.md (real tech design, Namatsawin)","concepts/admin-roles.md"],
      tasks:[
        {id:"1.1", task:"Data model: 5 core entities", desc:"USER · ROLE(is_system, institution_id FK) · PERMISSIONS(resource:action) · USER_ROLE (M:N) · ROLE_PERMISSIONS (M:N)", dep:"—", src:"role-management.md ER", c:"green"},
        {id:"1.2", task:"Permission format + granular permission list", desc:"resource:action เช่น users:create, roles:delete, credits:transfer, transcript:upload", dep:"1.1", src:"admin-roles.md RBAC Schema", c:"yellow", note:"format ชัดเจน แต่ 'Permission List ทั้งหมดมีอะไรบ้าง' เป็น open question ที่ไม่เคยถูกตอบ"},
        {id:"1.3", task:"Role CRUD API", desc:"Create/Read One/Read List/Update/Delete — 5 sequence diagram ให้ครบ", dep:"1.1", src:"role-management.md CRUD Sequence Diagrams", c:"green",
          subs:[
            {id:"1.3.1", task:"Duplicate role name rejection", desc:"", dep:"1.3", src:"role-management.md Critical Business Rules", c:"green"},
            {id:"1.3.2", task:"System role protection (is_system=true ห้ามลบ)", desc:"", dep:"1.3", src:"role-management.md", c:"green"},
            {id:"1.3.3", task:"In-use role protection (มี USER_ROLE ผูกอยู่ ห้ามลบ)", desc:"", dep:"1.3", src:"role-management.md", c:"green"},
            {id:"1.3.4", task:"Soft delete (deleted_at)", desc:"", dep:"1.3", src:"role-management.md", c:"green"},
            {id:"1.3.5", task:"Update = reset permissions ทั้งหมดแล้ว insert ใหม่", desc:"", dep:"1.3", src:"role-management.md", c:"green"},
          ]},
        {id:"1.4", task:"Auth Guard + @Permissions() decorator enforcement (API layer)", desc:"NestJS decorator pattern บังคับสิทธิ์ทุก endpoint", dep:"1.1, 1.2", src:"role-management.md Code Pattern", c:"red", note:"⚠️ pattern ตัวอย่างมีให้ แต่ทุกที่ใน wiki ที่พูดถึง RBAC/ABAC ย้ำตรงกันว่า 'prototype = mock, enforcement จริงที่ API layer = งาน dev' — นี่คืองาน dev จริงก้อนใหญ่ที่สุดของทั้ง epic ที่ยังไม่มีใครแตะเลย"},
        {id:"1.5", task:"APISIX → x-userinfo header decode", desc:"Gateway resolve token → forward base64 header → backend decode → load user/roles/permissions", dep:"Data & Service Foundation F3 (APISIX)", src:"role-management.md Architecture", c:"green"},
      ]
    },
    {
      id:"F2", name:"Admin 3-Tier Baseline (Super Admin / Institute Admin / Admin)",
      sources:["concepts/admin-roles.md"],
      tasks:[
        {id:"2.1", task:"3-tier hierarchy + Permission Matrix (10 features)", desc:"Super Admin(global)/Institute Admin(สถาบัน)/Admin(limited) × 10 feature ตาราง", dep:"F1", src:"admin-roles.md Permission Matrix", c:"green"},
        {id:"2.2", task:"Hierarchy protection", desc:"Institute Admin ห้ามแก้/ลบ Super Admin + ห้ามเห็น Admin ข้ามสถาบัน", dep:"2.1", src:"admin-roles.md Logic Rules", c:"green"},
        {id:"2.3", task:"Self-management rules", desc:"แก้ basic info ตัวเองได้ แต่ห้ามแก้ role/status ตัวเอง (กัน privilege escalation)", dep:"2.1", src:"admin-roles.md Logic Rules", c:"green"},
        {id:"2.4", task:"Dual approval สำหรับสร้าง Super Admin ใหม่", desc:"Super Admin อีกคนต้องกด Approve", dep:"2.1", src:"admin-roles.md Approval Workflow", c:"green"},
        {id:"2.5", task:"Sensitive action audit log", desc:"ทุกการเข้าดู View Profile ของ Admin ระดับสูง log ทุกครั้ง", dep:"2.1", src:"admin-roles.md Sensitive Action Logs", c:"green"},
      ]
    },
    {
      id:"F3", name:"Configurable Role Model (Per-Institution, SCR-015)",
      sources:["decisions/scr-015-configurable-role-model.md"],
      note:"Trigger จาก Regulator (GAP-007) — canonical schema (F1) รองรับอยู่แล้วผ่าน ROLE.institution_id + permission building-block — gap จริงคือ SRS ยังบรรยาย fixed-tier + ยังไม่เก็บ role mapping จริงของแต่ละมหาวิทยาลัย",
      tasks:[
        {id:"3.1", task:"Custom Role Definition builder (compose จาก permission set)", desc:"3-tier เดิม = default template", dep:"F1.1-1.3", src:"scr-015 §3, §10 Notes", c:"yellow", note:"ระบุตรงๆ ว่า 'build รอบหลัง ไม่อยู่ใน R2 F1-F6 scope' — แม้แต่ prototype ก็ยังไม่ทำ builder UI จริง มีแค่ role-view demo (ดู F5)"},
        {id:"3.2", task:"Super Admin Certification/Invitation flow", desc:"อว. รับรอง Super Admin ของแต่ละสถาบัน → invite ผู้ใช้อื่น + กำหนดสิทธิ์เอง", dep:"Identity & Auth F1.1", src:"scr-015 §3 FR-NCBS-DAC-NEW2", c:"green"},
        {id:"3.3", task:"Role Mapping Worksheet — เก็บ role จริงต่อมหาวิทยาลัย", desc:"ทะเบียน/ฝ่ายบุคคล/กรรมการคณะ/ผู้อนุมัติ — ใครเห็น/แก้/อนุมัติ → วิเคราะห์ common roles", dep:"—", src:"scr-015 §10 Round 2 actions", c:"red", note:"เป็น research/data-collection task ไม่ใช่ dev task — ไม่มีหลักฐานในวิกิว่าเก็บเสร็จหรือยัง ถ้ายังไม่เก็บ การออกแบบ role template ที่เหลือจะเดาเอาไม่ได้"},
        {id:"3.4", task:"3-tier default model validation กับ อว.", desc:"", dep:"3.3", src:"scr-015 §10", c:"yellow"},
      ]
    },
    {
      id:"F4", name:"Faculty-scoped ABAC (SCR-020)",
      sources:["decisions/scr-020-faculty-scoped-abac.md"],
      tasks:[
        {id:"4.1", task:"role_scope enum extend (+faculty)", desc:"all/university/faculty/self/external — จับคู่ attribute university_admin.faculty_scope", dep:"F1.1, Institution Structure Epic (faculty master data)", src:"scr-020", c:"green", note:"schema ชัดเจน ไม่ breaking (default=university)"},
        {id:"4.2", task:"API DTO update", desc:"RoleResponseDto.scope + CreateRoleDto/UpdateRoleDto optional scope field", dep:"4.1", src:"scr-020", c:"green"},
        {id:"4.3", task:"UI policy modal (scope selector 3 ระดับ)", desc:"สถาบัน/คณะ/ตนเอง + ตัวอย่าง role + badge scope", dep:"4.2", src:"scr-020", c:"green"},
        {id:"4.4", task:"Real enforcement ที่ API layer", desc:"query filter ตาม faculty_scope จริง", dep:"4.1, F1.4", src:"scr-020 ขอบเขต/หมายเหตุ", c:"red", note:"ระบุตรงๆ ว่า 'Enforcement จริงที่ API layer = งาน dev (prototype = mock)' — ผูกกับ F1.4 เป็นก้อนงานเดียวกัน"},
      ]
    },
    {
      id:"F5", name:"Role-based Menu & Data Scope",
      sources:["decisions/scr-015-configurable-role-model.md §11"],
      tasks:[
        {id:"5.1", task:"Menu derivation engine (role → menu ที่เห็น)", desc:"NCBS 3 roles (ผู้ดูแลระบบ อว./ผู้ดูแลสถาบัน/API User) + UCBS 3 ABAC roles (ผู้ดูแลสถาบัน/เจ้าหน้าที่ทะเบียน/ผู้พิจารณาเทียบโอน)", dep:"F1.4", src:"scr-015 §11.1-11.2", c:"yellow", note:"prototype มี foundation/app.js role-view engine (mock) — real backend-driven menu authorization ยังไม่มี"},
        {id:"5.2", task:"Data scope enforcement (national/institution/faculty query scoping)", desc:"หลักการ 'data scope follows role' — นี่คืองาน backend จริง ไม่ใช่แค่ UI banner", dep:"F1.4, F4.4", src:"scr-015 §11.3", c:"red", note:"งานเดียวกับ F1.4/F4.4 มองจากมุม query-level — ยังไม่มีที่ไหน implement จริงนอกจาก mock KPI number ใน prototype"},
        {id:"5.3", task:"Scope banner + KPI number swap UI", desc:"แสดงข้อความ 'ขอบเขตข้อมูลที่แสดง: เฉพาะสถาบัน/คณะ' บนหน้า admin", dep:"5.2", src:"scr-015 §11.3", c:"green", note:"UI-only เมื่อ 5.2 เสร็จแล้ว ทำง่าย"},
        {id:"5.4", task:"UCBS Audit Log page (gap-fill, Super-only)", desc:"UCBS ขาดหน้า activity/audit-log แม้ approval actions ถูก log อยู่แล้ว", dep:"2.5", src:"scr-015 §11.4", c:"green"},
      ]
    },
    {
      id:"F6", name:"UCBS Admin Access Provisioning (Closed, ไม่มี Public Onboarding)",
      sources:["decisions/scr-015-configurable-role-model.md §11.5"],
      tasks:[
        {id:"6.1", task:"Super-Admin-created admin account flow", desc:"UCBS admin ไม่มีช่องทางสมัครสาธารณะ — Super Admin สถาบันสร้าง account จากหลังบ้านเอง (ต่างจาก NCBS ที่มี public request-access)", dep:"3.2", src:"scr-015 §11.5", c:"green"},
        {id:"6.2", task:"Per-institution login page (branded)", desc:"เข้าจากปุ่มใน university card ของหน้า select", dep:"University Payment/White-label Epic (branding)", src:"scr-015 §11.5", c:"green"},
      ]
    },
  ],
  priority: [
    "<b>F1.1-1.3</b> Core data model + Role CRUD — ทำก่อนสุด เป็นฐานของทุก feature ในนี้และ epic อื่นที่ต้องเช็คสิทธิ์",
    "<b>F1.4 / F4.4 / F5.2 (real API-layer enforcement)</b> — นี่คืองาน 'ของจริง' ที่สำคัญที่สุดในทั้ง epic เพราะทุกอย่างที่เห็นใน prototype เป็นแค่ UI mock ล้วนๆ ควรจัดสรร sprint ให้ก้อนนี้ชัดเจน ไม่ใช่ประเมินจากความรู้สึกว่า 'implemented แล้ว' ตาม wiki",
    "<b>F2 (3-tier baseline)</b> — ทำคู่ขนานกับ F1 เพราะเป็น default template ที่ F3 (configurable) ต้องอ้างอิงต่อ",
    "<b>3.3 (Role Mapping Worksheet)</b> — ควรเช็คสถานะจริงก่อนว่าเก็บข้อมูลจากมหาวิทยาลัยเสร็จหรือยัง เพราะ F3 configurable role ที่เหลือทั้งหมดพึ่งพาข้อมูลนี้",
    "<b>F4 Faculty ABAC</b> — ทำหลัง F1 core + รอ Institution Structure epic ส่ง faculty master data มาก่อน",
    "<b>F6</b> ทำได้ขนานตลอดเวลา ไม่ block อะไร",
  ],
  flags: [
    "<b>Enforcement gap คือธีมใหญ่ที่สุดของ epic นี้ (1.4, 4.4, 5.2)</b> — ทุก SCR ที่เกี่ยวกับ RBAC/ABAC (015, 020) เขียนประโยคเดียวกันซ้ำๆ ว่า 'prototype = mock, enforcement จริงที่ API layer = งาน dev' — หมายความว่า 'implemented' ใน wiki ทั้งหมดของ epic นี้คือ UI demo เท่านั้น ตัว authorization/query-scoping จริงยังไม่เริ่มเลยสักบรรทัด ต้อง estimate เป็นงานใหม่ทั้งหมด ไม่ใช่แค่ 'เก็บรายละเอียด'",
    "<b>Role Mapping Worksheet (3.3) สถานะไม่ชัด</b> — SCR-015 เองบอกว่า 'gap ไม่ใช่ data model แต่คือยังไม่เก็บ role mapping จริงของแต่ละมหาวิทยาลัย' — ถ้าข้อมูลนี้ยังไม่เก็บจริง การออกแบบ role template ของ F3 ที่เหลือจะขาดหลักฐาน ควร confirm สถานะกับทีม Product ก่อน",
    "<b>Permission List เต็มไม่เคยถูก enumerate (1.2)</b> — เป็น open question จาก concept doc แรกสุด ทีม dev ต้องการ list นี้ก่อนจะ implement @Permissions() decorator ให้ครบทุก endpoint",
    "<b>Custom Role Builder UI ถูกเลื่อนตั้งแต่ระบุ scope (3.1)</b> — แม้แต่ prototype ก็ยังไม่ทำ ทำแค่ role-view demo (ดูอย่างเดียว ไม่ได้สร้าง role ใหม่ได้จริง) — อย่าประเมิน manday จากความรู้สึกว่ามี UI ต้นแบบให้ดูแล้ว",
    "<b>GAP-007 มาจาก Regulator ไม่ใช่ University Gap Analysis</b> — ถ้าใครอ้างอิงแค่ Gap Analysis (university-scope) เพื่อ prioritize จะมองข้าม requirement นี้ไปเลย เพราะมันถูก track แยกใน Regulator MOM + feedback-loop-log เท่านั้น",
  ]
};


// ---------- register into multi-epic registry ----------
window.NCBS_EPICS = window.NCBS_EPICS || {};
window.NCBS_EPICS['role-access-management'] = {
  id: 'role-access-management',
  system: 'NCBS',
  name: 'Role & Access Management',
  thaiName: 'การจัดการสิทธิ์และบทบาท',
  status: 'Prototype UI/demo เท่านั้น — real API-layer enforcement ยังไม่เริ่มเลยสักบรรทัด',
  epicDeps: ROLE_ACCESS_MANAGEMENT_DATA.epicDeps,
  features: ROLE_ACCESS_MANAGEMENT_DATA.features,
  priority: ROLE_ACCESS_MANAGEMENT_DATA.priority,
  flags: ROLE_ACCESS_MANAGEMENT_DATA.flags,
};
