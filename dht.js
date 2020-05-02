import DHT from 'bittorrent-dht';
import cors from 'cors';
import express from 'express';
import config from './config.js';

const api = express();
const dht = new DHT(config.nodeOptions);

console.log("Initialising with config:", config);

api.use(express.json());
api.use(cors());

api.get('/:key', (req, res, next) => {
    const key = req.params.key;

    console.log(key, ': Performing lookup');

    dht.get(key, {
        cache: config.caching
    }, (error, data) => {
        if (error) return next(error);

        console.log(key, ':', data ? 'Located' : 'Not found');

        if (data) {
            if (config.reinsert) {
                // reinsert the data on lookup
                dht.put(data, (error, hash, n) => {
                    if (error) {
                        console.error(key, ': Reinsertion failed', error);
                    } else {
                        console.log(key, ': Reinserted by', n, 'peers');
                    }
                })
            }
            return res.status(200).json({
                nodeId: data.id.toString('hex'),
                data: data.v.toString()
            });
        } else res.sendStatus(404);
    });
});

api.post('', (req, res, next) => {
    const data = req.body.data;
    const buff = new Buffer.from(data);

    dht.put({ v: buff }, (error, hash, n) => {
        if (error) return next(error);

        let key = hash.toString('hex');

        console.log(key, ': Accepted by', n, 'peers');

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

dht.listen(config.dhtListenPort, () =>
    console.log('DHT listening on port', dht.address().port)
);

dht.on('ready', () => {
    let listener = api.listen(config.apiListenPort, () =>
        console.log('API listening on port', listener.address().port)
    );
});

dht.on('error', err => console.error(err.stack));

export default api;