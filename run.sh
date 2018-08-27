#!/bin/bash

case "$1" in
nodemon)
  nodemon --watch nodes --watch lib --exec 'cd ../UiPathRED && npm start' ;;
*)
  node-red ;;
esac
