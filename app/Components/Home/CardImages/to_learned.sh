#!/bin/bash

# Get a list of all files in the Locked directory
files=$(ls Locked)

# Iterate over the list of files
for file in $files; do
  # Paste the lock in the center of the image (using ImageMagick)
  convert "Locked/$file" -gravity center checkmark.svg -composite "Learned/$file"
done