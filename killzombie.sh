#!/bin/sh

 zombieprocess=$(lsof -i :3000 | sed -n 's/[^ ]\+ \+\([0-9]\+\) .*/\1/p')
 kill -9 "$zombieprocess"


