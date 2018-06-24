#!/bin/sh
protoc --go_out=. --proto_path=../../proto/ ../../proto/*.proto
