(let reads 0)
(const original Reflect:apply)
(Object:defineProperty Reflect "apply"
  (object
    (get (=> ()
      (+= reads 1)
      (return original)))
    (configurable true)))
(await (dynamic-import "./retained.js"))
(console:log reads)
(original null (array))
(console:log reads)
