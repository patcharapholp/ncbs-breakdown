// NCBS Breakdown — Credit Transfer epic data
// แก้ไขไฟล์นี้เพื่ออัปเดต task breakdown (Claude Code แก้ตรงนี้ได้โดยตรง)
// โครงสร้าง: epicDeps / features[].tasks[].subs / priority / flags

const CREDIT_TRANSFER_DATA = {
  epicDeps: [
    { name:"Identity & Auth (ThaID e-KYC, Officer/Admin login)", why:"Learner ต้อง login ก่อนยื่นคำร้อง, Officer ต้อง login ก่อน review", blocker:false },
    { name:"Institution Structure & Master Data (course/curriculum/CLO)", why:"Matching Engine ต้องมี course spec ปลายทางถึงจะคำนวณได้", blocker:false },
    { name:"Role & Access Management (RBAC/ABAC)", why:"Officer role, RPL Committee role, faculty-scope", blocker:false },
    { name:"Notification Service (shared infra)", why:"ทุก state transition ต้อง trigger แจ้งเตือน", blocker:false },
    { name:"Payment Gateway procurement (ภายนอก)", why:"🔴 ยังเป็น Regulatory Blocker ระดับ Prime PM (ดู Feature 3)", blocker:true },
    { name:"Blockchain Infra", why:"🔴 แยก track, Prime PM ระบุอยู่ในงวด 4 (ยังไม่เริ่ม)", blocker:true },
    { name:"NCBS↔UCBS Integration", why:"credit sync หลัง approve ต้องพึ่ง integration contract", blocker:false },
  ],
  features: [
    {
      id:"F1", name:"Learner Request Submission (3 ประเภทการเรียนรู้ + N:1)",
      sources:["decisions/scr-006-learner-transfer-lifecycle.md","decisions/scr-010-n1-course-mapping.md"],
      tasks:[
        {id:"1.1", task:"โครงสร้างข้อมูลคำร้องขอเทียบโอนหน่วยกิต (Learner Request Submission - Data Structure)", desc:"ออกแบบ schema รองรับ sources[] array (N:1), learning_type, path, status", dep:"Data Foundation (course/credit schema)", src:"embedded-formulas-spec.md §3, scr-010", c:"green",
          subs:[
            {id:"1.1.1", task:"แผนภาพโครงสร้างฐานข้อมูลและสคริปต์ปรับปรุงฐานข้อมูล (Learner Request Submission - Database Migration)", desc:"", dep:"1.1", src:"", c:"green"},
            {id:"1.1.2", task:"ทดสอบกฎความถูกต้องของข้อมูล เช่น หน่วยกิตเป้าหมายต้องไม่น้อยกว่าที่ได้รับ (Learner Request Submission - Data Validation Test)", desc:"", dep:"1.1", src:"", c:"green"},
          ]},
        {id:"1.2", task:"API ยื่นคำร้องแบบทางการ พร้อมจับคู่วิชาอัตโนมัติ (Learner Request Submission - Auto-Match Submission API)", desc:"เลือก source (หลายวิชาได้) + target → trigger matching engine", dep:"1.1, Feature 2", src:"scr-006 UC-CTP-LER-03", c:"green",
          subs:[
            {id:"1.2.1", task:"กฎห้ามนำวิชาที่เทียบโอนมาแล้วไปเทียบโอนต่อ (Learner Request Submission - Business Rule)", desc:"", dep:"1.2, Feature 4 (G1)", src:"transfer-approval-detail-spec-draft.md §5.4", c:"green"},
          ]},
        {id:"1.3", task:"API ยื่นคำร้องแบบทางการ กรอกข้อมูลเอง (Learner Request Submission - Manual Submission API)", desc:"กรอกเองเมื่อไม่มีข้อมูล auto-match", dep:"1.1", src:"scr-006 UC-CTP-LER-03", c:"yellow", note:"field list ไม่ระบุ"},
        {id:"1.4", task:"API ยื่นคำร้องสำหรับการเรียนรู้นอกระบบ พร้อมแปลงชั่วโมงเป็นหน่วยกิต (Learner Request Submission - Non-formal Submission API)", desc:"ชื่อวิชา/แหล่งเรียนรู้/ผลการศึกษา + แปลงชั่วโมง→หน่วยกิต (15ชม.บรรยาย=1นก., 30ชม.ปฏิบัติ=1นก.)", dep:"1.1, evidence upload (1.7)", src:"matching-algorithm-spec.md §8.2", c:"green"},
        {id:"1.5", task:"API ยื่นคำร้องสำหรับประสบการณ์ตรง/เทียบโอนความรู้ RPL (Learner Request Submission - RPL Submission API)", desc:"ประสบการณ์ + portfolio, ไม่มี auto-score", dep:"1.1, Feature 5", src:"scr-006 UC-CTP-LER-05", c:"yellow", note:"RPL checklist ยังไม่ออกแบบ"},
        {id:"1.6", task:"หน้าจอเลือกประเภทการเรียนรู้พร้อมเตือนเมื่อเปลี่ยนกลางฟอร์ม (Learner Request Submission - Type Selector UI)", desc:"", dep:"1.2–1.5", src:"scr-006", c:"green"},
        {id:"1.7", task:"อัปโหลดไฟล์หลักฐานประกอบคำร้อง เช่น transcript/certificate (Learner Request Submission - Evidence Upload)", desc:"storage + validation", dep:"Service Foundation (storage backend)", src:"BR-CTP-01", c:"yellow", note:"ไม่มีสเปค storage backend/limit ที่ไหนใน wiki"},
      ]
    },
    {
      id:"F2", name:"Course Matching Algorithm Engine",
      sources:["decisions/2026-07-course-matching-algorithm-spec.md (สมบูรณ์ที่สุดในทั้ง repo — มี 10 test case คำนวณให้)"],
      note:"§11 ของ spec เขียนกันเผื่อเสนอ \"แผน B ใช้ LLM แทน\" — เป็นทางเลือกอนาคตถ้ามีดริฟท์ ไม่ต้อง estimate รอบนี้ (ทีมเสนอเองว่าใช้แผน A/Deterministic ก่อน)",
      tasks:[
        {id:"2.1", task:"ข้อมูลหลักคำกริยาระดับการเรียนรู้และคำพ้องความหมาย (Matching Engine - Master Data)", desc:"", dep:"—", src:"§3, §10", c:"yellow", note:"เจ้าภาพวิชาการยังไม่กำหนด (open item)"},
        {id:"2.2", task:"ระบบตัดคำภาษาไทย/อังกฤษเพื่อวิเคราะห์เนื้อหารายวิชา (Matching Engine - Text Tokenization)", desc:"normalize + PyThaiNLP newmm segmentation", dep:"2.1", src:"§3", c:"green", note:"ระบุ library ชัดเจน"},
        {id:"2.3", task:"ระบบคำนวณความคล้ายคลึงของเนื้อหารายวิชา (Matching Engine - Similarity Calculation)", desc:"ต้อง max ต่อหัวข้อแบบ pairwise ห้ามunion รวม (spec เตือนไว้ตรงๆ ว่าเคยผิด)", dep:"2.2", src:"§2.1, §3", c:"green",
          subs:[{id:"2.3.1", task:"ชุดทดสอบยืนยันผลคำนวณตรงกับกรณีทดสอบมาตรฐาน (Matching Engine - Regression Test Suite)", desc:"", dep:"2.3", src:"§8", c:"green"}]},
        {id:"2.4", task:"คำนวณคะแนนรวมความเหมาะสมของการเทียบโอน 4 มิติ (Matching Engine - Composite Scoring)", desc:"", dep:"2.3", src:"§2, §5", c:"green", note:"สูตร+ตัวอย่างครบ"},
        {id:"2.5", task:"กฎกันวิชาที่เกรดต่ำกว่าเกณฑ์ไม่ให้เทียบโอนได้ (Matching Engine - Grade Threshold Gate)", desc:"เกรดต้นทางต่ำกว่าเกณฑ์ → block (นอกสูตรคะแนน)", dep:"2.4", src:"§4", c:"yellow", note:"ขัดกับ 4.6 — คู่ flag ด้านล่าง"},
        {id:"2.6", task:"ระบบรวมเนื้อหาจากหลายวิชาต้นทางเข้าวิชาปลายทางเดียว (Matching Engine - Multi-Source Coverage)", desc:"union หัวข้อ/CLO ทุก source ก่อนคำนวณ, grade gate เช็คทุก source", dep:"2.3, 2.4, 1.2", src:"embedded-formulas §3, scr-010", c:"green"},
        {id:"2.7", task:"ตั้งค่าน้ำหนักคะแนนและช่วงเกณฑ์ได้ต่อสถาบัน (Matching Engine - Configurable Scoring Weights)", desc:"validate รวม=100 + audit log", dep:"2.4, Role/Institution Config", src:"§2, §6", c:"green"},
        {id:"2.8", task:"ระบบคำนวณคะแนนสำรองเมื่อข้อมูลไม่ครบ (Matching Engine - Fallback Scoring Ladder)", desc:"ห้ามโชว์ % เมื่อข้อมูลไม่พอ", dep:"2.4, master-data data_state", src:"§5", c:"green"},
        {id:"2.9", task:"บันทึกประวัติการคำนวณความคล้ายคลึงของแต่ละคู่วิชา (Matching Engine - Similarity Audit Log)", desc:"", dep:"2.3", src:"§3", c:"green"},
        {id:"2.10", task:"สร้างข้อความอธิบายผลการจับคู่จากแม่แบบที่กำหนดไว้ (Matching Engine - Insight Message Generator)", desc:"", dep:"2.4, 2.9", src:"§7", c:"green"},
        {id:"2.11", task:"แบบตรวจสอบสำหรับประเมินประสบการณ์ตรง/การเรียนรู้นอกระบบ (Matching Engine - RPL Checklist Module)", desc:"", dep:"1.5", src:"§8.3, §10", c:"red", note:"ระบุเป็น open item ตรงๆ — ยังไม่มีดีไซน์"},
        {id:"2.12", task:"ทดสอบสูตรคำนวณกับข้อมูลจริงที่สถาบันนำร่องเคยอนุมัติ (Matching Engine - Formula Validation)", desc:"", dep:"2.4, ground-truth data (ภายนอก)", src:"§9.3", c:"yellow", note:"ไม่มีแผนว่าใครประสานเก็บข้อมูล"},
      ]
    },
    {
      id:"F3", name:"Payment (2 จุด, QR PromptPay, Dynamic Fee)",
      sources:["concepts/payment-flow.md","decisions/2026-07-payment-gateway-fee-spec-draft.md"],
      tasks:[
        {id:"3.1", task:"โครงสร้างข้อมูลและหน้าตั้งค่าค่าธรรมเนียมต่อสถาบัน (Payment - Institution Fee Configuration)", desc:"toggle op/transfer fee, sub-items, fee basis (flat/perCredit/perCourse+extraItems), config snapshot versioning", dep:"Institution Structure Epic", src:"payment-flow.md", c:"green"},
        {id:"3.2", task:"เชื่อมต่อชำระเงินผ่าน QR PromptPay 2 จุดในขั้นตอน (Payment - QR PromptPay Integration)", desc:"", dep:"3.1, Payment Gateway ภายนอก", src:"payment-flow.md, transfer-state-machine §3.1", c:"red", note:"Regulatory Blocker — money-flow model (Centralized vs Direct Routing ผ่าน KTB/DGA) ยังไม่เคาะระดับ Prime PM (ติด พ.ร.บ.วินัยการเงินการคลัง + PSP license)"},
        {id:"3.3", task:"คำนวณค่าธรรมเนียมเกตเวย์ชำระเงินเพิ่มเติม (Payment - Gateway Fee Surcharge)", desc:"", dep:"3.2", src:"payment-gateway-fee-spec-draft.md §2.2, §6", c:"yellow", note:"Model A/B ยังไม่เคาะ + ผูกกับ blocker เดียวกับ 3.2"},
        {id:"3.4", task:"สถานะรอชำระเงินค้างไว้ ไม่ยกเลิกอัตโนมัติ (Payment - Payment Hold State)", desc:"ไม่จ่าย = ค้าง ไม่ auto-cancel", dep:"3.2, Feature 6", src:"transfer-state-machine §3.1", c:"green"},
        {id:"3.5", task:"โอนเงินให้สถาบันหลังหักค่าธรรมเนียม (Payment - Institution Settlement)", desc:"ต้องมี Bank Code/Biller ID/Merchant ID ต่อสถาบัน", dep:"3.1, 3.2", src:"payment-gateway-fee-spec-draft §8.3", c:"yellow", note:"field ต้อง audit ให้ครบ"},
        {id:"3.6", task:"ออกใบเสร็จรับเงินพร้อมรายการภาษีมูลค่าเพิ่ม (Payment - Receipt Generation)", desc:"", dep:"3.3", src:"§2.4, §4", c:"yellow", note:"VAT treatment ของ gateway fee รอฝ่ายเงินยืนยัน"},
      ]
    },
    {
      id:"F4", name:"UCBS Officer Review & Multi-Level Approval",
      sources:["concepts/approval-workflow.md","decisions/scr-008-multilevel-approval-chain.md","decisions/2026-07-transfer-approval-detail-spec-draft.md"],
      tasks:[
        {id:"4.1", task:"คิวงานตรวจสอบคำร้องสำหรับเจ้าหน้าที่ พร้อมค้นหา/กรอง (Officer Review - Review Queue)", desc:"", dep:"Feature 1, Role & Access Epic", src:"approval-workflow.md Step1", c:"green"},
        {id:"4.2", task:"หน้าตรวจสอบและอนุมัติคำร้องเป็นรายวิชา (Officer Review - Course Review Page)", desc:"approve/reject ต่อ item + comment", dep:"4.1, Feature 2", src:"approval-workflow.md Step2-3", c:"green"},
        {id:"4.3", task:"ให้หน่วยกิตบางส่วนและปรับเกรดพร้อมระบุวิธีประเมิน (Officer Review - Partial Credit Award)", desc:"awardedCredits ≤ targetCredits, awardedGrade, assessmentMethod enum", dep:"4.2", src:"transfer-approval-detail-spec-draft.md §3.1", c:"yellow", note:"6 open question ยังไม่เคาะ (notation เกรด, หน่วยกิตจัดการยังไง, scope เฟสไหนก่อน)"},
        {id:"4.4", task:"ทำเครื่องหมายที่มาของหน่วยกิต กันเทียบโอนซ้ำ และไม่นับใน GPAX (Officer Review - Credit Origin Tracking)", desc:"origin, reTransferable, countInGpax", dep:"4.3, Credit Record schema", src:"§G1/G2, §5 rule 4-5", c:"green", note:"validation rule ชัดเจน"},
        {id:"4.5", task:"ติดตามเพดานหน่วยกิตที่เทียบโอนได้ตามระดับการศึกษา (Officer Review - Credit Ceiling Tracking)", desc:"running total + warn/override+log", dep:"4.3", src:"§G3, §5 rule 3", c:"yellow", note:"hard-block vs warn+override ยังไม่เคาะ"},
        {id:"4.6", task:"กฎเกณฑ์เกรดขั้นต่ำแยกตามระดับการศึกษา (Officer Review - Academic Level Grade Gate)", desc:"", dep:"4.3", src:"§G4", c:"yellow", note:"ขัดกับ 2.5 — spec คนละฉบับให้ threshold ไม่ตรงกัน ต้อง reconcile"},
        {id:"4.7", task:"ระบบอนุมัติหลายขั้นตอนโดยคณะกรรมการ ตั้งค่าได้ 1-5 ขั้น (Committee Approval - Multi-Level Approval Engine)", desc:"", dep:"Role & Access Epic, 4.2", src:"scr-008", c:"red", note:"ยัง proposed, SCR เองระบุ \"อาจต้อง Phase 2 ถ้า effort สูง\" — Critical priority ตาม Focus Group แต่ scope/timeline ยังไม่ตัดสินใจ"},
        {id:"4.8", task:"หน้าตั้งค่าลำดับขั้นการอนุมัติของคณะกรรมการ (Committee Approval - Chain Configuration UI)", desc:"", dep:"4.7", src:"scr-008 FR-UCBS-APR-NEW-A", c:"red"},
        {id:"4.9", task:"อนุมัติด่วนสำหรับคู่วิชาที่เคยอนุมัติมาก่อนแล้ว (Committee Approval - Fast-Track Approval)", desc:"", dep:"4.7", src:"scr-008, 2026-07-fasttrack-autopair-spec-draft.md", c:"red", note:"doc เขียนตรงๆ \"รอเคาะ 5 คำถามก่อน implement\""},
        {id:"4.10", task:"ติดตามระยะเวลาดำเนินการและแจ้งเตือนเมื่อล่าช้าแต่ละขั้น (Committee Approval - SLA Tracking & Escalation)", desc:"", dep:"4.7", src:"scr-008 FR-UCBS-APR-NEW-C", c:"yellow"},
        {id:"4.11", task:"ขั้นตอนขอเอกสารเพิ่มเติมพร้อมปฏิเสธอัตโนมัติเมื่อเกินกำหนด (Officer Review - Document Request Sub-flow)", desc:"7/15/30 วัน, countdown, auto-reject", dep:"4.2, Feature 6", src:"transfer-state-machine §3.2", c:"green"},
        {id:"4.12", task:"บันทึกร่างผลการตรวจสอบไว้ทำต่อภายหลัง (Officer Review - Save Draft Review)", desc:"", dep:"4.2", src:"approval-workflow.md Step5", c:"green"},
      ]
    },
    {
      id:"F5", name:"RPL Committee Review (Informal Learning)",
      sources:[],
      tasks:[
        {id:"5.1", task:"มอบหมายคณะกรรมการประเมิน RPL ตรวจอิสระอย่างน้อย 2 คน (RPL Committee Review - Committee Assignment)", desc:"เสียงเท่ากัน → จนท. ชี้ขาด, เป้า 10-15 วันทำการ", dep:"Role & Access Epic, 1.5", src:"transfer-state-machine §3.4", c:"green"},
        {id:"5.2", task:"หน้าจอแบบตรวจประเมินประสบการณ์ตรงสำหรับกรรมการ (RPL Committee Review - Evaluation Checklist UI)", desc:"", dep:"2.11", src:"matching-algorithm-spec UC-I1/I2", c:"red", note:"checklist ยังไม่ออกแบบ"},
        {id:"5.3", task:"กฎตัดสินเมื่อกรรมการให้ความเห็นไม่ตรงกัน (RPL Committee Review - Tie-Break Resolution)", desc:"", dep:"5.1", src:"§3.4", c:"green"},
      ]
    },
    {
      id:"F6", name:"Transfer State Machine, Tracking & Notifications",
      sources:["decisions/2026-07-transfer-state-machine.md — เอกสารนี้ถูกเขียนขึ้นเป็น \"single source สำหรับ dev\" โดยเฉพาะ ชัดเจนที่สุดในทั้ง epic"],
      tasks:[
        {id:"6.1", task:"ระบบควบคุมสถานะคำร้องเทียบโอนทั้ง 8 สถานะ (State Machine - Core Engine)", desc:"implement transition table เต็ม", dep:"Feature 1, 3, 4 (ทุก action ที่ผลิต state)", src:"ทั้งไฟล์", c:"green"},
        {id:"6.2", task:"คำนวณสถานะสุดท้ายอัตโนมัติจากผลของแต่ละวิชา (State Machine - Terminal Status Calculation)", desc:"ห้าม officer set ตรงๆ", dep:"6.1", src:"§2", c:"green"},
        {id:"6.3", task:"ขั้นตอนยื่นคำร้องใหม่หลังถูกปฏิเสธ พร้อมดึงข้อมูลเดิมมากรอก (State Machine - Resubmit Flow)", desc:"", dep:"6.1, Feature 1", src:"§3.7", c:"green"},
        {id:"6.4", task:"การแจ้งเตือนอัตโนมัติเมื่อสถานะเปลี่ยนแปลง 5 กรณี (State Machine - Notification Triggers)", desc:"status change / docs-deadline 3 วัน / SLA officer / institution below-threshold / bulk-import", dep:"6.1, Notification Epic (shared), scr-002/003", src:"embedded-formulas §4", c:"green", note:"ระบุเป็น \"เสนอขั้นต่ำ\" — ควร confirm final list กับ PM"},
        {id:"6.5", task:"แดชบอร์ดประวัติการเทียบโอนของผู้เรียน (State Machine - Transfer History Dashboard)", desc:"", dep:"6.1", src:"scr-006, FR-CTP-REQ-06", c:"green", note:"แต่ SCR ยังไม่ merge เข้า SRS จริง"},
      ]
    },
    {
      id:"F7", name:"Credit Sync (NCBS) + Blockchain Anchoring",
      sources:[],
      tasks:[
        {id:"7.1", task:"ซิงค์หน่วยกิตที่อนุมัติแล้วเข้าระบบ UCBS อัตโนมัติ (Credit Sync - UCBS Sync)", desc:"", dep:"Feature 4 complete", src:"BR-CTP-05, credit-record.md", c:"green"},
        {id:"7.2", task:"ซิงค์ข้อมูลจาก UCBS เข้าสู่ระบบกลาง NCBS อัตโนมัติ (Credit Sync - NCBS Central Sync)", desc:"", dep:"7.1, NCBS-UCBS Integration Epic", src:"systems/ncbs-platform.md", c:"yellow", note:"contract detail อยู่นอก epic นี้"},
        {id:"7.3", task:"บันทึกหลักฐานการเทียบโอนลงบล็อกเชนแบบเป็นชุด (Credit Sync - Blockchain Anchoring)", desc:"", dep:"7.1, Blockchain Infra Epic", src:"transfer-state-machine §3.6, 2026-07-blockchain-anchoring-spec-draft.md", c:"red", note:"ไม่ควรเริ่ม — chain tech (Fabric vs Oracle Blockchain Table hybrid) ยังไม่เคาะ, Prime PM ระบุ blockchain dev อยู่งวด 4"},
        {id:"7.4", task:"ระบบหลังบ้านออกใบรับรองและหน้าตรวจสอบสาธารณะ (Credit Sync - Verify Token Backend)", desc:"token→DB→SHA-256 vs anchor→4 status", dep:"7.3", src:"embedded-formulas §2", c:"green", note:"spec ชัด แต่ถูก block โดย 7.3"},
      ]
    },
  ],
  priority: [
    "<b>6.1</b> State machine core — ทุก feature เขียนลง state นี้ก่อนสุด",
    "<b>1.x</b> Submission (Formal Auto-match + Non-formal) — ตัด Manual(1.3)/Informal(1.5) ไว้ก่อนเพราะ spec ไม่นิ่ง",
    "<b>2.1–2.4</b> Matching Engine core — ก่อน N:1(2.6)/fallback(2.8)/RPL(2.11)",
    "<b>4.1–4.2</b> Officer review พื้นฐาน — ก่อน award-detail(4.3-4.6) ก่อน Committee Chain(4.7+)",
    "<b>3.1</b> Payment config ทำคู่ขนานได้ — แต่ 3.2 เป็นต้นไปติด Regulatory Blocker ห้ามเริ่ม build จนกว่าจะเคาะ",
    "<b>6.4</b> Notification ต้องรอ Notification Foundation (cross-epic)",
    "<b>Feature 7</b> (Sync+Blockchain) ทำท้ายสุด — และควรแยก blockchain sub-part ออกเป็นคนละ estimate/phase",
  ],
  flags: [
    "<b>Grade gate ขัดกัน</b> — course-matching-algorithm-spec.md ใช้เกณฑ์เดียว \"≥C (2.00)\" ทุกระดับ ส่วน transfer-approval-detail-spec-draft.md (อ้างอิงประกาศ กมอ. 2565 ตรงตัวกว่า) แยก 2.00(ป.ตรี)/3.00(บัณฑิต) — ต้องเลือก 1 ฉบับเป็น canonical ก่อน dev เขียน 2.5 และ 4.6",
    "<b>Payment money-flow = Regulatory Blocker ระดับโครงการ</b> ไม่ใช่แค่ spec gap — ต้องรอ Prime PM (ธปท./PSP license) ยังไม่ confirmed — จะกระทบ estimate ของ Feature 3 ทั้งก้อน",
    "<b>SCR-008 (Multi-level Approval Chain)</b> — Critical priority จาก Focus Group ทุกสถาบันยืนยัน แต่ตัว SCR เองยังเป็น proposed และเขียนไว้ตรงๆ ว่า \"อาจต้อง Phase 2 ถ้า effort สูง\" — scope decision ใหญ่ที่กระทบ timeline ทั้ง epic",
    "<b>Fast-track (4.9)</b> — มี spec draft แยกแต่เขียนตรงว่า \"รอเคาะ 5 คำถามก่อน implement\" — อย่าเพิ่ง estimate",
    "<b>Blockchain anchoring (7.3/7.4)</b> — ยัง draft, เทคโนโลยียังไม่เคาะ, และ Prime PM วางไว้งวด 4 — แนะนำแยกออกจาก estimate ของ Credit Transfer MVP",
    "<b>RPL/Informal checklist (2.11, 5.2)</b> — ไม่มีดีไซน์เลย เป็นแค่ \"ต้องออกแบบ\" — ต้องมี design task ก่อนถึงจะ estimate dev ได้",
    "<b>N:1 validation methodology (2.12)</b> — ไม่มีแผนว่าใครประสานเก็บ ground-truth data จากมหาวิทยาลัยนำร่อง",
    "<b>Formal Path B Manual (1.3)</b> — field list ไม่ระบุ",
    "<b>Evidence file storage (1.7)</b> — ไม่มีสเปค storage backend ที่ไหนเลยในทั้ง wiki (ปัญหาข้าม epic — Foundation gap)",
    "<b>สถานะ SRS จริง</b> — SCR-006/008/009/010/013 ทั้งหมดยังเป็น draft delta ในวิกิ ไม่เคยถูก merge เข้า SRS ฉบับจริง — ควรมี BA/PO sign-off ก่อน ไม่ใช่แค่ wiki draft",
  ]
};


// ---------- register into multi-epic registry ----------
window.NCBS_EPICS = window.NCBS_EPICS || {};
window.NCBS_EPICS['credit-transfer'] = {
  id: 'credit-transfer',
  system: 'CTP',
  name: 'Credit Transfer',
  thaiName: 'การเทียบโอนหน่วยกิต',
  status: 'Data/Service Foundation เริ่มพัฒนาบางส่วน · business logic ยังไม่เริ่มพัฒนาเต็มรูปแบบ',
  epicDeps: CREDIT_TRANSFER_DATA.epicDeps,
  features: CREDIT_TRANSFER_DATA.features,
  priority: CREDIT_TRANSFER_DATA.priority,
  flags: CREDIT_TRANSFER_DATA.flags,
};
