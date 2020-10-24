<?php


 global $AWS_SHELL_LOGFILE, $AWS_SHELL_LOGFILE2;

 if ( !defined('S3_BUCKET_PATH') ) {
 define('S3_BUCKET_PATH', 's3://'.S3_IMAGE_STORE.'/');
 }

// Runs aws in a shell logged.
 if ( !function_exists('awssh') ) {
  function awssh( $cmd, $hush=FALSE ) {
   global $AWS_SHELL_LOGFILE,$AWS_SHELL_LOGFILE2;
   $out=shell_exec( '/var/www/automation/aws_shell '.$AWS_SHELL_LOGFILE2.' '.$cmd.' 2>&1 > '.$AWS_SHELL_LOGFILE );
   $out.=file_get_contents($AWS_SHELL_LOGFILE2);
   $out.=file_get_contents($AWS_SHELL_LOGFILE);
   if ( false_or_null($hush) ) plog("SHELL: aws s3 ".$cmd."\n-shell-output-\n".$out."\n-end-of-shell-output-");
   return $out;
  }
 }


 // Uses SYNC method.
 if ( !function_exists('aws_sync') ) {
  function aws_sync( $source, $endpoint, $hush=FALSE ) {
   $target = S3_BUCKET_PATH.$endpoint;
   return awssh( "sync $source $target", $hush );
  }
 }

 // Copies data to remote s3
 if ( !function_exists('aws_cp') ) {
  function aws_cp( $source, $endpoint, $hush=FALSE ) {
   $target = S3_BUCKET_PATH.$endpoint;
   return awssh( "cp $source $target", $hush );
  }
 }

 // Copies data to remote s3
 if ( !function_exists('aws_cp_direct') ) {
  function aws_cp_direct( $source, $target, $hush=FALSE ) {
   return awssh( "cp $source $target", $hush );
  }
 }

 // Lists files in an endpoint of a bucket on s3
 if ( !function_exists('aws_ls') ) {
  function aws_ls( $endpoint, $hush=FALSE ) {
   $target = S3_BUCKET_PATH.$endpoint;
   $files=awssh( "ls $target", $hush );
   $files=explode("\n",$files);
   foreach ( $files as $idx=>&$f ) if ( strlen(trim(removeWhiteSpace($f))) === 0 ) unset($files[$idx]);
   else $f=explode(" ",removeWhiteSpace($f));
   foreach ( $files as &$f ) {
    $len=count($f);
    if ( count($f) > 2 ) {
     $f["is_file"] = TRUE;
     $f["filename"] = $f[$len-1];
     $f["date"] = $f[0];
     $f["time"] = $f[1];
     $f["filesize"] = intval($f[2]);
     $f["created"] = strtotime($f[0].' '.$f[1]);
     $f["original"]=array();
     for ( $i=0; $i<$len; $i++ ) { $f["original"][$i]=$f[$i]; unset($f[$i]); }
    } else {
     $f["is_file"] = FALSE;
     $f["dirname"] = rtrim($f[count($f)-1],'/');
     for ( $i=0; $i<$len; $i++ ) { $f["original"][$i]=$f[$i]; unset($f[$i]); }
    }
   }
   return $files;
  }
 }

 // Checks if a file exists on aws
 if ( !function_exists('aws_file_exists') ) {
  function aws_file_exists( $filename, $endpoint, $hush=FALSE ) {
   if ( S3::Exists($filename) !== FALSE ) return TRUE;
   $files = aws_ls($endpoint, $hush);
   foreach ( $files as $f ) {
    if ( is($f["filename"],$filename)
      && $f["is_file"] === TRUE
      && $f["filesize"] > 0 ) return TRUE;
   }
   if ( false_or_null($hush) ) {
    plog("Could not validated the presence of $filename at $endpoint.");
    plog('$files = '.vars($files));
   }
   return FALSE;
  }
 }

 // Gets data from AWS and returns it as a string.
 if ( !function_exists('aws_to_memory') ) {
  function aws_to_memory( $endpoint, $hush=TRUE ) {
   $fn = tempnam( sys_get_temp_dir(), 'AWS' );
   $out=awssh( "cp $endpoint $fn", $hush );
   if ( !false_or_null($hush) ) plog("aws_to_memory: ".$out);
   if ( !file_exists($fn) || filesize($fn) === 0 ) return NULL;
   $data=file_get_contents($fn);
   unlink($fn);
   return $data;
  }
 }

 // Takes a string of data and puts it onto s3.
 if ( !function_exists('aws_from_memory') ) {
  function aws_from_memory( $endpoint, $data, $hush=TRUE ) {
   $fn = tempnam( sys_get_temp_dir(), 'AWS' );
   file_put_contents($fn,$data);
   $out=awssh( "cp $fn $endpoint", $hush );
   unlink($fn);
   return array( "result"=>TRUE, "output"=>$out );
  }
 }

// Generates an endpoint (used by aws_s3json_get and aws_s3json_put, and aws_s3json_db_delete)
 if ( !function_exists('aws_s3json_endpoint') ) {
   function aws_s3json_endpoint( $tablename, $id, $fieldname ) {
    return S3_BUCKET_PATH.sitename.'/'.$tablename.'/'.$id.'/'.$fieldname
     .(strpos($fieldname,".")===FALSE?'.json':"");
   }
 }

// Gets data associated with a Table/ID/Field
 if ( !function_exists('aws_s3db_get') ) {
   function aws_s3db_get( $tablename, $id, $fieldname, $hush=TRUE ) {
    return aws_to_memory(aws_s3json_endpoint($tablename,$id,$fieldname),$hush);
   }
 }

// Gets data associated with a Table/ID/Field
 if ( !function_exists('aws_s3db_put') ) {
   function aws_s3db_put( $tablename, $id, $fieldname, $data, $hush=TRUE ) {
    return aws_from_memory(aws_s3json_endpoint($tablename,$id,$fieldname),$data,$hush);
   }
 }

// Gets data associated with a Table/ID/Field
 if ( !function_exists('aws_s3db_put_file') ) {
   function aws_s3db_put_file( $tablename, $id, $fieldname, $filename, $hush=TRUE ) {
    return aws_cp_direct($filename,aws_s3json_endpoint($tablename,$id,$fieldname),$hush);
   }
 }

// Deletes everything associated with a Table/ID
 if ( !function_exists('aws_s3db_delete') ) {
   function aws_s3db_delete( $tablename, $id, $hush=TRUE ) {
    $endpoint=S3_BUCKET_PATH.$tablename.'/'.$id.'/';
    return awssh('rm --recursive '.$endpoint,$hush);
   }
 }
