const Views_Tests = {
   
 drawAddAssessment: function( program_id ) {
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
 },
 
 drawEditAssessment: function( test_id ) {	 
	 app.DrawLoader( "Assessment", "Create &amp; Edit", null ); 
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
 
};