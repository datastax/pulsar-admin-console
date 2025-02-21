# Copyright 2021
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

all: container

#
# Docker tag with v prefix to differentiate the official release build, triggered by git tagging
#
TAG ?= v0.0.4
PREFIX ?= docker.io/datastax/pulsar-admin-console

container:
	podman manifest create --amend $(PREFIX):$(TAG)
	podman build --jobs=4 --platform linux/arm64,linux/amd64 --manifest $(PREFIX):$(TAG) -f Dockerfile .
	podman tag $(PREFIX):$(TAG) ${PREFIX}:latest

push: container
	podman manifest push $(PREFIX):$(TAG)
	podman manifest push $(PREFIX):$(TAG) $(PREFIX):latest

clean:
	podman rmi $(PREFIX):$(TAG)

tarball:
	rm -rf pulsar-admin-console-$(TAG)/
	docker create -ti --name pac-tarball $(PREFIX):$(TAG) sh
	docker cp pac-tarball:/home/appuser/ pulsar-admin-console-$(TAG)/
	docker rm -f pac-tarball
	tar -czf pulsar-admin-console-$(TAG).tar.gz pulsar-admin-console-$(TAG)/
	rm -rf pulsar-admin-console-$(TAG)/
	openssl dgst -sha512 pulsar-admin-console-$(TAG).tar.gz
