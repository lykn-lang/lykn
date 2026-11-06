import hashlib, json, pathlib, sys
workspace=pathlib.Path('/Users/oubiwann/lab/lykn/lang/.worktrees/contract-predicate-lowering/target/slice08/pilot/run-01/experiment/workspace')
expected={
 'json':{'.':'./mod.js','./document':'./document.js','./file':'./file.js','./value':'./value.js'},
 'yaml':{'.':'./mod.js','./value':'./value.js'},
 'effects':{'.':'./mod.js','./dead':'./dead.js','./used':'./used.js'},
}
rows=[]; count=0
for pkg, exports in expected.items():
    source=json.loads((workspace/'lib'/pkg/'deno.json').read_text())
    dist=json.loads((workspace/'target/lykn/dist'/pkg/'deno.json').read_text())
    if source.get('exports') != exports or dist.get('exports') != exports:
        raise SystemExit(f'export map mismatch: {pkg} source={source.get("exports")} dist={dist.get("exports")} expected={exports}')
    print(f'export-map package={pkg} keys={len(exports)} matches-prior-exact-map=True')
    for key,target in exports.items():
        rel=f'{pkg}/{target.removeprefix("./")}'
        if not (workspace/'target/lykn/dist'/rel).is_file():
            raise SystemExit(f'missing declared target: {pkg} {key} -> {rel}')
        print(f'  {key} -> {target}')
        count += 1
if count != 9: raise SystemExit(f'expected9 exports, got {count}')
print(f'total-library-public-keys={count}')
files=['json/deno.json','json/mod.js','json/value.js','json/file.js','json/document.js','yaml/deno.json','yaml/mod.js','yaml/value.js','effects/deno.json','effects/mod.js','effects/used.js','effects/dead.js','effects/effect.js']
if len(files)!=13: raise SystemExit(f'expected13 public files, got {len(files)}')
for rel in files:
    p=workspace/'target/lykn/dist'/rel
    if not p.is_file(): raise SystemExit(f'missing public file: {rel}')
    digest=hashlib.sha256(p.read_bytes()).hexdigest()
    rows.append(f'{digest}  target/lykn/dist/{rel}')
(workspace.parent.parent.parent.parent/'placeholder').exists()
print('public-file-sha256-begin')
print('\n'.join(rows))
print('public-file-sha256-end')
