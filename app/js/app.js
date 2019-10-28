var APP_VERSION = "0.5 &alpha;";

var app = null;

var idleSince = Date.now();


//********8//


class MicertifyApp {

 constructor( api ) {
  this.version = APP_VERSION;
  this.api=api;
  this.api.app=this;
  this.codes = this.GetUICodes();
  this.focused = null;
  this.focusEvent = null;
  this.blurred = null;
  this.blurEvent = null;
  this.states = {
	  sidebar: this.codes.sidebar.dashboard
  };
  this.programs = null;
  this.modalOnSaveFunc = null;
  this.activeModalData = null;
  this.activeModel = null;
  this.inactivityLimit = 20; // 20 minutes, seems like > 26 hard to reach
  app=this;
 }
 
 GetUICodes() {
	 return { 
	  topnav: {
		  messages: 1,
		  notifications: 2,
		  tasks: 3,
		  profile: 4,
		  settings: 5
	  },
	  sidebar: {
		  dashboard: 110,
		  tasks: { drafts:1101, resume:1102 },
		  messages: 111,
		  search: 112,
		  browse: 113,
		  certified: 114,
		  results: 115,
		  download: 116,
		  grading: 117,
		  programs: 118,
		  gettingstarted: 119,
		  reference: 120,
		  support: 121
	  },
	  edit: {
		  program: 1,
		  test: 2,
		  question: 3,
		  answer: 4
	  },
	  control: {
		  
	  },
	  actions: {
		  profile: 301
	  },
	  modal: {
		  login: 901
	  }
	 };
 }
 
 Event30() {
   if ( app.api.session ) app.CheckSessionState();
   else app.NoSessionStateCallback();
 } 
 
 Event60() {
 }
	
 Event120() {
   if ( app.api.session ) {
	 app.api.BasicInfo( app.RepopulateFromBasicInfo );
   }
 }
	
 RepopulateFromBasicInfo( outgoing,incoming,ajax ) {
  console.log(incoming);
  app.user = incoming.data.user;
  app.messages = incoming.data.messages;
  app.tasks = incoming.data.tasks;
  app.notifications = incoming.data.notifications;
  console.log("Updating UI");
  app.redrawSidebar();
  app.redrawTopnav();
 }

 
 Init() {
  app.api.Init();
  
  app.InitInactivityTimeout();
  
  // Establish jQuery Behaviors
  
  // Establish login form
  $("#login-button").click(function(e){
	  app.api.username = GetInputValue("login-username");
	  app.api.password = GetInputValue("login-password");
	  $.modal.close();
	  app.api.Login();
  });
  
  // Establish onfocus tracking
  $("input").focus( function(e) { app.focused = this; app.focusedEvent=e; } );
  $("input").blur( function(e) { app.focused = null; app.focusedEvent=null; app.blurEvent=e; app.blurred=this;} );
  $("select").focus( function(e) { app.focused = this; app.focusedEvent=e; } );
  $("select").blur( function(e) { app.focused = null; app.focusedEvent=null; app.blurEvent=e; app.blurred=this;} );
  $("textarea").focus( function(e) { app.focused = this; app.focusedEvent=e; } );
  $("textarea").blur( function(e) { app.focused = null; app.focusedEvent=null; app.blurEvent=e; app.blurred=this;} );

  $("#mcapp-modal-close").click(function(e){$.modal.close();});
  $("#mcapp-modal-button-cancel").click(function(e){$.modal.close();});
  $("#mcapp-modal-button-save").click(function(e){if (app.modalOnSaveFunc) app.modalOnSaveFunc(app.activeModalData,e);});

  // Establish event for enter/return key  
  $(window).keyup(function(e) { if ( e.keyCode == 13 ) { event.preventDefault(); app.OnEnter(e); }}  );
 
  // Setup recurring session check
  setInterval(function(e){ app.Event30(); }, 30000);
  setInterval(function(e){ app.Event60(); }, 60000);
  setInterval(function(e){ app.Event120(); }, 120000);
  console.log(app);	 
  app.CheckSessionState();
 }
 
