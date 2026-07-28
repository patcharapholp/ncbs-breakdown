// NCBS Breakdown — Landing Pages / CMS / Personalized Recommendation epic data
// Sprint Details #36-38 (Landing Pages) Phase 2, #66-68 (Full CMS) Phase 3, #61-63 (AI/Skill Gap) Phase 3, BR-NCBS-07
// 🔴 thin ทั้งหมด — ชื่อ feature ใน sprint list + BR หนึ่งบรรทัด ไม่มี use case ละเอียดที่ไหน

const LANDING_CMS_RECOMMENDATION_DATA = {
  epicDeps: [
    { name:"Institution Structure & Master Data Epic", why:"Landing Page course catalog ต้องพึ่งข้อมูลหลักสูตร/รายวิชา", blocker:false },
    { name:"Grade & Credit Management + Skill Matrix Epics", why:"Recommendation engine (ถ้าทำ) ต้องพึ่งข้อมูล credit + skill", blocker:false },
  ],
  features: [
    {
      id:"F1", name:"Landing Pages (NCBS/UCBS/CTP)",
      sources:["sources/gap-vs-sprint-cross-reference.md §1.2, §3.2, §7.1"],
      tasks:[
        {id:"1.1", task:"Static course listing page (แทน full search engine)", desc:"reuse ข้อมูลจาก UCBS + University Profile", dep:"Institution Structure Epic", src:"gap-vs-sprint-cross-reference.md §7.1 Action 2", c:"yellow", note:"เอกสารแนะนำชัดเจนว่าไม่ต้องสร้าง search engine เต็ม (20-30 MD) — static listing พอสำหรับ MVP (ประเมินหยาบ 3-5 MD)"},
        {id:"1.2", task:"Landing page ต่อระบบ (NCBS/UCBS/CTP)", desc:"", dep:"1.1", src:"gap-vs-sprint-cross-reference.md §1.2 (#36-38)", c:"red", note:"ไม่มี use case ละเอียดที่ไหน — มีแค่ชื่อ feature ใน sprint list"},
      ]
    },
    {
      id:"F2", name:"Full CMS (NCBS/UCBS/CTP, Phase 3)",
      sources:["sources/gap-vs-sprint-cross-reference.md §1.3, §3.3"],
      tasks:[
        {id:"2.1", task:"Full CMS ต่อระบบ", desc:"", dep:"F1", src:"gap-vs-sprint-cross-reference.md §1.3 (#66-68)", c:"red", note:"Phase 3 — ไม่มี spec ใดๆ นอกชื่อ feature"},
      ]
    },
    {
      id:"F3", name:"Personalized Recommendation (BR-NCBS-07)",
      sources:["systems/ncbs-platform.md BR-NCBS-07","sources/gap-vs-sprint-cross-reference.md §1.3, §7.4"],
      tasks:[
        {id:"3.1", task:"Personalized Dashboard + Recommendation", desc:"", dep:"Dashboards Epic F1", src:"systems/ncbs-platform.md BR-NCBS-07", c:"red", note:"cross-ref Dashboards Epic 1.2/1.5 — ขัดกับนโยบาย 'ไม่มีงบ AI' เดียวกัน"},
        {id:"3.2", task:"Defer AI Recommendation Engine ไปก่อน", desc:"Rule-based matching ใน CTP เพียงพอสำหรับ 1-2 ปีแรก", dep:"—", src:"gap-vs-sprint-cross-reference.md §7.4 What NOT to Build", c:"green", note:"เป็นการตัดสินใจไม่ทำที่มีเหตุผลรองรับชัดเจนแล้ว — ควรยึดแนวทางนี้"},
      ]
    },
  ],
  priority: [
    "<b>1.1 (static listing)</b> — quick win ที่แนะนำให้ทำ ทำได้เร็วและถูก",
    "<b>3.2 (defer AI recommendation)</b> — ยึดตามคำแนะนำ ไม่ต้อง priority feature นี้เลยในระยะสั้น",
    "<b>F1.2, F2, F3.1</b> — priority ต่ำสุดในบรรดา epic ทั้งหมด เพราะเป็น Phase 2-3 ที่ไม่มี spec รองรับเลย",
  ],
  flags: [
    "<b>ทั้ง epic แทบไม่มี spec เลย</b> — ไม่ควร estimate manday ละเอียดตอนนี้ รอ Phase 2/3 planning จริงก่อน",
    "<b>Personalized Recommendation ขัดกับนโยบาย 'ไม่มีงบ AI' (3.1)</b> — เดียวกับที่ flag ไว้ใน Dashboards epic — ควร reconcile นโยบายนี้ครั้งเดียวระดับโครงการ ไม่ใช่แก้ปัญหาซ้ำในหลาย epic",
  ]
};


// ---------- register into multi-epic registry ----------
window.NCBS_EPICS = window.NCBS_EPICS || {};
window.NCBS_EPICS['landing-cms-recommendation'] = {
  id: 'landing-cms-recommendation',
  system: 'NCBS',
  name: 'Landing Pages / CMS / Recommendation',
  thaiName: 'หน้า Landing / ระบบจัดการเนื้อหา / คำแนะนำส่วนบุคคล',
  status: 'Phase 2-3 — แทบไม่มี spec รองรับ',
  epicDeps: LANDING_CMS_RECOMMENDATION_DATA.epicDeps,
  features: LANDING_CMS_RECOMMENDATION_DATA.features,
  priority: LANDING_CMS_RECOMMENDATION_DATA.priority,
  flags: LANDING_CMS_RECOMMENDATION_DATA.flags,
};
