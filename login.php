<?php
 include 'core/Page.php';

 $getpost = getpost();
 $getpost['m']=intval($getpost['m']);

 $p=new Page();

 $p->CSS( 'main.css' );
 $p->CSS( 'login.css' );

 $p->CSS('
.videobg {
 width:100%;
 height:100%;
 z-index:-10000;
 display:inline;
}
.errorlogin {
 border-radius:16px;
 background:black;
 width:75%;
}

body {
 background:black;
 height:100%;
 width:100%;
}
');

 $videos=array(
"Bokeh4413.mp4",
"Building7279.mp4",
"Code4733.mp4",
"Computer3174.mp4",
"Dots2312.mp4",
"Library846.mp4",
"Office7269.mp4",
"Reading4953.mp4",
"School80.mp4",
"TestTubes5451.mp4",
"Whiteboard2303.mp4",
"business.mp4"
);
 shuffle($videos);
 $video=array_shift($videos);

 $p->HTML('
<video class="videobg" autoplay id="bgvid" muted playsinline loop>
  <source src="i/vids/'.$video.'" type="video/mp4" />
</video>
');

 $message=NULL;
 switch ( $getpost['m'] ) {
  case 1: case 2: $message='<div class="errorlogin">Password or Username Incorrect</div>'; break;
  case 4: $message='<div class="errorlogin">Account is locked.</div>'; break;
 }

 $p->HTML('center_search_bar.html');

 $p->JS('
 var login_shown=false; var searchDelayed=null;
 function login_form() {
  if ( searchDelayed ) clearTimeout(searchDelayed);
  if ( !login_shown ) {
   $("#search").fadeOut("fast","linear");
   $("#LOGIN-WRAPPER").show();
   $("#LOGIN").fadeIn("slow","swing");
   login_shown=true;
  } else {
   $("#search").fadeIn("slow","swing");
   $("#LOGIN").fadeOut("slow","swing");
   login_shown=false;
  }
 }
');

 $p->JQ('
 $("#search").hide();
 $("#LOGIN-WRAPPER").hide();
 $("#LOGIN-WRAPPER").click(
  function(e){
   if ( e.target.id == "login-submit" ) { return true; }
   if ( e.target.id == "PRICING-LINK" ) { return true; }
   if ( e.target.id == "SIGNUP-LINK" ) { return true; }
   if ( e.target.id == "FORGOT-LINK" ) { return true; }
   if ( e.target.id == "LOGIN-INTERIOR" ) return false;
   if ( $(e.target).parents("#LOGIN-INTERIOR").length > 0 ) return false;
   login_form();
  }
 );
 $("password").keyup(function(e){ if(e.keyCode == 13) { $("#login-submit").click(); } });
 $("#LOGIN").hide();
 $("#LOGIN").fadeOut(1,"linear");
 $("#search").css("z-index",99);
 searchDelayed=setTimeout(function(e){$("#search").fadeIn("slow","swing");},1000);
 $("#login_now").click(function(e){login_form();});
 $("#signup_hint").click(function(e){window.location="/register";});
 $("#signup_now").click(function(e){window.location="/register";});
 $("#search").click(function(e){ $(e.target).attr("placeholder","Search for a testing program..."); });
 $("#search").focusout(function(e){ $(e.target).attr("placeholder","Search..."); });
');

 if ( !is_null($message)) {
  $messages=array( '###Messages###'=>$message );
  $p->JQ('login_form();');
 } else $messages=array('###Messages###'=>'');

 $p->HTML('login_form.html',$messages);

 if ( !$p->ajax ) $p->HTML('footer.html', array( "###YEAR###"=>date('Y') ) );
 $p->Render();
