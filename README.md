# :construction: rss-crawler
NodeJS daemon that periodically parses a RSS feed and based on a list of watched items, saves the info of relevant entries in a persistent storage and pushes them to a queue for downstream processing.

## Install

## Manage

## Specs

### RSS Schema

### SQLite Schema

### Output Message Schema
```json

```

## Develop
VSCode configuration at `.vscode/launch.json`.
```json
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "pwa-node",
            "request": "launch",
            "name": "Launch Program",
            "skipFiles": [
                "<node_internals>/**"
            ],
            "runtimeVersion": "14.15.0",
            "program": "${workspaceFolder}/src/index.js",
            "outputCapture": "std",
        }
    ]
}
```

## License

[MIT License - Copyright (c) 2020 Andrea Amorosi](LICENSE)