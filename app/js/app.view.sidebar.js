const Views_Sidebar = {
  
  

 UpdateSidebar: function() {
	 return;
	var content="";
	content+='<ul class="sidebar-menu" data-widget="tree" id="mcapp-sidebar-list">';

	content+=
        '<li class="header" id="mcapp-sidebar-section-help">SUPPORT</li>'+
        '<li id="mcapp-sidebar-gettingstarted"><a href="#" onclick="javascript:mcapp.Sidebar(mcapp.codes.sidebar.gettingstarted);"><i class="fa fa-toggle-right"></i> <span>Getting Started</span></a></li>'+
        '<li id="mcapp-sidebar-reference"><a href="https://bloomfield.ai/reference" target="_blank"><i class="fa fa-book"></i> <span>App Reference</span></a></li>'+
        '<li id="mcapp-sidebar-support">><a href="https://bloomfield.ai/support" target="_blank"><i class="fa fa-question-circle"></i> <span>Get Support</span></a></li>'
		;
	content+='</ul>';

	$("#mcapp-sidebar-menu").html(content);
 },
 
 
 Sidebar: function( c, x=0 ) {
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
    if ( x != 2 ) {
 		  this.Title("Search");
	 	  $("#mcapp-sidebar-search-form").addClass("active");
    } else {
     $("#mcapp-sidebar-find-programs").addClass("active");
     app.BrowsePrograms();
    }
    
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
 
  
};