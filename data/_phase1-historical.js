// ============================================================================
// ⚠️ MOCK / โครงสร้างตัวอย่าง — Phase 1 (Data & Service Foundation) ที่ทำไปแล้ว
// ช่วงเวลาจริง: มกราคม 2026 – พฤษภาคม 2026
//
// ไฟล์นี้เป็น "static data" แยกจาก scenario ที่กรอกได้ใน Timeline & Planning —
// ไม่ผูกกับ Firestore เลย แก้ไขได้โดยตรงในไฟล์นี้เท่านั้น (เหมือนไฟล์ epic อื่นๆ)
// เพื่อเก็บบันทึกว่า Phase 1 ใช้ manday ไปเท่าไหร่ต่อ role ในแต่ละ feature
//
// วิธีใส่ข้อมูลจริง: แก้ epics/features ด้านล่างนี้ให้ตรงกับสิ่งที่ทำจริง แล้วอัปเดต
// data/manifest.json ให้รวมไฟล์นี้ด้วย (รัน update-manifest.sh อีกครั้ง)
// ============================================================================

window.NCBS_PHASE1_HISTORY = {
  periodStart: '2026-01-05',   // MOCK — แก้เป็นวันที่ Phase 1 เริ่มจริง
  periodEnd:   '2026-05-29',   // MOCK — แก้เป็นวันที่ Phase 1 จบจริง (หรือ "จนถึงตอนนี้" ถ้ายังไม่จบเป๊ะ)
  note: 'ตัวอย่างโครงสร้าง (mock) — รอข้อมูล manday จริงจากทีมมาแทนที่',

  epics: [
    {
      name: 'Data & Service Foundation',
      system: 'NCBS',
      features: [
        {
          name: 'Database Architecture & Multi-Tenancy Provisioning',
          start: '2026-01-05', end: '2026-02-13',
          manday: { po_ba:3, ux_designer:0, tech_lead:12, dev:28, qa_lead:4, qa:9, pm:2, dm:3 },
        },
        {
          name: 'Physical/Compute Infrastructure Procurement',
          start: '2026-01-12', end: '2026-02-27',
          manday: { po_ba:5, ux_designer:0, tech_lead:8, dev:15, qa_lead:2, qa:4, pm:3, dm:0 },
        },
        {
          name: 'API Gateway & Service Mesh Foundation',
          start: '2026-02-16', end: '2026-04-03',
          manday: { po_ba:4, ux_designer:2, tech_lead:15, dev:32, qa_lead:6, qa:12, pm:2, dm:0 },
        },
      ],
    },
    {
      name: 'Identity & Authentication',
      system: 'NCBS',
      features: [
        {
          name: 'Core SSO / Auth Foundation',
          start: '2026-03-02', end: '2026-04-24',
          manday: { po_ba:6, ux_designer:3, tech_lead:10, dev:24, qa_lead:5, qa:10, pm:2, dm:0 },
        },
        {
          name: 'Role/Permission Data Model (พื้นฐาน)',
          start: '2026-04-06', end: '2026-05-29',
          manday: { po_ba:4, ux_designer:1, tech_lead:6, dev:18, qa_lead:3, qa:7, pm:1, dm:0 },
        },
      ],
    },
  ],
};
