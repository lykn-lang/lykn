#!/usr/bin/env python3
"""Reproduce the planning migration's structural checks using local Git objects."""
from pathlib import Path
import hashlib,json,posixpath,re,subprocess,sys,urllib.parse

PLAN=Path(__file__).resolve().parents[4]
ROOT=PLAN.parent.parent
ART=PLAN/'project06-planning-reorg/arc01-history-and-import/slice01-migration/artifacts'
MANIFEST=json.loads((ART/'migration-manifest.json').read_text())
TIPS=json.loads((ART/'source-tips.json').read_text())
errors=[];historical=[];checks=[]

def git(*args):
    return subprocess.check_output(['git','-C',str(PLAN),*args])

def paths(ref):
    files=set(git('ls-tree','-r','--name-only',ref).decode().splitlines())
    return files | {posixpath.dirname(f) for f in files} | {f.rsplit('/',i)[0] for f in files for i in range(1,f.count('/')+1)}

cache={}
def has(ref,path):
    if ref not in cache:cache[ref]=paths(ref)
    return path.rstrip('/') in cache[ref]

def check(condition,message):
    if not condition:errors.append(message)

def tokens(text):
    fence=None
    for number,line in enumerate(text.splitlines(),1):
        m=re.match(r'^\s*(`{3,}|~{3,})',line)
        if m:
            if fence is None:fence=m[1]
            elif m[1][0]==fence[0] and len(m[1])>=len(fence):fence=None
            continue
        if fence:continue
        for m in re.finditer(r'\]\(\s*<?([^\s)>]+)|(?:href|src)=["\']([^"\']+)|^\s*\[[^\]]+\]:\s*<?([^\s>]+)',line):
            yield number,next(x for x in m.groups() if x is not None)

def link_resolves(ref,doc,raw):
    if raw.startswith(('#','/','~')):return True
    if raw.startswith('https://github.com/lykn-lang/lykn/blob/'):
        tail=urllib.parse.unquote(raw.split('/blob/',1)[1].split('#')[0])
        if tail.startswith('release/'):
            parts=tail.split('/',2);target_ref='/'.join(parts[:2]);path=parts[2]
        else:target_ref,_,path=tail.partition('/')
        try:return has(target_ref,path)
        except subprocess.CalledProcessError:return False
    if re.match(r'^[A-Za-z][A-Za-z0-9+.-]*:',raw):return True
    path=urllib.parse.unquote(raw.split('#')[0])
    if any(c in path for c in '*<>'):return True
    return has(ref,posixpath.normpath(posixpath.join(posixpath.dirname(doc),path))) or has(ref,path)

for x in MANIFEST:
    source=x['source_commit']+':'+x['source_path']
    dest=x['move_commit']+':'+x['destination']
    check(git('rev-parse',source).decode().strip()==x['source_blob'],'Original blob mismatch: '+source)
    check(git('rev-parse',dest).decode().strip()==x['source_blob'],'Move changed content: '+dest)
    check(has('HEAD',x['destination']),'Missing migrated file: '+x['destination'])
checks.append(f'{len(MANIFEST)} source blobs, byte-identical move blobs, and tracked destinations checked')
for v,tip in TIPS.items():
    check(subprocess.run(['git','-C',str(PLAN),'merge-base','--is-ancestor',tip,'HEAD']).returncode==0,'Lost source ancestry '+v)
    selected=[f for f in paths(tip) if f.startswith(('docs/design/','docs/dev/','docs/backlog/','docs/design-v','docs/hardware-v')) and f in git('ls-tree','-r','--name-only',tip).decode().splitlines()]
    migrated={x['source_path'] for x in MANIFEST}
    check(set(selected)<=migrated,'Unmapped source planning files '+v)
checks.append('All original source tips remain ancestors; all branch planning paths are represented')
for x in json.loads((ART/'inherited-variants.json').read_text()):
    check(git('hash-object','--no-filters',str(PLAN/x['preserved_at'])).decode().strip()==x['source_blob'],'Inherited variant altered: '+x['preserved_at'])
