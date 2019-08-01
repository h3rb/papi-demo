<?php

 include 'core/Page.php';

 $g=getpost();

 if ( !isset($g['un']) || false_or_null($g['un']) ) { die; }

 $len=strlen($un=trim($g['un']));

 if ( $len == 0 ) { die; }
 if ( $len < 3 ) { die; }

 global $auth_model;
 $results=$auth_model->Select(array('username'=>$un));

 if ( ( is_array($results) && count($results)==0 ) || false_or_null($results) ) echo 1;