 InitInactivityTimeout() {
	 
    //Increment the idle time counter every minute.
    var idleInterval = setInterval(function(){
     if ( app.api.SessionValid() ) {
		var idleTime = Date.now();
		var minutes = (idleTime - idleSince) / 1000 / 60;
		console.log("idle for "+minutes+" minutes");
		if (minutes > app.inactivityLimit) { app.api.retries = 3; app.api.Logout(); }
	 }
    }, 60000); // 1 minute intervals

    //Zero the idle timer on mouse movement.
    $(window).mousemove(app.InactivityTimerReset);
	$(window).mousedown(app.InactivityTimerReset);
    $(window).keypress(app.InactivityTimerReset);
	$(window).click(app.InactivityTimerReset);
	$(window).scroll(app.InactivityTimerReset);
 }
 InactivityTimerReset() { if ( isPageVisible() ) idleSince = Date.now(); /*console.log("idleTime reset");*/ } 
 
 CheckSessionState() {
  console.log("CheckSessionState");
  app.api.CheckTokenState();
 }

 // Called when not logged in, session invalid / expired or network issue. 
 NoSessionStateCallback() {
  console.log("NoSessionStateCallback entered");
  ClearSuperGlobals();
  // Show login window
  app.ShowLoginModal();
 }
 
 ShowLoginModal() {
  this.Title("Log in");
  console.log("Show login modal.");
  $("#mcapp-login-box").modal({ escapeClose: false, clickClose: false, showClose: false });
  // $.modal.close();
 }
 
 ShowLogout() {
  window.location="/";
 }
 
 Logout() { app.api.Logout(); }
 
 OnEnter() {
	 if ( ( app.focused && app.focused === Get("mcapp-sidebar-search-input") )
       || ( app.blurred && app.blurred === Get("mcapp-sidebar-search-input") ) ) { console.log("Enter pressed: Search"); $("#mcapp-sidebar-search-button").click(); }
 }
 
 Title( c ) {
	 document.title="MiCertify | "+c;
 }
 
 Control( t ) {
 } 

 ModalClearMessage() { $("#mcapp-modal-message").html(""); }
 
 ModalSuccess( msg ) {
  $("#mcapp-modal-message").html(
    '<div class="alert alert-success" role="alert">'
   +msg
   +'</div>'
  );
 }
 
 ModalWarning( msg ) {
  $("#mcapp-modal-message").html(
    '<div class="alert alert-danger" role="alert">'
   +msg
   +'</div>'
  );
 }

 Modal( title, body, model, onSave, saveButton="Save Changes", cancelButton="Cancel" ) {
	 app.modalOnSaveFunc=onSave;
	 app.activeModalData=model;
	 $("#mcapp-modal-title").html(title);
	 $("#mcapp-modal-body").html(body);
	 $("#mcapp-modal-message").html("");
	 if ( saveButton === false ) $("#mcapp-modal-button-save").hide();
     else {
		$("#mcapp-modal-button-save").show();
		$("#mcapp-modal-button-save").html(saveButton);
	 }
	 if ( cancelButton === false ) $("#mcapp-modal-button-cancel").hide();
	 else {
		$("#mcapp-modal-button-cancel").show();
		$("#mcapp-modal-button-cancel").html(cancelButton);
	 }
	 $("#mcapp-modal").modal({ escapeClose: true, clickClose: true, showClose: false });
 }
 
