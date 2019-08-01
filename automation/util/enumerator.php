<?php

 // Just an example, refactor this code to generate basic enumerator classes for use in config.enums.php

 $new_type_name="AssessmentQuestionType";
 $starts_at=1;
 $input=array(
  "MultipleChoice"=>1,
  "TrueFalse"=>2,
  "Essay"=>3
 );

 echo '
abstract class '.$new_type_name.' extends Enum {
';
 $i=$starts_at;
 foreach ( $input as $symbol=>$description ) {
  echo ' const '.$symbol.'='.$i.';
';
  $i++;
 }
 echo ' static function name($n) {
  switch(intval($n)) {
';
 foreach ( $input as $symbol=>$description ) {
  echo "   case $new_type_name::$symbol: return '$description';".PHP_EOL;
 }
 echo "   default: return 'Unknown'; break;
  }
 }
}
";