for a,b in [('0.6.x','0.7.x'),('0.7.x','0.8.x')]:
    check(subprocess.run(['git','-C',str(PLAN),'merge-base','--is-ancestor','release/'+a,'release/'+b]).returncode==0,'Removal ancestry broken '+a+' -> '+b)
    check(not git('diff','--name-only','release/'+a,'release/'+b),'Source trees differ '+a+' / '+b)
for v in TIPS:
    ref='release/'+v
    remaining=[f for f in paths(ref) if f.startswith(('docs/design/','docs/dev/','docs/backlog/','docs/design-v','docs/hardware-v'))]
    check(not remaining,'Planning remains in '+ref)
    for retained in ['docs/guides','docs/ecmascript-2025']:
        before={p for p in paths(TIPS['0.6.x']) if p.startswith(retained+'/')}
        after={p for p in paths(ref) if p.startswith(retained+'/')}
        check(before==after,'Retained docs path-set changed '+ref+'/'+retained)
checks.append('Release ancestry, identical final source trees, planning removals and retained documentation paths checked')
guide_changes=git('diff','--name-only',TIPS['0.6.x'],'release/0.6.x','--','docs/guides').decode().splitlines()
check(not git('diff','--name-only',TIPS['0.6.x'],'release/0.6.x','--','docs/ecmascript-2025'),'ECMAScript corpus content changed')
allowed={'AGENTS.md','README.md','odm.toml'}
changed=git('diff','--name-only',TIPS['0.6.x'],'release/0.6.x').decode().splitlines()
check(all(p.startswith('docs/') or p in allowed for p in changed),'Unexpected implementation changes on 0.6')
gov=git('show','HEAD:AGENTS.md')
for ref in ['main','release/0.6.x','release/0.7.x','release/0.8.x']:
    check(git('show',ref+':AGENTS.md')==gov,'Governance drift: '+ref)
    check(git('show',ref+':CLAUDE.md')==b'AGENTS.md','CLAUDE.md target drift: '+ref)
check(git('show','HEAD:CLAUDE.md')==b'AGENTS.md','Planning CLAUDE.md target drift')
projects=sorted(PLAN.glob('project*/project-plan.md'))
check(len(projects)==6,'Expected six project plans')
for plan in projects:
    text=plan.read_text();check(text.startswith('---\n'),'Missing YAML '+str(plan))
    front=text.split('---',2)[1]
    for field in ['project','status','planned-release','depends-on','blocks','related']:
        check(bool(re.search(r'^'+field+r':',front,re.M)),'Missing '+field+' in '+str(plan))
    check(bool(re.search(r'^project: '+re.escape(plan.parent.name)+r'$',front,re.M)),'Project metadata identity mismatch '+str(plan))
checks.append('Six project metadata blocks and synchronized governance checked')
old_by_new={x['destination']:x for x in MANIFEST}
tracked=git('ls-tree','-r','--name-only','HEAD').decode().splitlines()
for doc in tracked:
    if not doc.endswith(('.md','.html')) or '/inherited-variants/' in doc:continue
    text=git('show','HEAD:'+doc).decode()
    old=old_by_new.get(doc)
    old_broken=set()
    if old:
        old_text=git('show',old['source_commit']+':'+old['source_path']).decode()
        old_broken={raw for _,raw in tokens(old_text) if not link_resolves(old['source_commit'],old['source_path'],raw)}
    for line,raw in tokens(text):
        if link_resolves('HEAD',doc,raw):continue
        if raw in old_broken:historical.append({'document':doc,'line':line,'target':raw,'classification':'pre-existing unresolved/future link'})
        else:errors.append(f'New unresolved link {doc}:{line}: {raw}')
checks.append(f'Planning links checked; {len(historical)} pre-existing unresolved/future references retained separately')
result={'checks':checks,'guide_files_with_navigation_edits':guide_changes,'historical_link_findings':historical,'errors':errors,'evidence_strength':'attested when run by the migration doer; independent rerun required for framework closure'}
if '--json' in sys.argv:print(json.dumps(result,indent=2))
else:
    for c in checks:print('CHECK:',c)
    for e in errors:print('ERROR:',e)
    print('RESULT:', 'PASS' if not errors else 'FAIL',f'({len(errors)} errors)')
sys.exit(bool(errors))