 Sidebar( c ) {
	 var tags = [
	 ];
	$( "ul[id=mcapp-sidebar-menu] li" ).each(function( index ) {
		$(this).removeClass("active");
	});	 
	 console.log( "Sidebar = "+c );
	 switch ( c ) {
		 case this.codes.sidebar.dashboard:
		  this.Title("Dashboard");
		 break;
		 case this.codes.sidebar.messages:
		  this.Title("Messages");
		  $("#mcapp-sidebar-messages").addClass("active");
		 break;
		 case this.codes.sidebar.search: // Called when enter pressed on search area, or button pressed.
		  this.Title("Search");
		  $("#mcapp-sidebar-search-form").addClass("active");		  
		 break;
		 case this.codes.sidebar.browse:
		  this.Title("Browse");
		  $("#mcapp-sidebar-take-tests").addClass("active");
		 break;
		 case this.codes.sidebar.certified:
		  this.Title("Certifications");
		  $("#mcapp-sidebar-certifications").addClass("active");
		 break;
		 case this.codes.sidebar.results:
		  this.Title("Results");
		  $("#mcapp-sidebar-results").addClass("active");
		 break;
		 case this.codes.sidebar.download:
		  this.Title("Download");
		  $("#mcapp-sidebar-download").addClass("active");
		 break;
		 case this.codes.sidebar.grading:
		  this.Title("Grading");
		  $("#mcapp-sidebar-needs-grading").addClass("active");
		 break;
		 case this.codes.sidebar.programs:
		  this.Title("Programs");
		  $("#mcapp-sidebar-programs").addClass("active");
		  this.doPrograms();
		 break;
		 case this.codes.sidebar.gettingstarted:
		  this.Title("Getting Started");
		  $("#mcapp-sidebar-section-gettingstarted").addClass("active");
		 break;
		 case this.codes.sidebar.reference:		 break;
		 case this.codes.sidebar.support:		 break;
	 }
 }
 
 Main( title, subtitle, boxtitle, body, crumblist=null ) {
	 $("#mcapp-header-title").html( title+"<small>"+subtitle+"</small>");
	 var crumblisthtml = '<li><a href="#" onclick="javascript:mcapp.Sidebar(mcapp.codes.sidebar.dashboard);"><i class="fa fa-dashboard"></i> Home</a></li>';
	 if ( crumblist ) {
	  crumblist.forEach(crumb => {
		crumblisthtml += '<li'+(crumb.css?' class="'+crumb.css+'"':'')+'><a href="#" onclick="javascript:'+crumb.func+'">';
		if ( crumb.icon ) crumblisthtml+='<i class="fa '+crumb.icon+'"></i> ';
		crumblisthtml += crumb.text+'</a></li>';
	  });
	 }
	 $("#mcapp-header-breadcrumb").html( crumblisthtml );
	 $("#mcapp-content-box-title").html(boxtitle);
	 $("#mcapp-content-box-body").html(body);
 }
 
 // Gets the number of tests, certs, etc, updates task lists, refresh profile data,
 // activities, etc.
 UpdateMetrics() {
 }
 
 UpdatePrograms( after=function(outgoing,incoming,ajax){app.programs=incoming.data.result;} ) {
	 console.log("UpdatePrograms");
	 	 app.api.ListEverything("programs",after);
 }
 
 drawLoader( title, subtitle, crumblist=null ) {
	 $("#mcapp-header-title").html( title+"<small>"+subtitle+"</small>");
	 var crumblisthtml = '<li><a href="#" onclick="javascript:mcapp.Sidebar(mcapp.codes.sidebar.dashboard);"><i class="fa fa-dashboard"></i> Home</a></li>';
	 if ( crumblist ) {
	  crumblist.forEach(crumb => {
		crumblisthtml += '<li class="'+crumb.css+'"><a href="#" onclick="javascript:'+crumb.func+'">';
		if ( crumb.icon ) crumblisthtml+='<i class="fa '+crumb.icon+'"></i> ';
		crumblisthtml += crumb.text+'</a></li>';
	  });
	 }
	 $("#mcapp-header-breadcrumb").html( crumblisthtml );
	 $("#mcapp-content-box-body").html("<div class='center-div'><p><img src='/app/i/loader.gif'></p></div>");
 }
 
