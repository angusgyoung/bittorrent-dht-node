import DHT from 'bittorrent-dht';
import cors from 'cors';
import express from 'express';

const isBootstrapper = process.env.IS_BOOTSTRAPPER || false,
    nodePort = isBootstrapper ? process.env.NODE_PORT || 6881 : 0,
    serverListenPort = isBootstrapper ? process.env.API_PORT || 3000 : 0,
    bootstrapNodeUrl = process.env.BOOTSTRAP_NODE_URL || '127.0.0.1:6881',
    nodeMaxAge = process.env.NODE_MAX_AGE || Infinity,
    nodeConfig = {
        // supress bootstrap if we are not provided with a host
        bootstrap: isBootstrapper ? false : [bootstrapNodeUrl],
        maxAge: nodeMaxAge
    };

const api = express();
const dhtNode = new DHT(nodeConfig);

api.use(express.json());
api.use(cors());

api.get('/:key', (req, res, next) => {
    const key = req.params.key;

    dhtNode.get(key, (error, result) => {
        if (error) return next(error);

        if (result) {
            return res.status(200).json({
                nodeId: result.id.toString('hex'),
                data: result.v.toString()
            });
        } else res.sendStatus(404);
    });
});

api.post('', (req, res, next) => {
    const data = req.body.data;
    const buff = new Buffer.from(data);

    dhtNode.put({ v: buff }, (error, hash, n) => {
        if (error) return next(error);

        let key = hash.toString('hex');
        return res.status(202).json({
            key,
            nodes: n
        });
    });
});

api.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: err.message });
});

dhtNode.listen(nodePort, () =>
    console.log('DHT node is listening on port', dhtNode.address().port)
);

dhtNode.on('ready', () => {
    console.log('DHT node is ready');
    let listener = api.listen(serverListenPort, () =>
        console.log('DHT API listening on port', listener.address().port)
    );
});

export default api;