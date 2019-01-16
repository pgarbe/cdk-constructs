.SHELLFLAGS = -e -c
.ONESHELL:
.SILENT:


build:
	time lerna run --stream build || fail

test: build
	lerna run --stream test || fail

publish: test
	learna publish