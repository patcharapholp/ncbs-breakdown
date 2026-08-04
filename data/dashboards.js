// NCBS Breakdown — Dashboards & Analytics epic data
// Sprint Details #58-60 (NCBS/UCBS/CTP Dashboard) Phase 2 — สถานะ spec ต่างกันมากในแต่ละ dashboard

const DASHBOARDS_DATA = {
  epicDeps: [
    { name:"Grade & Credit Management Epic", why:"ข้อมูล KPI พื้นฐานของทุก dashboard มาจากที่นี่", blocker:false },
    { name:"Credit Transfer Epic", why:"CTP Dashboard + transfer trend ต้องพึ่ง transfer data", blocker:false },
    { name:"Institution Structure Epic", why:"Institute Dashboard ต้องพึ่งโครงสร้างสถาบัน", blocker:false },
  ],
  features: [
    {
      id:"F1", name:"Learner Dashboard (Phase 2, real PRD — Confluence)",
      sources:["external/confluence-prd-summaries/prd-learner-dashboard.md (real PRD link, BA Team)"],
      note:"real PRD มีจริง (15 Use Cases + Mermaid diagram ใน Confluence) แต่เป็น Phase 2 — prototype สร้างล้ำหน้า spec ไปก่อนแล้ว",
      tasks:[
        {id:"1.1", task:"การ์ดแสดงตัวเลขสรุปสำคัญของผู้เรียน หน่วยกิต/วิชา/สถาบัน/สถานะเทียบโอน (Learner Dashboard - KPI Cards)", desc:"", dep:"Grade & Credit Management Epic", src:"prd-learner-dashboard.md FR-NCBS-LER-01/03", c:"green"},
        {id:"1.2", task:"วิเคราะห์ความสอดคล้องกับเส้นทางอาชีพ (Learner Dashboard - Career Insights, ต้องเคาะนโยบาย AI ก่อน)", desc:"", dep:"1.1", src:"prd-learner-dashboard.md FR-NCBS-LER-05", c:"red", note:"⚠️ ไม่มีงบ AI ตามที่ยืนยันซ้ำหลายจุดในวิกิ (course-matching-algorithm-spec เลือก deterministic เพราะเหตุนี้) — feature นี้ implies ต้องมี AI/ML model ซึ่งขัดกับนโยบายงบที่วางไว้ที่อื่น ต้องเคาะให้ชัดก่อน"},
        {id:"1.3", task:"วิเคราะห์ทักษะเทียบกับตลาดแรงงาน แบบกราฟเรดาร์/แท่ง (Learner Dashboard - Skills Analysis)", desc:"", dep:"1.1", src:"prd-learner-dashboard.md FR-NCBS-LER-05", c:"red", note:"data source ตลาดแรงงานสำหรับเทียบ ไม่มีระบุที่ไหน"},
        {id:"1.4", task:"เปรียบเทียบผลการเรียนกับเพื่อนร่วมรุ่น (Learner Dashboard - Peer Benchmark)", desc:"", dep:"1.1", src:"prd-learner-dashboard.md FR-NCBS-LER-06", c:"red", note:"open question ตรงๆ: 'ดึงข้อมูลจากแหล่งไหน' ไม่มีคำตอบ"},
        {id:"1.5", task:"แนะนำหลักสูตร/มหาวิทยาลัย/อาชีพด้วย AI (Learner Dashboard - AI Recommendations, ต้องเคาะนโยบาย AI ก่อน)", desc:"", dep:"1.1", src:"prd-learner-dashboard.md FR-NCBS-LER-06", c:"red", note:"เดียวกับ 1.2 — ขัดกับนโยบาย 'ไม่มีงบ AI' ที่ยืนยันในหลายจุด ต้องเคาะทิศทาง (rule-based ทดแทน หรือของบ AI จริง) ก่อน"},
        {id:"1.6", task:"ช่องว่าง spec ที่ยังไม่มีนิยาม FR-NCBS-LER-04 (Learner Dashboard - Undefined Requirement)", desc:"", dep:"—", src:"prd-learner-dashboard.md SRS Traceability", c:"red", note:"ระบุตรงๆ ว่า FR code นี้ไม่เคย define ใน SRS — gap เก่าที่ค้างมาตั้งแต่ต้น"},
      ]
    },
    {
      id:"F2", name:"Intelligence Dashboard (NCBS Central, BR-NCBS-04)",
      sources:["systems/ncbs-platform.md BR-NCBS-04"],
      note:"🔴 thin — ไม่มี PRD ไม่มี prototype ไม่มี SCR",
      tasks:[
        {id:"2.1", task:"แดชบอร์ดสรุปภาพรวมสำหรับผู้บริหาร อว. (Intelligence Dashboard - Executive Summary)", desc:"", dep:"Grade & Credit Management Epic", src:"systems/ncbs-platform.md BR-NCBS-04", c:"red", note:"มีแค่ 1 บรรทัดใน BR — ไม่มี use case/wireframe ใดๆ"},
        {id:"2.2", task:"พยากรณ์แนวโน้มทักษะด้วย Machine Learning สำหรับ Skill Matrix (Intelligence Dashboard - ML Forecast, งานเฟสถัดไปไม่ใช่ Phase 1)", desc:"", dep:"Skill Matrix Epic", src:"systems/ncbs-platform.md BR-NCBS-04, concepts/skill-matrix.md", c:"red", note:"concepts/skill-matrix.md (พ.ค. 69) แก้ข้อขัดแย้งเดิมแล้ว: Skill Matrix ยืนยัน in-scope แต่ Phase 1 = 'Design-ready ≠ Build-complete' (แค่เตรียม data model/API ให้ extensible) — ML forecasting เต็มรูปแบบเป็นงานเฟสถัดไป ไม่ใช่ Phase 1"},
      ]
    },
    {
      id:"F3", name:"Institute Dashboard (UCBS, BR-UCBS-04)",
      sources:["systems/ucbs.md BR-UCBS-04"],
      note:"🔴 thin — Sprint #59 Phase 2, ยังไม่เริ่ม",
      tasks:[
        {id:"3.1", task:"สถิติจำนวนผู้เรียนและแนวโน้มการเทียบโอนต่อสถาบัน (Institute Dashboard - Statistics)", desc:"สำหรับผู้บริหาร/เจ้าหน้าที่ ม.", dep:"Institution Structure Epic, Credit Transfer Epic", src:"systems/ucbs.md BR-UCBS-04", c:"red", note:"ไม่มี use case ละเอียด ต้องออกแบบใหม่ทั้งหมด"},
      ]
    },
    {
      id:"F4", name:"CTP Dashboard",
      sources:["sources/gap-vs-sprint-cross-reference.md Sprint #60"],
      note:"🔴 thin — Sprint #60 Phase 2, ยังไม่เริ่ม",
      tasks:[
        {id:"4.1", task:"สถิติภาพรวมขั้นตอนการเทียบโอนหน่วยกิต (CTP Dashboard - Workflow Statistics)", desc:"", dep:"Credit Transfer Epic", src:"gap-vs-sprint-cross-reference.md", c:"red", note:"ไม่มี spec ใดๆ นอกชื่อ feature ใน sprint list"},
      ]
    },
  ],
  priority: [
    "<b>F1.1 (KPI Cards)</b> — ทำได้ก่อนสุด spec ชัด ไม่ต้องรอ AI decision",
    "<b>1.2, 1.3, 1.5 (AI-dependent features)</b> — ต้องเคาะนโยบาย AI budget ก่อน ไม่ควร estimate จนกว่าจะรู้ว่าจะทำแบบ rule-based หรือของบ AI จริง",
    "<b>F2, F3, F4</b> — ต้องมี design phase (use case + wireframe) ก่อนถึงจะ breakdown เป็น dev task ได้ ตอนนี้มีแค่ชื่อ feature",
  ],
  flags: [
    "<b>AI features ขัดกับนโยบายงบประมาณของโครงการ (1.2, 1.3, 1.5)</b> — course-matching-algorithm-spec (Credit Transfer epic) เลือก deterministic algorithm อย่างชัดเจนเพราะ 'ไม่มีงบ AI' แต่ Learner Dashboard PRD ขอ Career Insights/Skills Analysis/AI Recommendations ซึ่งโดยธรรมชาติต้องพึ่ง ML/AI model — เป็นความขัดแย้งเชิงนโยบายระหว่าง 2 ส่วนของโครงการที่ควร reconcile ก่อน",
    "<b>Skill Matrix Phase 1 vs Phase 2 ขัดแย้งเก่าที่ยังไม่ปิด (2.2)</b> — BRD Exec Summary กับ BR-NCBS-04 เขียนขัดกันเองมาตั้งแต่ ingest ครั้งแรก ไม่เคยถูก resolve",
    "<b>F2, F3, F4 แทบไม่มี spec เลย</b> — เป็นแค่ชื่อ feature ใน Sprint list กับ BR หนึ่งบรรทัด ไม่ควร estimate manday จากข้อมูลระดับนี้ ต้องมี design/discovery phase ก่อน",
    "<b>Learner Dashboard เป็น Phase 2 แต่ prototype ทำล้ำหน้าไปแล้ว</b> — ระวังไม่ให้ความสมบูรณ์ของ prototype ทำให้ดูเหมือนงานเสร็จแล้ว ทั้งที่ real PRD ยัง Draft และ timeline ยังไม่กำหนด",
  ]
};


// ---------- register into multi-epic registry ----------
window.NCBS_EPICS = window.NCBS_EPICS || {};
window.NCBS_EPICS['dashboards'] = {
  id: 'dashboards',
  system: 'NCBS',
  name: 'Dashboards & Analytics',
  thaiName: 'แดชบอร์ดและการวิเคราะห์ข้อมูล',
  status: 'ส่วนใหญ่ Phase 2-3 ยังไม่เริ่ม — Learner Dashboard มี real PRD แต่ยัง thin',
  epicDeps: DASHBOARDS_DATA.epicDeps,
  features: DASHBOARDS_DATA.features,
  priority: DASHBOARDS_DATA.priority,
  flags: DASHBOARDS_DATA.flags,
};
