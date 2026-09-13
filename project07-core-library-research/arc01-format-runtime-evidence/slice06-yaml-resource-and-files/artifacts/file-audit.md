# File-fault byte and state audit

Two fresh attempts per variant. All before/after states precede separate cleanup. OS errors, Deno denials and injection remain distinct. Partial-write checkpoint bytes were independently reread before external termination; no durability or concurrency claim.

```json
[
  {
    "id": "Y-16-missing",
    "attempt": 1,
    "exit": 0,
    "signal": null,
    "faults": [
      [
        "error",
        {
          "stage": "read-input",
          "name": "NotFound",
          "message": "No such file or directory (os error 2): readfile 'inputs/source.yaml'",
          "details": {
            "kind": "object",
            "tag": "[object Error]",
            "id": 1,
            "length": null,
            "truncated": false,
            "entries": [
              [
                {
                  "kind": "string",
                  "value": "name"
                },
                {
                  "kind": "string",
                  "value": "NotFound",
                  "length": 8,
                  "truncated": false
                }
              ],
              [
                {
                  "kind": "string",
                  "value": "code"
                },
                {
                  "kind": "string",
                  "value": "ENOENT",
                  "length": 6,
                  "truncated": false
                }
              ]
            ]
          }
        }
      ],
      [
        "fault",
        {
          "requested": "missing",
          "stage": "read-input",
          "class": "operation-error"
        }
      ]
    ],
    "preparedInput": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "preparedOutput": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "inputState": [],
    "outputBefore": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "inputAfter": [],
    "outputAfter": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "checkpoint": null,
    "cleanup": [],
    "inputRestored": [],
    "outputCleaned": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ]
  },
  {
    "id": "Y-16-missing",
    "attempt": 2,
    "exit": 0,
    "signal": null,
    "faults": [
      [
        "error",
        {
          "stage": "read-input",
          "name": "NotFound",
          "message": "No such file or directory (os error 2): readfile 'inputs/source.yaml'",
          "details": {
            "kind": "object",
            "tag": "[object Error]",
            "id": 1,
            "length": null,
            "truncated": false,
            "entries": [
              [
                {
                  "kind": "string",
                  "value": "name"
                },
                {
                  "kind": "string",
                  "value": "NotFound",
                  "length": 8,
                  "truncated": false
                }
              ],
              [
                {
                  "kind": "string",
                  "value": "code"
                },
                {
                  "kind": "string",
                  "value": "ENOENT",
                  "length": 6,
                  "truncated": false
                }
              ]
            ]
          }
        }
      ],
      [
        "fault",
        {
          "requested": "missing",
          "stage": "read-input",
          "class": "operation-error"
        }
      ]
    ],
    "preparedInput": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "preparedOutput": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "inputState": [],
    "outputBefore": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "inputAfter": [],
    "outputAfter": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "checkpoint": null,
    "cleanup": [],
    "inputRestored": [],
    "outputCleaned": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ]
  },
  {
    "id": "Y-16-unreadable",
    "attempt": 1,
    "exit": 0,
    "signal": null,
    "faults": [
      [
        "error",
        {
          "stage": "read-input",
          "name": "PermissionDenied",
          "message": "Permission denied (os error 13): readfile 'inputs/source.yaml'",
          "details": {
            "kind": "object",
            "tag": "[object Error]",
            "id": 1,
            "length": null,
            "truncated": false,
            "entries": [
              [
                {
                  "kind": "string",
                  "value": "name"
                },
                {
                  "kind": "string",
                  "value": "PermissionDenied",
                  "length": 16,
                  "truncated": false
                }
              ],
              [
                {
                  "kind": "string",
                  "value": "code"
                },
                {
                  "kind": "string",
                  "value": "EACCES",
                  "length": 6,
                  "truncated": false
                }
              ]
            ]
          }
        }
      ],
      [
        "fault",
        {
          "requested": "unreadable",
          "stage": "read-input",
          "class": "operation-error"
        }
      ]
    ],
    "preparedInput": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "preparedOutput": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "inputState": [
      {
        "path": "inputs/source.yaml",
        "mode": 32768,
        "error": "Permission denied (os error 13): readfile '/private/tmp/lykn-p07-yaml-resources.mFDu19/confirmation/runs/Y-16-unreadable-1/inputs/source.yaml'"
      }
    ],
    "outputBefore": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "inputAfter": [
      {
        "path": "inputs/source.yaml",
        "mode": 32768,
        "error": "Permission denied (os error 13): readfile '/private/tmp/lykn-p07-yaml-resources.mFDu19/confirmation/runs/Y-16-unreadable-1/inputs/source.yaml'"
      }
    ],
    "outputAfter": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "checkpoint": null,
    "cleanup": [
      "restored input mode 0600 after inaccessible aftermath snapshot"
    ],
    "inputRestored": [
      {
        "path": "inputs/source.yaml",
        "mode": 33152,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputCleaned": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ]
  },
  {
    "id": "Y-16-unreadable",
    "attempt": 2,
    "exit": 0,
    "signal": null,
    "faults": [
      [
        "error",
        {
          "stage": "read-input",
          "name": "PermissionDenied",
          "message": "Permission denied (os error 13): readfile 'inputs/source.yaml'",
          "details": {
            "kind": "object",
            "tag": "[object Error]",
            "id": 1,
            "length": null,
            "truncated": false,
            "entries": [
              [
                {
                  "kind": "string",
                  "value": "name"
                },
                {
                  "kind": "string",
                  "value": "PermissionDenied",
                  "length": 16,
                  "truncated": false
                }
              ],
              [
                {
                  "kind": "string",
                  "value": "code"
                },
                {
                  "kind": "string",
                  "value": "EACCES",
                  "length": 6,
                  "truncated": false
                }
              ]
            ]
          }
        }
      ],
      [
        "fault",
        {
          "requested": "unreadable",
          "stage": "read-input",
          "class": "operation-error"
        }
      ]
    ],
    "preparedInput": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "preparedOutput": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "inputState": [
      {
        "path": "inputs/source.yaml",
        "mode": 32768,
        "error": "Permission denied (os error 13): readfile '/private/tmp/lykn-p07-yaml-resources.mFDu19/confirmation/runs/Y-16-unreadable-2/inputs/source.yaml'"
      }
    ],
    "outputBefore": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "inputAfter": [
      {
        "path": "inputs/source.yaml",
        "mode": 32768,
        "error": "Permission denied (os error 13): readfile '/private/tmp/lykn-p07-yaml-resources.mFDu19/confirmation/runs/Y-16-unreadable-2/inputs/source.yaml'"
      }
    ],
    "outputAfter": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "checkpoint": null,
    "cleanup": [
      "restored input mode 0600 after inaccessible aftermath snapshot"
    ],
    "inputRestored": [
      {
        "path": "inputs/source.yaml",
        "mode": 33152,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputCleaned": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ]
  },
  {
    "id": "Y-16-missing-parent",
    "attempt": 1,
    "exit": 0,
    "signal": null,
    "faults": [
      [
        "original",
        {
          "kind": "object",
          "tag": "[object Object]",
          "id": 1,
          "length": null,
          "truncated": false,
          "entries": [
            [
              {
                "kind": "string",
                "value": "name"
              },
              {
                "kind": "string",
                "value": "Ada",
                "length": 3,
                "truncated": false
              }
            ],
            [
              {
                "kind": "string",
                "value": "n"
              },
              {
                "kind": "number",
                "value": "1",
                "finite": true
              }
            ],
            [
              {
                "kind": "string",
                "value": "flags"
              },
              {
                "kind": "array",
                "tag": "[object Array]",
                "id": 2,
                "length": 2,
                "truncated": false,
                "entries": [
                  [
                    {
                      "kind": "string",
                      "value": "0"
                    },
                    {
                      "kind": "boolean",
                      "value": "true"
                    }
                  ],
                  [
                    {
                      "kind": "string",
                      "value": "1"
                    },
                    {
                      "kind": "boolean",
                      "value": "false"
                    }
                  ]
                ]
              }
            ],
            [
              {
                "kind": "string",
                "value": "nil"
              },
              {
                "kind": "null"
              }
            ]
          ]
        }
      ],
      [
        "edited",
        {
          "kind": "object",
          "tag": "[object Object]",
          "id": 1,
          "length": null,
          "truncated": false,
          "entries": [
            [
              {
                "kind": "string",
                "value": "name"
              },
              {
                "kind": "string",
                "value": "Ada",
                "length": 3,
                "truncated": false
              }
            ],
            [
              {
                "kind": "string",
                "value": "n"
              },
              {
                "kind": "number",
                "value": "2",
                "finite": true
              }
            ],
            [
              {
                "kind": "string",
                "value": "flags"
              },
              {
                "kind": "array",
                "tag": "[object Array]",
                "id": 2,
                "length": 2,
                "truncated": false,
                "entries": [
                  [
                    {
                      "kind": "string",
                      "value": "0"
                    },
                    {
                      "kind": "boolean",
                      "value": "true"
                    }
                  ],
                  [
                    {
                      "kind": "string",
                      "value": "1"
                    },
                    {
                      "kind": "boolean",
                      "value": "false"
                    }
                  ]
                ]
              }
            ],
            [
              {
                "kind": "string",
                "value": "nil"
              },
              {
                "kind": "null"
              }
            ]
          ]
        }
      ],
      [
        "serializedText",
        "name: Ada\n'n': 2\nflags:\n  - true\n  - false\nnil: null\n"
      ],
      [
        "error",
        {
          "stage": "open-write",
          "name": "NotFound",
          "message": "No such file or directory (os error 2): open 'outputs/absent/replacement.tmp'",
          "details": {
            "kind": "object",
            "tag": "[object Error]",
            "id": 1,
            "length": null,
            "truncated": false,
            "entries": [
              [
                {
                  "kind": "string",
                  "value": "name"
                },
                {
                  "kind": "string",
                  "value": "NotFound",
                  "length": 8,
                  "truncated": false
                }
              ],
              [
                {
                  "kind": "string",
                  "value": "code"
                },
                {
                  "kind": "string",
                  "value": "ENOENT",
                  "length": 6,
                  "truncated": false
                }
              ]
            ]
          }
        }
      ],
      [
        "fault",
        {
          "requested": "missing-parent",
          "stage": "open-write",
          "class": "operation-error"
        }
      ]
    ],
    "preparedInput": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "preparedOutput": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "inputState": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputBefore": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "inputAfter": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputAfter": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "checkpoint": null,
    "cleanup": [],
    "inputRestored": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputCleaned": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ]
  },
  {
    "id": "Y-16-missing-parent",
    "attempt": 2,
    "exit": 0,
    "signal": null,
    "faults": [
      [
        "original",
        {
          "kind": "object",
          "tag": "[object Object]",
          "id": 1,
          "length": null,
          "truncated": false,
          "entries": [
            [
              {
                "kind": "string",
                "value": "name"
              },
              {
                "kind": "string",
                "value": "Ada",
                "length": 3,
                "truncated": false
              }
            ],
            [
              {
                "kind": "string",
                "value": "n"
              },
              {
                "kind": "number",
                "value": "1",
                "finite": true
              }
            ],
            [
              {
                "kind": "string",
                "value": "flags"
              },
              {
                "kind": "array",
                "tag": "[object Array]",
                "id": 2,
                "length": 2,
                "truncated": false,
                "entries": [
                  [
                    {
                      "kind": "string",
                      "value": "0"
                    },
                    {
                      "kind": "boolean",
                      "value": "true"
                    }
                  ],
                  [
                    {
                      "kind": "string",
                      "value": "1"
                    },
                    {
                      "kind": "boolean",
                      "value": "false"
                    }
                  ]
                ]
              }
            ],
            [
              {
                "kind": "string",
                "value": "nil"
              },
              {
                "kind": "null"
              }
            ]
          ]
        }
      ],
      [
        "edited",
        {
          "kind": "object",
          "tag": "[object Object]",
          "id": 1,
          "length": null,
          "truncated": false,
          "entries": [
            [
              {
                "kind": "string",
                "value": "name"
              },
              {
                "kind": "string",
                "value": "Ada",
                "length": 3,
                "truncated": false
              }
            ],
            [
              {
                "kind": "string",
                "value": "n"
              },
              {
                "kind": "number",
                "value": "2",
                "finite": true
              }
            ],
            [
              {
                "kind": "string",
                "value": "flags"
              },
              {
                "kind": "array",
                "tag": "[object Array]",
                "id": 2,
                "length": 2,
                "truncated": false,
                "entries": [
                  [
                    {
                      "kind": "string",
                      "value": "0"
                    },
                    {
                      "kind": "boolean",
                      "value": "true"
                    }
                  ],
                  [
                    {
                      "kind": "string",
                      "value": "1"
                    },
                    {
                      "kind": "boolean",
                      "value": "false"
                    }
                  ]
                ]
              }
            ],
            [
              {
                "kind": "string",
                "value": "nil"
              },
              {
                "kind": "null"
              }
            ]
          ]
        }
      ],
      [
        "serializedText",
        "name: Ada\n'n': 2\nflags:\n  - true\n  - false\nnil: null\n"
      ],
      [
        "error",
        {
          "stage": "open-write",
          "name": "NotFound",
          "message": "No such file or directory (os error 2): open 'outputs/absent/replacement.tmp'",
          "details": {
            "kind": "object",
            "tag": "[object Error]",
            "id": 1,
            "length": null,
            "truncated": false,
            "entries": [
              [
                {
                  "kind": "string",
                  "value": "name"
                },
                {
                  "kind": "string",
                  "value": "NotFound",
                  "length": 8,
                  "truncated": false
                }
              ],
              [
                {
                  "kind": "string",
                  "value": "code"
                },
                {
                  "kind": "string",
                  "value": "ENOENT",
                  "length": 6,
                  "truncated": false
                }
              ]
            ]
          }
        }
      ],
      [
        "fault",
        {
          "requested": "missing-parent",
          "stage": "open-write",
          "class": "operation-error"
        }
      ]
    ],
    "preparedInput": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "preparedOutput": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "inputState": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputBefore": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "inputAfter": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputAfter": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "checkpoint": null,
    "cleanup": [],
    "inputRestored": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputCleaned": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ]
  },
  {
    "id": "Y-16-unwritable",
    "attempt": 1,
    "exit": 0,
    "signal": null,
    "faults": [
      [
        "original",
        {
          "kind": "object",
          "tag": "[object Object]",
          "id": 1,
          "length": null,
          "truncated": false,
          "entries": [
            [
              {
                "kind": "string",
                "value": "name"
              },
              {
                "kind": "string",
                "value": "Ada",
                "length": 3,
                "truncated": false
              }
            ],
            [
              {
                "kind": "string",
                "value": "n"
              },
              {
                "kind": "number",
                "value": "1",
                "finite": true
              }
            ],
            [
              {
                "kind": "string",
                "value": "flags"
              },
              {
                "kind": "array",
                "tag": "[object Array]",
                "id": 2,
                "length": 2,
                "truncated": false,
                "entries": [
                  [
                    {
                      "kind": "string",
                      "value": "0"
                    },
                    {
                      "kind": "boolean",
                      "value": "true"
                    }
                  ],
                  [
                    {
                      "kind": "string",
                      "value": "1"
                    },
                    {
                      "kind": "boolean",
                      "value": "false"
                    }
                  ]
                ]
              }
            ],
            [
              {
                "kind": "string",
                "value": "nil"
              },
              {
                "kind": "null"
              }
            ]
          ]
        }
      ],
      [
        "edited",
        {
          "kind": "object",
          "tag": "[object Object]",
          "id": 1,
          "length": null,
          "truncated": false,
          "entries": [
            [
              {
                "kind": "string",
                "value": "name"
              },
              {
                "kind": "string",
                "value": "Ada",
                "length": 3,
                "truncated": false
              }
            ],
            [
              {
                "kind": "string",
                "value": "n"
              },
              {
                "kind": "number",
                "value": "2",
                "finite": true
              }
            ],
            [
              {
                "kind": "string",
                "value": "flags"
              },
              {
                "kind": "array",
                "tag": "[object Array]",
                "id": 2,
                "length": 2,
                "truncated": false,
                "entries": [
                  [
                    {
                      "kind": "string",
                      "value": "0"
                    },
                    {
                      "kind": "boolean",
                      "value": "true"
                    }
                  ],
                  [
                    {
                      "kind": "string",
                      "value": "1"
                    },
                    {
                      "kind": "boolean",
                      "value": "false"
                    }
                  ]
                ]
              }
            ],
            [
              {
                "kind": "string",
                "value": "nil"
              },
              {
                "kind": "null"
              }
            ]
          ]
        }
      ],
      [
        "serializedText",
        "name: Ada\n'n': 2\nflags:\n  - true\n  - false\nnil: null\n"
      ],
      [
        "error",
        {
          "stage": "open-write",
          "name": "PermissionDenied",
          "message": "Permission denied (os error 13): open 'outputs/blocked/replacement.tmp'",
          "details": {
            "kind": "object",
            "tag": "[object Error]",
            "id": 1,
            "length": null,
            "truncated": false,
            "entries": [
              [
                {
                  "kind": "string",
                  "value": "name"
                },
                {
                  "kind": "string",
                  "value": "PermissionDenied",
                  "length": 16,
                  "truncated": false
                }
              ],
              [
                {
                  "kind": "string",
                  "value": "code"
                },
                {
                  "kind": "string",
                  "value": "EACCES",
                  "length": 6,
                  "truncated": false
                }
              ]
            ]
          }
        }
      ],
      [
        "fault",
        {
          "requested": "unwritable",
          "stage": "open-write",
          "class": "operation-error"
        }
      ]
    ],
    "preparedInput": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "preparedOutput": [
      {
        "path": "outputs/blocked",
        "directory": true,
        "mode": 16877
      },
      {
        "path": "outputs/blocked/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "inputState": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputBefore": [
      {
        "path": "outputs/blocked",
        "directory": true,
        "mode": 16704
      },
      {
        "path": "outputs/blocked/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "inputAfter": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputAfter": [
      {
        "path": "outputs/blocked",
        "directory": true,
        "mode": 16704
      },
      {
        "path": "outputs/blocked/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "checkpoint": null,
    "cleanup": [
      "restored directory mode 0700 after aftermath snapshot"
    ],
    "inputRestored": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputCleaned": [
      {
        "path": "outputs/blocked",
        "directory": true,
        "mode": 16832
      },
      {
        "path": "outputs/blocked/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ]
  },
  {
    "id": "Y-16-unwritable",
    "attempt": 2,
    "exit": 0,
    "signal": null,
    "faults": [
      [
        "original",
        {
          "kind": "object",
          "tag": "[object Object]",
          "id": 1,
          "length": null,
          "truncated": false,
          "entries": [
            [
              {
                "kind": "string",
                "value": "name"
              },
              {
                "kind": "string",
                "value": "Ada",
                "length": 3,
                "truncated": false
              }
            ],
            [
              {
                "kind": "string",
                "value": "n"
              },
              {
                "kind": "number",
                "value": "1",
                "finite": true
              }
            ],
            [
              {
                "kind": "string",
                "value": "flags"
              },
              {
                "kind": "array",
                "tag": "[object Array]",
                "id": 2,
                "length": 2,
                "truncated": false,
                "entries": [
                  [
                    {
                      "kind": "string",
                      "value": "0"
                    },
                    {
                      "kind": "boolean",
                      "value": "true"
                    }
                  ],
                  [
                    {
                      "kind": "string",
                      "value": "1"
                    },
                    {
                      "kind": "boolean",
                      "value": "false"
                    }
                  ]
                ]
              }
            ],
            [
              {
                "kind": "string",
                "value": "nil"
              },
              {
                "kind": "null"
              }
            ]
          ]
        }
      ],
      [
        "edited",
        {
          "kind": "object",
          "tag": "[object Object]",
          "id": 1,
          "length": null,
          "truncated": false,
          "entries": [
            [
              {
                "kind": "string",
                "value": "name"
              },
              {
                "kind": "string",
                "value": "Ada",
                "length": 3,
                "truncated": false
              }
            ],
            [
              {
                "kind": "string",
                "value": "n"
              },
              {
                "kind": "number",
                "value": "2",
                "finite": true
              }
            ],
            [
              {
                "kind": "string",
                "value": "flags"
              },
              {
                "kind": "array",
                "tag": "[object Array]",
                "id": 2,
                "length": 2,
                "truncated": false,
                "entries": [
                  [
                    {
                      "kind": "string",
                      "value": "0"
                    },
                    {
                      "kind": "boolean",
                      "value": "true"
                    }
                  ],
                  [
                    {
                      "kind": "string",
                      "value": "1"
                    },
                    {
                      "kind": "boolean",
                      "value": "false"
                    }
                  ]
                ]
              }
            ],
            [
              {
                "kind": "string",
                "value": "nil"
              },
              {
                "kind": "null"
              }
            ]
          ]
        }
      ],
      [
        "serializedText",
        "name: Ada\n'n': 2\nflags:\n  - true\n  - false\nnil: null\n"
      ],
      [
        "error",
        {
          "stage": "open-write",
          "name": "PermissionDenied",
          "message": "Permission denied (os error 13): open 'outputs/blocked/replacement.tmp'",
          "details": {
            "kind": "object",
            "tag": "[object Error]",
            "id": 1,
            "length": null,
            "truncated": false,
            "entries": [
              [
                {
                  "kind": "string",
                  "value": "name"
                },
                {
                  "kind": "string",
                  "value": "PermissionDenied",
                  "length": 16,
                  "truncated": false
                }
              ],
              [
                {
                  "kind": "string",
                  "value": "code"
                },
                {
                  "kind": "string",
                  "value": "EACCES",
                  "length": 6,
                  "truncated": false
                }
              ]
            ]
          }
        }
      ],
      [
        "fault",
        {
          "requested": "unwritable",
          "stage": "open-write",
          "class": "operation-error"
        }
      ]
    ],
    "preparedInput": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "preparedOutput": [
      {
        "path": "outputs/blocked",
        "directory": true,
        "mode": 16877
      },
      {
        "path": "outputs/blocked/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "inputState": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputBefore": [
      {
        "path": "outputs/blocked",
        "directory": true,
        "mode": 16704
      },
      {
        "path": "outputs/blocked/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "inputAfter": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputAfter": [
      {
        "path": "outputs/blocked",
        "directory": true,
        "mode": 16704
      },
      {
        "path": "outputs/blocked/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "checkpoint": null,
    "cleanup": [
      "restored directory mode 0700 after aftermath snapshot"
    ],
    "inputRestored": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputCleaned": [
      {
        "path": "outputs/blocked",
        "directory": true,
        "mode": 16832
      },
      {
        "path": "outputs/blocked/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ]
  },
  {
    "id": "Y-16-raw-interrupt",
    "attempt": 1,
    "exit": 137,
    "signal": "SIGKILL",
    "faults": [
      [
        "original",
        {
          "kind": "object",
          "tag": "[object Object]",
          "id": 1,
          "length": null,
          "truncated": false,
          "entries": [
            [
              {
                "kind": "string",
                "value": "name"
              },
              {
                "kind": "string",
                "value": "Ada",
                "length": 3,
                "truncated": false
              }
            ],
            [
              {
                "kind": "string",
                "value": "n"
              },
              {
                "kind": "number",
                "value": "1",
                "finite": true
              }
            ],
            [
              {
                "kind": "string",
                "value": "flags"
              },
              {
                "kind": "array",
                "tag": "[object Array]",
                "id": 2,
                "length": 2,
                "truncated": false,
                "entries": [
                  [
                    {
                      "kind": "string",
                      "value": "0"
                    },
                    {
                      "kind": "boolean",
                      "value": "true"
                    }
                  ],
                  [
                    {
                      "kind": "string",
                      "value": "1"
                    },
                    {
                      "kind": "boolean",
                      "value": "false"
                    }
                  ]
                ]
              }
            ],
            [
              {
                "kind": "string",
                "value": "nil"
              },
              {
                "kind": "null"
              }
            ]
          ]
        }
      ],
      [
        "edited",
        {
          "kind": "object",
          "tag": "[object Object]",
          "id": 1,
          "length": null,
          "truncated": false,
          "entries": [
            [
              {
                "kind": "string",
                "value": "name"
              },
              {
                "kind": "string",
                "value": "Ada",
                "length": 3,
                "truncated": false
              }
            ],
            [
              {
                "kind": "string",
                "value": "n"
              },
              {
                "kind": "number",
                "value": "2",
                "finite": true
              }
            ],
            [
              {
                "kind": "string",
                "value": "flags"
              },
              {
                "kind": "array",
                "tag": "[object Array]",
                "id": 2,
                "length": 2,
                "truncated": false,
                "entries": [
                  [
                    {
                      "kind": "string",
                      "value": "0"
                    },
                    {
                      "kind": "boolean",
                      "value": "true"
                    }
                  ],
                  [
                    {
                      "kind": "string",
                      "value": "1"
                    },
                    {
                      "kind": "boolean",
                      "value": "false"
                    }
                  ]
                ]
              }
            ],
            [
              {
                "kind": "string",
                "value": "nil"
              },
              {
                "kind": "null"
              }
            ]
          ]
        }
      ],
      [
        "serializedText",
        "name: Ada\n'n': 2\nflags:\n  - true\n  - false\nnil: null\n"
      ],
      [
        "checkpoint",
        {
          "pid": 50843,
          "path": "outputs/destination.yaml",
          "partialBytes": 26,
          "fullBytes": 53,
          "partialHex": "6e616d653a204164610a276e273a20320a666c6167733a0a2020",
          "fullSha256": "5ab891101476719c0d2f64a6fb6f6349f861f103a99d89c8f1a9b90e78bb1e97",
          "kind": "raw-interrupt"
        }
      ]
    ],
    "preparedInput": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "preparedOutput": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "inputState": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputBefore": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "inputAfter": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputAfter": [
      {
        "path": "outputs/checkpoint.json",
        "mode": 33188,
        "size": 251,
        "hex": "7b22706964223a35303834332c2270617468223a226f7574707574732f64657374696e6174696f6e2e79616d6c222c227061727469616c4279746573223a32362c2266756c6c4279746573223a35332c227061727469616c486578223a2236653631366436353361323034313634363130613237366532373361323033323061363636633631363737333361306132303230222c2266756c6c536861323536223a2235616238393131303134373637313963306432663634613666623666363334396638363166313033613939643839633866316139623930653738626231653937222c226b696e64223a227261772d696e74657272757074227d",
        "previewHex": "7b22706964223a35303834332c2270617468223a226f7574707574732f64657374696e6174696f6e2e79616d6c222c227061727469616c4279746573223a3236",
        "sha256": "e17aa821a6362bce8b4b3854e013f688dc2808fbf3d2197c710fc368cd671613"
      },
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 26,
        "hex": "6e616d653a204164610a276e273a20320a666c6167733a0a2020",
        "previewHex": "6e616d653a204164610a276e273a20320a666c6167733a0a2020",
        "sha256": "5fc17ab1af2f0353d7a0933bebbee946c1bff03e6810d699b5064e71581c376d"
      }
    ],
    "checkpoint": {
      "marker": {
        "pid": 50843,
        "path": "outputs/destination.yaml",
        "partialBytes": 26,
        "fullBytes": 53,
        "partialHex": "6e616d653a204164610a276e273a20320a666c6167733a0a2020",
        "fullSha256": "5ab891101476719c0d2f64a6fb6f6349f861f103a99d89c8f1a9b90e78bb1e97",
        "kind": "raw-interrupt"
      },
      "observedMs": 1017.9343329999974,
      "visibleBeforeKill": [
        {
          "path": "outputs/checkpoint.json",
          "mode": 33188,
          "size": 251,
          "hex": "7b22706964223a35303834332c2270617468223a226f7574707574732f64657374696e6174696f6e2e79616d6c222c227061727469616c4279746573223a32362c2266756c6c4279746573223a35332c227061727469616c486578223a2236653631366436353361323034313634363130613237366532373361323033323061363636633631363737333361306132303230222c2266756c6c536861323536223a2235616238393131303134373637313963306432663634613666623666363334396638363166313033613939643839633866316139623930653738626231653937222c226b696e64223a227261772d696e74657272757074227d",
          "previewHex": "7b22706964223a35303834332c2270617468223a226f7574707574732f64657374696e6174696f6e2e79616d6c222c227061727469616c4279746573223a3236",
          "sha256": "e17aa821a6362bce8b4b3854e013f688dc2808fbf3d2197c710fc368cd671613"
        },
        {
          "path": "outputs/destination.yaml",
          "mode": 33188,
          "size": 26,
          "hex": "6e616d653a204164610a276e273a20320a666c6167733a0a2020",
          "previewHex": "6e616d653a204164610a276e273a20320a666c6167733a0a2020",
          "sha256": "5fc17ab1af2f0353d7a0933bebbee946c1bff03e6810d699b5064e71581c376d"
        }
      ]
    },
    "cleanup": [],
    "inputRestored": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputCleaned": [
      {
        "path": "outputs/checkpoint.json",
        "mode": 33188,
        "size": 251,
        "hex": "7b22706964223a35303834332c2270617468223a226f7574707574732f64657374696e6174696f6e2e79616d6c222c227061727469616c4279746573223a32362c2266756c6c4279746573223a35332c227061727469616c486578223a2236653631366436353361323034313634363130613237366532373361323033323061363636633631363737333361306132303230222c2266756c6c536861323536223a2235616238393131303134373637313963306432663634613666623666363334396638363166313033613939643839633866316139623930653738626231653937222c226b696e64223a227261772d696e74657272757074227d",
        "previewHex": "7b22706964223a35303834332c2270617468223a226f7574707574732f64657374696e6174696f6e2e79616d6c222c227061727469616c4279746573223a3236",
        "sha256": "e17aa821a6362bce8b4b3854e013f688dc2808fbf3d2197c710fc368cd671613"
      },
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 26,
        "hex": "6e616d653a204164610a276e273a20320a666c6167733a0a2020",
        "previewHex": "6e616d653a204164610a276e273a20320a666c6167733a0a2020",
        "sha256": "5fc17ab1af2f0353d7a0933bebbee946c1bff03e6810d699b5064e71581c376d"
      }
    ]
  },
  {
    "id": "Y-16-raw-interrupt",
    "attempt": 2,
    "exit": 137,
    "signal": "SIGKILL",
    "faults": [
      [
        "original",
        {
          "kind": "object",
          "tag": "[object Object]",
          "id": 1,
          "length": null,
          "truncated": false,
          "entries": [
            [
              {
                "kind": "string",
                "value": "name"
              },
              {
                "kind": "string",
                "value": "Ada",
                "length": 3,
                "truncated": false
              }
            ],
            [
              {
                "kind": "string",
                "value": "n"
              },
              {
                "kind": "number",
                "value": "1",
                "finite": true
              }
            ],
            [
              {
                "kind": "string",
                "value": "flags"
              },
              {
                "kind": "array",
                "tag": "[object Array]",
                "id": 2,
                "length": 2,
                "truncated": false,
                "entries": [
                  [
                    {
                      "kind": "string",
                      "value": "0"
                    },
                    {
                      "kind": "boolean",
                      "value": "true"
                    }
                  ],
                  [
                    {
                      "kind": "string",
                      "value": "1"
                    },
                    {
                      "kind": "boolean",
                      "value": "false"
                    }
                  ]
                ]
              }
            ],
            [
              {
                "kind": "string",
                "value": "nil"
              },
              {
                "kind": "null"
              }
            ]
          ]
        }
      ],
      [
        "edited",
        {
          "kind": "object",
          "tag": "[object Object]",
          "id": 1,
          "length": null,
          "truncated": false,
          "entries": [
            [
              {
                "kind": "string",
                "value": "name"
              },
              {
                "kind": "string",
                "value": "Ada",
                "length": 3,
                "truncated": false
              }
            ],
            [
              {
                "kind": "string",
                "value": "n"
              },
              {
                "kind": "number",
                "value": "2",
                "finite": true
              }
            ],
            [
              {
                "kind": "string",
                "value": "flags"
              },
              {
                "kind": "array",
                "tag": "[object Array]",
                "id": 2,
                "length": 2,
                "truncated": false,
                "entries": [
                  [
                    {
                      "kind": "string",
                      "value": "0"
                    },
                    {
                      "kind": "boolean",
                      "value": "true"
                    }
                  ],
                  [
                    {
                      "kind": "string",
                      "value": "1"
                    },
                    {
                      "kind": "boolean",
                      "value": "false"
                    }
                  ]
                ]
              }
            ],
            [
              {
                "kind": "string",
                "value": "nil"
              },
              {
                "kind": "null"
              }
            ]
          ]
        }
      ],
      [
        "serializedText",
        "name: Ada\n'n': 2\nflags:\n  - true\n  - false\nnil: null\n"
      ],
      [
        "checkpoint",
        {
          "pid": 50853,
          "path": "outputs/destination.yaml",
          "partialBytes": 26,
          "fullBytes": 53,
          "partialHex": "6e616d653a204164610a276e273a20320a666c6167733a0a2020",
          "fullSha256": "5ab891101476719c0d2f64a6fb6f6349f861f103a99d89c8f1a9b90e78bb1e97",
          "kind": "raw-interrupt"
        }
      ]
    ],
    "preparedInput": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "preparedOutput": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "inputState": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputBefore": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "inputAfter": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputAfter": [
      {
        "path": "outputs/checkpoint.json",
        "mode": 33188,
        "size": 251,
        "hex": "7b22706964223a35303835332c2270617468223a226f7574707574732f64657374696e6174696f6e2e79616d6c222c227061727469616c4279746573223a32362c2266756c6c4279746573223a35332c227061727469616c486578223a2236653631366436353361323034313634363130613237366532373361323033323061363636633631363737333361306132303230222c2266756c6c536861323536223a2235616238393131303134373637313963306432663634613666623666363334396638363166313033613939643839633866316139623930653738626231653937222c226b696e64223a227261772d696e74657272757074227d",
        "previewHex": "7b22706964223a35303835332c2270617468223a226f7574707574732f64657374696e6174696f6e2e79616d6c222c227061727469616c4279746573223a3236",
        "sha256": "e766d6304746ffe3fe521f132a161f1d2bf3b33bbb42e6747d5f1d3bd8e45037"
      },
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 26,
        "hex": "6e616d653a204164610a276e273a20320a666c6167733a0a2020",
        "previewHex": "6e616d653a204164610a276e273a20320a666c6167733a0a2020",
        "sha256": "5fc17ab1af2f0353d7a0933bebbee946c1bff03e6810d699b5064e71581c376d"
      }
    ],
    "checkpoint": {
      "marker": {
        "pid": 50853,
        "path": "outputs/destination.yaml",
        "partialBytes": 26,
        "fullBytes": 53,
        "partialHex": "6e616d653a204164610a276e273a20320a666c6167733a0a2020",
        "fullSha256": "5ab891101476719c0d2f64a6fb6f6349f861f103a99d89c8f1a9b90e78bb1e97",
        "kind": "raw-interrupt"
      },
      "observedMs": 429.8623329999973,
      "visibleBeforeKill": [
        {
          "path": "outputs/checkpoint.json",
          "mode": 33188,
          "size": 251,
          "hex": "7b22706964223a35303835332c2270617468223a226f7574707574732f64657374696e6174696f6e2e79616d6c222c227061727469616c4279746573223a32362c2266756c6c4279746573223a35332c227061727469616c486578223a2236653631366436353361323034313634363130613237366532373361323033323061363636633631363737333361306132303230222c2266756c6c536861323536223a2235616238393131303134373637313963306432663634613666623666363334396638363166313033613939643839633866316139623930653738626231653937222c226b696e64223a227261772d696e74657272757074227d",
          "previewHex": "7b22706964223a35303835332c2270617468223a226f7574707574732f64657374696e6174696f6e2e79616d6c222c227061727469616c4279746573223a3236",
          "sha256": "e766d6304746ffe3fe521f132a161f1d2bf3b33bbb42e6747d5f1d3bd8e45037"
        },
        {
          "path": "outputs/destination.yaml",
          "mode": 33188,
          "size": 26,
          "hex": "6e616d653a204164610a276e273a20320a666c6167733a0a2020",
          "previewHex": "6e616d653a204164610a276e273a20320a666c6167733a0a2020",
          "sha256": "5fc17ab1af2f0353d7a0933bebbee946c1bff03e6810d699b5064e71581c376d"
        }
      ]
    },
    "cleanup": [],
    "inputRestored": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputCleaned": [
      {
        "path": "outputs/checkpoint.json",
        "mode": 33188,
        "size": 251,
        "hex": "7b22706964223a35303835332c2270617468223a226f7574707574732f64657374696e6174696f6e2e79616d6c222c227061727469616c4279746573223a32362c2266756c6c4279746573223a35332c227061727469616c486578223a2236653631366436353361323034313634363130613237366532373361323033323061363636633631363737333361306132303230222c2266756c6c536861323536223a2235616238393131303134373637313963306432663634613666623666363334396638363166313033613939643839633866316139623930653738626231653937222c226b696e64223a227261772d696e74657272757074227d",
        "previewHex": "7b22706964223a35303835332c2270617468223a226f7574707574732f64657374696e6174696f6e2e79616d6c222c227061727469616c4279746573223a3236",
        "sha256": "e766d6304746ffe3fe521f132a161f1d2bf3b33bbb42e6747d5f1d3bd8e45037"
      },
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 26,
        "hex": "6e616d653a204164610a276e273a20320a666c6167733a0a2020",
        "previewHex": "6e616d653a204164610a276e273a20320a666c6167733a0a2020",
        "sha256": "5fc17ab1af2f0353d7a0933bebbee946c1bff03e6810d699b5064e71581c376d"
      }
    ]
  },
  {
    "id": "Y-16-safe-interrupt",
    "attempt": 1,
    "exit": 137,
    "signal": "SIGKILL",
    "faults": [
      [
        "original",
        {
          "kind": "object",
          "tag": "[object Object]",
          "id": 1,
          "length": null,
          "truncated": false,
          "entries": [
            [
              {
                "kind": "string",
                "value": "name"
              },
              {
                "kind": "string",
                "value": "Ada",
                "length": 3,
                "truncated": false
              }
            ],
            [
              {
                "kind": "string",
                "value": "n"
              },
              {
                "kind": "number",
                "value": "1",
                "finite": true
              }
            ],
            [
              {
                "kind": "string",
                "value": "flags"
              },
              {
                "kind": "array",
                "tag": "[object Array]",
                "id": 2,
                "length": 2,
                "truncated": false,
                "entries": [
                  [
                    {
                      "kind": "string",
                      "value": "0"
                    },
                    {
                      "kind": "boolean",
                      "value": "true"
                    }
                  ],
                  [
                    {
                      "kind": "string",
                      "value": "1"
                    },
                    {
                      "kind": "boolean",
                      "value": "false"
                    }
                  ]
                ]
              }
            ],
            [
              {
                "kind": "string",
                "value": "nil"
              },
              {
                "kind": "null"
              }
            ]
          ]
        }
      ],
      [
        "edited",
        {
          "kind": "object",
          "tag": "[object Object]",
          "id": 1,
          "length": null,
          "truncated": false,
          "entries": [
            [
              {
                "kind": "string",
                "value": "name"
              },
              {
                "kind": "string",
                "value": "Ada",
                "length": 3,
                "truncated": false
              }
            ],
            [
              {
                "kind": "string",
                "value": "n"
              },
              {
                "kind": "number",
                "value": "2",
                "finite": true
              }
            ],
            [
              {
                "kind": "string",
                "value": "flags"
              },
              {
                "kind": "array",
                "tag": "[object Array]",
                "id": 2,
                "length": 2,
                "truncated": false,
                "entries": [
                  [
                    {
                      "kind": "string",
                      "value": "0"
                    },
                    {
                      "kind": "boolean",
                      "value": "true"
                    }
                  ],
                  [
                    {
                      "kind": "string",
                      "value": "1"
                    },
                    {
                      "kind": "boolean",
                      "value": "false"
                    }
                  ]
                ]
              }
            ],
            [
              {
                "kind": "string",
                "value": "nil"
              },
              {
                "kind": "null"
              }
            ]
          ]
        }
      ],
      [
        "serializedText",
        "name: Ada\n'n': 2\nflags:\n  - true\n  - false\nnil: null\n"
      ],
      [
        "checkpoint",
        {
          "pid": 50863,
          "path": "outputs/replacement.tmp",
          "partialBytes": 26,
          "fullBytes": 53,
          "partialHex": "6e616d653a204164610a276e273a20320a666c6167733a0a2020",
          "fullSha256": "5ab891101476719c0d2f64a6fb6f6349f861f103a99d89c8f1a9b90e78bb1e97",
          "kind": "safe-interrupt"
        }
      ]
    ],
    "preparedInput": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "preparedOutput": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "inputState": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputBefore": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "inputAfter": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputAfter": [
      {
        "path": "outputs/checkpoint.json",
        "mode": 33188,
        "size": 251,
        "hex": "7b22706964223a35303836332c2270617468223a226f7574707574732f7265706c6163656d656e742e746d70222c227061727469616c4279746573223a32362c2266756c6c4279746573223a35332c227061727469616c486578223a2236653631366436353361323034313634363130613237366532373361323033323061363636633631363737333361306132303230222c2266756c6c536861323536223a2235616238393131303134373637313963306432663634613666623666363334396638363166313033613939643839633866316139623930653738626231653937222c226b696e64223a22736166652d696e74657272757074227d",
        "previewHex": "7b22706964223a35303836332c2270617468223a226f7574707574732f7265706c6163656d656e742e746d70222c227061727469616c4279746573223a32362c",
        "sha256": "0935f7d3cff2da4c8cda354589e2d376aff9eb9bbf52302eadf3b5a19d078aec"
      },
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      },
      {
        "path": "outputs/replacement.tmp",
        "mode": 33188,
        "size": 26,
        "hex": "6e616d653a204164610a276e273a20320a666c6167733a0a2020",
        "previewHex": "6e616d653a204164610a276e273a20320a666c6167733a0a2020",
        "sha256": "5fc17ab1af2f0353d7a0933bebbee946c1bff03e6810d699b5064e71581c376d"
      }
    ],
    "checkpoint": {
      "marker": {
        "pid": 50863,
        "path": "outputs/replacement.tmp",
        "partialBytes": 26,
        "fullBytes": 53,
        "partialHex": "6e616d653a204164610a276e273a20320a666c6167733a0a2020",
        "fullSha256": "5ab891101476719c0d2f64a6fb6f6349f861f103a99d89c8f1a9b90e78bb1e97",
        "kind": "safe-interrupt"
      },
      "observedMs": 308.8229169999977,
      "visibleBeforeKill": [
        {
          "path": "outputs/checkpoint.json",
          "mode": 33188,
          "size": 251,
          "hex": "7b22706964223a35303836332c2270617468223a226f7574707574732f7265706c6163656d656e742e746d70222c227061727469616c4279746573223a32362c2266756c6c4279746573223a35332c227061727469616c486578223a2236653631366436353361323034313634363130613237366532373361323033323061363636633631363737333361306132303230222c2266756c6c536861323536223a2235616238393131303134373637313963306432663634613666623666363334396638363166313033613939643839633866316139623930653738626231653937222c226b696e64223a22736166652d696e74657272757074227d",
          "previewHex": "7b22706964223a35303836332c2270617468223a226f7574707574732f7265706c6163656d656e742e746d70222c227061727469616c4279746573223a32362c",
          "sha256": "0935f7d3cff2da4c8cda354589e2d376aff9eb9bbf52302eadf3b5a19d078aec"
        },
        {
          "path": "outputs/destination.yaml",
          "mode": 33188,
          "size": 9,
          "hex": "4f524947494e414c0a",
          "previewHex": "4f524947494e414c0a",
          "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
        },
        {
          "path": "outputs/replacement.tmp",
          "mode": 33188,
          "size": 26,
          "hex": "6e616d653a204164610a276e273a20320a666c6167733a0a2020",
          "previewHex": "6e616d653a204164610a276e273a20320a666c6167733a0a2020",
          "sha256": "5fc17ab1af2f0353d7a0933bebbee946c1bff03e6810d699b5064e71581c376d"
        }
      ]
    },
    "cleanup": [
      "removed observed orphan outputs/replacement.tmp"
    ],
    "inputRestored": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputCleaned": [
      {
        "path": "outputs/checkpoint.json",
        "mode": 33188,
        "size": 251,
        "hex": "7b22706964223a35303836332c2270617468223a226f7574707574732f7265706c6163656d656e742e746d70222c227061727469616c4279746573223a32362c2266756c6c4279746573223a35332c227061727469616c486578223a2236653631366436353361323034313634363130613237366532373361323033323061363636633631363737333361306132303230222c2266756c6c536861323536223a2235616238393131303134373637313963306432663634613666623666363334396638363166313033613939643839633866316139623930653738626231653937222c226b696e64223a22736166652d696e74657272757074227d",
        "previewHex": "7b22706964223a35303836332c2270617468223a226f7574707574732f7265706c6163656d656e742e746d70222c227061727469616c4279746573223a32362c",
        "sha256": "0935f7d3cff2da4c8cda354589e2d376aff9eb9bbf52302eadf3b5a19d078aec"
      },
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ]
  },
  {
    "id": "Y-16-safe-interrupt",
    "attempt": 2,
    "exit": 137,
    "signal": "SIGKILL",
    "faults": [
      [
        "original",
        {
          "kind": "object",
          "tag": "[object Object]",
          "id": 1,
          "length": null,
          "truncated": false,
          "entries": [
            [
              {
                "kind": "string",
                "value": "name"
              },
              {
                "kind": "string",
                "value": "Ada",
                "length": 3,
                "truncated": false
              }
            ],
            [
              {
                "kind": "string",
                "value": "n"
              },
              {
                "kind": "number",
                "value": "1",
                "finite": true
              }
            ],
            [
              {
                "kind": "string",
                "value": "flags"
              },
              {
                "kind": "array",
                "tag": "[object Array]",
                "id": 2,
                "length": 2,
                "truncated": false,
                "entries": [
                  [
                    {
                      "kind": "string",
                      "value": "0"
                    },
                    {
                      "kind": "boolean",
                      "value": "true"
                    }
                  ],
                  [
                    {
                      "kind": "string",
                      "value": "1"
                    },
                    {
                      "kind": "boolean",
                      "value": "false"
                    }
                  ]
                ]
              }
            ],
            [
              {
                "kind": "string",
                "value": "nil"
              },
              {
                "kind": "null"
              }
            ]
          ]
        }
      ],
      [
        "edited",
        {
          "kind": "object",
          "tag": "[object Object]",
          "id": 1,
          "length": null,
          "truncated": false,
          "entries": [
            [
              {
                "kind": "string",
                "value": "name"
              },
              {
                "kind": "string",
                "value": "Ada",
                "length": 3,
                "truncated": false
              }
            ],
            [
              {
                "kind": "string",
                "value": "n"
              },
              {
                "kind": "number",
                "value": "2",
                "finite": true
              }
            ],
            [
              {
                "kind": "string",
                "value": "flags"
              },
              {
                "kind": "array",
                "tag": "[object Array]",
                "id": 2,
                "length": 2,
                "truncated": false,
                "entries": [
                  [
                    {
                      "kind": "string",
                      "value": "0"
                    },
                    {
                      "kind": "boolean",
                      "value": "true"
                    }
                  ],
                  [
                    {
                      "kind": "string",
                      "value": "1"
                    },
                    {
                      "kind": "boolean",
                      "value": "false"
                    }
                  ]
                ]
              }
            ],
            [
              {
                "kind": "string",
                "value": "nil"
              },
              {
                "kind": "null"
              }
            ]
          ]
        }
      ],
      [
        "serializedText",
        "name: Ada\n'n': 2\nflags:\n  - true\n  - false\nnil: null\n"
      ],
      [
        "checkpoint",
        {
          "pid": 50873,
          "path": "outputs/replacement.tmp",
          "partialBytes": 26,
          "fullBytes": 53,
          "partialHex": "6e616d653a204164610a276e273a20320a666c6167733a0a2020",
          "fullSha256": "5ab891101476719c0d2f64a6fb6f6349f861f103a99d89c8f1a9b90e78bb1e97",
          "kind": "safe-interrupt"
        }
      ]
    ],
    "preparedInput": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "preparedOutput": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "inputState": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputBefore": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "inputAfter": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputAfter": [
      {
        "path": "outputs/checkpoint.json",
        "mode": 33188,
        "size": 251,
        "hex": "7b22706964223a35303837332c2270617468223a226f7574707574732f7265706c6163656d656e742e746d70222c227061727469616c4279746573223a32362c2266756c6c4279746573223a35332c227061727469616c486578223a2236653631366436353361323034313634363130613237366532373361323033323061363636633631363737333361306132303230222c2266756c6c536861323536223a2235616238393131303134373637313963306432663634613666623666363334396638363166313033613939643839633866316139623930653738626231653937222c226b696e64223a22736166652d696e74657272757074227d",
        "previewHex": "7b22706964223a35303837332c2270617468223a226f7574707574732f7265706c6163656d656e742e746d70222c227061727469616c4279746573223a32362c",
        "sha256": "fa56473533daad7a3d03a919bd3cb1d0759cad8f1e567e32bd9d3d88cd826c69"
      },
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      },
      {
        "path": "outputs/replacement.tmp",
        "mode": 33188,
        "size": 26,
        "hex": "6e616d653a204164610a276e273a20320a666c6167733a0a2020",
        "previewHex": "6e616d653a204164610a276e273a20320a666c6167733a0a2020",
        "sha256": "5fc17ab1af2f0353d7a0933bebbee946c1bff03e6810d699b5064e71581c376d"
      }
    ],
    "checkpoint": {
      "marker": {
        "pid": 50873,
        "path": "outputs/replacement.tmp",
        "partialBytes": 26,
        "fullBytes": 53,
        "partialHex": "6e616d653a204164610a276e273a20320a666c6167733a0a2020",
        "fullSha256": "5ab891101476719c0d2f64a6fb6f6349f861f103a99d89c8f1a9b90e78bb1e97",
        "kind": "safe-interrupt"
      },
      "observedMs": 274.0464579999971,
      "visibleBeforeKill": [
        {
          "path": "outputs/checkpoint.json",
          "mode": 33188,
          "size": 251,
          "hex": "7b22706964223a35303837332c2270617468223a226f7574707574732f7265706c6163656d656e742e746d70222c227061727469616c4279746573223a32362c2266756c6c4279746573223a35332c227061727469616c486578223a2236653631366436353361323034313634363130613237366532373361323033323061363636633631363737333361306132303230222c2266756c6c536861323536223a2235616238393131303134373637313963306432663634613666623666363334396638363166313033613939643839633866316139623930653738626231653937222c226b696e64223a22736166652d696e74657272757074227d",
          "previewHex": "7b22706964223a35303837332c2270617468223a226f7574707574732f7265706c6163656d656e742e746d70222c227061727469616c4279746573223a32362c",
          "sha256": "fa56473533daad7a3d03a919bd3cb1d0759cad8f1e567e32bd9d3d88cd826c69"
        },
        {
          "path": "outputs/destination.yaml",
          "mode": 33188,
          "size": 9,
          "hex": "4f524947494e414c0a",
          "previewHex": "4f524947494e414c0a",
          "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
        },
        {
          "path": "outputs/replacement.tmp",
          "mode": 33188,
          "size": 26,
          "hex": "6e616d653a204164610a276e273a20320a666c6167733a0a2020",
          "previewHex": "6e616d653a204164610a276e273a20320a666c6167733a0a2020",
          "sha256": "5fc17ab1af2f0353d7a0933bebbee946c1bff03e6810d699b5064e71581c376d"
        }
      ]
    },
    "cleanup": [
      "removed observed orphan outputs/replacement.tmp"
    ],
    "inputRestored": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputCleaned": [
      {
        "path": "outputs/checkpoint.json",
        "mode": 33188,
        "size": 251,
        "hex": "7b22706964223a35303837332c2270617468223a226f7574707574732f7265706c6163656d656e742e746d70222c227061727469616c4279746573223a32362c2266756c6c4279746573223a35332c227061727469616c486578223a2236653631366436353361323034313634363130613237366532373361323033323061363636633631363737333361306132303230222c2266756c6c536861323536223a2235616238393131303134373637313963306432663634613666623666363334396638363166313033613939643839633866316139623930653738626231653937222c226b696e64223a22736166652d696e74657272757074227d",
        "previewHex": "7b22706964223a35303837332c2270617468223a226f7574707574732f7265706c6163656d656e742e746d70222c227061727469616c4279746573223a32362c",
        "sha256": "fa56473533daad7a3d03a919bd3cb1d0759cad8f1e567e32bd9d3d88cd826c69"
      },
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ]
  },
  {
    "id": "Y-16-rename-injected",
    "attempt": 1,
    "exit": 0,
    "signal": null,
    "faults": [
      [
        "original",
        {
          "kind": "object",
          "tag": "[object Object]",
          "id": 1,
          "length": null,
          "truncated": false,
          "entries": [
            [
              {
                "kind": "string",
                "value": "name"
              },
              {
                "kind": "string",
                "value": "Ada",
                "length": 3,
                "truncated": false
              }
            ],
            [
              {
                "kind": "string",
                "value": "n"
              },
              {
                "kind": "number",
                "value": "1",
                "finite": true
              }
            ],
            [
              {
                "kind": "string",
                "value": "flags"
              },
              {
                "kind": "array",
                "tag": "[object Array]",
                "id": 2,
                "length": 2,
                "truncated": false,
                "entries": [
                  [
                    {
                      "kind": "string",
                      "value": "0"
                    },
                    {
                      "kind": "boolean",
                      "value": "true"
                    }
                  ],
                  [
                    {
                      "kind": "string",
                      "value": "1"
                    },
                    {
                      "kind": "boolean",
                      "value": "false"
                    }
                  ]
                ]
              }
            ],
            [
              {
                "kind": "string",
                "value": "nil"
              },
              {
                "kind": "null"
              }
            ]
          ]
        }
      ],
      [
        "edited",
        {
          "kind": "object",
          "tag": "[object Object]",
          "id": 1,
          "length": null,
          "truncated": false,
          "entries": [
            [
              {
                "kind": "string",
                "value": "name"
              },
              {
                "kind": "string",
                "value": "Ada",
                "length": 3,
                "truncated": false
              }
            ],
            [
              {
                "kind": "string",
                "value": "n"
              },
              {
                "kind": "number",
                "value": "2",
                "finite": true
              }
            ],
            [
              {
                "kind": "string",
                "value": "flags"
              },
              {
                "kind": "array",
                "tag": "[object Array]",
                "id": 2,
                "length": 2,
                "truncated": false,
                "entries": [
                  [
                    {
                      "kind": "string",
                      "value": "0"
                    },
                    {
                      "kind": "boolean",
                      "value": "true"
                    }
                  ],
                  [
                    {
                      "kind": "string",
                      "value": "1"
                    },
                    {
                      "kind": "boolean",
                      "value": "false"
                    }
                  ]
                ]
              }
            ],
            [
              {
                "kind": "string",
                "value": "nil"
              },
              {
                "kind": "null"
              }
            ]
          ]
        }
      ],
      [
        "serializedText",
        "name: Ada\n'n': 2\nflags:\n  - true\n  - false\nnil: null\n"
      ],
      [
        "error",
        {
          "stage": "pre-rename",
          "name": "Error",
          "message": "DECLARED_INJECTION_BEFORE_RENAME",
          "details": {
            "kind": "object",
            "tag": "[object Error]",
            "id": 1,
            "length": null,
            "truncated": false,
            "entries": []
          }
        }
      ],
      [
        "fault",
        {
          "requested": "rename-injected",
          "stage": "pre-rename",
          "class": "deliberate-injection"
        }
      ]
    ],
    "preparedInput": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "preparedOutput": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "inputState": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputBefore": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "inputAfter": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputAfter": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      },
      {
        "path": "outputs/replacement.tmp",
        "mode": 33188,
        "size": 53,
        "hex": "6e616d653a204164610a276e273a20320a666c6167733a0a20202d20747275650a20202d2066616c73650a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a276e273a20320a666c6167733a0a20202d20747275650a20202d2066616c73650a6e696c3a206e756c6c0a",
        "sha256": "5ab891101476719c0d2f64a6fb6f6349f861f103a99d89c8f1a9b90e78bb1e97"
      }
    ],
    "checkpoint": null,
    "cleanup": [
      "removed observed orphan outputs/replacement.tmp"
    ],
    "inputRestored": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputCleaned": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ]
  },
  {
    "id": "Y-16-rename-injected",
    "attempt": 2,
    "exit": 0,
    "signal": null,
    "faults": [
      [
        "original",
        {
          "kind": "object",
          "tag": "[object Object]",
          "id": 1,
          "length": null,
          "truncated": false,
          "entries": [
            [
              {
                "kind": "string",
                "value": "name"
              },
              {
                "kind": "string",
                "value": "Ada",
                "length": 3,
                "truncated": false
              }
            ],
            [
              {
                "kind": "string",
                "value": "n"
              },
              {
                "kind": "number",
                "value": "1",
                "finite": true
              }
            ],
            [
              {
                "kind": "string",
                "value": "flags"
              },
              {
                "kind": "array",
                "tag": "[object Array]",
                "id": 2,
                "length": 2,
                "truncated": false,
                "entries": [
                  [
                    {
                      "kind": "string",
                      "value": "0"
                    },
                    {
                      "kind": "boolean",
                      "value": "true"
                    }
                  ],
                  [
                    {
                      "kind": "string",
                      "value": "1"
                    },
                    {
                      "kind": "boolean",
                      "value": "false"
                    }
                  ]
                ]
              }
            ],
            [
              {
                "kind": "string",
                "value": "nil"
              },
              {
                "kind": "null"
              }
            ]
          ]
        }
      ],
      [
        "edited",
        {
          "kind": "object",
          "tag": "[object Object]",
          "id": 1,
          "length": null,
          "truncated": false,
          "entries": [
            [
              {
                "kind": "string",
                "value": "name"
              },
              {
                "kind": "string",
                "value": "Ada",
                "length": 3,
                "truncated": false
              }
            ],
            [
              {
                "kind": "string",
                "value": "n"
              },
              {
                "kind": "number",
                "value": "2",
                "finite": true
              }
            ],
            [
              {
                "kind": "string",
                "value": "flags"
              },
              {
                "kind": "array",
                "tag": "[object Array]",
                "id": 2,
                "length": 2,
                "truncated": false,
                "entries": [
                  [
                    {
                      "kind": "string",
                      "value": "0"
                    },
                    {
                      "kind": "boolean",
                      "value": "true"
                    }
                  ],
                  [
                    {
                      "kind": "string",
                      "value": "1"
                    },
                    {
                      "kind": "boolean",
                      "value": "false"
                    }
                  ]
                ]
              }
            ],
            [
              {
                "kind": "string",
                "value": "nil"
              },
              {
                "kind": "null"
              }
            ]
          ]
        }
      ],
      [
        "serializedText",
        "name: Ada\n'n': 2\nflags:\n  - true\n  - false\nnil: null\n"
      ],
      [
        "error",
        {
          "stage": "pre-rename",
          "name": "Error",
          "message": "DECLARED_INJECTION_BEFORE_RENAME",
          "details": {
            "kind": "object",
            "tag": "[object Error]",
            "id": 1,
            "length": null,
            "truncated": false,
            "entries": []
          }
        }
      ],
      [
        "fault",
        {
          "requested": "rename-injected",
          "stage": "pre-rename",
          "class": "deliberate-injection"
        }
      ]
    ],
    "preparedInput": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "preparedOutput": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "inputState": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputBefore": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ],
    "inputAfter": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputAfter": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      },
      {
        "path": "outputs/replacement.tmp",
        "mode": 33188,
        "size": 53,
        "hex": "6e616d653a204164610a276e273a20320a666c6167733a0a20202d20747275650a20202d2066616c73650a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a276e273a20320a666c6167733a0a20202d20747275650a20202d2066616c73650a6e696c3a206e756c6c0a",
        "sha256": "5ab891101476719c0d2f64a6fb6f6349f861f103a99d89c8f1a9b90e78bb1e97"
      }
    ],
    "checkpoint": null,
    "cleanup": [
      "removed observed orphan outputs/replacement.tmp"
    ],
    "inputRestored": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputCleaned": [
      {
        "path": "outputs/destination.yaml",
        "mode": 33188,
        "size": 9,
        "hex": "4f524947494e414c0a",
        "previewHex": "4f524947494e414c0a",
        "sha256": "9660b3303631e95817f72c7536939f0eca9e20c0d7b86382a39e4a98a1b26151"
      }
    ]
  },
  {
    "id": "Y-16-rename-directory",
    "attempt": 1,
    "exit": 0,
    "signal": null,
    "faults": [
      [
        "original",
        {
          "kind": "object",
          "tag": "[object Object]",
          "id": 1,
          "length": null,
          "truncated": false,
          "entries": [
            [
              {
                "kind": "string",
                "value": "name"
              },
              {
                "kind": "string",
                "value": "Ada",
                "length": 3,
                "truncated": false
              }
            ],
            [
              {
                "kind": "string",
                "value": "n"
              },
              {
                "kind": "number",
                "value": "1",
                "finite": true
              }
            ],
            [
              {
                "kind": "string",
                "value": "flags"
              },
              {
                "kind": "array",
                "tag": "[object Array]",
                "id": 2,
                "length": 2,
                "truncated": false,
                "entries": [
                  [
                    {
                      "kind": "string",
                      "value": "0"
                    },
                    {
                      "kind": "boolean",
                      "value": "true"
                    }
                  ],
                  [
                    {
                      "kind": "string",
                      "value": "1"
                    },
                    {
                      "kind": "boolean",
                      "value": "false"
                    }
                  ]
                ]
              }
            ],
            [
              {
                "kind": "string",
                "value": "nil"
              },
              {
                "kind": "null"
              }
            ]
          ]
        }
      ],
      [
        "edited",
        {
          "kind": "object",
          "tag": "[object Object]",
          "id": 1,
          "length": null,
          "truncated": false,
          "entries": [
            [
              {
                "kind": "string",
                "value": "name"
              },
              {
                "kind": "string",
                "value": "Ada",
                "length": 3,
                "truncated": false
              }
            ],
            [
              {
                "kind": "string",
                "value": "n"
              },
              {
                "kind": "number",
                "value": "2",
                "finite": true
              }
            ],
            [
              {
                "kind": "string",
                "value": "flags"
              },
              {
                "kind": "array",
                "tag": "[object Array]",
                "id": 2,
                "length": 2,
                "truncated": false,
                "entries": [
                  [
                    {
                      "kind": "string",
                      "value": "0"
                    },
                    {
                      "kind": "boolean",
                      "value": "true"
                    }
                  ],
                  [
                    {
                      "kind": "string",
                      "value": "1"
                    },
                    {
                      "kind": "boolean",
                      "value": "false"
                    }
                  ]
                ]
              }
            ],
            [
              {
                "kind": "string",
                "value": "nil"
              },
              {
                "kind": "null"
              }
            ]
          ]
        }
      ],
      [
        "serializedText",
        "name: Ada\n'n': 2\nflags:\n  - true\n  - false\nnil: null\n"
      ],
      [
        "error",
        {
          "stage": "rename",
          "name": "IsADirectory",
          "message": "Is a directory (os error 21): rename 'outputs/replacement.tmp' -> 'outputs/destination.yaml'",
          "details": {
            "kind": "object",
            "tag": "[object Error]",
            "id": 1,
            "length": null,
            "truncated": false,
            "entries": [
              [
                {
                  "kind": "string",
                  "value": "name"
                },
                {
                  "kind": "string",
                  "value": "IsADirectory",
                  "length": 12,
                  "truncated": false
                }
              ],
              [
                {
                  "kind": "string",
                  "value": "code"
                },
                {
                  "kind": "string",
                  "value": "EISDIR",
                  "length": 6,
                  "truncated": false
                }
              ]
            ]
          }
        }
      ],
      [
        "fault",
        {
          "requested": "rename-directory",
          "stage": "rename",
          "class": "operation-error"
        }
      ]
    ],
    "preparedInput": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "preparedOutput": [
      {
        "path": "outputs/destination.yaml",
        "directory": true,
        "mode": 16877
      },
      {
        "path": "outputs/destination.yaml/sentinel.txt",
        "mode": 33188,
        "size": 19,
        "hex": "4449524543544f52592d53454e54494e454c0a",
        "previewHex": "4449524543544f52592d53454e54494e454c0a",
        "sha256": "646b260d2e2e0b41d14bdfa302ee36cd8f9083ef289f2e7e62783ab89308b2e6"
      }
    ],
    "inputState": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputBefore": [
      {
        "path": "outputs/destination.yaml",
        "directory": true,
        "mode": 16877
      },
      {
        "path": "outputs/destination.yaml/sentinel.txt",
        "mode": 33188,
        "size": 19,
        "hex": "4449524543544f52592d53454e54494e454c0a",
        "previewHex": "4449524543544f52592d53454e54494e454c0a",
        "sha256": "646b260d2e2e0b41d14bdfa302ee36cd8f9083ef289f2e7e62783ab89308b2e6"
      }
    ],
    "inputAfter": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputAfter": [
      {
        "path": "outputs/destination.yaml",
        "directory": true,
        "mode": 16877
      },
      {
        "path": "outputs/destination.yaml/sentinel.txt",
        "mode": 33188,
        "size": 19,
        "hex": "4449524543544f52592d53454e54494e454c0a",
        "previewHex": "4449524543544f52592d53454e54494e454c0a",
        "sha256": "646b260d2e2e0b41d14bdfa302ee36cd8f9083ef289f2e7e62783ab89308b2e6"
      },
      {
        "path": "outputs/replacement.tmp",
        "mode": 33188,
        "size": 53,
        "hex": "6e616d653a204164610a276e273a20320a666c6167733a0a20202d20747275650a20202d2066616c73650a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a276e273a20320a666c6167733a0a20202d20747275650a20202d2066616c73650a6e696c3a206e756c6c0a",
        "sha256": "5ab891101476719c0d2f64a6fb6f6349f861f103a99d89c8f1a9b90e78bb1e97"
      }
    ],
    "checkpoint": null,
    "cleanup": [
      "removed observed orphan outputs/replacement.tmp"
    ],
    "inputRestored": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputCleaned": [
      {
        "path": "outputs/destination.yaml",
        "directory": true,
        "mode": 16877
      },
      {
        "path": "outputs/destination.yaml/sentinel.txt",
        "mode": 33188,
        "size": 19,
        "hex": "4449524543544f52592d53454e54494e454c0a",
        "previewHex": "4449524543544f52592d53454e54494e454c0a",
        "sha256": "646b260d2e2e0b41d14bdfa302ee36cd8f9083ef289f2e7e62783ab89308b2e6"
      }
    ]
  },
  {
    "id": "Y-16-rename-directory",
    "attempt": 2,
    "exit": 0,
    "signal": null,
    "faults": [
      [
        "original",
        {
          "kind": "object",
          "tag": "[object Object]",
          "id": 1,
          "length": null,
          "truncated": false,
          "entries": [
            [
              {
                "kind": "string",
                "value": "name"
              },
              {
                "kind": "string",
                "value": "Ada",
                "length": 3,
                "truncated": false
              }
            ],
            [
              {
                "kind": "string",
                "value": "n"
              },
              {
                "kind": "number",
                "value": "1",
                "finite": true
              }
            ],
            [
              {
                "kind": "string",
                "value": "flags"
              },
              {
                "kind": "array",
                "tag": "[object Array]",
                "id": 2,
                "length": 2,
                "truncated": false,
                "entries": [
                  [
                    {
                      "kind": "string",
                      "value": "0"
                    },
                    {
                      "kind": "boolean",
                      "value": "true"
                    }
                  ],
                  [
                    {
                      "kind": "string",
                      "value": "1"
                    },
                    {
                      "kind": "boolean",
                      "value": "false"
                    }
                  ]
                ]
              }
            ],
            [
              {
                "kind": "string",
                "value": "nil"
              },
              {
                "kind": "null"
              }
            ]
          ]
        }
      ],
      [
        "edited",
        {
          "kind": "object",
          "tag": "[object Object]",
          "id": 1,
          "length": null,
          "truncated": false,
          "entries": [
            [
              {
                "kind": "string",
                "value": "name"
              },
              {
                "kind": "string",
                "value": "Ada",
                "length": 3,
                "truncated": false
              }
            ],
            [
              {
                "kind": "string",
                "value": "n"
              },
              {
                "kind": "number",
                "value": "2",
                "finite": true
              }
            ],
            [
              {
                "kind": "string",
                "value": "flags"
              },
              {
                "kind": "array",
                "tag": "[object Array]",
                "id": 2,
                "length": 2,
                "truncated": false,
                "entries": [
                  [
                    {
                      "kind": "string",
                      "value": "0"
                    },
                    {
                      "kind": "boolean",
                      "value": "true"
                    }
                  ],
                  [
                    {
                      "kind": "string",
                      "value": "1"
                    },
                    {
                      "kind": "boolean",
                      "value": "false"
                    }
                  ]
                ]
              }
            ],
            [
              {
                "kind": "string",
                "value": "nil"
              },
              {
                "kind": "null"
              }
            ]
          ]
        }
      ],
      [
        "serializedText",
        "name: Ada\n'n': 2\nflags:\n  - true\n  - false\nnil: null\n"
      ],
      [
        "error",
        {
          "stage": "rename",
          "name": "IsADirectory",
          "message": "Is a directory (os error 21): rename 'outputs/replacement.tmp' -> 'outputs/destination.yaml'",
          "details": {
            "kind": "object",
            "tag": "[object Error]",
            "id": 1,
            "length": null,
            "truncated": false,
            "entries": [
              [
                {
                  "kind": "string",
                  "value": "name"
                },
                {
                  "kind": "string",
                  "value": "IsADirectory",
                  "length": 12,
                  "truncated": false
                }
              ],
              [
                {
                  "kind": "string",
                  "value": "code"
                },
                {
                  "kind": "string",
                  "value": "EISDIR",
                  "length": 6,
                  "truncated": false
                }
              ]
            ]
          }
        }
      ],
      [
        "fault",
        {
          "requested": "rename-directory",
          "stage": "rename",
          "class": "operation-error"
        }
      ]
    ],
    "preparedInput": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "preparedOutput": [
      {
        "path": "outputs/destination.yaml",
        "directory": true,
        "mode": 16877
      },
      {
        "path": "outputs/destination.yaml/sentinel.txt",
        "mode": 33188,
        "size": 19,
        "hex": "4449524543544f52592d53454e54494e454c0a",
        "previewHex": "4449524543544f52592d53454e54494e454c0a",
        "sha256": "646b260d2e2e0b41d14bdfa302ee36cd8f9083ef289f2e7e62783ab89308b2e6"
      }
    ],
    "inputState": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputBefore": [
      {
        "path": "outputs/destination.yaml",
        "directory": true,
        "mode": 16877
      },
      {
        "path": "outputs/destination.yaml/sentinel.txt",
        "mode": 33188,
        "size": 19,
        "hex": "4449524543544f52592d53454e54494e454c0a",
        "previewHex": "4449524543544f52592d53454e54494e454c0a",
        "sha256": "646b260d2e2e0b41d14bdfa302ee36cd8f9083ef289f2e7e62783ab89308b2e6"
      }
    ],
    "inputAfter": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputAfter": [
      {
        "path": "outputs/destination.yaml",
        "directory": true,
        "mode": 16877
      },
      {
        "path": "outputs/destination.yaml/sentinel.txt",
        "mode": 33188,
        "size": 19,
        "hex": "4449524543544f52592d53454e54494e454c0a",
        "previewHex": "4449524543544f52592d53454e54494e454c0a",
        "sha256": "646b260d2e2e0b41d14bdfa302ee36cd8f9083ef289f2e7e62783ab89308b2e6"
      },
      {
        "path": "outputs/replacement.tmp",
        "mode": 33188,
        "size": 53,
        "hex": "6e616d653a204164610a276e273a20320a666c6167733a0a20202d20747275650a20202d2066616c73650a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a276e273a20320a666c6167733a0a20202d20747275650a20202d2066616c73650a6e696c3a206e756c6c0a",
        "sha256": "5ab891101476719c0d2f64a6fb6f6349f861f103a99d89c8f1a9b90e78bb1e97"
      }
    ],
    "checkpoint": null,
    "cleanup": [
      "removed observed orphan outputs/replacement.tmp"
    ],
    "inputRestored": [
      {
        "path": "inputs/source.yaml",
        "mode": 33188,
        "size": 46,
        "hex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "previewHex": "6e616d653a204164610a6e3a20310a666c6167733a205b747275652c2066616c73655d0a6e696c3a206e756c6c0a",
        "sha256": "7455a3204d50ad250134ecfef22bb13c8119e87411b44f64fd535a0f4d723a1b"
      }
    ],
    "outputCleaned": [
      {
        "path": "outputs/destination.yaml",
        "directory": true,
        "mode": 16877
      },
      {
        "path": "outputs/destination.yaml/sentinel.txt",
        "mode": 33188,
        "size": 19,
        "hex": "4449524543544f52592d53454e54494e454c0a",
        "previewHex": "4449524543544f52592d53454e54494e454c0a",
        "sha256": "646b260d2e2e0b41d14bdfa302ee36cd8f9083ef289f2e7e62783ab89308b2e6"
      }
    ]
  }
]
```
