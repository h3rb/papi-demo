
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
 },
  
 Heatmap: function ( crop, plantscans, metric_type=0, domid="mcapp-heatmap", infobar="mcapp-heatmap-info", container="mcapp-scan-area" ) {
	 console.log("Heatmap: "+metric_type);
  var rowColAspect = crop.rows / crop.columns;
  var invRowCol =  crop.columns / crop.rows;	 
   
  var containerele=Get(container);
  var totalW = containerele.clientWidth;
  var elementW = totalW/crop.columns;
  var totalH = elementW * crop.rows;
  var scaleRate = totalW/200;
		console.log("scaleRate: "+scaleRate);
  var domele=Get(domid);
	 
	 var dmin=100;
	 var dmax=0;
	 var data=[];
	 var ofs={ x: 10*scaleRate, y: 10*scaleRate };
	 var scale={ x: 20*scaleRate, y: 20*scaleRate, z:10 };
	 for ( var j=0; j<crop.data.plants.length; j++ ) {
		 var gridloc=this.GetPlantLocation(crop,j+1);
		 if ( gridloc && plantscans[j].samples.length >0 ) {
			 var ourvalue=this.GetMetricTypeValue(metric_type,plantscans[j].samples[0]);
			 if ( dmin > ourvalue ) dmin=ourvalue;
			 if ( dmax < ourvalue ) dmax=ourvalue;
			 data[data.length]={ x: parseInt(""+(ofs.x+gridloc.x*scale.x)), y: parseInt(""+(ofs.y+gridloc.y*scale.y)), value: ourvalue };
//			 console.log(data[data.length-1]);
		 }
	 }
	 
	 var opts={
   backgroundColor: "#000",
   container: domele,
   radius: parseInt(""+25*scaleRate),
   maxOpacity: 1,
   minOpacity: 0,
   blur: 0.95,
   gradient: {
     '.1': 'maroon',
     '.3': 'red',
   	 '.5': 'yellow',
   	 '.7': 'lime',
     '.9': 'white'
   }
  };
   
  console.log(opts);
   
  var info=Get(infobar);
  $(info).html("<b>"+this.GetMetricTypeName(metric_type)+"</b>"+"<BR>Black to White Range: <B>"+dmin+"</B> (lowest) to <B>"+dmax+"</B> (highest)");
   
  if ( dmin > dmax ) { var t=dmax; dmax=dmin; dmin=t; }
	  
			// Deploy heatmap.
  var heatmap = h337.create(opts);
  console.log(data);
	 heatmap.setData({
	   min: dmin,
	   max : dmax,
	   data : data
  });
	 
 }
  
  
};