# bittorrent-dht-node

## A bitorrent-dht client with more http

An express server that exposes put/get endpoints for inserting and retrieving values from a bittorrent-dht node.

See [webtorrent/bittorrent-dht](https://github.com/webtorrent/bittorrent-dht) for more extensive documentation of the DHT implementation.

## Endpoints

---

```
GET /227dd57375fe84dc948bfd5c3aa10d59a6795549 HTTP/1.1
Accept: application/json

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

{
    "data": {
        "nodeId": "6e7d5f8fe42757e06dcabb42eca1eff39d1aad78",
        "value": "Some Value"
    }
}
```

---

```
PUT / HTTP/1.1
Content-Type: application/json
Accept: application/json
{
	"content": "Some Value"
}

HTTP/1.1 202 Accepted
Content-Type: application/json; charset=utf-8
{
    "key": "227dd57375fe84dc948bfd5c3aa10d59a6795549",
    "nodes": 1
}
```

---

## Deployment

### Environment Variables

-   IS_BOOTSTRAPPER
    -   Defaults to false. If set to true, the node will not attempt to bootstrap and will listen for bootstrap requests on UDP port 6881 and http requests on TCP port 3000 (unless overridden).
-   NODE_PORT
    -   UDP port for the DHT client to communicate over. Defaults to a random port.
-   API_PORT
    -   TCP port for the HTTP server to receive requests . Defaults to a random port.
-   BOOTSTRAP_NODE_URL
    -   If `IS_BOOTSTRAPPER == false`, use this address to initialise the routing table of this node. Defaults to `127.0.0.1:6881`.
-   NODE_MAX_AGE
    -   Time in seconds to wait for nodes to announce. Defaults to `Infinity`.

---

### Running Directly

#### Dependencies

-   `npm`
-   `node` (tested on `12.13.0`)

#### Running the code

`npm i`

`npm start`

This will start a node that listens for bootstrappers and http requests on two random ports. These values can be overridden by setting the corresponding enviroment variables.

Setting `IS_BOOTSTRAPPER` to true will (by default) start a node listening for bootstrap requests on UDP port 6881.

---

### Deploying as a Container

Tested using `podman` but `docker` should work as well.

#### Dependencies

-   `docker` or `podman`

#### Building and Running container

`podman pull gus33/bittorrent-dht-node:stable`

##### For a node that bootstraps from 127.0.0.1:6881

`podman run --network host gus33/bittorrent-dht-node:stable`

##### For a node that bootstraps from somewhere else

`podman run --network host --env BOOTSTRAP_NODE_URL=router.bittorrent.com:6881 gus33/bittorrent-dht-node:stable`

##### For a bootstrap node

`podman run --network host --env IS_BOOTSTRAPPER=true gus33/bittorrent-dht-node:stable`
