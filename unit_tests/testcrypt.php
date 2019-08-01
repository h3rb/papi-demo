<?php
 include '../core/Page.php';
 echo PHP_EOL;
 $pass_1="WARPfoo123";
 $pass_2="WARPfoAo123";
 echo ourcrypt("jurisdocto").PHP_EOL;
 echo ourcrypt($pass_1).PHP_EOL;
 echo ourcrypt($pass_1).PHP_EOL;
 echo ($r=ourcrypt($pass_2)).PHP_EOL;
 echo 'matches?'.(matchcrypt($pass_2,$r)?"YES":"NO").PHP_EOL;
 echo 'matches?'.(matchcrypt($pass_1,$r)?"YES":"NO");
