"use strict";

const fs = require('fs');
const path = require('path');
const debug = require('debug')('k8s-config');
const EventEmitter = require('events');

const DefaultConfig = {
    addToEnv: false,
    optional: false
};

class Config extends EventEmitter {
    constructor(opts) {
        super();
        this._opts = opts || DefaultConfig;
        this._map = new Map();
        this._configMountPath = process.env.KUBERNETES_CONFIG_MOUNT_PATH || '/etc/config';
    }

    watch() {
        if (!fs.existsSync(this._configMountPath)) {
            const msg = 'Configuration directory not found - ' + this._configMountPath;
            if (!this._opts.optional) {
                throw new Error(msg);
            } else {
                debug('WARN: %s', msg);
                debug('This configuration will not be used!');
                return;
            }
        }

        this._reloadSync();
        debug('Initial configuration loaded');

        debug('Watching: %s, exists: %j', this._configMountPath, fs.existsSync(this._configMountPath));
        fs.watch(this._configMountPath, {recursive: true}, (evt, filename) => {
            debug('Reloading configuration due to watch event: %s - file: %s', evt, filename);
            debug('Map before reload: %j', this.dump());
            this._reloadSync();
            debug('Map after reload: %j', this.dump());
        });
    }

    get (key, defaultVal = null) {
        const res = this._map.has(key) ? this._map.get(key) : defaultVal;
        debug('get - key: %s, defaultVal: %j, result: %j', key, defaultVal, res);
        return res;
    }

    isset(key) {
        const res = this._map.has(key);
        debug('isset - key: %s, result: %s', key, res);
        return res;
    }

    dump() {
        const res = {};
        this._map.forEach((v, k) => {
            res[k] = v;
        });
        return res;
    }

    _reloadSync() {
        const keyDir = this._configMountPath;
        debug('keyDir: %s', keyDir);
        const keyPaths = fs.readdirSync(keyDir)
            .map(name => path.join(keyDir, name))
            .filter((p) => {
                return !fs.lstatSync(p).isDirectory() && !path.basename(p).match(/^\.\.data$/);
            });
        debug('keyPaths: %j', keyPaths);

        if (this._opts.addToEnv) {
            // unset any previously set vals
            this._map.forEach((v, k) => {
                delete process.env[k];
            });
        }

        keyPaths.forEach((keyPath) => {
            const key = path.basename(keyPath).replace('\n', '');
            const val = fs.readFileSync(keyPath).toString().replace(/\n*$/g, '');
            debug('Set - key: %s: %s', key, val);
            this._map.set(key, val);
            if (this._opts.addToEnv) {
                process.env[key] = val;
            }
        });
    }
}

module.exports = Config;
