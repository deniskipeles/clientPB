export const tablesTypes =  [
      {
        "collectionId": "16ozzwpv14576vn",
        "collectionName": "view_tables",
        "createRule": "(@request.auth.roles ~ 'students' && @request.auth.collectionName = 'personnel')",
        "created": "2023-10-08 10:51:22.023Z",
        "deleteRule": "(@request.auth.roles ~ 'students' && @request.auth.collectionName = 'personnel')",
        "id": "_pb_users_auth_",
        "indexes": [ ],
        "listRule": "@request.auth.id != ''",
        "name": "students",
        "options": {
          "allowEmailAuth": true,
          "allowOAuth2Auth": true,
          "allowUsernameAuth": true,
          "exceptEmailDomains": null,
          "manageRule": "id = @request.auth.id || (@request.auth.other_roles ~ 'students' && @request.auth.collectionName = 'personnel')",
          "minPasswordLength": 5,
          "onlyEmailDomains": null,
          "requireEmail": false
        },
        "schema": [
          {
            "system": false,
            "id": "users_name",
            "name": "name",
            "type": "text",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "min": null,
              "max": null,
              "pattern": ""
            }
          },
          {
            "system": false,
            "id": "users_avatar",
            "name": "avatar",
            "type": "file",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "maxSelect": 1,
              "maxSize": 5242880,
              "mimeTypes": [
                "image/jpeg",
                "image/png",
                "image/svg+xml",
                "image/gif",
                "image/webp"
              ],
              "thumbs": null,
              "protected": false
            }
          },
          {
            "system": false,
            "id": "ewx7qtaz",
            "name": "current_class",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "yvd1531i3j1fzep",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          }
        ],
        "system": 0,
        "type": "auth",
        "updateRule": "id = @request.auth.id || (@request.auth.roles ~ 'students' && @request.auth.collectionName = 'personnel')",
        "updated": "2023-10-21 12:35:36.357Z",
        "viewRule": "@request.auth.id != ''"
      },
      {
        "collectionId": "16ozzwpv14576vn",
        "collectionName": "view_tables",
        "createRule": null,
        "created": "2023-10-08 10:55:17.200Z",
        "deleteRule": null,
        "id": "d3vgvmu6ng54z65",
        "indexes": [ ],
        "listRule": "",
        "name": "z_roots",
        "options": { },
        "schema": [
          {
            "system": false,
            "id": "bd4yteox",
            "name": "name",
            "type": "text",
            "required": false,
            "presentable": true,
            "unique": false,
            "options": {
              "min": null,
              "max": null,
              "pattern": ""
            }
          },
          {
            "system": false,
            "id": "3a9ynxad",
            "name": "data",
            "type": "json",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "saf0gutw",
            "name": "more_photos",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "5lefk5zohg7o6au",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": null,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "xigsp9so",
            "name": "photos",
            "type": "file",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "maxSelect": 99,
              "maxSize": 5242880,
              "mimeTypes": [ ],
              "thumbs": [ ],
              "protected": false
            }
          }
        ],
        "system": 0,
        "type": "base",
        "updateRule": null,
        "updated": "2023-10-21 15:05:43.298Z",
        "viewRule": ""
      },
      {
        "collectionId": "16ozzwpv14576vn",
        "collectionName": "view_tables",
        "createRule": null,
        "created": "2023-10-08 11:03:26.253Z",
        "deleteRule": null,
        "id": "cdnkz8chtyil438",
        "indexes": [
          "CREATE UNIQUE INDEX `idx_T1p6iuL` ON `z_class_levels` (`name`)"
        ],
        "listRule": "",
        "name": "z_class_levels",
        "options": { },
        "schema": [
          {
            "system": false,
            "id": "nsfcyoci",
            "name": "name",
            "type": "text",
            "required": false,
            "presentable": true,
            "unique": false,
            "options": {
              "min": null,
              "max": null,
              "pattern": ""
            }
          },
          {
            "system": false,
            "id": "zqnm62ha",
            "name": "class_number",
            "type": "number",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "min": null,
              "max": null,
              "noDecimal": false
            }
          },
          {
            "system": false,
            "id": "64adksdp",
            "name": "description",
            "type": "editor",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "convertUrls": false
            }
          }
        ],
        "system": 0,
        "type": "base",
        "updateRule": null,
        "updated": "2023-10-08 13:20:44.675Z",
        "viewRule": ""
      },
      {
        "collectionId": "16ozzwpv14576vn",
        "collectionName": "view_tables",
        "createRule": null,
        "created": "2023-10-08 11:05:42.945Z",
        "deleteRule": null,
        "id": "s06gyf4crcgzdn8",
        "indexes": [
          "CREATE INDEX `idx_LRgvogy` ON `subjects` (\n  `name`,\n  `class_level`\n)"
        ],
        "listRule": "",
        "name": "subjects",
        "options": { },
        "schema": [
          {
            "system": false,
            "id": "yhe0gywj",
            "name": "name",
            "type": "text",
            "required": false,
            "presentable": true,
            "unique": false,
            "options": {
              "min": null,
              "max": 50,
              "pattern": ""
            }
          },
          {
            "system": false,
            "id": "1mjvnemo",
            "name": "class_level",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "cdnkz8chtyil438",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "epa2r8gt",
            "name": "description",
            "type": "editor",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "convertUrls": false
            }
          }
        ],
        "system": 0,
        "type": "base",
        "updateRule": null,
        "updated": "2023-10-10 17:56:45.417Z",
        "viewRule": ""
      },
      {
        "collectionId": "16ozzwpv14576vn",
        "collectionName": "view_tables",
        "createRule": null,
        "created": "2023-10-08 11:11:05.424Z",
        "deleteRule": null,
        "id": "h00kv48u8r0jg97",
        "indexes": [ ],
        "listRule": "",
        "name": "personnel",
        "options": {
          "allowEmailAuth": true,
          "allowOAuth2Auth": true,
          "allowUsernameAuth": true,
          "exceptEmailDomains": null,
          "manageRule": null,
          "minPasswordLength": 5,
          "onlyEmailDomains": null,
          "requireEmail": true
        },
        "schema": [
          {
            "system": false,
            "id": "ylabderp",
            "name": "name",
            "type": "text",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "min": null,
              "max": 50,
              "pattern": ""
            }
          },
          {
            "system": false,
            "id": "5pkjfcty",
            "name": "description",
            "type": "editor",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "convertUrls": false
            }
          },
          {
            "system": false,
            "id": "zb8pmhsf",
            "name": "phone_number",
            "type": "text",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "min": 8,
              "max": 16,
              "pattern": ""
            }
          },
          {
            "system": false,
            "id": "pohoyipw",
            "name": "active",
            "type": "bool",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "whcqxxms",
            "name": "avatar",
            "type": "file",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "maxSelect": 1,
              "maxSize": 5242880,
              "mimeTypes": [ ],
              "thumbs": [
                "200x200",
                "200x0"
              ],
              "protected": false
            }
          },
          {
            "system": false,
            "id": "p1gp4ta3",
            "name": "roles",
            "type": "select",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "maxSelect": 6,
              "values": [
                "students",
                "library",
                "exams",
                "classes",
                "school attendance",
                "lesson attendance"
              ]
            }
          }
        ],
        "system": 0,
        "type": "auth",
        "updateRule": "id = @request.auth.id",
        "updated": "2023-10-21 03:51:21.671Z",
        "viewRule": ""
      },
      {
        "collectionId": "16ozzwpv14576vn",
        "collectionName": "view_tables",
        "createRule": "(@request.auth.roles ~ 'library' && @request.auth.collectionName = 'personnel')",
        "created": "2023-10-08 11:11:25.360Z",
        "deleteRule": "(@request.auth.roles ~ 'library' && @request.auth.collectionName = 'personnel')",
        "id": "s88dzrbga3w2zxb",
        "indexes": [ ],
        "listRule": "",
        "name": "books",
        "options": { },
        "schema": [
          {
            "system": false,
            "id": "8kna700m",
            "name": "name",
            "type": "text",
            "required": false,
            "presentable": true,
            "unique": false,
            "options": {
              "min": null,
              "max": 50,
              "pattern": ""
            }
          },
          {
            "system": false,
            "id": "tltxzq3b",
            "name": "description",
            "type": "editor",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "convertUrls": false
            }
          },
          {
            "system": false,
            "id": "ootmwbtu",
            "name": "cover_images",
            "type": "file",
            "required": false,
            "presentable": true,
            "unique": false,
            "options": {
              "maxSelect": 99,
              "maxSize": 5242880,
              "mimeTypes": [ ],
              "thumbs": [
                "200x0",
                "200x200"
              ],
              "protected": false
            }
          },
          {
            "system": false,
            "id": "lrefmnoi",
            "name": "maximum_days_to_borrow",
            "type": "number",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "min": null,
              "max": null,
              "noDecimal": false
            }
          },
          {
            "system": false,
            "id": "4r9vfi57",
            "name": "class_level",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "cdnkz8chtyil438",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "0wqhgzfk",
            "name": "subject",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "s06gyf4crcgzdn8",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "ps29t5nl",
            "name": "added_by",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "h00kv48u8r0jg97",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          }
        ],
        "system": 0,
        "type": "base",
        "updateRule": "(@request.auth.roles ~ 'library' && @request.auth.collectionName = 'personnel')",
        "updated": "2023-10-08 13:12:16.983Z",
        "viewRule": ""
      },
      {
        "collectionId": "16ozzwpv14576vn",
        "collectionName": "view_tables",
        "createRule": "(@request.auth.roles ~ 'classes' && @request.auth.collectionName = 'personnel')",
        "created": "2023-10-08 11:24:26.039Z",
        "deleteRule": "(@request.auth.roles ~ 'classes' && @request.auth.collectionName = 'personnel')",
        "id": "yvd1531i3j1fzep",
        "indexes": [
          "CREATE UNIQUE INDEX `idx_ocCDWqC` ON `classes` (\n  `class_level`,\n  `academic_year`\n)"
        ],
        "listRule": "",
        "name": "classes",
        "options": { },
        "schema": [
          {
            "system": false,
            "id": "q1fpywa9",
            "name": "class_level",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "cdnkz8chtyil438",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "4k4buf1p",
            "name": "name",
            "type": "text",
            "required": false,
            "presentable": true,
            "unique": false,
            "options": {
              "min": null,
              "max": 50,
              "pattern": ""
            }
          },
          {
            "system": false,
            "id": "6ejwmrsi",
            "name": "academic_year",
            "type": "text",
            "required": false,
            "presentable": true,
            "unique": false,
            "options": {
              "min": null,
              "max": 20,
              "pattern": ""
            }
          },
          {
            "system": false,
            "id": "jcawrepr",
            "name": "more_details",
            "type": "json",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "xa34jk4b",
            "name": "subjects",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "s06gyf4crcgzdn8",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": null,
              "displayFields": null
            }
          }
        ],
        "system": 0,
        "type": "base",
        "updateRule": "(@request.auth.roles ~ 'classes' && @request.auth.collectionName = 'personnel')",
        "updated": "2023-10-18 10:34:44.939Z",
        "viewRule": ""
      },
      {
        "collectionId": "16ozzwpv14576vn",
        "collectionName": "view_tables",
        "createRule": null,
        "created": "2023-10-08 11:26:06.845Z",
        "deleteRule": null,
        "id": "lx442shgpvgchti",
        "indexes": [
          "CREATE UNIQUE INDEX `idx_oGV4ZDp` ON `classes_teachers` (\n  `teacher`,\n  `class`\n) WHERE active IS TRUE"
        ],
        "listRule": "",
        "name": "classes_teachers",
        "options": { },
        "schema": [
          {
            "system": false,
            "id": "6hkwsg4n",
            "name": "teacher",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "h00kv48u8r0jg97",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "fdoj5wwp",
            "name": "class",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "yvd1531i3j1fzep",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "xnprt4cp",
            "name": "active",
            "type": "bool",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "izbzz9v8",
            "name": "from_date",
            "type": "date",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "min": "",
              "max": ""
            }
          },
          {
            "system": false,
            "id": "9lloarjf",
            "name": "to_date",
            "type": "date",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "min": "",
              "max": ""
            }
          }
        ],
        "system": 0,
        "type": "base",
        "updateRule": null,
        "updated": "2023-10-21 13:29:21.923Z",
        "viewRule": ""
      },
      {
        "collectionId": "16ozzwpv14576vn",
        "collectionName": "view_tables",
        "createRule": null,
        "created": "2023-10-08 11:31:42.496Z",
        "deleteRule": null,
        "id": "5lefk5zohg7o6au",
        "indexes": [ ],
        "listRule": "",
        "name": "z_roots_images",
        "options": { },
        "schema": [
          {
            "system": false,
            "id": "itvxkysf",
            "name": "image",
            "type": "file",
            "required": true,
            "presentable": true,
            "unique": false,
            "options": {
              "maxSelect": 1,
              "maxSize": 5242880,
              "mimeTypes": [
                "image/vnd.adobe.photoshop",
                "image/png",
                "image/jpeg",
                "image/jxl",
                "image/jp2",
                "image/gif",
                "image/webp",
                "image/tiff",
                "image/bmp",
                "image/x-icns",
                "image/x-xpixmap",
                "image/vnd.mozilla.apng",
                "image/vnd.radiance",
                "image/x-xcf",
                "image/heif-sequence",
                "image/heif",
                "image/jpx",
                "image/jpm",
                "image/jxs",
                "image/x-icon",
                "image/vnd.djvu",
                "image/bpg",
                "image/vnd.dwg",
                "image/heic",
                "image/heic-sequence",
                "image/x-gimp-pat",
                "image/x-gimp-gbr",
                "image/avif",
                "image/jxr",
                "image/svg+xml"
              ],
              "thumbs": [
                "200x200",
                "200x0"
              ],
              "protected": false
            }
          },
          {
            "system": false,
            "id": "avvmzfb2",
            "name": "caption",
            "type": "text",
            "required": false,
            "presentable": true,
            "unique": false,
            "options": {
              "min": null,
              "max": null,
              "pattern": ""
            }
          }
        ],
        "system": 0,
        "type": "base",
        "updateRule": null,
        "updated": "2023-10-21 15:01:29.689Z",
        "viewRule": ""
      },
      {
        "collectionId": "16ozzwpv14576vn",
        "collectionName": "view_tables",
        "createRule": "(@request.auth.roles ~ 'library' && @request.auth.collectionName = 'personnel')",
        "created": "2023-10-08 11:52:24.493Z",
        "deleteRule": "(@request.auth.roles ~ 'library' && @request.auth.collectionName = 'personnel')",
        "id": "kw853lro56k6ctw",
        "indexes": [
          "CREATE UNIQUE INDEX `idx_c1UtPXF` ON `books_collections` (\n  `book_index`,\n  `book`\n)"
        ],
        "listRule": "",
        "name": "books_collections",
        "options": { },
        "schema": [
          {
            "system": false,
            "id": "am5acr2t",
            "name": "book_index",
            "type": "text",
            "required": true,
            "presentable": true,
            "unique": false,
            "options": {
              "min": 2,
              "max": 30,
              "pattern": ""
            }
          },
          {
            "system": false,
            "id": "v1pwutpx",
            "name": "book",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "s88dzrbga3w2zxb",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "pnsydjrq",
            "name": "added_by",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "h00kv48u8r0jg97",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          }
        ],
        "system": 0,
        "type": "base",
        "updateRule": "(@request.auth.roles ~ 'library' && @request.auth.collectionName = 'personnel')",
        "updated": "2023-10-21 12:17:28.228Z",
        "viewRule": ""
      },
      {
        "collectionId": "16ozzwpv14576vn",
        "collectionName": "view_tables",
        "createRule": "(@request.auth.roles ~ 'library' && @request.auth.collectionName = 'personnel')",
        "created": "2023-10-08 11:57:22.250Z",
        "deleteRule": "(@request.auth.roles ~ 'library' && @request.auth.collectionName = 'personnel')",
        "id": "zy49nzb6wgo4bxv",
        "indexes": [
          "CREATE UNIQUE INDEX `idx_s4NQu50` ON `books_collections_borrowed` (\n  `book`,\n  `student`,\n  `returned`\n) WHERE returned IS FALSE"
        ],
        "listRule": "",
        "name": "books_collections_borrowed",
        "options": { },
        "schema": [
          {
            "system": false,
            "id": "z31z2t62",
            "name": "book",
            "type": "relation",
            "required": true,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "kw853lro56k6ctw",
              "cascadeDelete": true,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "gyuwsara",
            "name": "student",
            "type": "relation",
            "required": true,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "_pb_users_auth_",
              "cascadeDelete": true,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "qxpsbc9c",
            "name": "signed_out_by",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "h00kv48u8r0jg97",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "vbxce4ls",
            "name": "expected_to_return_on",
            "type": "date",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "min": "",
              "max": ""
            }
          },
          {
            "system": false,
            "id": "4lwhqkeu",
            "name": "returned",
            "type": "bool",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "s3nq8lq1",
            "name": "signed_in_by",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "h00kv48u8r0jg97",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          }
        ],
        "system": 0,
        "type": "base",
        "updateRule": "(@request.auth.roles ~ 'library' && @request.auth.collectionName = 'personnel')",
        "updated": "2023-10-10 16:52:44.580Z",
        "viewRule": ""
      },
      {
        "collectionId": "16ozzwpv14576vn",
        "collectionName": "view_tables",
        "createRule": null,
        "created": "2023-10-08 12:08:23.290Z",
        "deleteRule": null,
        "id": "16ozzwpv14576vn",
        "indexes": [ ],
        "listRule": "",
        "name": "view_tables",
        "options": {
          "query": "SELECT id,system, name, type, schema, indexes, options, viewRule, listRule, createRule, updateRule, deleteRule, created, updated\n  FROM '_collections'"
        },
        "schema": [
          {
            "system": false,
            "id": "nezzg0hh",
            "name": "system",
            "type": "json",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "iqr1jiue",
            "name": "name",
            "type": "json",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "g2d1siyd",
            "name": "type",
            "type": "json",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "vwk4ozx9",
            "name": "schema",
            "type": "json",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "2ze3dscj",
            "name": "indexes",
            "type": "json",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "x8bdd2gf",
            "name": "options",
            "type": "json",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "9wuz2mk3",
            "name": "viewRule",
            "type": "json",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "pe9dt92v",
            "name": "listRule",
            "type": "json",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "fz0zx1dj",
            "name": "createRule",
            "type": "json",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "i6f3nwol",
            "name": "updateRule",
            "type": "json",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "zlbtljvu",
            "name": "deleteRule",
            "type": "json",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          }
        ],
        "system": 0,
        "type": "view",
        "updateRule": null,
        "updated": "2023-10-08 13:22:10.707Z",
        "viewRule": ""
      },
      {
        "collectionId": "16ozzwpv14576vn",
        "collectionName": "view_tables",
        "createRule": "(@request.auth.roles ~ 'test' && @request.auth.collectionName = 'personnel') && @request.data.question.answers:length > 2",
        "created": "2023-10-08 12:14:59.859Z",
        "deleteRule": "(@request.auth.roles ~ 'test' && @request.auth.collectionName = 'personnel') && @request.data.question.answers:length > 2",
        "id": "yuwigzf8e9fgsoo",
        "indexes": [ ],
        "listRule": null,
        "name": "questions",
        "options": { },
        "schema": [
          {
            "system": false,
            "id": "09ktftus",
            "name": "question",
            "type": "json",
            "required": true,
            "presentable": true,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "t8xzg4c9",
            "name": "marks",
            "type": "number",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "min": null,
              "max": null,
              "noDecimal": false
            }
          },
          {
            "system": false,
            "id": "sjdbf54g",
            "name": "subject",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "s06gyf4crcgzdn8",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "5rki3po9",
            "name": "added_by",
            "type": "relation",
            "required": true,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "h00kv48u8r0jg97",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          }
        ],
        "system": 0,
        "type": "base",
        "updateRule": "(@request.auth.roles ~ 'test' && @request.auth.collectionName = 'personnel') && @request.data.question.answers:length > 2",
        "updated": "2023-10-12 10:39:45.832Z",
        "viewRule": null
      },
      {
        "collectionId": "16ozzwpv14576vn",
        "collectionName": "view_tables",
        "createRule": "(@request.auth.roles ~ 'test' && @request.auth.collectionName = 'personnel')",
        "created": "2023-10-08 12:26:42.305Z",
        "deleteRule": "(@request.auth.roles ~ 'test' && @request.auth.collectionName = 'personnel')",
        "id": "emurt3tkzx00mc0",
        "indexes": [ ],
        "listRule": "",
        "name": "tests",
        "options": { },
        "schema": [
          {
            "system": false,
            "id": "mpqrpmf8",
            "name": "name",
            "type": "text",
            "required": true,
            "presentable": true,
            "unique": false,
            "options": {
              "min": null,
              "max": 30,
              "pattern": ""
            }
          },
          {
            "system": false,
            "id": "jrhoj1kx",
            "name": "description",
            "type": "editor",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "convertUrls": false
            }
          },
          {
            "system": false,
            "id": "rwtn9xei",
            "name": "set_by",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "h00kv48u8r0jg97",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "upu0n1ld",
            "name": "from_date",
            "type": "date",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "min": "",
              "max": ""
            }
          }
        ],
        "system": 0,
        "type": "base",
        "updateRule": "(@request.auth.roles ~ 'test' && @request.auth.collectionName = 'personnel')",
        "updated": "2023-10-19 17:31:05.107Z",
        "viewRule": ""
      },
      {
        "collectionId": "16ozzwpv14576vn",
        "collectionName": "view_tables",
        "createRule": "(@request.auth.roles ~ 'test' && @request.auth.collectionName = 'personnel')",
        "created": "2023-10-08 12:29:03.949Z",
        "deleteRule": "(@request.auth.roles ~ 'test' && @request.auth.collectionName = 'personnel')",
        "id": "jd606dvhqqv2bg3",
        "indexes": [
          "CREATE UNIQUE INDEX `idx_zJjOb1F` ON `tests_questions` (\n  `test`,\n  `question`\n)"
        ],
        "listRule": "",
        "name": "tests_questions",
        "options": { },
        "schema": [
          {
            "system": false,
            "id": "om72hxt6",
            "name": "test",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "emurt3tkzx00mc0",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "m1hm0mez",
            "name": "question",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "yuwigzf8e9fgsoo",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "kzyaqcry",
            "name": "marks",
            "type": "number",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "min": null,
              "max": null,
              "noDecimal": false
            }
          }
        ],
        "system": 0,
        "type": "base",
        "updateRule": "(@request.auth.roles ~ 'test' && @request.auth.collectionName = 'personnel')",
        "updated": "2023-10-08 13:20:03.588Z",
        "viewRule": ""
      },
      {
        "collectionId": "16ozzwpv14576vn",
        "collectionName": "view_tables",
        "createRule": "(@request.auth.roles ~ 'test' && @request.auth.collectionName = 'personnel')",
        "created": "2023-10-08 12:34:11.244Z",
        "deleteRule": "(@request.auth.roles ~ 'test' && @request.auth.collectionName = 'personnel')",
        "id": "px9rp3v43825d9l",
        "indexes": [
          "CREATE UNIQUE INDEX `idx_wdJawIP` ON `tests_questions_students_answers` (\n  `test_question`,\n  `student`\n)"
        ],
        "listRule": "",
        "name": "tests_questions_students_answers",
        "options": { },
        "schema": [
          {
            "system": false,
            "id": "ozfvnxyt",
            "name": "answer",
            "type": "json",
            "required": true,
            "presentable": true,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "wy50nuu5",
            "name": "test_question",
            "type": "relation",
            "required": true,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "jd606dvhqqv2bg3",
              "cascadeDelete": true,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "zlgusvzm",
            "name": "student",
            "type": "relation",
            "required": true,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "_pb_users_auth_",
              "cascadeDelete": true,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          }
        ],
        "system": 0,
        "type": "base",
        "updateRule": "(@request.auth.roles ~ 'test' && @request.auth.collectionName = 'personnel')",
        "updated": "2023-10-08 13:20:28.572Z",
        "viewRule": ""
      },
      {
        "collectionId": "16ozzwpv14576vn",
        "collectionName": "view_tables",
        "createRule": null,
        "created": "2023-10-08 12:46:49.479Z",
        "deleteRule": null,
        "id": "0rs2c7h4kbko4m7",
        "indexes": [
          "CREATE UNIQUE INDEX `idx_t4DRpHi` ON `subjects_teachers` (\n  `subject`,\n  `class`,\n  `instructed_by`\n)"
        ],
        "listRule": "",
        "name": "subjects_teachers",
        "options": { },
        "schema": [
          {
            "system": false,
            "id": "eqwcuayj",
            "name": "subject",
            "type": "relation",
            "required": true,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "s06gyf4crcgzdn8",
              "cascadeDelete": true,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "dxn2dfpm",
            "name": "class",
            "type": "relation",
            "required": true,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "yvd1531i3j1fzep",
              "cascadeDelete": true,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "ga6xzpdj",
            "name": "instructed_by",
            "type": "relation",
            "required": true,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "h00kv48u8r0jg97",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "mqqbyigm",
            "name": "from_date",
            "type": "date",
            "required": true,
            "presentable": false,
            "unique": false,
            "options": {
              "min": "",
              "max": ""
            }
          },
          {
            "system": false,
            "id": "s7uongdn",
            "name": "to_date",
            "type": "date",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "min": "",
              "max": ""
            }
          },
          {
            "system": false,
            "id": "xq7zhaqk",
            "name": "active",
            "type": "bool",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          }
        ],
        "system": 0,
        "type": "base",
        "updateRule": null,
        "updated": "2023-10-12 10:55:03.831Z",
        "viewRule": ""
      },
      {
        "collectionId": "16ozzwpv14576vn",
        "collectionName": "view_tables",
        "createRule": "(@request.auth.roles ~ 'notes' && @request.auth.collectionName = 'personnel')",
        "created": "2023-10-08 12:51:43.932Z",
        "deleteRule": "(@request.auth.roles ~ 'notes' && @request.auth.collectionName = 'personnel')",
        "id": "prm7o9dglbdrt18",
        "indexes": [ ],
        "listRule": "",
        "name": "notes",
        "options": { },
        "schema": [
          {
            "system": false,
            "id": "itmj3fd8",
            "name": "name",
            "type": "text",
            "required": true,
            "presentable": true,
            "unique": false,
            "options": {
              "min": null,
              "max": 50,
              "pattern": ""
            }
          },
          {
            "system": false,
            "id": "kvthfqib",
            "name": "description",
            "type": "editor",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "convertUrls": false
            }
          },
          {
            "system": false,
            "id": "eblo4p2a",
            "name": "document",
            "type": "file",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "maxSelect": 1,
              "maxSize": 5242880,
              "mimeTypes": [ ],
              "thumbs": [ ],
              "protected": false
            }
          },
          {
            "system": false,
            "id": "empsbvz2",
            "name": "added_by",
            "type": "relation",
            "required": true,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "h00kv48u8r0jg97",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "inecr0yy",
            "name": "subject",
            "type": "relation",
            "required": true,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "s06gyf4crcgzdn8",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          }
        ],
        "system": 0,
        "type": "base",
        "updateRule": "(@request.auth.roles ~ 'notes' && @request.auth.collectionName = 'personnel')",
        "updated": "2023-10-08 13:16:34.631Z",
        "viewRule": ""
      },
      {
        "collectionId": "16ozzwpv14576vn",
        "collectionName": "view_tables",
        "createRule": null,
        "created": "2023-10-09 05:37:22.888Z",
        "deleteRule": null,
        "id": "vried4izsi2soar",
        "indexes": [ ],
        "listRule": "@request.auth.roles ~ 'library'",
        "name": "personnel_view_books",
        "options": {
          "query": "SELECT \n  books_.id, \n  books_.cover_images, \n  books_.name, \n  COALESCE((\n  SELECT COUNT(book)\n  FROM books_collections\n  WHERE book = books_.id\n  ),0) AS book_collections,\n  COALESCE((\n  SELECT COUNT(books_collections.book)\n  FROM books_collections\n  JOIN books_collections_borrowed ON books_collections_borrowed.book = books_collections.id\n  WHERE books_collections.book = books_.id\n  ),0) AS borrow_history,\n  books_.subject, \n  books_.class_level, \n  books_.maximum_days_to_borrow, \n  books_.description, \n  books_.created, \n  books_.updated,\n  COALESCE((\n   SELECT JSON_EXTRACT(z_roots.data,'$.name')\n   FROM z_roots\n   WHERE z_roots.name = 'library'\n  ),'No Library Name') AS library\nFROM books AS books_"
        },
        "schema": [
          {
            "system": false,
            "id": "y9agct9r",
            "name": "cover_images",
            "type": "file",
            "required": false,
            "presentable": true,
            "unique": false,
            "options": {
              "maxSelect": 99,
              "maxSize": 5242880,
              "mimeTypes": [ ],
              "thumbs": [
                "200x0",
                "200x200"
              ],
              "protected": false
            }
          },
          {
            "system": false,
            "id": "owloyfmh",
            "name": "name",
            "type": "text",
            "required": false,
            "presentable": true,
            "unique": false,
            "options": {
              "min": null,
              "max": 50,
              "pattern": ""
            }
          },
          {
            "system": false,
            "id": "jsyootwt",
            "name": "book_collections",
            "type": "json",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "cie8bxgi",
            "name": "borrow_history",
            "type": "json",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "ipmkayxl",
            "name": "subject",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "s06gyf4crcgzdn8",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "4ezibxcy",
            "name": "class_level",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "cdnkz8chtyil438",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "qz4yh1r9",
            "name": "maximum_days_to_borrow",
            "type": "number",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "min": null,
              "max": null,
              "noDecimal": false
            }
          },
          {
            "system": false,
            "id": "56iwlugl",
            "name": "description",
            "type": "editor",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "convertUrls": false
            }
          },
          {
            "system": false,
            "id": "nvb6v0b9",
            "name": "library",
            "type": "json",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          }
        ],
        "system": 0,
        "type": "view",
        "updateRule": null,
        "updated": "2023-10-21 04:04:57.604Z",
        "viewRule": "@request.auth.roles ~ 'library'"
      },
      {
        "collectionId": "16ozzwpv14576vn",
        "collectionName": "view_tables",
        "createRule": null,
        "created": "2023-10-09 12:49:42.502Z",
        "deleteRule": null,
        "id": "iy8491nfbxuw3fp",
        "indexes": [ ],
        "listRule": "@request.auth.roles ~ 'library'",
        "name": "personnel_view_books_collections",
        "options": {
          "query": "SELECT \n  books_collections_.id, \n  books_.cover_images,\n  books_.name,\n  books_collections_.book_index,   \n  (SELECT CASE \n  WHEN EXISTS(\n  SELECT 1\n  FROM books_collections_borrowed\n  WHERE book = books_collections_.id AND returned = FALSE\n  ) THEN 'NO'\n  ELSE 'YES' END) AS available,\n  COALESCE((\n  SELECT COUNT(books_collections_borrowed.book)\n  FROM books_collections_borrowed\n  WHERE books_collections_borrowed.book = books_collections_.id\n  ),0) AS borrow_history,\n  books_collections_.book,\n  books_collections_.added_by,\n  books_collections_.created, \n  books_collections_.updated\nFROM books_collections AS books_collections_\nLEFT JOIN books books_ ON books_.id = books_collections_.book"
        },
        "schema": [
          {
            "system": false,
            "id": "umeyo983",
            "name": "cover_images",
            "type": "file",
            "required": false,
            "presentable": true,
            "unique": false,
            "options": {
              "maxSelect": 99,
              "maxSize": 5242880,
              "mimeTypes": [ ],
              "thumbs": [
                "200x0",
                "200x200"
              ],
              "protected": false
            }
          },
          {
            "system": false,
            "id": "8ymuwtvo",
            "name": "name",
            "type": "text",
            "required": false,
            "presentable": true,
            "unique": false,
            "options": {
              "min": null,
              "max": 50,
              "pattern": ""
            }
          },
          {
            "system": false,
            "id": "5yveb4yp",
            "name": "book_index",
            "type": "text",
            "required": true,
            "presentable": true,
            "unique": false,
            "options": {
              "min": 2,
              "max": 30,
              "pattern": ""
            }
          },
          {
            "system": false,
            "id": "wqlisxpe",
            "name": "available",
            "type": "json",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "v5o841rc",
            "name": "borrow_history",
            "type": "json",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "pgvrtkms",
            "name": "book",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "s88dzrbga3w2zxb",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "alxeqnrk",
            "name": "added_by",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "h00kv48u8r0jg97",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          }
        ],
        "system": 0,
        "type": "view",
        "updateRule": null,
        "updated": "2023-10-21 04:20:24.446Z",
        "viewRule": "@request.auth.roles ~ 'library'"
      },
      {
        "collectionId": "16ozzwpv14576vn",
        "collectionName": "view_tables",
        "createRule": null,
        "created": "2023-10-09 13:09:06.891Z",
        "deleteRule": null,
        "id": "ok570lvzqi3tv7z",
        "indexes": [ ],
        "listRule": "@request.auth.roles ~ 'library'",
        "name": "personnel_view_books_collections_borrowed",
        "options": {
          "query": "SELECT \n  books_collections_borrowed_.id,  \n  books_.cover_images,\n  books_.name AS book_name,\n  books_collections_.book_index,\n  books_collections_borrowed_.student, \n  IIF(books_collections_borrowed_.returned,'YES', 'NO') AS is_returned,\n  books_collections_borrowed_.signed_out_by, \n  books_collections_borrowed_.signed_in_by, \n  books_collections_borrowed_.expected_to_return_on, \n  books_collections_borrowed_.returned, \n  books_.class_level AS class,\n  books_collections_borrowed_.book, \n  books_collections_borrowed_.created, \n  books_collections_borrowed_.updated\nFROM books_collections_borrowed AS books_collections_borrowed_\nLEFT JOIN books_collections books_collections_ ON books_collections_.id = books_collections_borrowed_.book\nLEFT JOIN books books_ ON books_.id = books_collections_.book"
        },
        "schema": [
          {
            "system": false,
            "id": "sirb0yh4",
            "name": "cover_images",
            "type": "file",
            "required": false,
            "presentable": true,
            "unique": false,
            "options": {
              "maxSelect": 99,
              "maxSize": 5242880,
              "mimeTypes": [ ],
              "thumbs": [
                "200x0",
                "200x200"
              ],
              "protected": false
            }
          },
          {
            "system": false,
            "id": "zgzdqezh",
            "name": "book_name",
            "type": "text",
            "required": false,
            "presentable": true,
            "unique": false,
            "options": {
              "min": null,
              "max": 50,
              "pattern": ""
            }
          },
          {
            "system": false,
            "id": "f9qvnxbq",
            "name": "book_index",
            "type": "text",
            "required": true,
            "presentable": true,
            "unique": false,
            "options": {
              "min": 2,
              "max": 30,
              "pattern": ""
            }
          },
          {
            "system": false,
            "id": "56s5nrag",
            "name": "student",
            "type": "relation",
            "required": true,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "_pb_users_auth_",
              "cascadeDelete": true,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "tbv1m32e",
            "name": "is_returned",
            "type": "json",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "93zpcrjt",
            "name": "signed_out_by",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "h00kv48u8r0jg97",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "tyzwdl1w",
            "name": "signed_in_by",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "h00kv48u8r0jg97",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "wef3dliv",
            "name": "expected_to_return_on",
            "type": "date",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "min": "",
              "max": ""
            }
          },
          {
            "system": false,
            "id": "ao6qdcfg",
            "name": "returned",
            "type": "bool",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "f8bdrzpm",
            "name": "class",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "cdnkz8chtyil438",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "bibvwx62",
            "name": "book",
            "type": "relation",
            "required": true,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "kw853lro56k6ctw",
              "cascadeDelete": true,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          }
        ],
        "system": 0,
        "type": "view",
        "updateRule": null,
        "updated": "2023-10-21 04:27:58.335Z",
        "viewRule": "@request.auth.roles ~ 'library'"
      },
      {
        "collectionId": "16ozzwpv14576vn",
        "collectionName": "view_tables",
        "createRule": null,
        "created": "2023-10-10 17:20:18.913Z",
        "deleteRule": null,
        "id": "l1stvzszz6g2843",
        "indexes": [
          "CREATE UNIQUE INDEX `idx_dDqLZoY` ON `attendances_to_school` (\n  `student`,\n  DATE(`date`)\n)"
        ],
        "listRule": "@request.auth.id != ''",
        "name": "attendances_to_school",
        "options": { },
        "schema": [
          {
            "system": false,
            "id": "hnj4hfm5",
            "name": "present",
            "type": "bool",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "pipmyxqp",
            "name": "date",
            "type": "date",
            "required": true,
            "presentable": false,
            "unique": false,
            "options": {
              "min": "",
              "max": ""
            }
          },
          {
            "system": false,
            "id": "prpqxybd",
            "name": "student",
            "type": "relation",
            "required": true,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "_pb_users_auth_",
              "cascadeDelete": true,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "0ripoytu",
            "name": "registered_by",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "h00kv48u8r0jg97",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          }
        ],
        "system": 0,
        "type": "base",
        "updateRule": null,
        "updated": "2023-10-19 17:38:16.237Z",
        "viewRule": "@request.auth.id != ''"
      },
      {
        "collectionId": "16ozzwpv14576vn",
        "collectionName": "view_tables",
        "createRule": "@request.auth.roles ~ 'attendance' || (@collection.subjects_teachers.instructed_by = @request.auth.id && @collection.subjects_teachers.subject = subject)",
        "created": "2023-10-10 17:37:08.572Z",
        "deleteRule": "@request.auth.roles ~ 'attendance' || (@collection.subjects_teachers.instructed_by = @request.auth.id && @collection.subjects_teachers.subject = subject)",
        "id": "it94yahilyve9yo",
        "indexes": [
          "CREATE UNIQUE INDEX `idx_wcFGkU9` ON `attendances_to_lessons` (\n  `student`,\n  `date`,\n  `subject`\n)"
        ],
        "listRule": null,
        "name": "attendances_to_lessons",
        "options": { },
        "schema": [
          {
            "system": false,
            "id": "y1w2lduw",
            "name": "present",
            "type": "bool",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "ngxhrda2",
            "name": "date",
            "type": "date",
            "required": true,
            "presentable": false,
            "unique": false,
            "options": {
              "min": "",
              "max": ""
            }
          },
          {
            "system": false,
            "id": "jfte2bwl",
            "name": "student",
            "type": "relation",
            "required": true,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "_pb_users_auth_",
              "cascadeDelete": true,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "vax8uvbc",
            "name": "subject",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "s06gyf4crcgzdn8",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "rjsebfpz",
            "name": "registered_by",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "h00kv48u8r0jg97",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          }
        ],
        "system": 0,
        "type": "base",
        "updateRule": "@request.auth.roles ~ 'attendance' || (@collection.subjects_teachers.instructed_by = @request.auth.id && @collection.subjects_teachers.subject = subject)",
        "updated": "2023-10-19 17:36:28.483Z",
        "viewRule": null
      },
      {
        "collectionId": "16ozzwpv14576vn",
        "collectionName": "view_tables",
        "createRule": null,
        "created": "2023-10-12 06:07:24.817Z",
        "deleteRule": null,
        "id": "ekhrqtpaofudhjv",
        "indexes": [ ],
        "listRule": "",
        "name": "students_view_books",
        "options": {
          "query": "SELECT \n  books_.id, \n  books_.cover_images, \n  books_.name, \n  COALESCE((\n  SELECT COUNT(book)\n  FROM books_collections\n  WHERE book = books_.id\n  ),0) AS book_collections,\n  COALESCE((\n  SELECT COUNT(books_collections.book)\n  FROM books_collections\n  JOIN books_collections_borrowed ON books_collections_borrowed.book = books_collections.id\n  WHERE books_collections.book = books_.id\n  ),0) AS borrow_history,\n  books_.description, \n  books_.subject, \n  books_.class_level AS class, \n  books_.maximum_days_to_borrow AS can_be_borrowed_for_this_days, \n  books_.created, \n  books_.updated\nFROM books AS books_\nLEFT JOIN z_class_levels ON z_class_levels.id = books_.class_level\nLEFT JOIN subjects ON subjects.id = books_.subject"
        },
        "schema": [
          {
            "system": false,
            "id": "q4pvuvre",
            "name": "cover_images",
            "type": "file",
            "required": false,
            "presentable": true,
            "unique": false,
            "options": {
              "maxSelect": 99,
              "maxSize": 5242880,
              "mimeTypes": [ ],
              "thumbs": [
                "200x0",
                "200x200"
              ],
              "protected": false
            }
          },
          {
            "system": false,
            "id": "19felmg5",
            "name": "name",
            "type": "text",
            "required": false,
            "presentable": true,
            "unique": false,
            "options": {
              "min": null,
              "max": 50,
              "pattern": ""
            }
          },
          {
            "system": false,
            "id": "bmmley5g",
            "name": "book_collections",
            "type": "json",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "s9tmwbin",
            "name": "borrow_history",
            "type": "json",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "z1qq9dbt",
            "name": "description",
            "type": "editor",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "convertUrls": false
            }
          },
          {
            "system": false,
            "id": "8hxp3jzq",
            "name": "subject",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "s06gyf4crcgzdn8",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "pomakro9",
            "name": "class",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "cdnkz8chtyil438",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "2vll3cqd",
            "name": "can_be_borrowed_for_this_days",
            "type": "number",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "min": null,
              "max": null,
              "noDecimal": false
            }
          }
        ],
        "system": 0,
        "type": "view",
        "updateRule": null,
        "updated": "2023-10-19 09:06:38.993Z",
        "viewRule": "@request.auth.collectionName = 'students'"
      },
      {
        "collectionId": "16ozzwpv14576vn",
        "collectionName": "view_tables",
        "createRule": null,
        "created": "2023-10-12 06:12:18.487Z",
        "deleteRule": null,
        "id": "76it9zix5tjshxj",
        "indexes": [ ],
        "listRule": "@request.auth.collectionName = 'students'",
        "name": "students_view_books_collections",
        "options": {
          "query": "SELECT \n  books_collections_.id, \n  books_.name AS book_name,\n  books_.cover_images AS book_cover_images,\n  books_collections_.book_index, \n  (SELECT CASE \n  WHEN EXISTS(\n  SELECT 1\n  FROM books_collections_borrowed\n  WHERE book = books_collections_.id AND returned = FALSE\n  ) THEN 'NO'\n  ELSE 'YES' END) AS available,\n  COALESCE((\n  SELECT COUNT(books_collections_borrowed.book)\n  FROM books_collections_borrowed\n  WHERE books_collections_borrowed.book = books_collections_.id\n  ),0) AS borrow_history, \n  books_collections_.book AS book_data,  \n  books_collections_.created, \n  books_collections_.updated\nFROM books_collections AS books_collections_\nLEFT JOIN books books_ ON books_.id = books_collections_.book"
        },
        "schema": [
          {
            "system": false,
            "id": "h7nsvy6a",
            "name": "book_name",
            "type": "text",
            "required": false,
            "presentable": true,
            "unique": false,
            "options": {
              "min": null,
              "max": 50,
              "pattern": ""
            }
          },
          {
            "system": false,
            "id": "v8l0p2xw",
            "name": "book_cover_images",
            "type": "file",
            "required": false,
            "presentable": true,
            "unique": false,
            "options": {
              "maxSelect": 99,
              "maxSize": 5242880,
              "mimeTypes": [ ],
              "thumbs": [
                "200x0",
                "200x200"
              ],
              "protected": false
            }
          },
          {
            "system": false,
            "id": "xlsvxchb",
            "name": "book_index",
            "type": "text",
            "required": true,
            "presentable": true,
            "unique": false,
            "options": {
              "min": 2,
              "max": 30,
              "pattern": ""
            }
          },
          {
            "system": false,
            "id": "lfafjjar",
            "name": "available",
            "type": "json",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "ly6wtzjc",
            "name": "borrow_history",
            "type": "json",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "gltqigzw",
            "name": "book_data",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "s88dzrbga3w2zxb",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          }
        ],
        "system": 0,
        "type": "view",
        "updateRule": null,
        "updated": "2023-10-21 12:14:55.116Z",
        "viewRule": "@request.auth.collectionName = 'students'"
      },
      {
        "collectionId": "16ozzwpv14576vn",
        "collectionName": "view_tables",
        "createRule": null,
        "created": "2023-10-12 06:14:43.763Z",
        "deleteRule": null,
        "id": "kxadrizthxzk5xl",
        "indexes": [ ],
        "listRule": "@request.auth.id = student",
        "name": "students_view_books_collections_borrowed",
        "options": {
          "query": "SELECT \n  books_collections_borrowed_.id,\n  books_.name AS book_name,\n  books_.cover_images AS book_cover_images,\n  books_collections_borrowed_.student, \n  IIF(books_collections_borrowed_.returned,'YES', 'NO') AS 'is_returned',\n  books_collections_borrowed_.expected_to_return_on, \n  -- books_collections_borrowed_.returned, \n  books_collections_borrowed_.signed_out_by, \n  books_collections_borrowed_.book AS book_data, \n  books_collections_borrowed_.created, \n  books_collections_borrowed_.updated\nFROM books_collections_borrowed AS books_collections_borrowed_\nLEFT JOIN books_collections books_collections_ ON books_collections_.id = books_collections_borrowed_.book\nLEFT JOIN books books_ ON books_.id = books_collections_.book"
        },
        "schema": [
          {
            "system": false,
            "id": "wuiipcbu",
            "name": "book_name",
            "type": "text",
            "required": false,
            "presentable": true,
            "unique": false,
            "options": {
              "min": null,
              "max": 50,
              "pattern": ""
            }
          },
          {
            "system": false,
            "id": "caeos11v",
            "name": "book_cover_images",
            "type": "file",
            "required": false,
            "presentable": true,
            "unique": false,
            "options": {
              "maxSelect": 99,
              "maxSize": 5242880,
              "mimeTypes": [ ],
              "thumbs": [
                "200x0",
                "200x200"
              ],
              "protected": false
            }
          },
          {
            "system": false,
            "id": "livlgkkb",
            "name": "student",
            "type": "relation",
            "required": true,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "_pb_users_auth_",
              "cascadeDelete": true,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "jryrnkld",
            "name": "is_returned",
            "type": "json",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "vpnxcjpx",
            "name": "expected_to_return_on",
            "type": "date",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "min": "",
              "max": ""
            }
          },
          {
            "system": false,
            "id": "ydvtffhe",
            "name": "signed_out_by",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "h00kv48u8r0jg97",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "kofeqe5j",
            "name": "book_data",
            "type": "relation",
            "required": true,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "kw853lro56k6ctw",
              "cascadeDelete": true,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          }
        ],
        "system": 0,
        "type": "view",
        "updateRule": null,
        "updated": "2023-10-19 12:39:22.240Z",
        "viewRule": "@request.auth.id = student"
      },
      {
        "collectionId": "16ozzwpv14576vn",
        "collectionName": "view_tables",
        "createRule": "@request.auth.roles ~ 'enrollment' || (@collection.classes_teachers.teacher = @request.auth.id && @collection.classes_teachers.active = true && @collection.classes_teachers.class = class)",
        "created": "2023-10-12 06:53:08.658Z",
        "deleteRule": "@request.auth.roles ~ 'enrollment' || (@collection.classes_teachers.teacher = @request.auth.id && @collection.classes_teachers.active = true && @collection.classes_teachers.class = class)",
        "id": "ltllp98m40o367i",
        "indexes": [
          "CREATE UNIQUE INDEX `idx_nbXIQ0h` ON `classes_students_enrollments` (\n  `class`,\n  `student`\n) WHERE active IS TRUE"
        ],
        "listRule": null,
        "name": "classes_students_enrollments",
        "options": { },
        "schema": [
          {
            "system": false,
            "id": "sde4ruel",
            "name": "from_date",
            "type": "date",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "min": "",
              "max": ""
            }
          },
          {
            "system": false,
            "id": "dwcwxaj5",
            "name": "to_date",
            "type": "date",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "min": "",
              "max": ""
            }
          },
          {
            "system": false,
            "id": "kggccx3f",
            "name": "class",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "yvd1531i3j1fzep",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "iek2c4fk",
            "name": "student",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "_pb_users_auth_",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "gqv6iqzu",
            "name": "enrolled_by",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "h00kv48u8r0jg97",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "frcyiozc",
            "name": "active",
            "type": "bool",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          }
        ],
        "system": 0,
        "type": "base",
        "updateRule": "@request.auth.roles ~ 'enrollment' || (@collection.classes_teachers.teacher = @request.auth.id && @collection.classes_teachers.active = true && @collection.classes_teachers.class = class)",
        "updated": "2023-10-21 13:26:50.054Z",
        "viewRule": null
      },
      {
        "collectionId": "16ozzwpv14576vn",
        "collectionName": "view_tables",
        "createRule": null,
        "created": "2023-10-12 07:06:18.643Z",
        "deleteRule": null,
        "id": "swje1dsxpxu7a7t",
        "indexes": [ ],
        "listRule": "@request.auth.roles ~ 'library'",
        "name": "personnel_view_questions",
        "options": {
          "query": "SELECT \n  questions_.id,\n  COALESCE(JSON_EXTRACT(questions_.question,'$.question'),'no question provided') AS question,\n  COALESCE(JSON_EXTRACT(questions_.question,'$.answers'),'no answers provided') AS answers,\n  COALESCE((\n  SELECT COUNT(question)\n  FROM tests_questions\n  WHERE tests_questions.question = questions_.id\n  ),0) AS times_tested,\n  questions_.marks,\n  questions_.subject,\n  questions_.added_by,\n  questions_.created, \n  questions_.updated\nFROM questions AS questions_"
        },
        "schema": [
          {
            "system": false,
            "id": "fh8wednf",
            "name": "question",
            "type": "json",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "btbpwkf7",
            "name": "answers",
            "type": "json",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "kfidahos",
            "name": "times_tested",
            "type": "json",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "buy1codd",
            "name": "marks",
            "type": "number",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "min": null,
              "max": null,
              "noDecimal": false
            }
          },
          {
            "system": false,
            "id": "9egikvh1",
            "name": "subject",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "s06gyf4crcgzdn8",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "5xgrjqeh",
            "name": "added_by",
            "type": "relation",
            "required": true,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "h00kv48u8r0jg97",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          }
        ],
        "system": 0,
        "type": "view",
        "updateRule": null,
        "updated": "2023-10-19 14:20:11.123Z",
        "viewRule": "@request.auth.roles ~ 'library'"
      },
      {
        "collectionId": "16ozzwpv14576vn",
        "collectionName": "view_tables",
        "createRule": null,
        "created": "2023-10-12 11:00:04.177Z",
        "deleteRule": null,
        "id": "tfdwvwwn6b99cy8",
        "indexes": [ ],
        "listRule": "@request.auth.collectionName ~ 'student'",
        "name": "students_view_questions",
        "options": {
          "query": "SELECT \n  questions_.id,\n  COALESCE(JSON_EXTRACT(questions_.question,'$.question'),'no question provided') AS question,\n  COALESCE(JSON_EXTRACT(questions_.question,'$.answers'),'no answers provided') AS answers,\n  COALESCE((\n  SELECT COUNT(question)\n  FROM tests_questions\n  WHERE tests_questions.question = questions_.id\n  ),0) AS times_tested,\n  questions_.marks,\n  questions_.subject,\n  questions_.added_by,\n  questions_.created, \n  questions_.updated\nFROM questions AS questions_"
        },
        "schema": [
          {
            "system": false,
            "id": "onpuybvg",
            "name": "question",
            "type": "json",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "gvcdhlvl",
            "name": "answers",
            "type": "json",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "w0rzj2pe",
            "name": "times_tested",
            "type": "json",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": { }
          },
          {
            "system": false,
            "id": "bgihrvt2",
            "name": "marks",
            "type": "number",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "min": null,
              "max": null,
              "noDecimal": false
            }
          },
          {
            "system": false,
            "id": "hvxtjqxd",
            "name": "subject",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "s06gyf4crcgzdn8",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "yxteob6s",
            "name": "added_by",
            "type": "relation",
            "required": true,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "h00kv48u8r0jg97",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          }
        ],
        "system": 0,
        "type": "view",
        "updateRule": null,
        "updated": "2023-10-19 14:19:35.595Z",
        "viewRule": "@request.auth.collectionName ~ 'student'"
      },
      {
        "collectionId": "16ozzwpv14576vn",
        "collectionName": "view_tables",
        "createRule": null,
        "created": "2023-10-18 09:56:23.561Z",
        "deleteRule": null,
        "id": "10lef9zz81l9b07",
        "indexes": [ ],
        "listRule": "",
        "name": "exams",
        "options": { },
        "schema": [
          {
            "system": false,
            "id": "rzvagcwd",
            "name": "name",
            "type": "text",
            "required": true,
            "presentable": true,
            "unique": false,
            "options": {
              "min": null,
              "max": null,
              "pattern": ""
            }
          },
          {
            "system": false,
            "id": "d2izjy3i",
            "name": "description",
            "type": "editor",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "convertUrls": false
            }
          },
          {
            "system": false,
            "id": "60djooqp",
            "name": "from_date",
            "type": "date",
            "required": true,
            "presentable": true,
            "unique": false,
            "options": {
              "min": "",
              "max": ""
            }
          },
          {
            "system": false,
            "id": "aqurw0ul",
            "name": "to_date",
            "type": "date",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "min": "",
              "max": ""
            }
          },
          {
            "system": false,
            "id": "yo2boz2l",
            "name": "examiner",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "h00kv48u8r0jg97",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": null,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "ymloieco",
            "name": "subject",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "s06gyf4crcgzdn8",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          },
          {
            "system": false,
            "id": "dhabzqsz",
            "name": "class",
            "type": "relation",
            "required": false,
            "presentable": false,
            "unique": false,
            "options": {
              "collectionId": "yvd1531i3j1fzep",
              "cascadeDelete": false,
              "minSelect": null,
              "maxSelect": 1,
              "displayFields": null
            }
          }
        ],
        "system": 0,
        "type": "base",
        "updateRule": null,
        "updated": "2023-10-20 11:01:05.155Z",
        "viewRule": ""
      }
    ]
  