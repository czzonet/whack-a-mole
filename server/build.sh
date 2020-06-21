#!/bin/sh
echo 'clean ./dist ...'
rm -rf ./dist
echo 'clean done.'
echo 'compile typescript ...'
tsc
echo 'compile done.'
echo 'start tar  [dist,source...] to .tar.gz ...'
tar zcf dist`date +%Y%m%d%H%M%S`.tar.gz ./dist ./source ./sql ./env_config.json ./package.json ./ecosystem.config.js
echo 'output file: ' dist`date +%Y%m%d%H%M%S.tar.gz`
