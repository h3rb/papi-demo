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

 $ar_model=new AssessmentResult($database);
 $grades=$ar_model->Select(array("r_Auth"=>$auth["ID"]));

 $programs = count($pgms);
 $grades = count($grades);

 $in_progress = 0;

 $a_model=new Assessment($database);

 $suggestions = 0;
 $messages = 0;

 $p->HTML('<div style="width:100%; height:96px;"></div>');

 Muuri_Start($p);

 $content = '<button id="resume" class="btn btn-danger btn-lg" type="button">Incomplete <span class="badge">'.$in_progress.'</span></button><BR>'
           .'<button id="resume" class="btn btn-danger"><span class="glyphicon glyphicon-play"></span> Resume</button>';
 Muuri_Item( $p, href("resume",$content) );

 $content = '<button id="grades" class="btn btn-success btn-lg" type="button">Passed <span class="badge">'.$grades.'</span></button><BR>'
           .'<button id="grades" class="btn btn-success"><span class="glyphicon glyphicon-education"></span> Review</button>';
 Muuri_Item( $p, href("grades",$content) );

 $content = '<button id="suggested" class="btn btn-info btn-lg" type="button">Suggested for you <span class="badge">'.$suggestions.'</span></button><BR>'
           .'<button id="suggested" class="btn btn-info"><span class="glyphicon glyphicon-arrow-right"></span> More</button>';
 Muuri_Item( $p, href("suggested",$content) );

 if ( $messages > 0 ) {
  $content = '<button id="messages" class="btn btn-warning btn-lg" type="button">Inquiries and Requests <span class="badge">'.$messages.'</span></button><BR>'
            .'<button id="messages" class="btn btn-warning"><span class="glyphicon glyphicon-book"></span> Respond</button>';
  Muuri_Item( $p, href("inbox",$content) );
 }

 $content = '<button id="programs" class="btn btn-primary btn-lg" type="button">Programs You\'ve Created <span class="badge">'.$programs.'</span></button><BR>'
           .'<button id="programs" class="btn btn-primary"><span class="glyphicon glyphicon-eye-open"></span> Manage Your Content</button>';
 Muuri_Item( $p, href("programs",$content) );

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

