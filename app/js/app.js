// Copyright (c) 2018-2020 Fantastic! Inc.  All rights reserved.

var app = null;

var appInfo = new AppInfo();

var APP_VERSION = appInfo.version.replace("a","&alpha;").replace("b","&beta;");


/////////////////

class MicertifyApp {

 constructor( api ) {
  importObject(this,AppCSV); // app.makecsv.js
  importObject(this,AppWidgets); // app.widgets.js
  importObject(this,new AppViews()); // app.views.js
  this.version = APP_VERSION;
  this.api=api;
  this.api.app=this;
  this.codes = this.GetUICodes();
  this.focused = null;
  this.focusEvent = null;
  this.blurred = null;
  this.blurEvent = null;
  this.storage = window.localStorage;
  this.inactivityLimit = 20; // 20 minutes, seems like > 26 hard to reach
  this.tasks = [];
  this.notifications = [];
  this.user = null;
  this.ModalSaveFunction = null;  
  this.modalOnSaveFunc = null;
  this.activeModalData = null;
  this.last_scan_data = null;
  this.charts = [];
  this.save_user_data = false;
  this.last_color_picked = tinycolor("hotPink");
  this.current= {
   test: 0,
   program: 0,
   questions: 0,
   page: 0
  };
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
 
 SaveState( function_name, params=null ) {
  console.log("SaveState: "+function_name);
  console.log(params);
  app.storage.setItem( "last_function", function_name );
  app.storage.setItem( "last_function_param_count", params && is_array(params) ? params.length : (params?1:0) );
  if ( params && !is_array(params) ) {
   var arr=[];
   arr[0]=params;
   params=arr;
  } else if ( !params ) params=[];
  app.storage.setItem( "last_function_params", JSON.stringify(params) );
 }
 
 LoadState( ) {
  var name = app.storage.getItem( "last_function" );
  var params = JSON.parse(app.storage.getItem("last_function_params"));
  var count = parseInt(app.storage.getItem( "last_function_param_count"));
  return { name:name, params:params, count:count};
 }
 
 RecallState( state ) {
  console.log("app.RecallState");
  console.log(state);
  if ( state.name ) {
   if ( typeof app[state.name] == 'function' ) {
    console.log("Calling from State: app."+state.name);
    console.log(state.params);
    if ( !state.params ) { app[state.name](); return true; }
    else switch ( state.count ) {
      case 0: app[state.name](); break;
      case 1: app[state.name](state.params[0]); break;
      case 2: app[state.name](state.params[0],state.params[1]); break;
      case 3: app[state.name](state.params[0],state.params[1],state.params[2]); break;
      case 4: app[state.name](state.params[0],state.params[1],state.params[2],state.params[3]); break;
      case 5: app[state.name](state.params[0],state.params[1],state.params[2],state.params[3],state.params[4]); break;
      default:
      case 6: app[state.name](state.params[0],state.params[1],state.params[2],state.params[3],state.params[4],state.params[5]); break;
    }
    return true;
   }
  }
  return false;
 }
 
 ClearState() {
  app.storage.clear();  
 }
 
 RefreshData() {
  console.log("Refreshing dataset and UI...");
  app.api.BasicInfo( function(outgoing,incoming,ajax) {
   app.ParseIncoming();
   app.user = incoming.data.user;
   app.messages = incoming.data.messages;
   app.tasks = incoming.data.tasks;
   app.notifications = incoming.data.notifications;
   app.RecallState(app.LoadState());
   console.log("..completed. (app.RefreshData)");
  });
 }
 
 TriggerResize() {
	 if (app.ResizeTask)  clearTimeout(app.ResizeTask);
     app.ResizeTask=setTimeout(function(){app.EventResize();},200);
 }
 
 EventResize() {
	 if ( this.onResizeFunc ) {
		 this.onResizeFunc();
	 }
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
	  app.api.Login();
  });
  
  // Establish Password Strength feature
  var password=Get("mcapp-new-password");
  password.addEventListener('input', passCheckFun);
  password.addEventListener('onload', passCheckFun);
  password.addEventListener('onchange', passCheckFun);
  password.addEventListener('onfocus', passCheckFun);
  password.addEventListener('onblur', passCheckFun);
  
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
  
