(import "./provider.js" (invoke))
(function run (mode)
  (const events (array))
  (const original
    (function original (a b)
      (events:push "call")
      (return (array this:id a b))))
  (const receiver (object (id "receiver") (Reflect (object (apply "property")))) )
  (Object:defineProperty receiver "method"
    (object
      (get (=> ()
        (events:push "get")
        (if (= mode "getter") (throw (new Error "getter")))
        (return original)))
      (configurable true)))
  (const replacement (function replacement () (throw (new Error "replacement"))))
  (= original:call (=> () (throw (new Error "call touched"))))
  (= original:apply (=> () (throw (new Error "apply touched"))))
  (const iter (function* ()
    (events:push "spread")
    (yield 7)))
  (function update ()
    (events:push "arg")
    (if (= mode "arg") (throw (new Error "arg")))
    (= receiver:method replacement)
    (return 8))
  (try
    (return (array events
      (invoke (get receiver "method") receiver
        (array (spread (iter)) (update)))))
    (catch error
      (return (array events error:message)))))
(console:log (JSON:stringify (run "live")))
(console:log (JSON:stringify (run "getter")))
(console:log (JSON:stringify (run "arg")))
