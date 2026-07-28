// NCBS Breakdown — Blockchain & Credential Verification epic data
// Prime PM scope ยืนยัน: Blockchain Dev อยู่งวด 4 (ยังไม่เริ่ม) — ทั้ง epic นี้ควรถือเป็น "ยังไม่ควรเริ่ม build จริง" จนกว่าจะถึงงวดนั้น
// ⚠️ Credit Transfer Epic (F7.3/7.4) และ Learner Profile Epic (F7.2/F9.4) มี placeholder task ที่รอ epic นี้ปลดล็อก — ห้าม implement ซ้ำ 3 ที่

const BLOCKCHAIN_CREDENTIAL_DATA = {
  epicDeps: [
    { name:"Data & Service Foundation (Async backbone)", why:"Anchor worker ใช้ pattern Outbox+NATS เดียวกับที่ Foundation epic วางไว้", blocker:false },
    { name:"PDPA & Compliance Epic", why:"การ hash payload ที่มี PII (แม้ salted) ต้องผ่าน legal review เหมือน PDPA gap อื่น", blocker:false },
  ],
  features: [
    {
      id:"F1", name:"Blockchain Architecture Decision (Technical Workshop)",
      sources:["decisions/2026-07-blockchain-anchoring-spec-draft.md §5","concepts/blockchain-credentials.md Open Questions"],
      note:"⛔ ทุก feature อื่นในเอพิคนี้ (F2-F4) รอผลจากที่นี่ก่อน — เป็น blocker ตัวจริงของทั้งโดเมน ไม่ใช่แค่ priority ต่ำ",
      tasks:[
        {id:"1.1", task:"เลือก chain type", desc:"permissioned consortium (สถาบัน=node) vs อว. host เดี่ยว", dep:"—", src:"blockchain-anchoring-spec-draft.md §5.3, blockchain-credentials.md", c:"red", note:"ยังไม่เคาะ — แนวโน้มภาครัฐไทย = permissioned แต่เป็นแค่การคาดเดา ไม่ใช่มติ"},
        {id:"1.2", task:"เลือก Hyperledger flavor", desc:"Fabric / Besu / Sawtooth", dep:"1.1", src:"blockchain-credentials.md Open Questions", c:"red", note:"deck ก.ค. 69 เอียงไปทาง Fabric แต่ยังไม่ confirm"},
        {id:"1.3", task:"ตัดสินใจ node distribution", desc:"Fabric ≥4 nodes กระจายให้องค์กรไหนถือ (อว./UniNet/สถาบันนำร่อง?)", dep:"1.2", src:"blockchain-anchoring-spec-draft.md §5.4", c:"red", note:"ถ้า node ทั้งหมดอยู่ DC เดียวกัน = consensus เชิงพิธีกรรมเท่านั้น ไม่ได้ประโยชน์จริงของ multi-party — ต้องคิดให้รอบคอบ"},
        {id:"1.4", task:"ยืนยันการแบ่งหน้าที่ Fabric × Oracle Blockchain Table", desc:"Blockchain Table = ledger ละเอียดใน NCBS PDB · Fabric = การรับรองข้ามองค์กร (checkpoint)", dep:"1.2, 1.3", src:"blockchain-anchoring-spec-draft.md §3, §5.3", c:"red", note:"เป็น proposal จากฝั่ง design เท่านั้น รอ tech ยืนยันทิศทาง"},
        {id:"1.5", task:"Gas/transaction cost model", desc:"ใครจ่าย transaction cost", dep:"1.2", src:"blockchain-credentials.md Open Questions", c:"red", note:"ไม่เคยถูกตอบตั้งแต่ concept doc แรกสุด (เม.ย. 69)"},
      ]
    },
    {
      id:"F2", name:"Anchoring Pipeline",
      sources:["decisions/2026-07-blockchain-anchoring-spec-draft.md §1-2"],
      tasks:[
        {id:"2.1", task:"Candidate record priority list", desc:"1) verify_token(ตอน issue) 2) transfer_request(terminal approved/partial) 3) achievement/credit record(ตอน official) 4) เอกสารแนบ(hash)", dep:"F1", src:"blockchain-anchoring-spec-draft.md §1", c:"yellow", note:"เป็น proposal ตามลำดับความมั่นใจ — ข้อ 1 (verify_token) มั่นใจสูงสุด เสนอให้ทำก่อนแล้วขยาย"},
        {id:"2.2", task:"Async anchor worker (Outbox+NATS pattern)", desc:"event→outbox row→pending_anchor→worker consume→เขียน hash เข้า chain→อัปเดต anchor_tx_id+anchored_at", dep:"F1, Data & Service Foundation F5", src:"blockchain-anchoring-spec-draft.md §2", c:"green", note:"pattern เดียวกับที่ทีมจริงใช้อยู่แล้ว (Outbox+NATS) — ความเสี่ยง technical ต่ำ ต่างจาก F1 ที่เป็นเรื่อง decision"},
        {id:"2.3", task:"Granularity decision (per-record vs batch/Merkle root)", desc:"ปริมาณ 5.4M ผู้เรียน — ต้องประเมิน rows/วัน", dep:"F1, 2.1", src:"blockchain-anchoring-spec-draft.md §5.2", c:"red", note:"ยังไม่มีตัวเลขประเมินปริมาณจริง — มีผลกระทบ cost/performance มาก ควรทำ capacity estimate ก่อนเคาะ"},
        {id:"2.4", task:"Retry/idempotency + alert เมื่อ anchor ล้มถาวร", desc:"ผู้ใช้ไม่ต้องรอ chain — token ใช้ได้ทันทีแบบ pending_anchor", dep:"2.2", src:"blockchain-anchoring-spec-draft.md §2", c:"green"},
      ]
    },
    {
      id:"F3", name:"Verify Token Lifecycle Management",
      sources:["decisions/2026-07-prd-blc-draft.md §3","decisions/2026-07-embedded-formulas-spec.md §2"],
      tasks:[
        {id:"3.1", task:"Token issuance (learner-triggered)", desc:"public profile/e-transcript", dep:"F2.1, Learner Profile Epic F9", src:"prd-blc-draft.md §4", c:"green"},
        {id:"3.2", task:"Token TTL + revocation policy", desc:"default หมดอายุ (demo ใช้ 90 วัน — ไม่ confirm) + learner เพิกถอนเองได้", dep:"3.1", src:"prd-blc-draft.md §3", c:"yellow", note:"ค่า default ยังเป็นแค่ demo value ไม่ใช่มติจริง"},
        {id:"3.3", task:"Re-hash trigger เมื่อสถาบันแก้ข้อมูลย้อนหลัง", desc:"verify เดิม fail โดยตั้งใจ (by-design ไม่ใช่บั๊ก) → ขอเอกสารฉบับใหม่", dep:"3.1, F2.2", src:"prd-blc-draft.md §3, §4", c:"green", note:"design intent ชัดเจน"},
        {id:"3.4", task:"Rate limiting บน public verify endpoint", desc:"ไม่ login = เสี่ยง scrape", dep:"3.1, API Management Epic", src:"prd-blc-draft.md §3.5", c:"red", note:"ไม่มี SLA/ตัวเลข rate limit ระบุที่ไหน"},
      ]
    },
    {
      id:"F4", name:"Public Verification Page (Backend)",
      sources:["decisions/2026-07-embedded-formulas-spec.md §2","decisions/2026-07-blockchain-anchoring-spec-draft.md §4"],
      note:"UI/flow ถูก prototype ไว้แล้ว (verify.html) — ในนี้คือ backend จริงที่ยังไม่มี",
      tasks:[
        {id:"4.1", task:"Payload proof display backend", desc:"tx id, hash(SHA-256), timestamp, สถานะ pending/anchored", dep:"F2.2, F1", src:"blockchain-anchoring-spec-draft.md §4", c:"green", note:"spec ชัดเจนเมื่อ F1/F2 พร้อม"},
        {id:"4.2", task:"3-status resolution (ok/revoked/mismatch)", desc:"", dep:"4.1, Credit Transfer Epic F7.4", src:"embedded-formulas-spec.md §2", c:"green", note:"cross-ref Credit Transfer epic 7.4 — เป็นงานเดียวกัน อย่า implement ซ้ำ"},
        {id:"4.3", task:"PDPA-safe hashing", desc:"hash เฉพาะ salted normalized payload — ไม่เก็บ raw PII on-chain", dep:"4.1, PDPA & Compliance Epic", src:"blockchain-anchoring-spec-draft.md §5.7", c:"yellow", note:"proposed approach ที่ยังไม่ผ่าน legal review เหมือน PDPA gap อื่นในโครงการ (เช่น shadow record legal basis ใน Learner Identity Linking epic)"},
      ]
    },
    {
      id:"F5", name:"Scope Boundaries (Non-goals — Already Agreed)",
      sources:["decisions/2026-07-prd-blc-draft.md §5"],
      tasks:[
        {id:"5.1", task:"ยืนยัน non-goals ไว้เป็น guardrail", desc:"ไม่เก็บ PII on-chain · ไม่ใช่ cryptocurrency/token economy · ไม่แทน audit log ปกติ (เสริมกัน)", dep:"—", src:"prd-blc-draft.md §5", c:"green", note:"ตกลงกันแล้ว — ใช้กัน scope creep เวลามีคนเสนอ feature เกินขอบเขต"},
      ]
    },
  ],
  priority: [
    "<b>F1 (architecture decision)</b> — ต้องเคาะก่อนสุด ผ่าน Technical Workshop เท่านั้น ห้าม estimate หรือเริ่ม build feature อื่นก่อนมีมติ",
    "<b>F5 (non-goals)</b> — ล็อกไว้เป็น guardrail ตั้งแต่ต้น ทำได้ทันทีไม่ต้องรออะไร",
    "<b>2.2, 2.4 (anchor worker pattern)</b> — เตรียม infra pattern ล่วงหน้าได้ (reuse Outbox+NATS) แต่ยังต่อ chain จริงไม่ได้จนกว่า F1 จะเคาะ",
    "<b>F3, F4</b> — ทำ policy/UI-adjacent งานคู่ขนานได้ แต่ backend จริงรอ F1/F2",
    "<b>ทั้ง epic ควรจัดเป็นงวด 4 ตามที่ Prime PM วางไว้</b> — ไม่ควร pull เข้ามาทำเร็วกว่านั้น แม้ Credit Transfer/Learner Profile epic จะมี placeholder รอ",
  ],
  flags: [
    "<b>ทั้ง epic gated โดย F1 (8 open questions รวมกัน)</b> — chain type, Fabric flavor, node hosting, cost model, granularity, TTL default, rate limit, PDPA hashing approach ล้วนไม่มีคำตอบ — เป็น epic ที่ 'ยังไม่พร้อม estimate' มากที่สุดในบรรดา epic ทั้งหมดในเชิง architecture (แม้ user flow/UI จะ prototype ไว้ครบแล้วก็ตาม)",
    "<b>Duplication risk ข้าม 3 epic</b> — Credit Transfer (F7.3/7.4) และ Learner Profile (F7.2/F9.4) ต่างมี placeholder task รอ epic นี้ — ต้อง coordinate ให้ implement backend anchor/verify ที่เดียว (epic นี้) แล้วให้ epic อื่นแค่ consume ไม่ใช่ build ซ้ำ",
    "<b>Prime PM ยืนยัน Blockchain Dev = งวด 4</b> — เป็นสัญญาณระดับโครงการว่าไม่ควรดัน epic นี้เร็วกว่าที่วางแผนไว้ แม้จะมี pressure จาก feature อื่นที่รอ",
    "<b>Granularity/scale ยังไม่ประเมิน (2.3)</b> — 5.4M ผู้เรียน potential records ต้อง anchor เป็น batch/Merkle ไม่ใช่รายแถว แต่ไม่มีตัวเลข throughput/cost ประเมินไว้เลย ควรทำ capacity estimate ก่อนเข้า Technical Workshop",
  ]
};


// ---------- register into multi-epic registry ----------
window.NCBS_EPICS = window.NCBS_EPICS || {};
window.NCBS_EPICS['blockchain-credential'] = {
  id: 'blockchain-credential',
  system: 'NCBS',
  name: 'Blockchain & Credential Verification',
  thaiName: 'บล็อกเชนและการตรวจสอบหลักฐาน',
  status: 'งวด 4 ตาม Prime PM scope — architecture ยังไม่เคาะ (8 open question)',
  epicDeps: BLOCKCHAIN_CREDENTIAL_DATA.epicDeps,
  features: BLOCKCHAIN_CREDENTIAL_DATA.features,
  priority: BLOCKCHAIN_CREDENTIAL_DATA.priority,
  flags: BLOCKCHAIN_CREDENTIAL_DATA.flags,
};
