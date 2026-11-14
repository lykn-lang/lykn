# Exact stalled public-test cleanup —2026-11-13

Root-owned receipt resolves the missing process handle for CC's
`public/cc/raw/focused-pre-full` attempt. The original observation had partial
stdout and no captured numeric status; its frozen test source contains an
unmatched close after `ordered-stop`. Source review identifies D-2611-RDCL's
nonprogress path. This cleanup is not a separately supervised minimal parser
reproduction or a passing test.

CC paused new invocations of this exact selector during inspection. Sandbox
process enumeration was unavailable to CC; root's narrowly scoped host calls
were approved. Root made no source/build mutation or overlapping test run.

1. `pgrep -fl '/private/tmp/lykn-b2-discard-public-cc/focused-deno.json test/forms/discard-bindings.test.js'`
   returned0 and identified Deno67128 plus its waiting Bash wrapper67090.
   The wrapper's complete command named the canonical `focused-pre-full`
   capture directory; the child command exactly matched the retained launch.
2. `ps -p 67090,67128 -o pid=,ppid=,lstart=,etime=,pcpu=,comm=` returned0:

   ```text
   67090 61111 Fri Nov 13 18:44:54 2026     16:14   0.0 /opt/homebrew/bin/bash
   67128 67090 Fri Nov 13 18:44:54 2026     16:14  99.3 deno
   ```

3. `kill -TERM 67128` returned0, with empty stdout. Only that verified owned
   child was signalled; no broad Deno termination was used.
4. `ps -p 67090,67128 -o pid=,ppid=,etime=,comm=` returned1 with no rows.
5. The original wrapper then wrote `143` to the retained
   `public/cc/raw/focused-pre-full/status.txt`. This is its actual status after
   root's external TERM, not a natural semantic failure or timeout result.
   Existing partial stdout and source snapshot were not rewritten.
6. The same exact-selector pgrep returned1 with no rows before CC's pause was
   released. Both identified processes were gone, and no matching invocation
   remained at that check. This is not an unrestricted process census.

CC was informed of all identifiers/statuses and resumed source ownership and
focused launches. The process ownership gap for this known stalled attempt is
resolved. D-2611-RDCL remains open under the existing Project07 reader owner.
