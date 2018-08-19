#!/bin/bash

case "$1" in
nodemon)
  nodemon --watch nodes --watch lib --exec '/root/node_modules/.bin/node-red' ;;
*)
  node-red ;;
esac
