.SHELLFLAGS = -e -c
.ONESHELL:
.SILENT:

update_dependencies:
	find . -name "package-lock.json" -type f -prune -exec rm -rf '{}' +
	npx lerna exec "ncu -a"
	npx lerna exec "npm install"

	ncu -a
	npm i

	cd pipeline && ncu -a && npm i

bootstrap:
	npm i --no-package-lock --global-style
	npx lerna bootstrap --reject-cycles

build:
	npx lerna run --stream build || fail

test: build
	npx lerna run --stream lint || fail
	npx jest

package: test
	npx lerna run --stream package || fail

bump_release:
	npx lerna version

clean:
	find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
	find . -name "dist" -type d -prune -exec rm -rf '{}' +
	