 drawPrograms(outgoing,incoming,ajax) {
	 var content="";
	 console.log(incoming);
	 $("#mcapp-content-box-title").html('<div class="pull-right"><button onclick="javascript:mcapp.drawAddProgram();"><i class="fa fa-plus-circle"></i> Create New Program</button></div>');
	 var programs = incoming.data.result;
	 app.programs = programs;
	 programs.forEach( function (program,index) {
	  content += '<div class="pull-right"><button onclick="javascript:mcapp.drawAddAssessment('+program.id+');"><i class="fa fa-plus-circle"></i> New Test</button></div>';
      content += '<div class="roundbox">';
      content += "<h4>"+program.name+'</h4>';
	  content += '<a href="#" title="Change Settings" alt="Change Settings" onclick="javascript:mcapp.Edit(mcapp.codes.edit.program,'+program.id+')"><i class="fa fa-gear"></i> Program Settings</a> ';
	  content += '<hr>';
	  program.tests.forEach( function (test,index) {
      	  content += '<a href="#" title="Edit" class="pull-right" onclick="javascript:mcapp.drawEditAssessment('+test.id+');"><i class="fa fa-edit"></i> Edit</a>';
		  content += '<h5>'+test.name+'</h5>';
		  content += '<p>'+test.desc+'</p>';
		  if ( index != program.tests.length-1 ) content+='<center>&hellip;</center>';
	  });
	  content += '</div>';
	  if ( index != programs.length-1 ) content+='<div style="height:5px;"></div>';
//      content += '<i class="fa fa-users"></i> Enrollment';
	 });
	 $("#mcapp-content-box-body").html(content);
 }

 doPrograms() {
	 this.drawLoader( "Your Programs", "&amp; Assessments", [ { css: "active", func:"mcapp.Sidebar(mcapp.codes.sidebar.programs)", icon:null, text:"Your Programs"  } ] );
	 app.api.ListEverything("programs",app.drawPrograms);
 }
 
 GetProgramByID(id) {
   for ( var i=0; i<app.programs.length; i++ ) {
	   if ( app.programs[i].id == id ) return app.programs[i];
   }
   return null;
 } 
 
 drawAddProgram() {
	 var model=[
	 { name: "name", label: "Program Name:", type:"string", hint: "Program Name", required:true },
	 { type:"p", text:"" },
	 { type: "p", text: "You will be able to adjust additional settings after you create the course program.  Your program will not be visible until it is published.", css: "alert alert-info" }
	 ];
	 app.Modal( "New Program", PackForm( model ), model, function(model,e) {
 	  console.log(model);
	  var data=UnpackForm(model);
	  app.api.Create( "program", 
	   { name:data.name },
	   function(outgoing,incoming,ajax) {
		  $.modal.close();
		  app.doPrograms();
	   }
	  );
	  console.log(data);
	 });
 }
 
