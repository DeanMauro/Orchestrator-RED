#!/bin/bash

case "$1" in
nodemon)
  nodemon --watch nodes --watch lib --exec '/usr/bin/node-red' ;;
*)
  node-red ;;
esac
