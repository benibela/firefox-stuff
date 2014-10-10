#/bin/bash
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
source $DIR/../../../manageUtils.sh

mirroredProject firefox-stuff

BASE=$HGROOT/programs/internet/firefoxgreasemonkey

case "$1" in
mirror)
  syncHg  
;;

esac