 drawEditProgram( id ) {
	 var program = app.GetProgramByID(id);
	 if ( !program ) return;
	 var model=[
	 { name: "id", type:"hidden", value:id },
	 { name: "name", label: "Name:", type:"string", value: program.name, hint: "Program Name" },
	 { name: "desc", label: "Description:", type:"text", value: program.desc, hint: "Description" },
	 { name: "mode", label: "Testing Mode", type: "select", value: parseInt(program.mode),
		 options: [
		 { name: "Each test", value: 1 },
		 { name: "All tests", value: 2 }
		 ]
	 },
	 { type: "p", css: "alert alert-dark", text: "<b>Testing Mode</b> lets you choose between a program that requires passing <b><i>all</i></b> tests to gain a badge, or a program where <b><i>each</i></b> test gains the student a badge." },
	 { name: "days", label: "Days Limit", type: "integer", value: program.days },
	 { type: "p", css: "alert alert-dark", text: "Enter a number greater than 0 if you want to limit the number of days a student has to complete all of the tests in this course." },
	 { name: "autoenroll", label: "Automatic Enrollment", type: "toggle", value: program.autoenroll },
	 { type: "p", css: "alert alert-dark", text: "When set to <i>ON</i>, students are automatically enrolled in the course after they have been registered. Turn this option <i>OFF</i> if you want to manually permit students to start the course.  This can be used to schedule rounds of student enrollment, and is useful for managing the number of students taking your tests at any one time.  For example, if your tests are going to require grading-by-hand, and you wish to cap the number of students currently enrolled." },
	 { name: "crowdgrading", label: "Crowd Grading", type: "toggle", value: program.crowdgrading },
	 { type: "p", css: "alert alert-dark", text: "When set to <i>ON</i>, prior certified students are given a chance to weigh in to help grade exams that require a human grader.  Final exam results are still approved by you, but their suggested grade shows up if they participate.  This can help cut down grading time.  You can also mark participants as trusted so their grading opinions appear higher in the list.  Participants receive extra bling on their badges indicating they have helped you certify others for something in which they are certified.  Please note that students can opt out of this feature." },
     { name: "selfregistration", label: "Self-registration", type: "toggle", value: program.selfregistration },
	 { type: "p", css: "alert alert-dark", text: "<b>Self-registration</b> means students can apply without requiring manual approval." },
	 { name: "cost", label: "Registration Fee", type:"money", value: program.cost, range: { min: 0.00, max: 10000.0, step:0.01 }, list: [ { value: "0.00", text: "Free Registration" } ] },
	 { type: "p", css: "alert alert-danger", text: "Set this value to 0 to make the course <i>free</i>.  Students will be explained the fee amount during registration.  Currently MiCertify.com does not collect these fees.  It is up to you to collect these fees.  You may tell students how to pay in content shown on the introduction page.  Students must have their accounts manually marked <i>PAID</i> to enter the course." },
	 { name: "invite", label: "Private Program", type: "toggle", value: program.invite },
	 { type: "p", css: "alert alert-success", text: "<b>Private programs:</b> students can join this program only if they are invited, and the program does not appear in search results or public profiles.  This requires you to pay for a premium subscription.  This option is generally useful for organizations that want to create certifications for internal use."+' <a href="#">Learn more</a>' },
	 { name: "premium", label: "Require premium subscription", type: "toggle", value: program.premium },
	 { type: "p", css: "alert alert-success", text: "Only students who have a premium subscription can apply to your program.  Premium users have their identification verified and get access to additional testing programs not available to free tier users.  This encourages a more serious pool of applicants.  You may also still invite users and offer them access to your program without having a premium subscription." },
	 { name: "intro", label: "Introduction Page Content", placeholder: "Enter introduction content here", type:"markdown", value:program.intro },
	 { type: "p", css: "alert alert-info", text:"The above content is displayed on the information profile for a program.  Students who are invited to a program, or who browse to a program through search results or a link they clicked, will first see this page.  <b>Introductory Page Content</b> should contain information about the topic and scope of your course, the certifications provided, expectations for domain knowledge and the skill depth required of your tests, estimated time commitment to acheive mastery, and any relevant fees or materials required." } /* spacer */
	 ];
	 app.activeModel= model;
	 app.Main( program.name, "Your Programs", "Editing Program Details", PackForm( model ),
     [ { text: "Your Programs", func:"mcapp.doPrograms();" }, { text: program.name, css: "active" } ]);
	 jQueryForm( model );
	 SaveButton( "mcapp-content-box-body", model, function(e) {
	  console.log("Saving...");
	  var model=Get("mcapp-saveButton").model;
	  var data=UnpackForm(model);
	  if ( data.error ) {
		  console.log(data);
		  Warn(data.error.message);
	  } else {
		app.api.Modify("Program", data.id, 
		  { name:data.name, desc:data.desc, days:data.days, autoenroll:data.autoenroll, selfregistration:data.selfregistration,
            cost:data.cost, invite:data.invite, premium: data.premium, intro:data.intro, crowdgrading:data.crowdgrading
          }, 
		  function(incoming,outgoing,ajax){
			  Succeed("Changes saved.");
		      app.UpdatePrograms(function(outgoing,incoming,ajax){
				  app.programs=incoming.data.result;
				  app.drawEditProgram(outgoing.for);
			  });
		  }, function(e){
			  Warn("Unable to save changes!");
		  }
		 );
	  }
	 });
 }
 
