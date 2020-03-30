import DHT from 'bittorrent-dht';
import cors from 'cors';
import express from 'express';
import config from './config.js';

const api = express();
const dhtNode = new DHT(config.nodeOptions);

console.log(config);

api.use(express.json());
api.use(cors());

api.get('/:key', (req, res, next) => {
    const key = req.params.key;

    dhtNode.get(key, {
        cache: config.caching
    }, (error, result) => {
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

dhtNode.listen(config.dhtListenPort, () =>
    console.log('DHT node is listening on port', dhtNode.address().port)
);

dhtNode.on('ready', () => {
    let listener = api.listen(config.apiListenPort, () =>
        console.log('API listening on port', listener.address().port)
    );
});

dhtNode.on('error', err => console.error(err));

export default api;