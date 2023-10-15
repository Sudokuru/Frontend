#!/bin/bash

# Get a list of all files in the Learned directory
files=$(ls Learned)

# Iterate over the list of files
for file in $files; do
  # Paste the lock in the center of the image (using ImageMagick)
  convert "Learned/$file" -gravity center lock.svg -composite "Locked/$file"
done