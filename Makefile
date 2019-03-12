.SHELLFLAGS = -e -c
.ONESHELL:
.SILENT:

update_dependencies:
	lerna exec "ncu -a"
	lerna exec "npm install"

bootstrap:
	npm i --no-package-lock --global-style
	lerna bootstrap --reject-cycles

build:
	time lerna run --stream build || fail

test: build
	lerna run --stream lint || fail
	lerna run --stream test || fail

package: test
	time lerna run --stream package || fail

clean:
	find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
	find . -name "package-lock.json" -type f -prune -exec rm -rf '{}' +
