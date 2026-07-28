#!/usr/bin/env bash
# รันสคริปต์นี้ทุกครั้งหลังเพิ่ม/ลบไฟล์ใน data/ — จะ scan ไฟล์ .js ทั้งหมดใน data/
# (ยกเว้น _template.js) แล้วเขียน data/manifest.json ใหม่ให้ตรงกับไฟล์ที่มีจริง
# ไม่ต้องแก้ index.html เลย
set -e
cd "$(dirname "$0")"

python3 -c "
import json, glob, os
files = sorted(
    os.path.basename(f) for f in glob.glob('data/*.js')
    if not os.path.basename(f).startswith('_template')
)
with open('data/manifest.json', 'w', encoding='utf-8') as out:
    json.dump(files, out, indent=2, ensure_ascii=False)
    out.write('\n')
print('เขียน data/manifest.json แล้ว —', len(files), 'ไฟล์:')
for f in files:
    print(' -', f)
"
