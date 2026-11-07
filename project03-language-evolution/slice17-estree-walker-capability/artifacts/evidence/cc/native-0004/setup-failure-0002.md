# Setup failure 0002 — relative evidence path from scratch CWD

The attempted walker check did not invoke the compiler. Shell redirection failed
because evidence paths were relative to `/private/tmp/s17-correction1-native-0001`:

`/opt/homebrew/bin/bash: line 1: project03-language-evolution/slice17-estree-walker-capability/artifacts/evidence/cc/native-0004/argv.txt: No such file or directory`
`/opt/homebrew/bin/bash: line 1: project03-language-evolution/slice17-estree-walker-capability/artifacts/evidence/cc/native-0004/exit.txt: No such file or directory`

No check ran; the next invocation uses the absolute workspace evidence path.
