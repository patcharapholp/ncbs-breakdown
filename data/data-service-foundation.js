// NCBS Breakdown — Data & Service Foundation epic data
// Sprint Details #1 (Database Schema Design) + #2 (Service Foundation) — v0.5.0, Priority 1-2
// สถานะ real dev (per gap-vs-sprint-cross-reference.md, พ.ค. 69 — ไม่มี signal ใหม่กว่านี้): "Dev in Progress" ทั้งคู่ ไม่ confirm เสร็จ
// หมายเหตุสำคัญ: epic นี้เป็น "infra/platform" ไม่ใช่ business feature — หลาย task ควบคุมโดยผู้เล่นภายนอก (UniNet/Sirisoft/Sky ICT) ไม่ใช่ทีม dev SkillLane โดยตรง

const DATA_SERVICE_FOUNDATION_DATA = {
  epicDeps: [
    { name:"UniNet Infra Provisioning (ภายนอก — สป.อว./UniNet)", why:"Physical server + network เป็นความรับผิดชอบของ UniNet ไม่ใช่ทีม dev — timeline ทั้งหมดขึ้นกับผู้เล่นภายนอก", blocker:true },
    { name:"Oracle Stack Procurement (Sirisoft)", why:"DB/IAM/SOA/API Mgmt license เป็นเงื่อนไขก่อนตั้งค่า schema/gateway จริง", blocker:false },
    { name:"Sky ICT Security Stack Procurement", why:"Firewall/XDR/Log ต้องมาก่อนจะเปิด production traffic ได้อย่างปลอดภัย", blocker:false },
  ],
  features: [
    {
      id:"F1", name:"Database Architecture & Multi-Tenancy Provisioning",
      sources:["decisions/2026-05-infrastructure-procurement.md","sources/oracle-nonprod-setup.md","meta/research/tech-infra-alignment-2026-07.md §A4"],
      tasks:[
        {id:"1.1", task:"Oracle CDB/PDB multitenant architecture setup", desc:"PDB ต่อมหาวิทยาลัย (standard tables) + PDB NCBS กลาง (Central Registry + Blockchain Table)", dep:"F2 (physical/VM infra พร้อม)", src:"internal-project-update-2026-07.md (deck หน้า 87), tech-infra-alignment §A4", c:"yellow", note:"ทิศทางยืนยันจาก deck ก.ค. 69 แต่ยังไม่มี task ใดใน db-schema registry ที่ annotate ว่าตารางไหนอยู่ PDB ไหน — proposal draft กำลังทำฝั่ง prototype เท่านั้น รอ Technical Workshop ยืนยัน"},
        {id:"1.2", task:"Non-prod Oracle service/tablespace setup (Dev/UAT/Pre-Prod)", desc:"3 services ต่อ env (ncbs_<ENV>_svc / ucbs_<ENV>_svc / common_<ENV>_svc) + tablespace + DBRM resource isolation (2vCPU/4GB, quota ต่อ consumer group)", dep:"—", src:"oracle-nonprod-setup.md", c:"green", note:"มาตรฐานเขียนโดย Tech Lead จริง (Totsawat) ใน Confluence แล้ว — ใช้ตรงได้เลย"},
        {id:"1.3", task:"PII masking at DB level (DBMS_REDACT)", desc:"grant DBMS_REDACT execute ให้ ncbs_<ENV> + ucbs_<ENV> — สอดคล้อง PDPA", dep:"1.2", src:"oracle-nonprod-setup.md", c:"green"},
        {id:"1.4", task:"Tenancy field annotation ครบทุกตาราง (53 tables)", desc:"เพิ่ม field tenancy (ncbs-pdb / university-pdb / shared) ต่อทุกตาราง ผูกกับ 1.1", dep:"1.1", src:"tech-infra-alignment §A4, §6 P1.2", c:"yellow", note:"กำลังทำเป็น proposal draft (branch feat/tech-infra-alignment) — ยังไม่ confirm จาก tech workshop"},
        {id:"1.5", task:"Oracle License compliance resolution (Physical vs VM entitlement)", desc:"TOR license ซื้อสำหรับ Physical Server แต่ใช้งานจริงบน VM Farm ชั่วคราว", dep:"—", src:"infrastructure-procurement.md D2", c:"red", note:"Legal/financial risk — ถ้า Oracle audit เจอการใช้งานผิดประเภทมีความเสี่ยงค่าปรับ ต้องมีหนังสือรับทราบร่วมจาก HI Stakeholder ก่อน ไม่ใช่ dev decision"},
      ]
    },
    {
      id:"F2", name:"Physical/Compute Infrastructure Procurement",
      sources:["decisions/2026-05-infrastructure-procurement.md"],
      note:"ทุก task ในนี้ควบคุมโดย UniNet + Infra PM (โบ๊ท นภดล) เป็นหลัก — ทีม dev SkillLane รอผลเท่านั้น ไม่ใช่งานที่ dev estimate manday ได้ตรงๆ",
      tasks:[
        {id:"2.1", task:"Physical server Batch 1 (2 เครื่อง, DC)", desc:"กำหนดส่งมอบ ต.ค. 69", dep:"UniNet procurement (ภายนอก)", src:"infrastructure-procurement.md", c:"yellow", note:"timeline ชัดแล้วแต่เป็น external dependency — เลื่อนได้"},
        {id:"2.2", task:"Physical server Batch 2 (2 เครื่อง, DC+DR)", desc:"กำหนดส่งมอบ ธ.ค. 69 - ต้นปี 70", dep:"2.1 (งบเดียวกัน)", src:"infrastructure-procurement.md", c:"yellow"},
        {id:"2.3", task:"Interim VM Farm capacity validation (load test ก่อน pilot)", desc:"UniNet ยืนยันกำลังพอสำหรับทุก environment แต่ยังไม่มี load test จริงบันทึกไว้", dep:"—", src:"infrastructure-procurement.md Open Risks", c:"yellow", note:"ระบุเป็น open risk ตรงๆ ในเอกสาร — ต้องทำ load test ก่อน production workload"},
        {id:"2.4", task:"K8s cluster sizing (~400 VM / 1,000 vCPU / 4,000GB RAM, RKE2)", desc:"target design ตาม deck ก.ค. 69", dep:"2.1, 2.2 หรือ VM Farm เพียงพอ", src:"internal-project-update-2026-07.md (per Agent research, พ.ค. 69: VM allocation จริงมีแค่ 20/50 ที่ขอ)", c:"red", note:"ตัวเลข allocation จริงล่าสุดที่เห็นใน wiki (พ.ค. 69) ต่ำกว่าเป้าหมายมาก — ต้อง cross-check สถานะปัจจุบันกับทีม infra ก่อนวางแผนต่อ ไม่ควรถือว่า capacity พร้อมแล้ว"},
        {id:"2.5", task:"DR site readiness ก่อน Soft Launch (ต.ค.-พ.ย. 69)", desc:"Batch 2 (มี DR) มาไม่ทัน Soft Launch — ต้องมี BCP ชั่วคราวด้วย VM Farm", dep:"2.2", src:"infrastructure-procurement.md Open Risks", c:"red", note:"Soft Launch จะไม่มี DR site จริง ณ วันเปิดระบบ — เป็น availability risk ที่ระบุไว้ตรงๆ"},
      ]
    },
    {
      id:"F3", name:"API Gateway & Service Mesh Foundation",
      sources:["concepts/api-gateway.md","entities/apisix.md","meta/research/tech-infra-alignment-2026-07.md §A1"],
      tasks:[
        {id:"3.1", task:"APISIX runtime gateway setup (L2)", desc:"ทุก request ของ NCBS/UCBS ผ่าน APISIX — auth, x-userinfo header injection, rate limit", dep:"—", src:"tech-infra-alignment §2 (จุดที่ตรงกันแล้ว)", c:"green", note:"สถาปัตยกรรม confirmed ทั้งฝั่ง deck จริงและ prototype design"},
        {id:"3.2", task:"Oracle API Management setup (L3, 8 Processor license)", desc:"เชื่อมระบบภาครัฐ/ภายนอกตามภาคผนวก ก ของสัญญา", dep:"Oracle Stack Procurement", src:"tech-infra-alignment §A1, concepts/middleware-stack.md", c:"yellow", note:"License เริ่มแล้วแต่ semantics ยังไม่ชัดว่า partner ภายนอกวิ่งผ่านชั้นไหนจริง"},
        {id:"3.3", task:"Reconcile external-facing API docs กับ gateway layer จริง", desc:"docs.html/getting-started (ฝั่ง prototype) เขียนว่า API key partner ตรวจที่ APISIX — ถ้า partner จริงต้องผ่าน Oracle APIM ก่อน ต้องแก้ base URL/วิธีขอ key/rate limit policy", dep:"3.1, 3.2", src:"tech-infra-alignment §A1", c:"red", note:"บล็อกจนกว่า Technical Workshop จะยืนยันว่า gateway ชั้นไหนตรวจ key ของใคร (คำถาม #1 ใน tech-workshop-open-questions)"},
      ]
    },
    {
      id:"F4", name:"Middleware & Security Stack Procurement (13 รายการ, 2 vendor)",
      sources:["concepts/middleware-stack.md","sources/middleware-procurement-matrix.md","sources/sky-middleware-gap.md"],
      tasks:[
        {id:"4.1", task:"Oracle Stack (Sirisoft) — 7 รายการ", desc:"DB RAC✅ · IAM OAM+OIG✅ · SOA✅ · API Mgmt🟢(เริ่มแล้ว) · DataGuard🟢(เริ่มแล้ว) · DBFW🟡(เริ่ม ก.ค.69) · Data Analytic🟡(เริ่ม ต.ค.69)", dep:"—", src:"middleware-stack.md", c:"green", note:"ไม่มีรายการไหนล่าช้าตามแผน ณ ข้อมูลล่าสุดที่มี (พ.ค. 69)"},
        {id:"4.2", task:"Sky ICT Stack — 6 รายการ", desc:"GitLab✅ · Cisco NGFW🟢 · XDR🔴 · XDR Sensor🔴 · NetEvid Log🔴 · DevSecOps⚪TBD", dep:"—", src:"middleware-stack.md, sky-middleware-gap.md", c:"red", note:"3/6 รายการไม่ทัน Soft Launch (ต.ค.-พ.ย.69) — Security Monitoring gap ('เปิดระบบมี Firewall แต่ไม่มีกล้องวงจรปิด')"},
        {id:"4.3", task:"Mitigation: Application-level audit logging ชั่วคราว", desc:"NCBS/UCBS API log ระดับ application ทดแทน NetEvid ระหว่างรอจัดซื้อ", dep:"4.2", src:"middleware-stack.md Mitigation Strategy", c:"yellow", note:"Owner = SkillLane Dev — เป็น dev task จริงที่ estimate ได้ ต่างจาก 4.1/4.2 ที่เป็น procurement"},
        {id:"4.4", task:"Prometheus + Grafana infra anomaly detection", desc:"ระดับ infrastructure — เสริม visibility ระหว่างรอ XDR", dep:"—", src:"middleware-stack.md Mitigation Strategy", c:"yellow"},
      ]
    },
    {
      id:"F5", name:"Async/Integration Backbone",
      sources:["meta/research/tech-infra-alignment-2026-07.md §2"],
      note:"Pattern นี้เป็นฐานที่ Notification Service, Blockchain Anchoring (ใน Credit Transfer epic), และ Multi-Channel Data Ingestion epic ต้องใช้ร่วมกัน",
      tasks:[
        {id:"5.1", task:"Transactional Outbox pattern → NATS JetStream setup", desc:"async job queue กลาง — confirmed จาก deck ก.ค. 69 ตรงกับ pattern ที่ prototype ออกแบบไว้ (sync_job/export_job/pending_anchor)", dep:"F1, F3", src:"tech-infra-alignment §2 (จุดที่ตรงกันแล้ว)", c:"green", note:"สถาปัตยกรรม confirmed ทั้งสองฝั่งแล้ว — พร้อม estimate"},
        {id:"5.2", task:"Job status tracking schema (sync_job/export_job)", desc:"real implementation ของ pattern ที่ prototype mock ไว้", dep:"5.1", src:"tech-infra-alignment §2", c:"yellow", note:"prototype มีแค่ mock status field — schema จริงยังต้องออกแบบ"},
      ]
    },
    {
      id:"F6", name:"Data Schema Design & Contract Governance",
      sources:["sources/data-dictionary-v2.md","decisions/2026-07-contract-sync-policy-draft.md","meta/research/tech-infra-alignment-2026-07.md §C1-C3"],
      tasks:[
        {id:"6.1", task:"Canonical schema baseline merge", desc:"Data Dictionary V2 จริง (14 ตาราง/208 fields, ธ.ค. 68) + w3 delta (31 ตารางใหม่ ~470 field rows จาก prototype-side gap doc) → ต้อง BA merge เป็น schema จริงชุดเดียว", dep:"—", src:"data-dictionary-v2.md, meta/w3-data-dictionary-new-tables-2026-07.md", c:"yellow", note:"w3 delta มาจากฝั่ง prototype (Track B) ไม่ใช่ BA จริงเขียน — ต้อง sign-off ก่อนถือเป็น schema จริง"},
        {id:"6.2", task:"Contract-sync policy adoption (yaml design-time vs Swagger NestJS runtime)", desc:"CI diff paths/operationId/DTO ทุก release กัน 2 แหล่งข้อมูล drift", dep:"6.1", src:"contract-sync-policy-draft.md", c:"yellow", note:"เป็นแค่ policy draft ยังไม่ adopt formally — ต้อง PM/tech รับรอง"},
        {id:"6.3", task:"Stats generator (auto-derive table/field/op count จาก registry)", desc:"กัน drift แบบที่เจอแล้วจริง (deck ใช้ 148 ops ขณะ registry จริง=153 ops)", dep:"6.1", src:"tech-infra-alignment §C2, §6 P1.1", c:"yellow", note:"กำลังทำอยู่ฝั่ง prototype (branch feat/tech-infra-alignment) — ยังไม่เสร็จ"},
        {id:"6.4", task:"Government data standard compliance mapping (TGIX/DGA)", desc:"ยืนยันว่ามาตรฐานการเชื่อมโยงข้อมูลภาครัฐที่ต้องทำตามคือมาตรฐานไหน", dep:"—", src:"concepts/data-standard.md Open Questions", c:"red", note:"เป็น open question มาตั้งแต่ concept doc แรกสุด (เม.ย. 69) ไม่เคยถูกตอบที่ไหนในทั้ง wiki"},
      ]
    },
    {
      id:"F7", name:"DevOps/CI Foundation",
      sources:["concepts/middleware-stack.md","meta/research/tech-infra-alignment-2026-07.md §2"],
      tasks:[
        {id:"7.1", task:"GitLab repo + CI/CD pipeline setup", desc:"", dep:"—", src:"middleware-stack.md (✅ พร้อม)", c:"green"},
        {id:"7.2", task:"Git governance (main protected, MR+pipeline, release-only merge)", desc:"โครงเดียวกับที่ prototype ใช้อยู่แล้ว (คนละ scale)", dep:"7.1", src:"tech-infra-alignment §2", c:"green", note:"confirmed ตรงกันทั้งสองฝั่ง"},
        {id:"7.3", task:"Quality gate enforcement (coverage ≥80% ฯลฯ)", desc:"มาตรฐานถูกนิยามไว้ แต่ยังไม่ confirm ว่าบังคับใช้จริงใน pipeline หรือยัง", dep:"7.2", src:"internal-project-update-2026-07.md (per Agent research)", c:"yellow"},
      ]
    },
  ],
  priority: [
    "<b>F2</b> Physical/Compute Infra — ต้องตามให้ทันเพราะ external timeline (UniNet) ควบคุมไม่ได้ ควร escalate เร็วถ้ามีสัญญาณเลื่อน",
    "<b>1.2, 1.3</b> Non-prod DB setup — ทำได้ทันทีไม่ต้องรอ physical server (ใช้ VM Farm ได้)",
    "<b>3.1, 7.1-7.2</b> Gateway runtime + DevOps foundation — confirmed spec แล้ว ทำคู่ขนานได้เลย",
    "<b>1.1, 1.4</b> Tenancy/PDB design — ต้องเคาะก่อน Institution Structure epic และ Grade & Credit Management epic จะออกแบบ data access ต่อได้ถูก",
    "<b>F6 (schema governance)</b> — ควรทำคู่ขนานกับทุก business epic ตั้งแต่ต้น ไม่ใช่ทำทีหลัง เพราะ drift (148 vs 153 ops) เกิดขึ้นแล้วจริง",
    "<b>F4 Sky ICT gap (XDR/NetEvid)</b> — ไม่ block dev แต่ block security posture ของ Soft Launch — ต้องมี mitigation (4.3/4.4) พร้อมก่อนวันเปิดระบบ",
    "<b>3.3 (gateway layer reconcile)</b> และ <b>1.5 (Oracle License)</b> — ทั้งคู่รอการตัดสินใจนอกทีม dev ห้าม estimate ก่อนเคาะ",
  ],
  flags: [
    "<b>Oracle License compliance (1.5)</b> — ใช้งานบน VM Farm ทั้งที่ license ซื้อสำหรับ Physical Server เป็นความเสี่ยงกฎหมาย/การเงินที่ยังไม่ resolved ไม่ใช่แค่ tech debt — ต้องมีหนังสือรับทราบจาก HI Stakeholder",
    "<b>K8s capacity gap (2.4)</b> — ข้อมูลล่าสุดที่เห็นใน wiki (พ.ค. 69) ระบุ VM allocation จริงแค่ 20/50 ที่ขอ ต่ำกว่าเป้าหมาย ~400VM มาก — ต้อง verify สถานะปัจจุบันกับทีม infra ก่อนวางแผน sprint ที่พึ่งพา compute capacity",
    "<b>Tenancy annotation ยังไม่เสร็จ (1.4)</b> — กระทบทุก epic ที่อ่าน/เขียนข้อมูล เพราะยังไม่ชัดว่าตารางไหนอยู่ PDB สถาบัน vs PDB กลาง — ควรปิด gap นี้ก่อนเริ่ม business epic จำนวนมาก ไม่ใช่ทำขนานไปเรื่อยๆ",
    "<b>Gateway layer ambiguity (3.3)</b> — กระทบ API Management epic และ External API Integration Standards epic โดยตรง เพราะเอกสาร onboarding partner ภายนอกอาจผิดทั้งชุดถ้า gateway ชั้นจริงไม่ตรงกับที่ prototype design ไว้",
    "<b>SKY Middleware gap (4.2)</b> — 3 รายการ (XDR/XDR Sensor/NetEvid) ไม่ทัน Soft Launch เป็น security blind spot ที่ยอมรับความเสี่ยงไว้แล้วเป็นลายลักษณ์อักษร แต่ mitigation (4.3/4.4) ต้องทำจริงไม่ใช่แค่ระบุไว้เฉยๆ",
    "<b>Contract-sync policy (6.2) ยังไม่ adopt</b> — ระหว่างนี้ yaml design-time กับ Swagger runtime จะ drift ต่อไปเรื่อยๆ (มีหลักฐานแล้วว่า drift เกิดจริง — 148 vs 153 ops) กระทบทุก epic ที่มี API contract",
    "<b>Government data standard (6.4)</b> — เป็น open question ที่ไม่เคยถูกตอบตั้งแต่ concept doc แรกสุด ควรถามให้ชัดก่อนเข้าสู่ acceptance/compliance review รอบใหญ่",
    "<b>สถานะข้อมูลในไฟล์นี้ไม่ real-time</b> — ข้อมูล infra ส่วนใหญ่ (VM allocation, middleware timeline) มาจาก wiki ที่ freeze ประมาณ พ.ค.-ก.ค. 69 ควร cross-check กับทีม infra ปัจจุบันก่อนใช้ตัดสินใจ manday",
  ]
};


// ---------- register into multi-epic registry ----------
window.NCBS_EPICS = window.NCBS_EPICS || {};
window.NCBS_EPICS['data-service-foundation'] = {
  id: 'data-service-foundation',
  system: 'NCBS',
  name: 'Data & Service Foundation',
  thaiName: 'โครงสร้างพื้นฐานข้อมูลและบริการ',
  status: 'Dev in Progress (Sprint #1-2, ข้อมูลล่าสุด พ.ค. 69) — ยังไม่ confirm เสร็จส่วนไหน',
  epicDeps: DATA_SERVICE_FOUNDATION_DATA.epicDeps,
  features: DATA_SERVICE_FOUNDATION_DATA.features,
  priority: DATA_SERVICE_FOUNDATION_DATA.priority,
  flags: DATA_SERVICE_FOUNDATION_DATA.flags,
};
