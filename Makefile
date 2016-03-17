.PHONY: install test server run

install:
	bundle
	npm install

run:
	bundle exec rake webpack:run& bundle exec thin start --port 3000

build:
	bundle exec rake webpack:build

run_production:
	bundle exec rake webpack:build
	RACK_ENV=production bundle exec thin start --port 3000
