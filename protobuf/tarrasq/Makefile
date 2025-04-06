_DEPS= $(wildcard **/*.proto)
_OUT=gen

all: go typescript

export GO_PATH := $(HOME)/go
export PATH := ${PATH}:${GO_PATH}/bin
go: $(_DEPS)
	go install google.golang.org/grpc/cmd/protoc-gen-go-grpc@latest
	go install google.golang.org/protobuf/cmd/protoc-gen-go@latest
	cd .. && protoc --go_out=protocol/gen protocol/**/*.proto protocol/**/**/*.proto
	# cp -r ./gen/goland /usr/local/go/src

package.json:
node_modules: package.json
	yarn install


typescript: $(_DEPS) node_modules
	cd gen && mkdir -p js
	cd .. && protoc --plugin=protocol/js/node_modules/.bin/protoc-gen-ts_proto --ts_proto_out=protocol/gen/js protocol/**/*.proto protocol/**/**/*.proto --ts_proto_opt=esModuleInterop=true  --ts_proto_opt=env=browser