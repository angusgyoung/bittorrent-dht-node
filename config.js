// parse nodes in the format nodeA:6881,nodeB:6881 
// to an array [ 'nodeA:6881', 'nodeB:6881' ]
const parseBootstrapNodes = () => {
    const bootstrapNodeString = process.env.BOOTSTRAP_NODES;

    if (bootstrapNodeString) {
        if (bootstrapNodeString.includes(',')) {
            return bootstrapNodeString.split(',');
        } else return [bootstrapNodeString]
    }
}

export default {
    nodeOptions: {
        bootstrap: parseBootstrapNodes() || false,
        maxAge: process.env.NODE_MAX_AGE || Infinity
    },
    caching: process.env.LOOKUP_CACHE || true,
    dhtListenPort: process.env.NODE_LISTEN_PORT || 6881,
    apiListenPort: process.env.API_LISTEN_PORT || 3000
}

