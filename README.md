# Docker based deployment
In this project the deployment is happening on docker, the image is being severed staticky using NGINX
## step 0 `aws login`

e.g. `aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 400779737080.dkr.ecr.us-east-1.amazonaws.com/equabli-eks-ecr-qa`

## Step 1 `docker build -t <build name>:<version> .`

e.g. `docker build -t document-manager:0.0.1 .`

## Step 2 `docker images` get image tag 

e.g. `421639237669`

## Step 3 `docker tag <tag> <ECS>`

e.g.  `docker tag 9c0e16b7b11a 400779737080.dkr.ecr.us-east-1.amazonaws.com/equabli-eks-ecr-qa/eq-docs-ui:0.1.0`

## Step 4 `docker push <ECS>`

e.g. `docker push 400779737080.dkr.ecr.us-east-1.amazonaws.com/equabli-eks-ecr-qa/eq-docs-ui:0.1.0`