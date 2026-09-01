from pathlib import Path
import json
import pandas as pd

root = Path('/home/ubuntu/coptic_arabic_dictionary/source/archive_files')
out = Path('/home/ubuntu/coptic_arabic_dictionary/source/inspection')
out.mkdir(exist_ok=True)

xlsx = root / 'coptic_northern_unicode_complete.xlsx'
book = pd.ExcelFile(xlsx)
report = {'xlsx_sheets': book.sheet_names, 'xlsx': {}}
for sheet in book.sheet_names:
    df = pd.read_excel(xlsx, sheet_name=sheet, header=None, nrows=12)
    report['xlsx'][sheet] = {
        'shape_sample': [int(df.shape[0]), int(df.shape[1])],
        'rows': [[None if pd.isna(v) else str(v) for v in row] for row in df.values.tolist()]
    }

text = root / 'CopticArabicDictionaryNotepad.txt'
raw = text.read_text(encoding='utf-8', errors='replace')
lines = raw.splitlines()
report['text'] = {
    'bytes': text.stat().st_size,
    'line_count': len(lines),
    'first_lines': lines[:80],
    'sample_tab_lines': [line for line in lines if '\t' in line][:20],
}
(out / 'source_profile.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps({'sheets': book.sheet_names, 'text_lines': len(lines), 'profile': str(out/'source_profile.json')}, ensure_ascii=False))
