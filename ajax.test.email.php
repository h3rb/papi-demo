<?php

 include 'core/Page.php';

 $g=getpost();

 if ( !isset($g['em']) || false_or_null($g['em']) ) { die; }

 $len=strlen($em=trim($g['em']));

 if ( $len == 0 ) { die; }
 if ( $len < 3 ) { die; }

 global $auth_model;
 $results=$auth_model->Select(array('email'=>$em));

 if ( ( is_array($results) && count($results)==0 ) || false_or_null($results) ) echo 1;
