// NCBS Breakdown — Strategic Gaps (Unspecced) epic data
// 4 รายการนี้ระบุเป็น "Critical/Highest Risk Gap" ใน gap-vs-sprint-cross-reference.md แต่ไม่มีอยู่ใน Sprint Plan จริงเลยแม้แต่บรรทัดเดียว
// ต่างจาก epic อื่น: นี่ไม่ใช่ "spec ที่ยังไม่ทำ" แต่คือ "ความต้องการที่ยังไม่ถูกแปลงเป็น spec เลย" — ต้องผ่าน Steering Committee decision ก่อน

const STRATEGIC_GAPS_DATA = {
  epicDeps: [
    { name:"Institution Structure & Master Data Epic", why:"Taxonomy Engine ต้องพึ่งโครงสร้างวิชา/หลักสูตร", blocker:false },
    { name:"Identity & Authentication Epic", why:"Federated SSO เป็นส่วนขยายของ authentication ที่มีอยู่", blocker:false },
    { name:"Credit Transfer Epic", why:"MOU Engine ต่อยอดจาก Credit Transfer Review ที่มี AI Match% อยู่แล้ว", blocker:false },
    { name:"Multi-Channel Data Ingestion Epic", why:"Segment C Manual Entry ทับซ้อนกับ Channel ที่ epic นั้นออกแบบไว้", blocker:false },
  ],
  features: [
    {
      id:"F1", name:"National Credit Taxonomy Engine",
      sources:["sources/gap-vs-sprint-cross-reference.md §3.3, §7, §8"],
      note:"🚨 severity สูงสุดตามที่เอกสารจัดอันดับไว้ — 'ไม่มีใน Sprint Plan' ทั้งที่ block API integration ของทุกมหาวิทยาลัย",
      tasks:[
        {id:"1.1", task:"Steering Committee ตัดสินใจ: PIM 6-code model vs Custom MHESI taxonomy vs Defer", desc:"", dep:"—", src:"gap-vs-sprint-cross-reference.md §8.1", c:"red", note:"เอกสารแนะนำ 'A→B' (เริ่ม PIM model แล้ว evolve เป็น MHESI standard) แต่ยังไม่มีมติจริง"},
        {id:"1.2", task:"Static mapping table เบื้องต้น (ใช้ PIM 6 codes: CE/CP/CS/CT/CX/CN)", desc:"", dep:"1.1", src:"gap-vs-sprint-cross-reference.md §7.1 Action 1", c:"yellow", note:"เอกสารประเมินหยาบไว้ 5-10 MD — เป็น T-shirt size ไม่ใช่ breakdown ละเอียด"},
        {id:"1.3", task:"Mapping UI/Workflow ให้มหาวิทยาลัย map หลักสูตรตัวเอง", desc:"", dep:"1.2", src:"gap-vs-sprint-cross-reference.md §3.3 (Effort: XL)", c:"red", note:"ไม่มี UI นี้เลยแม้แต่แบบร่าง"},
        {id:"1.4", task:"Evolve เป็น National Taxonomy มาตรฐานเต็มรูปแบบ", desc:"", dep:"1.3", src:"gap-vs-sprint-cross-reference.md §8.1", c:"red", note:"long-term — ไม่ใช่ Phase 1/2"},
      ]
    },
    {
      id:"F2", name:"Federated SSO / Multi-IDP Bridge",
      sources:["sources/gap-vs-sprint-cross-reference.md §3.3, §7.2, §7.4"],
      tasks:[
        {id:"2.1", task:"ออกแบบ architecture สำหรับ LDAP/AD/NDID/ICEHR bridge", desc:"3 มหาวิทยาลัยหลักต้องการ: Chula(NDID)/PIM(AD)/TU(ICEHR)", dep:"Identity & Auth Epic F3", src:"gap-vs-sprint-cross-reference.md §7.2 Action 8", c:"red", note:"เสนอให้ 'ออกแบบ architecture ก่อน implement ทีหลัง' — เป็น medium-term (Q3-Q4) ไม่ใช่เร่งด่วน"},
        {id:"2.2", task:"Defer การ implement จริงจนกว่าจะมี 5+ มหาวิทยาลัยต้องการ", desc:"", dep:"2.1", src:"gap-vs-sprint-cross-reference.md §7.4 What NOT to Build", c:"green", note:"เป็นการตัดสินใจไม่ทำตอนนี้ที่มีเหตุผลชัดเจน (ปัจจุบันมีแค่ 2-3 ม.) — เอกสารระบุ 'ThaiID เพียงพอ' สำหรับตอนนี้"},
      ]
    },
    {
      id:"F3", name:"MOU Rule-Based Transfer Engine",
      sources:["sources/gap-vs-sprint-cross-reference.md §3.3, §7.2"],
      tasks:[
        {id:"3.1", task:"เพิ่ม MOU configuration rules ต่อยอดจาก Credit Transfer Review (#7)", desc:"ที่มี AI Match % อยู่แล้ว", dep:"Credit Transfer Epic F2", src:"gap-vs-sprint-cross-reference.md §7.2 Action 5", c:"red", note:"ไม่มีใน Sprint Plan เลย — closest feature คือ Credit Transfer Review ที่เป็น criteria-based ไม่ใช่ MOU-based"},
        {id:"3.2", task:"รองรับ TU Transfer Consortium + SUT MOU Network + PIM cross-institution", desc:"", dep:"3.1", src:"gap-vs-sprint-cross-reference.md §3.3", c:"red", note:"Effort: L ตามประเมินหยาบ"},
      ]
    },
    {
      id:"F4", name:"Segment C Turnkey SaaS (BRU + ราชภัฏ 70+ ในอนาคต)",
      sources:["sources/gap-vs-sprint-cross-reference.md §5.3, §7"],
      note:"🔴🔴 severity สูงสุด (double-red) — 'Sprint Plan ไม่มี Turnkey Mode' เลย — Sprint Plan ทั้งหมดออกแบบสำหรับ ม. ที่มีระบบอยู่แล้ว (Segment A)",
      tasks:[
        {id:"4.1", task:"Manual Entry UI (MVP สำหรับ Segment C)", desc:"1-2 หน้าง่ายๆ สำหรับข้อมูลนักศึกษา/ผลการเรียน", dep:"Multi-Channel Data Ingestion Epic", src:"gap-vs-sprint-cross-reference.md §7.1 Action 4", c:"yellow", note:"ประเมินหยาบ 3-5 MD — เป็น quick win ที่แนะนำให้ทำก่อน (Q2 2026)"},
        {id:"4.2", task:"University Self-Assessment Portal (ใช้ Google Form/Sheet)", desc:"0 MD — ไม่ต้องสร้างระบบ", dep:"—", src:"gap-vs-sprint-cross-reference.md §7.3 Action 10", c:"green", note:"ข้อเสนอที่ฉลาด — ลด effort จาก 30-50 MD เหลือ 0 โดยใช้เครื่องมือสำเร็จรูป"},
        {id:"4.3", task:"Full UCBS CMS + Portal (Zero-IT mode)", desc:"", dep:"4.1, 4.2", src:"gap-vs-sprint-cross-reference.md §5.3, §7.3 Action 9", c:"red", note:"long-term (2027+) — ยังไม่มี design ใดๆ นอกจากคำแนะนำระดับ direction"},
        {id:"4.4", task:"Training + onboarding system (ไม่มีบุคลากรพร้อม)", desc:"", dep:"4.3", src:"gap-vs-sprint-cross-reference.md §5.3", c:"red"},
        {id:"4.5", task:"Full Workflow Automation (ปัจจุบัน Manual 100%)", desc:"", dep:"4.3", src:"gap-vs-sprint-cross-reference.md §5.3", c:"red"},
      ]
    },
  ],
  priority: [
    "<b>1.1 (Steering Committee decision บน Taxonomy)</b> — สำคัญที่สุดเพราะ block API integration ของทุกมหาวิทยาลัย ควร escalate ก่อนเรื่องอื่นในเอพิคนี้",
    "<b>4.1, 4.2 (Segment C quick wins)</b> — ตามคำแนะนำ Q2 2026 ทำได้เร็วและถูก (Google Form = 0 MD) ควรทำก่อนของใหญ่",
    "<b>2.2 (defer Federated SSO)</b> — เป็นการตัดสินใจไม่ทำที่มีเหตุผลรองรับ ไม่ต้อง priority สูง",
    "<b>F3 (MOU Engine)</b> — medium-term (Q3-Q4) ตามคำแนะนำ",
    "<b>4.3-4.5 (Full Turnkey SaaS)</b> — long-term (2027+) ไม่ควร estimate ละเอียดตอนนี้ เป็นแค่ direction",
  ],
  flags: [
    "<b>ทั้ง epic นี้คือ 'requirement ที่ยังไม่แปลงเป็น spec' ไม่ใช่ 'spec ที่ยังไม่ build'</b> — ต่างจาก epic อื่นๆ ส่วนใหญ่ในชุดนี้ที่อย่างน้อยมี draft spec ระดับหนึ่ง — 4 รายการนี้มีแค่ระดับ 'gap identified + คำแนะนำหยาบ' ต้องผ่าน design/discovery phase เต็มรูปก่อนถึงจะ breakdown ละเอียดได้จริง",
    "<b>Taxonomy Engine + Segment C SaaS = 2 รายการ severity สูงสุดในทั้ง Phase 1 inventory</b> — ควร raise เข้า Steering Committee โดยเร็ว เพราะเอกสารต้นทางเองก็จัดเป็น '🚨 Highest' risk",
    "<b>ตัวเลข effort ที่ให้มา (5-10 MD, 3-5 MD ฯลฯ) เป็นแค่ T-shirt sizing หยาบ</b> — ไม่ใช่ breakdown ระดับ task/subtask แบบ epic อื่น ห้ามใช้ตัวเลขนี้เป็น commitment ตรงๆ",
    "<b>มี 'What NOT to Build' guidance ชัดเจนอยู่แล้ว</b> — full search engine, identity bridge ก่อนมี 5+ ม.ต้องการ, AI recommendation engine — ทีมควรเคารพคำแนะนำนี้ ไม่ over-invest ก่อนเวลาอันควร",
  ]
};


// ---------- register into multi-epic registry ----------
window.NCBS_EPICS = window.NCBS_EPICS || {};
window.NCBS_EPICS['strategic-gaps'] = {
  id: 'strategic-gaps',
  system: 'NCBS',
  name: 'Strategic Gaps (Unspecced)',
  thaiName: 'ช่องว่างเชิงกลยุทธ์ที่ยังไม่มีสเปค',
  status: 'Critical gap — ไม่มีใน Sprint Plan เลย รอ Steering Committee ตัดสินใจ',
  epicDeps: STRATEGIC_GAPS_DATA.epicDeps,
  features: STRATEGIC_GAPS_DATA.features,
  priority: STRATEGIC_GAPS_DATA.priority,
  flags: STRATEGIC_GAPS_DATA.flags,
};
