<?php

 include '../../core/Page.php';

?>
class AppInfo {
 constructor() {
	this.sitename = "<?php echo sitename; ?>";
	this.app_id = "<?php echo MY_APP_ID; ?>";
	this.site = "<?php echo site; ?>";
  this.version = "<?php echo APP_VERSION; ?>";
 }
}
