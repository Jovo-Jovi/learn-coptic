from pathlib import Path
import json, re
p = Path('/home/ubuntu/coptic_arabic_dictionary/output/coptic_arabic_dictionary.json')
d = json.loads(p.read_text(encoding='utf-8'))
entries = d['entries']
issues=[]
seen=[]
for e in entries:
    if not e.get('headword') or not e.get('senses'):
        issues.append({'id':e.get('id'),'issue':'missing headword or senses'})
    for s in e['senses']:
        if not s.get('arabic'):
            issues.append({'id':e.get('id'),'issue':'missing Arabic gloss'})
        seen.append((e['headword'], s.get('arabic'), s.get('part_of_speech')))
report = {
 'json_parse_ok': True,
 'entry_count_declared': d['entry_count'],
 'entry_count_actual': len(entries),
 'sense_count_declared': d['sense_count'],
 'sense_count_actual': len(seen),
 'duplicate_sense_tuples': len(seen)-len(set(seen)),
 'issues': issues[:20],
 'coptic_script_entries': sum(bool(re.search(r'[Ⲁ-⳹]', e['headword'])) for e in entries),
 'arabic_script_senses': sum(bool(re.search(r'[\u0600-\u06ff]', s['arabic'])) for e in entries for s in e['senses']),
 'samples': [entries[i] for i in [0, 1, 2, len(entries)//2, -1]]
}
Path('/home/ubuntu/coptic_arabic_dictionary/output/validation_report.json').write_text(json.dumps(report, ensure_ascii=False, indent=2), encoding='utf-8')
print(json.dumps(report, ensure_ascii=False, indent=2))
