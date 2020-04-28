const Views_Programs = {
  
  
 drawPrograms: function(outgoing,incoming,ajax) {
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
 },

 doPrograms: function() {
	 app.DrawLoader( "Your Programs", "&amp; Assessments", [ { css: "active", func:"mcapp.Sidebar(mcapp.codes.sidebar.programs)", icon:null, text:"Your Programs"  } ] );
	 app.api.ListEverything("programs",app.drawPrograms);
 },
 
 GetProgramByID: function(id) {
   for ( var i=0; i<app.programs.length; i++ ) {
	   if ( app.programs[i].id == id ) return app.programs[i];
   }
   return null;
 },
  
 
 drawAddProgram: function() {
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
 },
  
  
 drawEditProgram: function( id ) {
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
 },
 
 
 UpdatePrograms( after=function(outgoing,incoming,ajax){app.programs=incoming.data.result;} ) {
	 console.log("UpdatePrograms");
	 	 app.api.ListEverything("programs",after);
 }
  
};