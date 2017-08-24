'use strict';

const config = require('k8s-config');
const server = require('restify').createServer({name: 'node-k8s-config-example'});

server.get('/config', (req, res) => {
    res.send(config.dump());
});

server.listen(process.env.PORT || 3000, () => {
    console.log('%s listening at %s', server.name, server.url);
});
