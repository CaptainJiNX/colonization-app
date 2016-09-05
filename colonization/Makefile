service=colonization
imagename=ctjinx/$(service)

project=colonize
network=$(project)_default
int-test-env=docker-compose.int-test-env.yml
int-test-dep=docker-compose.int-test-dep.yml
local-yml=local-services.yml

LOCAL_SERVICES ?= "$(service)"

.DEFAULT_GOAL := build-local

build-local:
	@docker build -t $(imagename):local .

build-local-silent:
	@echo "Building $(imagename):local ..."
	@docker build -t $(imagename):local . > /dev/null || \
		docker build -t $(imagename):local .

deploy-local-to-latest: build-local
	@docker tag $(imagename):local $(imagename):latest && docker push $(imagename):latest

build-test:
	@echo "Building $(imagename):test ..."
	@docker build --build-arg node_env=test -t $(imagename):test . > /dev/null || \
		docker build --build-arg node_env=test -t $(imagename):test .

test-unit: build-test
	@docker run --rm -it $(imagename):test npm run test-unit || exit 1

pull-dependencies:
	@docker-compose -f $(int-test-dep) pull

local-services-yml:
	@export LOCAL_SERVICES="$(LOCAL_SERVICES)" && ./generate-local-services.sh

integration-test-environment: build-local-silent pull-dependencies local-services-yml
	@docker-compose -p $(project) -f $(int-test-env) -f $(int-test-dep) -f $(local-yml) up -d

test-integration: build-test integration-test-environment
	@docker run --rm -it --net $(network) $(imagename):test npm run test-integration && \
		docker-compose -p $(project) -f $(int-test-env) -f $(int-test-dep) -f $(local-yml) down && \
		exit 0 || \
			docker-compose -p $(project) -f $(int-test-env) -f $(int-test-dep) -f $(local-yml) ps -q | \
				while read line; do \
					echo '\n\n\n\n'; \
					docker logs $$line; \
					tput sgr0; \
				done && \
			docker-compose -p $(project) -f $(int-test-env) -f $(int-test-dep) -f $(local-yml) down && \
			exit 1

test: test-unit test-integration