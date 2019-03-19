.SHELLFLAGS = -e -c
.ONESHELL:
.SILENT:

update_dependencies:
	find . -name "package-lock.json" -type f -prune -exec rm -rf '{}' +
	npx lerna exec "ncu -a"
	npx lerna exec "npm install"

bootstrap:
	npm i --no-package-lock --global-style
	npx lerna bootstrap --reject-cycles

build:
	npx lerna run --stream build || fail

test: build
	npx lerna run --stream lint || fail
	npx lerna run --stream test || fail

package: test
	npx lerna publish
	npx lerna run --stream package || fail

bump_release:
	npx lerna publish --force-publish=* --skip-npm --no-git-tag-version --no-push

clean:
	find . -name "node_modules" -type d -prune -exec rm -rf '{}' +
	find . -name "dist" -type d -prune -exec rm -rf '{}' +
	