.PHONY: install test server run

NAME=ceej/young_actors_house
VERSION=`git describe --always`
CORE_VERSION=HEAD

install:
	bundle
	npm install
	touch .env
	touch .env.development
	touch .env.test
	touch .env.production

run:
	bundle exec rake webpack:run& bundle exec puma -C app/config/puma.rb

build:
	RACK_ENV=production bundle exec rake webpack:build

run_production:
	RACK_ENV=production bundle exec rake webpack:build
	RACK_ENV=production bundle exec puma -C app/config/puma.rb

docker_all: prepare build

prepare:
	git archive -o docker/echoapp.tar HEAD

docker_build:
	docker build -t $(NAME):$(VERSION) --rm docker

docker_tag_latest:
	docker tag $(NAME):$(VERSION) $(NAME):latest

docker_push:
	docker push $(NAME):$(VERSION)
