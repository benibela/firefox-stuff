#!/bin/bash

export PATH=$PATH::~/opt/xdotool
export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:~/opt/xdotool

SELF=/home/benito/timeworld/time-world.sh
alias message=echo

#WAR=1;
#while getopts "w:" option
#do
#case $option in
#w) WAR=$OPTARG;;
#esac
# done

function myclick(){
  ((X=$1+$OFFSETX))
  ((Y=$2+$OFFSETY))
  echo xdotool click --position $X $Y --window $WINDOW 1
  xdotool click --position $X $Y --window $WINDOW 1
  mysleep 1
}

function fastclick(){
  ((X=$1+$OFFSETX))
  ((Y=$2+$OFFSETY))
  echo xdotool click --position $X $Y --window $WINDOW 1
  xdotool click --position $X $Y --window $WINDOW 1
  mysleep 0.01
}

function mysleep(){
  sleep $1
}


while true; do

WINDOW=` xdotool search --name "Play Time World" | tail -1`
INIT=


if [[ -z $WINDOW ]]; then
  echo failed to find chrome
  exit;
  
#  firefox -P tyrant --no-remote -new-window http://www.kongregate.com/games/synapticon/tyrant 2> /dev/null  > /dev/nullc &
  sudo -u firefox google-chrome http://www.kongregate.com/games/playmage/time-world 2> /dev/null  > /dev/null &
  while [[ -z $WINDOW ]]; do 
    WINDOW=` xdotool search --name "Play Time World"`
    sleep 0.25;
  done
  xdotool set_desktop_for_window $WINDOW 2
  sleep 30;
  INIT=1
fi



#WINDOWNAME=`xdotool getwindowname $WINDOW`
#OFFSETFLASHX=4 #`echo $WINDOWNAME | cut -d "|" --field 2`
#OFFSETFLASHY=88 # `echo $WINDOWNAME | cut -d "|" --field 3`

#OFFSETWINDOwX=`xwininfo -id $WINDOW -all | grep Relative | grep X | cut -d : -f 2`
#OFFSETWINDOwY=`xwininfo -id $WINDOW -all | grep Relative | grep Y | cut -d : -f 2`
#echo $OFFSETFLASHX $OFFSETFLASHY
#echo $OFFSETWINDOwX $OFFSETWINDOwY
#((OFFSETX=$OFFSETFLASHX-$OFFSETWINDOwX))
#((OFFSETY=$OFFSETFLASHY-$OFFSETWINDOwY))
#echo $OFFSETX $OFFSETY

OFFSETX=0
OFFSETY=63



case $1 in
fastautopirates) ;&
autopirates)
message select pirates
#pretty alcon planet
fastclick 529 364 #first or it hits the cancel button
fastclick 470 233
fastclick 318 304
fastclick 712 302
fastclick 163 352
fastclick 361 419
fastclick 661 407
fastclick 621 552

#home
fastclick 252 211
fastclick 418 189
fastclick 717 235
fastclick 198 378
fastclick 368 391
fastclick 500 297
fastclick 667 392
fastclick 588 518

#pirate planet
fastclick 261 183
fastclick 433 257
fastclick 610 210
fastclick 289 298
fastclick 682 311
fastclick 259 483
fastclick 465 439
fastclick 621 465


#strange planet
fastclick 187 176
fastclick 438 172
fastclick 674 154
fastclick 150 250 
fastclick 340 347
fastclick 632 375
fastclick 525 458
fastclick 231 458

if [[ $1 = fastautopirates ]]; then  $SELF fastpirates; 
else $SELF pirates; fi
;;

fastpirates) ;&
pirates)
message fight pirates
myclick 432 357 # pirates battle
myclick 490 357 # pirates battle wtf
myclick 683 133 # war of heros message
myclick 683 133 # war of heros message
if [[ $1 = fastpirates ]]; then
  myclick 20 450 # surrender
  myclick 486 357 # confirm
else myclick 106 450 # auto
fi
myclick 800 50 # close missinons dialog if no pirates are there
myclick 878 50 # close missinons dialog if no pirates are there wtf
if [[ $1 = fastpirates ]]; then mysleep 1
else mysleep $((RANDOM/500+70))
fi
myclick 800 125 # close result dialog
myclick 858 125 # close result dialog wtf

