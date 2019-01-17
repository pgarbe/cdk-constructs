.SHELLFLAGS = -e -c
.ONESHELL:
.SILENT:

bootstrap:
	npm i --no-package-lock --global-style
	lerna bootstrap --reject-cycles

build:
	time lerna run --stream build || fail

test: build
	lerna run --stream test || fail

publish: test
	learna publish

clean:
	find . -name "node_modules" -type d -prune -exec rm -rf '{}' +