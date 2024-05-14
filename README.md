# clientPB

Open source project for testing your Pocketbase backend API rules on how it exposing resources. This project can also be used in mean time to power your frontend while you are developing a beautiful ui for your clints.

## Features

* Supports auth2 authentication (except for GitHub which results in a 404 error page **for anyone who have a fix for this do let me know, thanks in advance**)
* Clients can access resources through database views
* Views structure are created like `{auth_collectionName}_view_{targeted_(base/auth)_collectionName}`

## Example Collections

* personnel (auth collection)
* client (auth collection)
* blog (base collection)
* other\_collection (base collection)
* personnel\_view\_blog (view collection only accessible by personnel)
* client\_view\_blog (view collection only accessible by client)

## Hosting & Setup

To get started with clientPB.

Frontend hosting is free on [Vercel.com](http://vercel.com), while backend hosting can be done on [Pockethost one free instance and no credit card needed](http://pockethost.io). To initialize the database, copy the provided JSON schema and paste it on import schema.

To set up the frontend:

1. Head to [Vercel](http://vercel.com) and create a new project.
2. Import the clientPB repository from GitHub using this URL: `https://github.com/deniskipeles/clientPB.git`
3. Add the following environmental variables:
	* `PRIVATE_AI_KEY` leave it as empty string
	* `PUBLIC_POCKETBASE_URL`
4. Deploy the project.
import the following JSON schema into your Pocketbase app:

```json
[
    {
        "id": "h00kv48u8r0jg97",
        "name": "personnel",
        "type": "auth",
        "system": false,
        "schema": [
            {
                "system": false,
                "id": "ylabderp",
                "name": "name",
                "type": "text",
                "required": true,
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
                "options": {}
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
                    "mimeTypes": [],
                    "thumbs": [
                        "200x200",
                        "200x0"
                    ],
                    "maxSelect": 1,
                    "maxSize": 5242880,
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
                    "maxSelect": 17,
                    "values": [
                        "add students",
                        "add personnel",
                        "librarian",
                        "add exams",
                        "add classes",
                        "take school attendance",
                        "take lesson attendance",
                        "add fees structure",
                        "add fees payments",
                        "add subjects",
                        "add subject teachers",
                        "enrollment students to classes",
                        "add class teachers",
                        "add root data",
                        "add tests",
                        "blogger",
                        "check-in visitors"
                    ]
                }
            }
        ],
        "indexes": [],
        "listRule": "id = @request.auth.id || \n(\n  @request.auth.roles ~ 'add personnel' &&\n  @request.auth.active = true\n)",
        "viewRule": "",
        "createRule": "@request.auth.roles ~ 'add personnel' && \n@request.auth.active = true",
        "updateRule": "(\n  id = @request.auth.id && \n  roles = @request.data.roles && \n  active = @request.data.active\n) ||\n(\n  @request.auth.roles ~ 'add personnel' &&\n  @request.auth.active = true\n)",
        "deleteRule": "@request.auth.roles ~ 'add personnel' && \n@request.auth.active = true",
        "options": {
            "allowEmailAuth": true,
            "allowOAuth2Auth": true,
            "allowUsernameAuth": true,
            "exceptEmailDomains": null,
            "manageRule": null,
            "minPasswordLength": 5,
            "onlyEmailDomains": null,
            "onlyVerified": false,
            "requireEmail": true
        }
    },
    {
        "id": "oi9k6ovoyx34rpg",
        "name": "blog",
        "type": "base",
        "system": false,
        "schema": [
            {
                "system": false,
                "id": "uiowgl3v",
                "name": "title",
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
                "id": "faj6b0wj",
                "name": "content",
                "type": "editor",
                "required": true,
                "presentable": false,
                "unique": false,
                "options": {
                    "convertUrls": false
                }
            },
            {
                "system": false,
                "id": "d11g7eqr",
                "name": "category",
                "type": "select",
                "required": true,
                "presentable": true,
                "unique": false,
                "options": {
                    "maxSelect": 1,
                    "values": [
                        "sports",
                        "news",
                        "events",
                        "revision materials"
                    ]
                }
            },
            {
                "system": false,
                "id": "4opq9bcf",
                "name": "public",
                "type": "bool",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {}
            },
            {
                "system": false,
                "id": "jty7ob18",
                "name": "by",
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
        "indexes": [],
        "listRule": "(\n  @request.auth.id != ''\n) ||\n(\n  @request.auth.id = '' &&\n  public = true\n)",
        "viewRule": "(\n  @request.auth.id != ''\n) ||\n(\n  @request.auth.id = '' &&\n  public = true\n)",
        "createRule": "@request.data.by.roles?~'blogger'",
        "updateRule": "by.id = @request.auth.id",
        "deleteRule": "by.id = @request.auth.id",
        "options": {}
    },
    {
        "id": "ua111z8ifx2e3aq",
        "name": "root",
        "type": "base",
        "system": false,
        "schema": [
            {
                "system": false,
                "id": "5yqhcsrw",
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
                "id": "zfqk5oav",
                "name": "data",
                "type": "json",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "maxSize": 2000000
                }
            },
            {
                "system": false,
                "id": "ij6asyor",
                "name": "photos",
                "type": "file",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "mimeTypes": [],
                    "thumbs": [],
                    "maxSelect": 99,
                    "maxSize": 5242880,
                    "protected": false
                }
            },
            {
                "system": false,
                "id": "xh5xaiwa",
                "name": "html_data",
                "type": "editor",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "convertUrls": false
                }
            }
        ],
        "indexes": [],
        "listRule": "",
        "viewRule": "",
        "createRule": "(\n  @request.auth.roles ~ 'add root data' &&\n  @request.auth.active = true\n)",
        "updateRule": "(\n  @request.auth.roles ~ 'add root data' &&\n  @request.auth.active = true\n)",
        "deleteRule": "(\n  @request.auth.roles ~ 'add root data' &&\n  @request.auth.active = true\n)",
        "options": {}
    },
    {
        "id": "16ozzwpv14576vn",
        "name": "clientPB_view_tables",
        "type": "view",
        "system": false,
        "schema": [
            {
                "system": false,
                "id": "pkpywoki",
                "name": "name",
                "type": "json",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "maxSize": 1
                }
            },
            {
                "system": false,
                "id": "uwvvm6pm",
                "name": "type",
                "type": "json",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "maxSize": 1
                }
            },
            {
                "system": false,
                "id": "ir4ermmc",
                "name": "schema",
                "type": "json",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "maxSize": 1
                }
            },
            {
                "system": false,
                "id": "niotnapy",
                "name": "indexes",
                "type": "json",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "maxSize": 1
                }
            },
            {
                "system": false,
                "id": "s1u3oicv",
                "name": "options",
                "type": "json",
                "required": false,
                "presentable": false,
                "unique": false,
                "options": {
                    "maxSize": 1
                }
            }
        ],
        "indexes": [],
        "listRule": "(\n  name ~ @request.auth.collectionName &&\n  name ~ \"_view_\"\n)||\n(\n  type = \"base\" &&\n  @request.auth.id != null\n) ||\n(\n  type = \"auth\"\n)",
        "viewRule": "(\n  name ~ @request.auth.collectionName &&\n  name ~ \"_view_\"\n)||\n(\n  type = \"base\" &&\n  @request.auth.id != null\n) ||\n(\n  type = \"auth\"\n)",
        "createRule": null,
        "updateRule": null,
        "deleteRule": null,
        "options": {
            "query": "SELECT\n    id,\n    -- system,\n    name,\n    type,\n    schema,\n    indexes,\n    options,\n    -- viewRule,\n    -- listRule,\n    -- createRule,\n    -- updateRule,\n    -- deleteRule,\n    created,\n    updated\nFROM\n    '_collections'"
        }
    }
]
```


## Customizing Home Page Content

To customize the content that is displayed on your home page, add a record to the root collection with the name "app/website". In this record, use the following fields:

* `id`: a unique identifier for the record
* `name`: the name of your page
* `html_data`: the HTML content you want to be seen by your page visitors
* `data`: a JSON object containing additional data for your page, such as the title, description, and logo index
* `photos`: an array of photo URLs to be used in a carousel on your home page

For example:

```json
{
  "id": "1",
  "name": "my-page",
  "html_data": "<h1>Welcome to my page!</h1>",
  "data": {
    "title": "My Page",
    "description": "This is my personal page",
    "logo": 0
  },
  "photos": [
    "photo1.jpg",
    "photo2.jpg",
    "photo3.jpg"
  ]
}
```

## Viewing Many Relations

To allow certain users to view many relations, add a new record to the root collection with the name "controls" and the following data:

* `name`: "controls"
* `data`: a JSON object containing the following fields:
	+ `view_many_relations`: a boolean indicating whether to view many relations
	+ `unlimited_users`: an array of user collectionNames who have unlimited access

For example:

```json
{
  "name": "controls",
  "data": {
    "view_many_relations": true,
    "unlimited_users": ["personnel"]
  }
}
```

This will allow the users specified in the "unlimited\_users" array to see the edit and create buttons.

## Demo

To see clientPB in action, check out the demo at [client-pb.ktechs.xyz](https://client-pb.ktechs.xyz).

Login credentials:

* Username/Email: tester/tester@gmail.com
* Password: tester

## Contributing

We welcome contributions from the community. If you'd like to contribute, please fork the repository and make changes as you'd like. Pull requests are warmly welcome.

## Issues

If you encounter any problems or have any suggestions, please open an issue on the [GitHub issue tracker](https://github.com/deniskipeles/clientPB/issues).

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/deniskipeles/clientPB/blob/master/LICENSE.md) file for details.