;;

visit)
message visit
#myclick 734 460 #friends
myclick 867 460 #wtf shifted friends
#myclick 500 $((172 + (RANDOM % 8) * 38)) #choose friend
myclick 588 $((172 + (RANDOM % 8) * 38)) #wtf shifted choose friend

#myclick 186 198 #planet 1
#myclick 256 185 #visit (offset 142 30)

#myclick 311 262 #planet 2
#myclick 400 256 #visit 

#myclick 453 193 #planet 3
#myclick 555 186 #visit (offset 112 -7)

myclick 538 455 #planet 7
myclick 650 462 #visit (offset 112 -7)

myclick 726 393 #planet 6
myclick 838 386 #visit (offset 112 -7)

myclick 571 267 #planet 4
myclick 683 260 #visit (offset 112 -7)

#myclick 493 375 #visit confirm
myclick 567 375 #visit confirm wtf shifted
mysleep 3 #slow loading
fastclick 145 278 #chest left
fastclick 60 278 #chest left
fastclick 44 258 #chest left
fastclick 771 277 #chest right
fastclick 803 277 #chest right
fastclick 800 273 #chest right
mysleep 1
fastclick 507 362 #chest confirm
fastclick 507 370 #chest confirm
fastclick 563 370 #chest confirm wtf
fastclick 563 375 #chest confirm wtf
myclick 507 375 #chest confirm

;;

fullvisit)
  if [ -z "$2" ]; then COUNT=1; else COUNT=$2; fi;
  for ((i=1;i<=$COUNT;i++)); do 
    $SELF visit
    $SELF autopirates
  done;
;;

fastfullvisit)
  if [ -z "$2" ]; then COUNT=1; else COUNT=$2; fi;
  for ((i=1;i<=$COUNT;i++)); do 
    $SELF visit
    $SELF fastautopirates
  done;
;;

lab)
myclick 703 271 #carrot
fastclick 222 311 #upgrade
myclick 450 330 #target
fastclick 222 311 #upgrade
myclick 541 330 #attack
fastclick 222 311 #upgrade
myclick 641 330 #leth
fastclick 222 311 #upgrade
myclick 717 416 #armor
fastclick 222 311 #upgrade
myclick 444 475 #dodge
fastclick 222 311 #upgrade
myclick 524 475 #defense
fastclick 222 311 #upgrade
myclick 604 475 #leth def
fastclick 222 311 #upgrade
myclick 678 475 #speed
fastclick 222 311 #upgrade
mysleep 2
myclick 828 58
;;

esac



exit



xdotool set_desktop_for_window $WINDOW 2

#if [[ INIT == 1 ]]; then myclick 512 437
#else 
myclick 60 100; #home/activate
sleep 2;
myclick 510 454
mysleep 2;
myclick 60 100
mysleep 3;
#fi



echo Found: $WINDOW $OFFSETX $OFFSETY 
echo
echo BEGINNING FACTION FIGHTS
echo

if [[ $WAR != 0 ]]; then
myclick 473 99 #factions
mysleep 5;
myclick 253 549 #wars
mysleep 5;
case $WAR in
1) myclick 655 292;; #war 1
2) myclick 655 323;; #war 2
esac
myclick 307 476 #fight
mysleep 10
myclick 134 528 #speed 4

function standardfight(){
  myclick 569 408 #close out of stamina
  sleep 1
  myclick 307 476 #fight
  sleep 1
  mysleep 27
  myclick 387 323
}

for ((i=1;i<21;i++)); do 
  standardfight
  echo "    battle repeat" $i
done

sleep 3
myclick 569 408 #close out of stamina
sleep 3

fi


echo BEGINNING MISSION FIGHTS

#missions
myclick 171 95 #missions
mysleep 5
myclick 175 330 #fight
mysleep 10
myclick 134 528 #speed 4

for ((i=1;i<20;i++)); do 
  mysleep 30
  myclick 279 381 #win
  myclick 279 323 #lost
  echo "    mission repeat" $i
done



xdotool windowdelete $WINDOW

echo tired, now

sleep 5400;

done
