(kernel:let current "first")
(kernel:function advance () (+= current "!"))
(export (names current advance))
