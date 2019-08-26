
var app = null;

function Get( id ) { return document.getElementById(id); }

function GetInputValue(id) {
	var a = Get(id);
	return $(a).val();
}

class MicertifyApp {

 constructor( api ) {
  this.api=api;
  this.api.app=this;
  this.codes = this.GetUICodes();
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
	  modal: {
		  login: 201
	  }
	 };
 }
 
 Event30() {
   app.CheckSessionState();
 }
 
 Init() {
  app.api.Init();
  
  // Establish jQuery Behaviors
  $("#login-button").click(function(e){
	  app.api.username = GetInputValue("login-username");
	  app.api.password = GetInputValue("login-password");
	  $.modal.close();
	  app.api.Login();
  });
  
  // Setup recurring session check
  setInterval(function(e){ app.Event30(); }, 30000);	 
  console.log(app);	 
  app.CheckSessionState();
 }
 
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
  console.log("Show login modal.");
  $("#modal-login").modal({ escapeClose: false, clickClose: false, showClose: false });
  // $.modal.close();
 }
 
 Sidebar( c ) {
	 switch ( c ) {
		 case this.codes.sidebar.messages:
		 break;
		 case this.codes.sidebar.search:
		 break;
		 case this.codes.sidebar.browse:
		 break;
		 case this.codes.sidebar.certified:
		 break;
		 case this.codes.sidebar.results:
		 break;
		 case this.codes.sidebar.download:
		 break;
		 case this.codes.sidebar.grading:
		 break;
		 case this.codes.sidebar.programs:
		 break;
		 case this.codes.sidebar.gettingstarted:
		 break;
		 case this.codes.sidebar.reference:
		 break;
		 case this.codes.sidebar.support:
		 break;
	 }
 }

};
