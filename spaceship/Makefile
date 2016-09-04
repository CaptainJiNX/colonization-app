imagename=ctjinx/spaceship

.DEFAULT_GOAL := build-local

build-local:
	@docker build -t $(imagename):local .

deploy-local-to-latest: build-local
	@docker tag $(imagename):local $(imagename):latest && docker push $(imagename):latest
