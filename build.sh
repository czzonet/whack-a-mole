#!/bin/sh
echo start tar  './dist' to dist`date +%Y%m%d%H%M%S`.tar.gz ...
tar zcf dist`date +%Y%m%d%H%M%S`.tar.gz ./dist
echo ok