(let current "first")
(function advance () (+= current "!"))
(export (names current advance))
