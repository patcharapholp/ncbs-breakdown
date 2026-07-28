// NCBS Breakdown — API Management & Integration Standards epic data
// Sprint Details #10 (NCBS API Mgmt) v0.6.0 + #14 (API Transfer Log) v0.7.0
// SCR-016 core onboarding validated against real tech team OpenAPI (api-1.yaml) — more trustworthy than SCR-023 items ที่ยังเป็น Track B ล้วน

const API_MANAGEMENT_DATA = {
  epicDeps: [
    { name:"Data & Service Foundation (Gateway layer)", why:"⚠️ Gateway layer ambiguity (APISIX vs Oracle API Management) ที่ flag ไว้ใน Foundation epic กระทบ epic นี้โดยตรง — external partner docs อาจผิดชั้นทั้งชุด", blocker:true },
    { name:"Identity & Authentication", why:"Unified onboarding ใช้ ThaID+Unicon เดียวกับ Registration epic", blocker:false },
    { name:"Role & Access Management", why:"API User role + menu scope เป็นส่วนหนึ่งของ RBAC เดียวกัน", blocker:false },
    { name:"Institution Structure Epic", why:"PUT semantics (F7) เป็น API realization ของ FR-UCBS-CRS-12", blocker:false },
    { name:"Learner Identity Linking Epic", why:"verifyLearner FR เป็นของ epic นั้น (IDL-04) — epic นี้กำหนดแค่ policy ฝั่ง API (rate limit)", blocker:false },
  ],
  features: [
    {
      id:"F1", name:"API Onboarding & Self-Service Key Management",
      sources:["decisions/scr-016-api-integration.md","external/confluence-prd-summaries/prd-api-management.md (real PRD, Chonlada)"],
      note:"core นี้ validate กับ real tech team OpenAPI แล้ว (api-1.yaml v0.0.1, §12) — มั่นใจได้มากกว่า feature อื่นในเอพิคนี้",
      tasks:[
        {id:"1.1", task:"Unified onboarding form (ThaID+Unicon)", desc:"role กำหนดจากตำแหน่ง: 'ผู้ดูแลหน่วยงาน'→Institution Admin · 'เจ้าหน้าที่เชื่อมต่อทางเทคนิค'→API User", dep:"Identity & Auth Epic F1", src:"scr-016 §11.1", c:"green"},
        {id:"1.2", task:"อว. admin approval (โปรแกรมอนุมัติผู้ใช้เดียวกันทุก role) → set-password link", desc:"", dep:"1.1", src:"scr-016 §11.1", c:"green"},
        {id:"1.3", task:"Self-service API key management (NCBS)", desc:"create/rotate/revoke/delete, secret แสดงครั้งเดียว, scope/env", dep:"1.2", src:"scr-016 §11.1, prd-api-management.md", c:"green",
          subs:[
            {id:"1.3.1", task:"No-deletion rule (status change เท่านั้น)", desc:"", dep:"1.3", src:"prd-api-management.md Critical Business Rules", c:"green"},
            {id:"1.3.2", task:"Display-once + copy button", desc:"", dep:"1.3", src:"prd-api-management.md", c:"green"},
            {id:"1.3.3", task:"Toggle On/Off (service status, ไม่ต้อง revoke)", desc:"", dep:"1.3", src:"prd-api-management.md", c:"green"},
          ]},
        {id:"1.4", task:"UCBS-side API Keys console (institution-scoped)", desc:"gate ตามคำร้อง SOP อนุมัติแล้ว + rotate + IP allowlist + scope(courses:write/achievements:write/transfers:read/learners:read)", dep:"1.3", src:"scr-016 §14", c:"green"},
        {id:"1.5", task:"API usage audit log (per account)", desc:"error envelope {type,time,code,message} — 401/422/429", dep:"1.3, 1.4", src:"scr-016 §14, prd-api-management.md Audit Trail", c:"green"},
      ]
    },
    {
      id:"F2", name:"Webhook Delivery Contract (SCR-023 §1)",
      sources:["decisions/scr-023-external-api-integration-standards.md §2, FR-NCBS-ASP-06"],
      tasks:[
        {id:"2.1", task:"Retry policy + auto-disable", desc:"exponential backoff สูงสุด 5 ครั้ง/24ชม. · fail ติดกัน 20 ครั้ง → auto-disable + แจ้งอีเมล", dep:"—", src:"scr-023 §2, ASP-06", c:"green"},
        {id:"2.2", task:"HMAC-SHA256 signature (X-NCBS-Signature)", desc:"constant-time verify", dep:"2.1", src:"scr-023 §2", c:"green"},
        {id:"2.3", task:"Anti-replay protection", desc:"X-NCBS-Timestamp ±5 นาที + X-NCBS-Delivery id dedupe", dep:"2.2", src:"scr-023 §2", c:"green"},
        {id:"2.4", task:"Event catalog (extensible array)", desc:"events[] เสมอ — พิสูจน์แล้วเพิ่ม event 4 (import.job_completed) โดยไม่แตะ contract", dep:"2.1", src:"scr-023 §2", c:"green"},
      ]
    },
    {
      id:"F3", name:"Import Job Status & Bulk Ingest (SCR-023 §6)",
      sources:["decisions/scr-023-external-api-integration-standards.md §2, FR-NCBS-ASP-07"],
      tasks:[
        {id:"3.1", task:"GET /import-jobs/{jobId}", desc:"สถานะ + ผลตรวจรายแถวเฉพาะแถว fail (แบ่งหน้า)", dep:"Multi-Channel Data Ingestion Epic", src:"scr-023 §2, ASP-07", c:"green"},
        {id:"3.2", task:"JSON bulk ingest (idempotent upsert)", desc:"ส่งซ้ำได้ ใช้ key เดิม", dep:"3.1", src:"scr-023 §2", c:"green"},
        {id:"3.3", task:"webhook import.job_completed event", desc:"ยิงตอนจบ ไม่ยิงรายแถว", dep:"3.1, F2.4", src:"scr-023 §2", c:"green"},
      ]
    },
    {
      id:"F4", name:"Credit Void Flow (SCR-023 §7)",
      sources:["decisions/scr-023-external-api-integration-standards.md §2, FR-NCBS-ASP-08"],
      tasks:[
        {id:"4.1", task:"POST /credits/void", desc:"business key(idType/idValue/courseCode/termCode) + reason บังคับ → 204", dep:"Learner Identity Linking Epic (idType/idValue)", src:"scr-023 §2, ASP-08", c:"green"},
        {id:"4.2", task:"Soft delete (achievement.deleted_at) + audit", desc:"hard delete ไม่ทำ (PDPA)", dep:"4.1", src:"scr-023 §2", c:"green"},
        {id:"4.3", task:"Void-then-reimport rule", desc:"แก้ = void แล้ว import ใหม่ (ไม่มี PATCH ราย entry)", dep:"4.2", src:"scr-023 §2, §5", c:"green"},
      ]
    },
    {
      id:"F5", name:"Non-formal Provider First-Class (SCR-023 §8)",
      sources:["decisions/scr-023-external-api-integration-standards.md §2, FR-NCBS-ASP-09"],
      tasks:[
        {id:"5.1", task:"university.org_type enum(university/non_formal_provider)", desc:"default university", dep:"—", src:"scr-023 §2, ASP-09", c:"green"},
        {id:"5.2", task:"Reuse เส้น ingest/access-request/api-key เดียวกัน", desc:"ไม่แตะ UI แยก", dep:"5.1, F1", src:"scr-023 §2", c:"green"},
      ]
    },
    {
      id:"F6", name:"Bulk Export — Institution Exit Path (SCR-023 §9)",
      sources:["decisions/scr-023-external-api-integration-standards.md §2, FR-NCBS-ASP-10"],
      tasks:[
        {id:"6.1", task:"Admin-triggered export job", desc:"super admin + reason บังคับ + acknowledgeAudit", dep:"—", src:"scr-023 §2, ASP-10", c:"green"},
        {id:"6.2", task:"Machine-grade output", desc:"JSON Lines + manifest + SHA256 checksum + downloadUrl หมดอายุ 72 ชม.", dep:"6.1", src:"scr-023 §2", c:"green"},
        {id:"6.3", task:"ไม่มี standing pull API (deliberate — เปิดเมื่อมี use case จริง)", desc:"", dep:"—", src:"scr-023 §2, §5", c:"green", note:"เป็นการตัดสินใจไม่ทำ ไม่ใช่ gap — ระบุเหตุผลไว้ชัดเจน"},
      ]
    },
    {
      id:"F7", name:"Institution Structure Write Semantics — PUT (SCR-023 §2)",
      sources:["decisions/scr-023-external-api-integration-standards.md §2, FR-NCBS-ASP-11"],
      tasks:[
        {id:"7.1", task:"PUT full-replace ต่อ collection + optimistic concurrency", desc:"X-Collection-Version header → 409 เมื่อไม่ตรง", dep:"Institution Structure Epic F1", src:"scr-023 §2, ASP-11", c:"green"},
        {id:"7.2", task:"No hard delete (entry หาย = ปิดใช้งาน)", desc:"", dep:"7.1", src:"scr-023 §2", c:"green"},
        {id:"7.3", task:"CHECO lock", desc:"checoCode/revisionYear read-only ผ่าน API → แก้ = 400 CHECO_FIELD_LOCKED · เพิ่มรุ่น = เพิ่ม entry", dep:"7.1, Institution Structure Epic F1.4", src:"scr-023 §2", c:"green"},
      ]
    },
    {
      id:"F8", name:"API Documentation & Developer Portal",
      sources:["decisions/scr-016-api-integration.md §12-13"],
      tasks:[
        {id:"8.1", task:"Scalar API Reference SDK integration", desc:"render live OpenAPI spec — single source of truth (ไม่มี doc แยก)", dep:"—", src:"scr-016 §13", c:"green", note:"confirmed เป็นตัวเลือกจริงของทีม tech แล้ว"},
        {id:"8.2", task:"Official base URL configuration", desc:"api-gateway.ncbs.mhesi.go.th/ncbs/api", dep:"8.1, Data & Service Foundation F3 (gateway layer resolve)", src:"scr-016 §13", c:"yellow", note:"ขึ้นกับผลของ Data & Service Foundation 3.3 (gateway layer ambiguity) — ถ้าชั้น gateway เปลี่ยน base URL/onboarding steps ต้องแก้ตาม"},
        {id:"8.3", task:"Contract-sync กับ real NestJS Swagger", desc:"", dep:"Data & Service Foundation F6.2 (contract-sync policy)", src:"scr-016 §12", c:"yellow", note:"policy ยังไม่ adopt formally (ดู flag ใน Data & Service Foundation epic)"},
      ]
    },
  ],
  priority: [
    "<b>F1 (onboarding+key mgmt)</b> — ทำก่อนสุด เป็น core ที่ validate กับ real tech team แล้ว ความเสี่ยงต่ำสุดในเอพิคนี้",
    "<b>F7 (PUT semantics)</b> — sequence คู่กับ Institution Structure epic F1 เพราะเป็น API realization ของ schema เดียวกัน",
    "<b>F2, F3, F4</b> — ทำคู่ขนานกันได้หลัง F1 เพราะเป็น standard คนละเรื่องที่ไม่ผูกกัน",
    "<b>F5</b> — เล็ก ทำเร็ว ไม่ block ใคร",
    "<b>F6 (bulk export)</b> — priority ต่ำกว่า เพราะเป็น exit-path (ใช้ตอนสถาบันจะออกจากระบบ) ไม่ใช่ core day-1",
    "<b>F8 (docs)</b> — รอผล Data & Service Foundation 3.3 (gateway layer) ก่อนจะ finalize base URL/onboarding docs",
  ],
  flags: [
    "<b>Gateway layer ambiguity กระทบตรงจุดที่สุด (8.2)</b> — Data & Service Foundation flag ไว้ว่า APISIX vs Oracle API Management ยังไม่เคาะว่า partner ภายนอกวิ่งชั้นไหน — epic นี้คือจุดที่ผลกระทบจริงจะเกิด (base URL, วิธีขอ key, rate limit policy) ห้าม finalize F8 ก่อนเคาะ",
    "<b>ตัวเลข event/rate limit ยังเป็นค่าร่าง</b> — SCR-023 ระบุเองว่า 'รอทีม tech ยืนยัน' ก่อน finalize (เช่น 10 req/นาทีของ verifyLearner, retry 5 ครั้ง/24ชม.) — ใช้เป็นค่าตั้งต้นได้แต่ต้อง confirm ก่อน lock",
    "<b>Support Ticket ถูกตัดออก 2 รอบ</b> — ใครอ้างอิง FR-CTP-REQ-06 หรือเอกสารเก่าที่พูดถึงระบบ support ticket ต้องรู้ว่ามันถูกถอดออกจาก scope ทั้งหมดแล้ว (2026-07-11, 2026-07-13) งาน support ทั้งหมดทำนอกระบบ",
    "<b>Maturity ไม่เท่ากันในเอพิคเดียวกัน</b> — F1 (SCR-016) validate กับ OpenAPI จริงของทีม tech แล้ว น่าเชื่อถือกว่า F2-F7 (SCR-023) ที่เป็น Track B ล้วนที่ทีม product/wiki กำหนดมาตรฐานเองแล้วรอ tech ยืนยันย้อนหลัง — ควรแยกระดับความเชื่อมั่นตอน estimate",
    "<b>verifyLearner ownership แยกกัน (4.1 cross-ref)</b> — FR อยู่ที่ SCR-022 (Learner Identity Linking) แต่ policy (rate limit) อยู่ที่ SCR-023 (epic นี้) — ต้องประสาน 2 epic เวลา implement",
  ]
};


// ---------- register into multi-epic registry ----------
window.NCBS_EPICS = window.NCBS_EPICS || {};
window.NCBS_EPICS['api-management'] = {
  id: 'api-management',
  system: 'NCBS',
  name: 'API Management & Integration Standards',
  thaiName: 'การจัดการ API และมาตรฐานการเชื่อมต่อ',
  status: 'Onboarding core (SCR-016) validate กับทีม tech จริงแล้ว — ส่วนที่เหลือ (SCR-023) ยัง Track B',
  epicDeps: API_MANAGEMENT_DATA.epicDeps,
  features: API_MANAGEMENT_DATA.features,
  priority: API_MANAGEMENT_DATA.priority,
  flags: API_MANAGEMENT_DATA.flags,
};
