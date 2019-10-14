var APP_VERSION = "0.5 &alpha;";

var app = null;

var idleSince = Date.now();

function Get( id ) { return document.getElementById(id); }

function GetInputValue(id) {
	var a = Get(id);
	return $(a).val();
}

function PageVisibilityProp(){
    var prefixes = ['webkit','moz','ms','o'];
    
    // if 'hidden' is natively supported just return it
    if ('hidden' in document) return 'hidden';
    
    // otherwise loop over all the known prefixes until we find one
    for (var i = 0; i < prefixes.length; i++){
        if ((prefixes[i] + 'Hidden') in document) 
            return prefixes[i] + 'Hidden';
    }

    // otherwise it's not supported
    return null;
}

function isPageVisible() {
    var prop = PageVisibilityProp();
    if (!prop) return true;    
    return !document[prop];
}

function slugify(s) {
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return s.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word characters
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

var html="";
function PackForm( model, prefix="jsapp-model" ) {
 html="";
 model.forEach(function(item,index){
	 var n = (item.name?item.name:index);
	 var i = prefix+'-'+slugify(n);
	 var v = (item.value?item.value:"");
	 var p = (item.hint?item.hint:"");
	 html+='<div id="'+i+'-wrapper" class="'+(item.css?item.css:"")+'" style="'+(item.style?item.style:"")+'">';
	 if ( item.label ) html+='<label for="'+n+'">'+l;
	 if ( item.type === "hidden" ) {
		html+='<input name="'+n+'" id="'+i+'" type="hidden" value="'+v+'" placeholder="'+p+'">';
	 } else if ( item.type === "string" ) {
		html+='<input name="'+n+'" id="'+i+'" type="text" value="'+v+'" placeholder="'+p+'">';
	 } else if ( item.type === "text" ) {
		 html+='<textarea name="'+n+'" id="'+i+'" placeholder="'+p+'">'+v+'</textarea>';
	 } else if ( item.type === "markdown" ) {
		 html+='<textarea name="'+n+'" id="'+i+'" placeholder="'+p+'">'+v+'</textarea>';
	 } else if ( item.type === "date" ) {
		html+='<input name="'+n+'" id="'+i+'" type="date" value="'+v+'" placeholder="'+p+'">';
	 } else if ( item.type === "slider" ) {
		 html+='<input name="'+n+'" id="'+i+'" type="number" value="'+v+'" placeholder="'+p+'">';
	 } else if ( item.type === "integer" ) {
		 html+='<input name="'+n+'" id="'+i+'" type="number" value="'+v+'" placeholder="'+p+'">';
	 } else if ( item.type === "decimal" ) {
		 html+='<input name="'+n+'" id="'+i+'" type="number" value="'+v+'" placeholder="'+p+'">';
	 } else if ( item.type === "radio" ) {
	 } else if ( item.type === "select" ) {		 
	 } else if ( item.type === "toggle" ) {
	 }
	 if ( item.label ) html+='</label>';
	 html+='</div>';
 });
 return html;
}

function UnpackForm( prefix="jsapp-modal", model ) {
 var data={};
 model.forEach(function(item,index){
	 var n = (item.name?item.name:index);
	 var i = prefix+'-'+slugify(n);
	 var v = $("#"+i).val();
	 data[n] = v;
 });
 return data;
}


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

  // Establish event for enter/return key  
  $(window).keyup(function(e) { if ( e.keyCode == 13 ) { event.preventDefault(); app.OnEnter(e); }}  );
 
  // Setup recurring session check
  setInterval(function(e){ app.Event30(); }, 30000);	 
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

 Modal( title, body, saveButton="Save Changes", cancelButton="Cancel" ) {
	 $("#mcapp-modal-title").html(title);
	 $("#mcapp-modal-body").html(body);
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
	 $("#mcapp-modal").modal({ escapeClose: true, clickClose: true, showClose: true });
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
 
 // Gets the number of tests, certs, etc, updates task lists, refresh profile data,
 // activities, etc.
 UpdateMetrics() {
 }
 
 drawLoader( title, subtitle, crumblist ) {
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
	 var programs = incoming.data.result;
	 app.programs = programs;
	 programs.forEach( program => {
      content += "<b>"+program.name+'</b><BR>';
	  content += '<a href="#" title="Edit" alt="Edit" onclick="javascript:mcapp.Edit(mcapp.codes.edit.program,'+program.id+')"><i class="fa fa-edit"></i> Edit</a> ';
      content += '<i class="fa fa-users"></i> Enrollment';
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
 
 drawEditProgram( id ) {
	 console.log("drawEditProgram:"+id);
	 var program = app.GetProgramByID(id);
	 if ( !program ) return;
	 var model=[
	 { name: "name", value: program.name, hint: "Program Name" }
	 ];
	 app.Modal( "Editing Program", PackForm( model ) );
 }
 
 drawEditTest( id ) {
	 console.log("drawEditTest:"+id);
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



};
