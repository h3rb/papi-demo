<?php

 global $AWS_SHELL_LOGFILE,$AWS_SHELL_LOGFILE2;
 $AWS_SHELL_LOGFILE = tempnam( sys_get_temp_dir(), 'AWS-S3' );
 $AWS_SHELL_LOGFILE2 = tempnam( sys_get_temp_dir(), 'AWS-S3' );

 require '/home/ubuntu/awssdk/vendor/autoload.php';
// require '/home/ubuntu/awssdk/creds.php';

 use Aws\S3\S3Client;
 use Aws\Exception\AwsException;

 if ( !defined('S3_BUCKET_PATH') ) {
 define('S3_BUCKET_PATH', 's3://'.S3_IMAGE_STORE.'/');
 }

 require 'S3.awscli.php';

 class S3 {

  public $error, $client, $exception, $message, $error_context, $result;

  static public function GetURLPrefix() { return S3_URL_PREFIX; }
  static public function Clean($key) { return str_replace(S3::GetURLPrefix(),"",$key); }

  function __construct() {
   $this->ResetError();
   $this->Authenticate();
  }

  public function Authenticate() {
   global $awskey,$awssecret;
   try {
    $this->client = new S3Client([
     'region' => S3_REGION_CODE,
     'version' => 'latest',
   //  'credentials' => [
   //     'key' => $awskey,
   //     'secret' => $awssecret,
   //  ]
   ]);
   } catch (S3Exception $e) {
    $this->StoreError($e);
    $this->client = NULL;
   }
  }

  function ResetError() {
   $this->error = FALSE;
   $this->exception = NULL;
   $this->message = "";
   $this->error_context = "";
  }

  function StoreError( $e, $context="S3" ) {
    $this->error = TRUE;
    $this->exception = $e;
    $this->message = is_object($e) && ($e instanceof S3Exception) ? $e->getMessage() : vars($e);
    $this->client = NULL;
    $this->error_context = $context;
  }

  public function KeyExists( $endpoint ) {
   $bucket = S3_IMAGE_STORE;
   try {
    // Check bucket for key.
    $this->result = $this->client->doesObjectExist($bucket,$endpoint);
    return $this->result;
   } catch (S3Exception $e) {
    $this->StoreError($e,"S3::Exists(`$endpoint`)");
    return FALSE;
   }
  }

  public function DeleteKey( $endpoint ) {
   $bucket = S3_IMAGE_STORE;
   try {
    $this->result = $this->client->deleteObject(array(
     'Bucket'=>$bucket,
     'Key'=>$endpoint
    ));
    return $this->result;
   } catch (S3Exception $e) {
    $this->StoreError($e,"S3::Exists(`$endpoint`)");
    return FALSE;
   }
  }

  // Upload a $source file that is less than 5GB
  // From: https://docs.aws.amazon.com/AmazonS3/latest/dev/UploadObjSingleOpPHP.html
  /* NOT RELIABLE */
  public function Upload( $source, $endpoint, $waitUntil=TRUE ) {
   if ( !file_exists($source) || filesize($source) === 0 ) return FALSE;
   $bucket = S3_IMAGE_STORE;
   try {
    // Upload data.
    $this->result = $this->client->putObject(array(
        'Bucket' => $bucket,
        'Key'    => $endpoint,
        'SourceFile' => $source
    ));
    if ( $waitUntil === TRUE ) { // Poll the object until it is accessible
     $this->client->waitUntil('ObjectExists', array(
      'Bucket' => $bucket,
      'Key'    => $endpoint
     ));
    }
   } catch (S3Exception $e) {
    $this->StoreError($e,"S3::Upload(`$source`,`$endpoint`)");
    return FALSE;
   }
   // Check one more time...
   sleep(1);
   if ( S3::Exists($endpoint) ) return TRUE;
   else $this->StoreError("S3::Upload was not validated","S3::Upload(`$source`,`$endpoint`)");
   return FALSE;
  }

  // Download an S3 $endpoint to a $localfilepath that includes both path and target filename.
  // From: https://docs.aws.amazon.com/AmazonS3/latest/dev/RetrieveObjSingleOpPHP.html
  public function Download( $endpoint, $localfilepath ) {
   $bucket = S3_IMAGE_STORE;
   try {
    // Get the object.
    $result = $this->client->getObject(array(
        'Bucket' => $bucket,
        'Key'    => $endpoint
    ));
    make_path(dirname($localfilepath));
    file_put_contents($localfilepath,$result['Body']);
    if ( file_exists($localfilepath) ) return TRUE;
    $this->StoreError("File not found after download","S3::Download(`$endpoint`,`$localfilepath`)");
    return FALSE;
   } catch (S3Exception $e) {
    $this->StoreError($e,"S3::Download(`$endpoint`,`$localfilepath`)");
    return FALSE;
   }
  }

  // Download an S3 $endpoint to a $localfilepath that includes both path and target filename.
  // From: https://docs.aws.amazon.com/AmazonS3/latest/dev/RetrieveObjSingleOpPHP.html
  public function DownloadToMemory( $endpoint ) {
   $bucket = S3_IMAGE_STORE;
   try {
    // Get the object.
    $result = $this->client->getObject(array(
        'Bucket' => $bucket,
        'Key'    => $endpoint
    ));
    return $result;
   } catch (S3Exception $e) {
    $this->StoreError($e,"S3::DownloadToMemory(`$endpoint`)");
    return FALSE;
   }
  }

  // Shorthand S3 Send File.
  /* NOT RELIABLE */
 /* Amazon claims: Using Amazon S3 Multipart Uploads with AWS SDK for PHP version 3.
    With a single PutObject operation, you can upload objects up to 5 GB in size.
    This has not been proven reliable. Works with a single image, but larger files > 10mb have issue. */
  public static function Send( $source, $endpoint ) {
   $s3 = new S3();
   if ( $s3->Upload( $source, S3::Clean($endpoint) ) === FALSE ) return $s3;
   return TRUE;
  }

  // Shorthand S3 Get File.
  public static function Get( $endpoint, $localfilepath ) {
   $s3 = new S3();
   if ( $s3->Download( S3::Clean($endpoint), $localfilepath ) === FALSE ) return $s3;
   return TRUE;
  }

  // Shorthand S3 Get File to Memory.
  public static function GetData( $endpoint ) {
   $s3 = new S3();
   $data=$s3->DownloadToMemory( S3::Clean($endpoint), $localfilepath );
   if ( $data === FALSE ) return $s3;
   return $data;
  }

  // Shorthand if exists
  public static function Exists( $endpoint ) {
   $s3 = new S3();
   $result = $s3->KeyExists(S3::Clean($endpoint));
   if ( $result !== FALSE && $s3->error ) return TRUE;
   return FALSE;
  }

  // Shorthand S3 Delete Key
  public static function Delete( $endpoint ) {
   $s3 = new S3();
   return $s3->DeleteKey(S3::Clean($endpoint));
  }

  // Shorthand S3 If-Exists-Delete Key
  public static function IfDelete( $endpoint ) {
   $s3 = new S3();
   return $s3->KeyExists(S3::Clean($endpoint)) ? $s3->DeleteKey(S3::Clean($endpoint)) : FALSE;
  }

  // Converts a spiffy Body to a string, pass in result from DownloadToMemory
  public static function BodyToString( $result ) {
   $output='';
   $result['Body']->rewind();
   while ($data = $result['Body']->read(1024)) $output.=$data;
   return $output;
  }

  public static function GetDataAsString( $endpoint ) {
   $result=S3::GetData($endpoint);
   if ( is_object($result) && is(get_class($result),'S3') ) return $result;
   return S3::BodyToString($result);
  }

};
