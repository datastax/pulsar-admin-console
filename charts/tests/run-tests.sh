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

set -e
this_dir="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"
filter_tests=${1:-""}


source $this_dir/k3s.sh
k3s_stop
k3s_start

print_pods_logs() {
    local namespace=$1
    within_k3s kubectl get pods -n $namespace | tail -n 2 | awk '{print $1}' | while read pod; do echo "$pod logs:" && within_k3s kubectl logs $pod -n $namespace; done
}

for f in charts/pulsar-admin-console/templates/tests/*; do
    basename_test=$(basename $f)
    if [[ "$basename_test" != "test-"* ]]; then
        echo "skipping $basename_test file"
        continue
    fi
    if [[ "$basename_test" != *"$filter_tests"* ]]; then
        echo "skipping $basename_test test"
        continue
    fi

    values_file=${this_dir}/test-specs/values-${basename_test:5}
    if [ ! -f "$values_file" ]; then
        echo "values file not found for test $basename_test, expected values file at $values_file"
        exit 1
    fi
    release_name=${basename_test//\.yaml}
    echo "==========================================="
    echo "starting test $release_name"
    within_k3s kubectl delete namespace $release_name 2> /dev/null || echo ""
    within_k3s helm install -n $release_name --create-namespace $release_name charts/pulsar-admin-console -f $values_file
    within_k3s kubectl wait deployment -n $release_name $release_name-pulsar-admin-console --for condition=Available=True --timeout=120s || (
        echo "test $release_name failed, admin console deployment not ready" && 
        print_pods_logs $release_name &&
        within_k3s kubectl delete namespace $release_name &&
        k3s_stop &&
        exit 1
    )
    within_k3s helm test -n $release_name $release_name --filter "name=$release_name" || (
        echo "test $release_name failed" && 
        print_pods_logs $release_name &&
        within_k3s kubectl delete namespace $release_name &&
        k3s_stop &&
        exit 1
    )
    within_k3s helm delete $release_name -n $release_name
    within_k3s kubectl delete namespace $release_name
    echo "test $release_name passed"
    echo "==========================================="
done
k3s_stop
