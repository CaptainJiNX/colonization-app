.DEFAULT_GOAL := build-local

makefiles := $(shell find . -maxdepth 2 -mindepth 2 -name [Mm]akefile)
dirs := $(foreach file, $(makefiles), $(shell dirname $(file)))

build-local:
test:
test-unit:
test-integration:
%:
	@$(foreach dir, $(dirs), $(MAKE) $@ -C $(dir);)
