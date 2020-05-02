# bittorrent-dht-node

## A bitorrent-dht client with more http

A web server that exposes POST/GET endpoints for inserting and retrieving values from a bittorrent-dht node.

See [webtorrent/bittorrent-dht](https://github.com/webtorrent/bittorrent-dht) for more extensive documentation of the DHT implementation.

## Endpoints

---
```
POST / 
Content-Type: application/json
Accept: application/json
{
	"data": "Some Value"
}

HTTP/1.1 202 Accepted
Content-Type: application/json; charset=utf-8
{
    "key": "227dd57375fe84dc948bfd5c3aa10d59a6795549",
    "nodes": 1
}
```
---
```
GET /227dd57375fe84dc948bfd5c3aa10d59a6795549 HTTP/1.1
Accept: application/json

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
    "nodeId": "6e7d5f8fe42757e06dcabb42eca1eff39d1aad78",
    "data": "Some Value"
}
```
---
```
GET /info HTTP/1.1
Accept: application/json

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
  "nodes": [],
  "values": {}
}
```
---

## Deployment

### Environment Variables

-   BOOTSTRAP_NODES
    - Comma-separated list of nodes to attempt to bootstrap from. If none are provided, the node will not attempt to bootstrap.
    Example: `BOOTSTRAP_NODES=localhost:6881,router.bittorrent.com:6881`
-   NODE_LISTEN_PORT
    -   UDP port for the DHT node to communicate over. Defaults to `6881`.
-   API_LISTEN_PORT
    -   TCP port for the HTTP server to receive requests . Defaults to `3000`.
-   NODE_MAX_AGE
    -   Time in seconds to wait for nodes to announce. Defaults to `Infinity`.
-   LOOKUP_CACHE
    -   Should the node return a cached value if one exists instead of performing a lookup. Defaults to true.
-   REINSERT
    -   Should the node reinsert data after a successful lookup. Use to keep frequently accessed data in the table. Defaults to true.

---

### Running Directly

#### Dependencies

-   `npm`
-   `node` (tested on `12.13.0`)

#### Running the code

`npm i`

`npm start`

This will start a bootstrap node on port 6881 (API listening on 3000). These values can be overridden by setting the corresponding enviroment variables.

---

### Deploying as a Container

Tested using `podman` but `docker` should work as well.

#### Dependencies

-   `docker` or `podman`

#### Building and Running container

`podman pull gus33/bittorrent-dht-node:stable`

##### For a node that bootstraps from 127.0.0.1:6881

`podman run --network host --env BOOTSTRAP_NODES=127.0.0.1:6881 gus33/bittorrent-dht-node:stable`

##### For a node that bootstraps from multiple nodes

`podman run --network host --env BOOTSTRAP_NODE_URL=router.bittorrent.com:6881,router.utorrent.com:6881 gus33/bittorrent-dht-node:stable`

##### For a bootstrap node

`podman run --network host gus33/bittorrent-dht-node:stable`