 drawAddAssessment( program_id ) {
	 var model=[
	 { name: "member", type:"hidden", value:program_id },
	 { name: "name", label: "Name:", type:"string", hint: "Test Name", required:true },
	 { name: "desc", label: "Description", type:"text", hint: "Describe your test here." },
	 { name: "timed", label: "Is this a timed test?", type:"toggle" },
	 { name: "randomize", label: "Randomize question order?", type:"toggle" },
	 { name: "private", label: "Invite only?", type: "toggle" },
	 { name: "privatebadges", label: "Do not allow badge on public user profiles", type: "toggle" },
				 
	 ];
	 app.Modal( "New Assessment", PackForm( model ), model, function(model,e) {
 	  console.log(model);
	  var data=UnpackForm(model);
	  app.api.Create( "test", 
	   { name:data.name, member:data.member, desc:data.desc },
	   function(outgoing,incoming,ajax) {
		  $.modal.close();
		  Succeed("New Assessment Created!");
		  app.drawEditAssessment(incoming.data.id);
	   }
	  );
	  console.log(data);
	 });
 }
 
 drawEditAssessment( test_id ) {	 
	 this.drawLoader( "Assessment", "Create &amp; Edit", null ); 
	 console.log("drawEditAssessment:"+test_id);
	 app.api.Get( "test", test_id, function(outgoing,incoming,ajax) {
		console.log(incoming);
		var test=incoming.data.test;
		var program=incoming.data.program;
		var questions=incoming.data.questions;
		var title=test.name;
		var subtitle="Create &amp; Edit";
        $("#mcapp-header-title").html( title+"<small>"+subtitle+"</small>");
		$("#mcapp-content-box-title").html('<div class="pull-right"><button onclick="javascript:mcapp.drawAddQuestion('+test.id+');"><i class="fa fa-plus-circle"></i> Add Question</button></div>');
		var crumbs = '<li><a href="#" onclick="javascript:mcapp.Sidebar(mcapp.codes.sidebar.dashboard);"><i class="fa fa-dashboard"></i> Home</a></li>';
		crumbs += '<li><a href="#" onclick="javascript:mcapp.doPrograms();">'+program.name+'</a></li>';
		crumbs += '<li class="active">'+test.name+'</li>';
		$("#mcapp-header-breadcrumb").html( crumbs );
		var content="";
		$("#mcapp-content-box-body").html(content);
	 }, function(outgoing,incoming,ajax) {
		 Warn("Error loading test!");
		 app.doPrograms();
	 });
 }
 
 drawAddQuestion( id ) {
 }
 
 drawEditQuestion( id ) {
 }
 
 drawEditAnswer( id ) {
 }
 
 Edit( t, id ) {
  switch ( t ) {
   case this.codes.edit.program: this.drawEditProgram(id); break;
   case this.codes.edit.test: this.drawEditTest(id); break;
   case this.codes.edit.question: this.drawEditQuestion(id); break;
   case this.codes.edit.answer: this.drawEditAnswer(id); break;
  }
 }

 redrawSidebar() {
	 return;
	var content="";
	content+='<ul class="sidebar-menu" data-widget="tree" id="mcapp-sidebar-list">';

	content+=
        '<li class="header" id="jsapp-sidebar-section-help">SUPPORT</li>'+
        '<li id="mcapp-sidebar-gettingstarted"><a href="#" onclick="javascript:jsapp.Sidebar(jsapp.codes.sidebar.gettingstarted);"><i class="fa fa-toggle-right"></i> <span>Getting Started</span></a></li>'+
        '<li id="mcapp-sidebar-reference"><a href="https://bloomfield.ai/reference" target="_blank"><i class="fa fa-book"></i> <span>App Reference</span></a></li>'+
        '<li id="mcapp-sidebar-support">><a href="https://bloomfield.ai/support" target="_blank"><i class="fa fa-question-circle"></i> <span>Get Support</span></a></li>'
		;
	content+='</ul>';

	$("#mcapp-sidebar-menu").html(content);
 }
 
 redrawTopnav() {
 }

};
