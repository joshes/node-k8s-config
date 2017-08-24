# node-k8s-config - example

**tl;dr**

```bash
# Create the configuration
kubectl create -f k8s/configmap.yml

# Create the deployment
kubectl create -f k8s/deployment.yml

# Expose the service with a public loadbalancer - may take a few minutes to become active
kubectl create -f k8s/service.yml

# Check the current config values
curl $(kubectl get svc -o wide | grep ^node-k8s-config-example | awk '{print $3}')/config

# Tail the logs (do this in another terminal)
kubectl logs $(kubectl get po | grep node-k8s | awk '{print $1}') -f

# Update the configmap (add a new key/val pair for example) and save
kubectl edit configmap special-config

# It takes a few seconds to update the volume...
# The logs should update with some k8s-config logging ...

# Check the updated config values
curl $(kubectl get svc -o wide | grep ^node-k8s-config-example | awk '{print $3}')/config
```
