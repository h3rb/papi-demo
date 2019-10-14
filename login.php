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

 $p->JS('function go_login() { window.location="/app"; }');
 $p->JS('function go_signup() { window.location="/register"; }');

 $p->HTML('
<br>
<DIV class="login-logo"><img src="i/miCertify.svg" alt="miCertify" title="miCertify"><center><span class="strokedwhite" style="font-size:200%;">Teach or be taught</span></center></div>
<br>
<div id="login_now">Log In &#9654;</div>
<div id="signup_hint" class="animated fadeIn">
<hgroup class="speech-bubble"><p class="typer padded10"><span onclick="javascript:go_signup();">Find out more!</a></p></hgroup>
</div>
<div id="signup_now">Sign Up</div>
 ');
 $p->JQ('$("#signup_now").click(go_signup);');
 $p->JQ('$("#login_now").click(go_login);');

 if ( !$p->ajax ) $p->HTML('footer.html', array( "###YEAR###"=>date('Y') ) );
 $p->Render();
