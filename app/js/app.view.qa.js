const Views_QA = {
 
 drawAddQuestion: function ( test_id ) {
  
  var amodel=[
	 { name: "correct", label: "Is this a correct answer?", type:"toggle" },
	 { name: "text",     label: "Answer Text", type:"text", hint: "ex. The capital of Mozambique is Maputo." },
	 { name: "imageurl", label: "Image URL", type:"string", hint:"https://...", caption: "(optional) URL that contains content related to this answer" },
	 { name: "videourl", label: "Video URL", type:"string", hint:"https://youtu.be/..", caption: "(optional) URL to a YouTube video (must allow embedding)" }
  ];
  
	 var model=[
	 { name: "member", type:"hidden", value:test_id },
  { name: "type", label: "Question Type", type:"select", options: [{name:"Multiple Choice", value:1},{name:"True/False",value:2},{name:"Essay", value:3}],
    change: function(e) {
     console.log(e.target);
     var option=parseInt($(e.target).val());
     console.log(option);
     if ( option == 3 ) {
      $("#jsapp-model-answers").hide();
      $("#limitanswers-caption").html("Maximum length of the essay in characters, 0=no limit");
     } else {
      $("#jsapp-model-answers").show();
      $("#limitanswers-caption").html("How many answer options should we show? 0=show all");
     }
    }
  },
	 { name: "text", label: "Question Text", type:"markdown", hint: "ex. What is the capital of Mozambique?" },
	 { name: "url", label: "URL", type:"string", hint: "https://...", caption: "(optional) Add a URL that contains content related to this question" },
	 { name: "videourl", label: "Video URL", type:"string", hint:"https://youtu.be/..", caption: "(optional) URL to a YouTube video (must allow embedding)" },
//	 { name: "pjs", label: "Is this a timed test?", type:"text", hint: "Provide Processing code for a Processingjs interactive animation" },
	 { name: "timed", label: "Is this a timed question?", type:"toggle", caption:"Timed questions have a countdown timer.",
    change: function(e) {
     if ( isChecked(e.target) ) $("#jsapp-model-seconds-wrapper").show();
     else $("#jsapp-model-seconds-wrapper").hide();
    }
  },
	 { name: "seconds", label: "How many seconds?", type: "integer", value:60 },
	 { name: "reorder", label: "Randomize answer order?", type:"toggle" },
	 { name: "limitanswers", label: "Answer Limit", type:"number", caption: span("How many answer options should we show? 0=show all",null,"limitanswers-caption"), value:0 },
	 { name: "skippable", label: "Allow test taker to skip this question?", type:"toggle" },
  { name: "answers", type: "extend", model: amodel,
     closebefore: true,
     add: button(faicon("fa-plus")+" Add Another Answer", null, "btn bg-green round4 marg10"),
     closecss: "pull-right", minimum:2, initial:2, inner: "thinline round8 pad4",
     title:h5("Answer ###"),
     before: div("Possible Answers","bartitle"),
     css: "nomargin nopadding"
   }
	 ];
  
 	var crumbs = '<li><a href="#" onclick="javascript:mcapp.Sidebar(mcapp.codes.sidebar.dashboard);"><i class="fa fa-dashboard"></i> Home</a></li>';
		crumbs += '<li><a href="#" onclick="javascript:mcapp.doPrograms();">'+app.current.program.name+'</a></li>';
		crumbs += '<li class="active">'+app.current.test.name+'</li>';
		crumbs += '<li class="active">New Question</li>';

  
  app.activeDataModel=model;
	 app.Main( "New Question", app.current.test.name,
           "Question Details",
            PackForm( model )
            + div(
                hrefbtn(button("Cancel",null,"btn"),"mcapp.drawEditAssessment("+app.current.test.id+");")
              + nbsp(5)
              + hrefbtn(button("Save Question",null,"btn bg-blue"),"mcapp.SaveNewQuestion();"),
              "bottom-right"
             ),
            null
  );
		$("#mcapp-header-breadcrumb").html( crumbs );
  jQueryForm(model);
  $("#jsapp-model-seconds-wrapper").hide();
 },
 
 SaveNewQuestion: function() {
   var model=app.activeDataModel;
	  var data=UnpackForm(model);
	  app.api.CreateMember( "qa", 
	   data.member, data,
	   function(outgoing,incoming,ajax) {
     app.current.test.questions[app.current.test.questions.length]=incoming.data;
		   $.modal.close();
		   Succeed("New Question Created!");
     console.log(incoming);
		   app.drawEditAssessment(outgoing.for);
	   }
	  );
 },
 
 drawEditQuestion: function ( question_id ) {
 }  
  
  
};