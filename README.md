# node-k8s-config

Reloads Kubernetes configmap data from mounted volumes. Optionally, these values can be added to the (Node) environment. 

# Usage

```javascript 1.6
const Config = require('k8s-config');

const config = new Config({addToEnv: true, optional: false});

// Start watching configs for changes
config.watch(); 

// Get a value
const val = config.get('myKey');
console.log(val); // someVal (or null if key not present)

// Get a value, with defaultValue if key not present
const otherVal = config.get('myKeyDoesNotExist', 'myDefaultValue');
console.log(otherVal); // myDefaultValue

// These are equivalent (assuming `addToEnv` is true)
const valFromConfig = config.get('myKey', 'myDefaultValue');
const valFromEnv = process.env.myKey || 'myDefaultValue';

// Dumps value as raw object
console.log(config.dump()); 

// Check if key is set
console.log(config.isset('myKey')); // true or false
```

See `example/k8s` for examples of how to configure the Kubernetes deployment.
