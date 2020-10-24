<?php

function ourcrypt($pwd) {
 $hash=password_hash($pwd,PASSWORD_DEFAULT);
// plog("hashed pwd:".$hash);
 return $hash;
}

function matchcrypt($input,$pass) {
 return password_verify($input,$pass);
}
