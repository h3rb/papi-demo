
// http://bootstrap-notify.remabledesigns.com/

function Warn(msg) {
	console.log("Warning: "+msg);
	$.notify({	message: msg },{  type: 'danger', z_index:100000 });
}

function Warning(msg) {
	console.log("Warning: "+msg);
	$.notify({	message: msg },{  type: 'danger', z_index:100000 });
}

function Succeed(msg) {
	console.log("Success: "+msg);
	$.notify({	message: msg },{  type: 'success', z_index:100000 });
}


const AppWidgets = {
	
	// Main content area
 DrawLoader: function ( title, subtitle, crumblist ) {
	 $("#mcapp-header-title").html( title+"<small>"+subtitle+"</small>");
	 var crumblisthtml = '<li><a href="#" onclick="javascript:mcapp.Sidebar(mcapp.codes.sidebar.dashboard);"><i class="fa fa-home"></i></a></li>';
	 if ( crumblist ) {
	  crumblist.forEach(crumb => {
		crumblisthtml += '<li class="'+crumb.css+'"><a href="#" onclick="javascript:'+crumb.func+'">';
		if ( crumb.icon ) crumblisthtml+='<i class="fa '+crumb.icon+'"></i> ';
		crumblisthtml += crumb.text+'</a></li>';
	  });
	 }
	 $("#mcapp-header-breadcrumb").html( crumblisthtml );
	 $("#mcapp-content-box-body").html("<div class='center-div'><p><img src='/app/i/loader.gif'></p></div>");
 },
 
 Main: function ( title, subtitle, boxtitle, body, crumblist=null ) {
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
 },
	
 EmptyMain: function () {
		Main("","","","",null);
 },
 
 ResetContextBox2: function () {
	 console.log("ContentBox2: reset");
	 $("#mcapp-content-box-title2").html("");
	 $("#mcapp-content-box-body2").html("");
	 $("#mcapp-content-box2").hide();
 },
 
 ContentBox2: function ( title, content ) {
	 console.log("ContentBox2: "+title);
	 $("#mcapp-content-box-title2").html(title);
	 $("#mcapp-content-box-body2").html(content);
	 $("#mcapp-content-box2").show();
 },
	
	// Modal dialog
	
 ModalSuccess: function ( msg ) {
  $("#mcapp-modal-message").html(
    '<div class="alert alert-success" role="alert">'
   +msg
   +'</div>'
  );
 },
 
 ModalWarning: function ( msg ) {
  $("#mcapp-modal-message").html(
    '<div class="alert alert-danger" role="alert">'
   +msg
   +'</div>'
  );
 },

 Modal: function ( title, body, model, onSave, saveButton="Save Changes", cancelButton="Cancel" ) {
	 console.log("Opening Modal: "+title);
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
	 $("#mcapp-modal").modal({ escapeClose: true, clickClose: false, showClose: false });
 },
	
 ModalClearMessage: function() { $("#mcapp-modal-message").html(""); },
	
	ShowModal: function() {
	 $("#mcapp-modal").modal({ escapeClose: false, clickClose: false, showClose: false });   //({ escapeClose: true, clickClose: true, showClose: true });
 }
  
};