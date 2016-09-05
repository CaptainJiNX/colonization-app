imagename=ctjinx/spaceship

.DEFAULT_GOAL := build-local

build-local:
	@docker build -t $(imagename):local .

deploy-local-to-latest: build-local
	@docker tag $(imagename):local $(imagename):latest && docker push $(imagename):latest

build-test:
	@docker build --build-arg node_env=test -t $(imagename):test .

test-unit: build-test
	@docker run --rm -it $(imagename):test npm run test-unit || exit 1

test: test-unit