  app.after_repopulate=function(){ app.RecallState(app.LoadState()); };
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
  if ( $("#mcapp-password-form").is(":visible") ) return;
  console.log("NoSessionStateCallback entered");
  CheckMaintenanceMode();
  ClearSuperGlobals();
  // Show login window
  app.ShowLoginModal();
 }
 
 ShowLoginModal() {
  this.Title("Log in");
  console.log("Show login modal.");
  $("#mcapp-login-box").modal({ escapeClose: false, clickClose: false, showClose: false });
 }
 
 ShowLogout() {
  window.location="/";
 }
 
 Logout() { app.api.Logout(); }
 
 ShowPasswordExpired() {
  CallDeferredUnique(-122,function(){app.ShowPasswordExpiredModal();});
 }
 
 ShowPasswordExpiredModal() {
  SuperWarn("Your password is expired.  Please choose a new one.");
  console.log("ShowPasswordExpired");
  $("#mcapp-password-form").modal({ escapeClose: false, clickClose: false, showClose: false });
  $("#password-strength-text").html("");
  $("#password-box-msg").html("Your password has expired, please choose a new password");
  $("#mcapp-password-old").hide();
  $("#mcapp-password-forgot").hide();
  $("#mcapp-password-update-button").unbind('click');
  $("#mcapp-password-update-button").on('click', function(e) {
   var pw_new  = Get("mcapp-new-password");
   var pw_new2 = Get("mcapp-new-password-confirm");
   var message = Get("mcapp-password-update-result");
   if ( $(pw_new).val() != $(pw_new2).val() ) {
    Warn("New passwords do not match!");
   } else if (pwstrength < 2) {
    Warn("Password is not strong enough!");
   } else {
    console.log("Updating password.");
    api.UpdatePassword( $(pw_new).val(),
     function() {
      Warn("Could not update password!");
     }
    );
   }
  });
 }
 
 OnEnter() {
	 if ( ( app.focused && app.focused === Get("mcapp-sidebar-search-input") )
       || ( app.blurred && app.blurred === Get("mcapp-sidebar-search-input") ) ) { console.log("Enter pressed: Search"); $("#mcapp-sidebar-search-button").click(); }
 }
 
 Recurring() {
	 if ( !app.facilities ) {
		 app.doGetBasicInfo();
	 }
 }
 
 Refresh() { app.RedrawAll(true); }
 
 RedrawAll( forceReloadFromServer=false) { window.location.reload(forceReloadFromServer); }
 
 OnEnter() {
	 if ( ( app.focused && app.focused === Get("mcapp-sidebar-search-input") )
    || ( app.blurred && app.blurred === Get("mcapp-sidebar-search-input") ) ) {
   console.log("Enter pressed: Search"); $("#mcapp-sidebar-search-button").click();
  }
 }
 
 Title( c ) {
	 var info=new AppInfo;
	 document.title=info.sitename+" | "+c;
 }
 
 Control( t ) {
 }
 
 
 ParseIncoming() {
	 /*for ( var i=0; i<app.facilities.length; i++ ) {
		 app.facilities[i].id=parseInt(app.facilities[i].id);
		 for ( var j=0; j<app.facilities[i].layouts.length; j++ ) {
			 app.facilities[i].layouts[j].id=parseInt(app.facilities[i].layouts[j].id);
		 }
	 }*/
 }
 
 // Replaces elements in the sidebar with result from request.
 RepopulateFromBasicInfo( outgoing,incoming,ajax ) {
	 console.log(incoming.data);
	 app.ParseIncoming();
	 app.user = incoming.data.user;
	 app.messages = incoming.data.messages;
	 app.tasks = incoming.data.tasks;
	 app.notifications = incoming.data.notifications;
	 console.log("Updating UI");
	 app.UpdateSidebar();
	 app.UpdateTopNav();
	 if ( app.mainview_id ) app.Sidebar(app.mainview_code,app.mainview_id);
  else if ( app.after_repopulate ) { app.after_repopulate(); app.after_repopulate=null; }
 }
 
 doGetBasicInfo() {
	 app.api.BasicInfo( this.RepopulateFromBasicInfo );
 }
 
	 // Function to download data to a file
 downloadAsFile(data, filename, type="text") { return downloadAsFile(data,filename,type); }

};
