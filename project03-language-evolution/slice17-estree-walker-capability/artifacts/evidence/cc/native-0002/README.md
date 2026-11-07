This attempted source check never reached Lykn. The shell failed while opening
redirection paths because this evidence directory had not yet been created.
The original tool output is preserved in setup.stderr, with setup exit 1. No
compiler stdout/stderr or compiler exit exists for this attempt. The same frozen
source is retried under a new unique native receipt.
