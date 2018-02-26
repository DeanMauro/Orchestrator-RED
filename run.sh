#!/bin/bash

case "$1" in
nodemon)
  nodemon --watch nodes --watch lib --exec '/usr/local/bin/node-red' ;;
*)
  node-red ;;
esac