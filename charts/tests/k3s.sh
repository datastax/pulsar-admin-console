#!/bin/bash

#
# Copyright DataStax, Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#

docker_container=pulsar-admin-console-k3s
docker_image=rancher/k3s:v1.25.3-k3s1
workdir=/tmp/pulsar-admin-console-tests
k3s_start() {
    mkdir -p $workdir
    docker run --rm -d \
        --name $docker_container \
        -v /sys/fs/cgroup:/sys/fs/cgroup \
        --privileged \
        -p 6443:6443 \
        $docker_image server --tls-san=localhost --disable=traefik
    sleep 10

    docker cp $docker_container:/etc/rancher/k3s/k3s.yaml $workdir/kubeconfig
    KUBECONFIG=$workdir/kubeconfig kubectl wait --for=condition=Ready nodes --all --timeout=600s
    echo "k3s ready"
}
k3s_load_image() {
    local docker_image=$1
    echo "Loading image $docker_image into k3s"
    sha=$(docker inspect $docker_image | jq -r '.[0].Id')
    echo "Image sha: $sha"
    if [ ! -f "$workdir/$sha.tar.gz" ]; then
        mkdir -p $workdir
        echo "Exporting image $docker_image"
        docker save $docker_image > $workdir/$sha.tar.gz
    fi
    docker cp $workdir/$sha.tar.gz $docker_container:/tmp/$sha.tar.gz
    echo "Creating $docker_image in k3s"
    docker exec -it $docker_container ctr image import /tmp/$sha.tar.gz
}

within_k3s() {
    KUBECONFIG=$workdir/kubeconfig "$@"
}
k3s_stop() {
    docker rm -f $docker_container
    rm -rf $workdir
}




