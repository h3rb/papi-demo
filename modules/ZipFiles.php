<?php

//use ZipArchive;

/**
 *  @brief Extractor class to extract files from zip file
 */
class ZipExtractor
{
  /**
   *  @brief Constructor
   *  @param string zip file
   */
  function __construct($zipfile)  { $this->message=""; $this->setZipFile($zipfile); }

  static public function IsZipFile( $fn ) {
   $fh = @fopen($fn, "r");
   if (!$fh) { return FALSE; }
   $blob = fgets($fh, 5);
   fclose($fh);
   if (strpos($blob, 'Rar') !== false) return 'RAR';
   if (strpos($blob, 'PK') !== false) return TRUE;
   return FALSE;
  }

  /**
   *  @brief Getter for zip file name
   *  @return string zip file
   */
  function getZipFile()           { return $this->zip_file; }

  /**
   *  @brief Getter for CSV file name
   *  @param int index
   *  @return string CSV file
   */
  function getCSVFile($index=0)   { return $this->csv_files[$index]; }

  /**
   *  @brief Getter for number of CSV files
   *  @return int CSV file count
   */
  function getCSVCount()
  {
    if ( isset( $this->csv_files ) ) {
      return count( $this->csv_files );
    }

    return 0;
  }

  /**
   *  @brief Setter for zip file name
   *  @param string zip file
   */
  function setZipFile($filename)  { $this->zip_file = $filename; }

  /**
   *  @brief Setter for CSV files
   *  @param Array[string] CSV files
   */
  function setCSVFiles($files)    { $this->csv_files = $files; }

  /**
   *  @brief Unzips assigned zip file
   *  @return string destination absolute path
   */
  function unzip()
  {
    $zipfile = $this->getZipFile();

    if (!$zipfile) {
      return "";
    }

    // Get the absolute target path
    $dir_path = pathinfo( realpath($zipfile), PATHINFO_DIRNAME );
    $file_name = pathinfo( $zipfile, PATHINFO_FILENAME );
    $absolute_path = $dir_path . "/" . $file_name;
    $zip = new ZipArchive;

    // Unzip to folder with same basename
    if ( $zip->open($zipfile) ) {
      if ( !is_dir($absolute_path) ) {
        mkdir($absolute_path, 0777);
      }

      $zip->extractTo($absolute_path);
      $zip->close();

      // Locate and store the extracted csv file
      $csv_files = $this->find($absolute_path, "*.csv");
      $this->setCSVFiles($csv_files);

      $this->message="$zipfile extracted to $absolute_path";
      return $absolute_path;
    } else {
      $his->message="Couldn't open $zipfile";
      return FALSE;
    }
  }

  /**
   *  @brief Find files matching a pattern
   *  @param string starting directory
   *  @param string pattern to search for
   *  @return Array[string] matching files
   */
  function find($dir, $pattern)
  {
    // Get all matching files in the current directory
    $files = glob("$dir/$pattern");

    // Find all subdirectories within the current directory
    // Directories beginning with a dot are also included
    foreach ( glob("$dir/{.[^.]*,*}", GLOB_BRACE|GLOB_ONLYDIR) as $sub_dir ) {
      $arr   = $this->find($sub_dir, $pattern);  // recursive call
      $files = array_merge($files, $arr); // merge array with files from subdirectory
    }

    return $files;
  }

  private $zip_file;  ///< string zip file name
  private $csv_files; ///< Array[string] csv files
  public $message;
}
?>
