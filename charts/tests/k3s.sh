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
k3s_start() {
    docker run --rm -d \
        --name $docker_container \
        -v /sys/fs/cgroup:/sys/fs/cgroup \
        --privileged \
        -p 6443:6443 \
        $docker_image server --tls-san=localhost --disable=traefik
    sleep 10

    docker cp $docker_container:/etc/rancher/k3s/k3s.yaml /tmp/test-kubeconfig
    KUBECONFIG=/tmp/test-kubeconfig kubectl wait --for=condition=Ready nodes --all --timeout=600s
    echo "k3s ready"
}
within_k3s() {
    KUBECONFIG=/tmp/test-kubeconfig "$@"
}


k3s_stop() {
    docker rm -f $docker_container
}




