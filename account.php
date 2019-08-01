<?php

 include 'core/Page.php';

 if ( !Session::logged_in() ) Page::Redirect('login');

 $p= new Page;
 if ( !$p->ajax ) $p->HTML('header.html',array("###MENU###"=>Dropdown_menu($p)));

 $p->title ="Your Account";
 $p->CSS( "main.css" );
 $p->Jquery();
 $p->JS( 'notifier.js' );

 global $auth_database,$auth;

 $p->HTML('<div class="formboundary">');

 $p->HTML('<h4>Your Profile</h4>');

  $link_title="Send mail to ".$auth['first_name'].' '.$auth['last_name'].' or right click to copy URL\'s email address';
  $acls=explode(",",$auth['acl']);
  $access='';
  foreach ( $acls as $ac ) if ( strlen($level=trim($ac))>0 ) $access.='<span class="acl">'.$ac.'</span>';
  $html=
   $auth['username'].'<BR>'.
   '<em>'.$auth['first_name'].' '.$auth['last_name'].'</em><BR>'.
   '<a href="mailto:'.$auth['email'].'" title="'.$link_title.'" alt="'.$link_title.'" class="bare">'.$auth['email'].'</a>'.'<BR>'.
   '<h4>Access</h4>'.$access.'<BR>'
  ;

 $p->HTML($html);
 $p->HTML('</div>');

 $p->HTML('<div class="formboundary">');

 $p->Fragment("password","password.php");

 $p->HTML('<div id="password"><center><img src="i/LOAD.GIF"></center></div>');

 $p->HTML('</div>');

 $p->HTML('<a href="profiles" class="bare buttonlink">All Users &rarr;</a>');

 if ( !$p->ajax ) $p->HTML('footer.html');
 $p->Render();

