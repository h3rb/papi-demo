<?php
 include 'core/Page.php';

 if ( Session::logged_in() ) {
  redirect('/app');
 } else {
  redirect('login');
 }
