# node-k8s-config

Reloads Kubernetes configmap data from mounted volumes.

# Usage

```javascript 1.6
const config = require('k8s-config');

// Get a value
const val = config.get('myKey');
console.log(val); // someVal (or null if key not present)

// Get a value, with defaultValue if key not present
const otherVal = config.get('myKeyDoesNotExist', 'myDefaultValue');
console.log(otherVal); // myDefaultValue

// Dumps value as raw object
console.log(config.dump()); 

// Check if key is set
console.log(config.isset('myKey')); // true or false
```

See `example/k8s` for examples of how to configure the Kubernetes deployment.
