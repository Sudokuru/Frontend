#!/bin/bash

# Get a list of all files in the current directory
files=$(ls)

# Iterate over the list of files and echo the filename of each file that ends in .png
for file in $files; do
  # Check if the file is a regular file and if the filename ends in .png
  if [[ -f $file && "$file" =~ \.png$ ]]; then
    convert $file -colorspace Gray "Learned/$file"
  fi
done