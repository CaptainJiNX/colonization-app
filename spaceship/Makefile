imagename=ctjinx/spaceship

project=colonize
network=$(project)_default
int-test-env=docker-compose.int-test-env.yml

.DEFAULT_GOAL := build-local

build-local:
	@docker build -t $(imagename):local .

deploy-local-to-latest: build-local
	@docker tag $(imagename):local $(imagename):latest && docker push $(imagename):latest

build-test:
	@docker build --build-arg node_env=test -t $(imagename):test .

test-unit: build-test
	@docker run --rm -it $(imagename):test npm run test-unit || exit 1

integration-test-environment: build-local
	@docker-compose -p $(project) -f $(int-test-env) up -d

test-integration: build-test integration-test-environment
	@docker run --rm -it --net $(network) $(imagename):test npm run test-integration && \
		docker-compose -p $(project) -f $(int-test-env) down && \
		exit 0 || \
			docker-compose -p $(project) -f $(int-test-env) ps -q | \
				while read line; do \
					echo '\n\n\n\n'; \
					docker logs $$line; \
					tput sgr0; \
				done && \
			docker-compose -p $(project) -f $(int-test-env) down && \
			exit 1

test: test-unit test-integration