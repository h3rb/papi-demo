<?php

 global $plog_level; $plog_level=1;
 include 'core/Page.php';

 if ( !Session::logged_in() ) Page::Redirect('login');

 plog("New page!");
 $p= new Page;

 if ( !$p->ajax ) $p->HTML('header.html',
  array("###MENU###"=>'',
  "###1A###"=>'<!--',"###1B###"=>'-->',
  "###2A###"=>'',"###2B###"=>'')
 );

 $p->title ="MiCertify&trade; - Dashboard";
 $p->CSS( "main.css" );
 $p->CSS( "dash.css" );
 $p->CSS( "bootstrap.min.css" );
 $p->Jquery();

 $getpost=getpost();

 $p->HTML('<BR>');

 $p->HTML('dash_top.html');

 global $database,$auth;

 $p_model=new Program($database);
 $pgms=$p_model->ForUser($auth["ID"]);

 $programs = count($pgms);

 $p->HTML('<div style="width:100%; height:96px;"></div>');

 Muuri_Start($p);

 foreach ( $pgms as $pg ) {
  $content = $pg['Name'] . '<BR>' . $students . ' students<BR>' 
   . href("program.view?i=".$pg['ID'],'<button id="edit"><span class="fi-magnifying-glass"></span></button>')
   . href("program.edit?i=".$pg['ID'],'<button id="edit"><span class="fi-edit"></span></button>')
   ;
  Muuri_Item( $p, $content );
 }

 Muuri_End($p);

$p->JQ('

 $("#resume").click(function(e){ window.location="/continue"; });
 $("#grades").click(function(e){ window.location="/grades"; });
 $("#suggested").click(function(e){ window.location="/suggested"; });
 $("#messages").click(function(e){ window.location="/messages"; });
 $("#programs").click(function(e){ window.location="/programs"; });

');


 if ( !$p->ajax ) $p->HTML('footer.html',array("###YEAR###"=>date('Y')) );
 $p->Render();

