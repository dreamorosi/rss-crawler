# :construction: rss-crawler
NodeJS daemon that periodically parses a RSS feed and based on a list of watched items, saves the info of relevant entries in a persistent storage and pushes them to a queue for downstream processing.

## Install

## Manage

## Specs

### RSS Schema
```xml
<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:tv="http://my-rss-feed.com">
    <channel>
        <title>Feed Title</title>
        <link>http://my-rss-feed.com</link>
        <ttl>30</ttl>
        <description>Feed Description</description>
        <item>
            <title>Show Name S01E01</title>
            <link>some_url:?ABCDEFGHILMNOPQRSTUVWZYZ</link>
            <guid isPermaLink="false">96c0f2a6dc843b7ef08eb3c17266cf348ab3e16c</guid>
            <pubDate>Fri, 30 Oct 2020 09:50:17 +0000</pubDate>
            <description>New episode: Show Name S01E01</description>
            <tv:show_id>1234</tv:show_id>
            <tv:external_id>98765</tv:external_id>
            <tv:show_name>Show Name</tv:show_name>
            <tv:episode_id>7654</tv:episode_id>
            <tv:raw_title>Show Name S01E01</tv:raw_title>
            <tv:info_hash>ABCDEFGHILMNOPQRSTUVWZYZ</tv:info_hash>
            <enclosure url="some_url:?ABCDEFGHILMNOPQRSTUVWZYZ" length="0" type="application/mime" />
        </item>
    </channel>
</rss>
```
### SQLite Schema

### Output Message Schema
```json
{
    "name": "Show Name",
    "link":"some_url:?ABCDEFGHILMNOPQRSTUVWZYZ",
    "show":"1234",
    "guid":"96c0f2a6dc843b7ef08eb3c17266cf348ab3e16c"
}
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
            "internalConsoleOptions": "openOnSessionStart",
            "env": {
                "RSS_CRAWLER_LOG_LEVEL": "DEBUG",
                "RSS_CRAWLER_ENVIRONMENT": "DEV",
            }
        }
    ]
}
```

## License

[MIT License - Copyright (c) 2020 Andrea Amorosi](LICENSE)