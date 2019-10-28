<?php
 $models =
  array(
    "Message",
    "Task",
    "Notification"
  );
 foreach ( $models as $model ) {
  echo "echo '<?php class $model extends Model {}; ' > $model.php".PHP_EOL;
 }
