#!/bin/bash

rm -rf dist/*

cd plugins || exit

for dir in *
do
  dest="../../dist/$dir"
  cd "$dir" || exit
  npm exec esbuild -- index.js --global-name=e --bundle --minify --outfile="$dest"/plugin.js
  cp plugin.json "$dest"/

  # this is super janky - remove `var e=`
  sed -i "s/var e=//" "$dest"/plugin.js
  # insert the hash to the manifest
  md5=$(md5sum "$dest"/plugin.json | awk '{ print $1 }')
  sed -i "s/<HASH_PLACEHOLDER>/$md5/" "$dest"/plugin.json

done

cd ..