from pathlib import Path
from collections import OrderedDict
import json, re, hashlib
import pandas as pd

ROOT = Path('/home/ubuntu/coptic_arabic_dictionary')
SRC = ROOT / 'source/archive_files/coptic_northern_unicode_complete.xlsx'
OUT = ROOT / 'output'
OUT.mkdir(exist_ok=True)

def clean(value):
    if value is None or (isinstance(value, float) and pd.isna(value)):
        return None
    s = re.sub(r'\s+', ' ', str(value).replace('\u00a0', ' ')).strip()
    return s or None

def key_norm(s):
    return re.sub(r'\s+', '', s or '')

df = pd.read_excel(SRC, sheet_name=0, header=None, dtype=object)
rows = []
for i, raw in enumerate(df.iloc[1:].values.tolist(), start=2):
    vals = [clean(x) for x in raw]
    if not vals or not vals[0]:
        continue
    # Observed schema: Coptic, Greek, pronunciation, English, phonetic, POS, gender, [unused], Arabic/etymology, Arabic gloss/note, [unused]
    coptic, greek, pronunciation, english, phonetic, pos, gender = (vals + [None]*7)[:7]
    tail = (vals + [None]*11)[7:11]
    nonempty_tail = [x for x in tail if x]
    etymology = None
    arabic = None
    note = None
    if len(nonempty_tail) >= 2 and any(x in nonempty_tail[0].lower() for x in ['يوناني','greek','egyptian','مصري']):
        etymology, arabic = nonempty_tail[0], nonempty_tail[1]
        if len(nonempty_tail) > 2: note = ' ؛ '.join(nonempty_tail[2:])
    elif nonempty_tail:
        arabic = nonempty_tail[0]
        if len(nonempty_tail) > 1: note = ' ؛ '.join(nonempty_tail[1:])
    if not arabic:
        continue
    rows.append({'source_row': i, 'coptic': coptic, 'greek': greek, 'pronunciation': pronunciation, 'latin': english, 'phonetic': phonetic, 'part_of_speech': pos, 'gender': gender, 'etymology': etymology, 'arabic': arabic, 'note': note})

entries = OrderedDict()
for r in rows:
    k = key_norm(r['coptic'])
    if k not in entries:
        entries[k] = {'id': hashlib.sha1(k.encode('utf-8')).hexdigest()[:12], 'headword': r['coptic'], 'variants': [], 'senses': []}
    e = entries[k]
    # Keep only Arabic-script glosses for a Coptic–Arabic dictionary; English-only
    # etymological glosses in the export are not dictionary translations.
    if not r['arabic'] or not re.search(r'[\u0600-\u06ff]', r['arabic']):
        continue
    for field in ['greek','pronunciation','latin','phonetic','part_of_speech','gender','etymology']:
        if r[field]:
            candidate = {field: r[field]}
            if candidate not in e['variants']:
                e['variants'].append(candidate)
    sense = {x: r[x] for x in ['arabic','part_of_speech','gender','etymology','note','source_row'] if r[x] is not None}
    if not any(s['arabic'] == sense['arabic'] and s.get('part_of_speech') == sense.get('part_of_speech') for s in e['senses']):
        e['senses'].append(sense)

entries = OrderedDict((k, e) for k, e in entries.items() if e['senses'])

payload = {
  'schema': 'coptic-arabic-dictionary/v1.1',
  'language_pair': {'source': 'Coptic', 'target': 'Arabic'},
  'dialect': 'Northern/Bohairic-oriented source export (as named by source file)',
  'entry_count': len(entries),
  'sense_count': sum(len(e['senses']) for e in entries.values()),
  'entries': list(entries.values()),
  'provenance': [{
    'source_id': 'internet_archive_CopticArabicDictionary',
    'title': 'Coptic Arabic Dictionary / قاموس قبطي عربي',
    'creator': 'Osama Thabet',
    'url': 'https://archive.org/details/CopticArabicDictionary',
    'file': 'coptic dictionary northern dialect unicode complete.xlsx',
    'retrieved': '2026-09-02',
    'rights_label': 'Public Domain Mark 1.0 (as displayed by Internet Archive)',
    'caveat': 'Underlying publication provenance and OCR/editorial accuracy are not independently established here.'
  }],
  'field_notes': 'Arabic is taken from the spreadsheet meaning/gloss columns. Only senses containing Arabic script are included; English-only etymological glosses are excluded. Duplicate Coptic headword–Arabic gloss–part-of-speech combinations are merged; source_row retains the original spreadsheet row.'
}
(OUT/'coptic_arabic_dictionary.json').write_text(json.dumps(payload, ensure_ascii=False, indent=2), encoding='utf-8')
summary = {'source_rows_considered': len(rows), 'unique_headwords': len(entries), 'unique_senses': payload['sense_count'], 'output': str(OUT/'coptic_arabic_dictionary.json')}
(OUT/'build_summary.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(summary, ensure_ascii=False))
