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
 
 
 
 // Gets the number of tests, certs, etc, updates task lists, refresh profile data,
 // activities, etc.
 UpdateMetrics() {
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
 
 redrawTopnav() {
 }

};
