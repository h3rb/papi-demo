const Views_QA = {
 
 drawAddQuestion: function ( test_id ) {
  
  var amodel=[
	 { name: "imageurl", label: "Image URL", type:"string", hint: "(optional) URL that contains content related to this answer" },
	 { name: "videourl", label: "Video URL", type:"string", hint: "(optional) URL to a YouTube video (must allow embedding)" },
	 { name: "text", label: "Text", type:"text", hint: "ex. The capital of Mozambique is Maputo." },
	 { name: "correct", label: "Is this a correct answer?", type:"toggle" },
	 { name: "seconds", label: "How many seconds?", type: "toggle" }   
  ];
  
	 var model=[
	 { name: "member", type:"hidden", value:test_id },
	 { name: "url", label: "URL", type:"string", hint: "(optional) Add a URL that contains content related to this question" },
	 { name: "text", label: "Text", type:"text", hint: "ex. What is the capital of Mozambique?" },
//	 { name: "pjs", label: "Is this a timed test?", type:"text", hint: "Provide Processing code for a Processingjs interactive animation" },
	 { name: "timed", label: "Is this a timed question?", type:"toggle" },
	 { name: "seconds", label: "How many seconds?", type: "toggle" },
	 { name: "reorder", label: "Randomize answer order?", type:"toggle" },
	 { name: "limitanswers", label: "Limit randomized correct answers to 1.", type:"toggle" },
	 { name: "skippable", label: "Allow test taker to skip this question?", type:"toggle" },
  { name: "answers", type: "extend", model: amodel,
     closebefore: true,
     closecss: "pull-right", minimum:2, initial:2, inner: "roundbox",
     title:h5("Answer ###")
   }
	 ];
  
	 app.Modal( "New Question", PackForm( model ), model, function(model,e) {
 	 console.log(model);
	  var data=UnpackForm(model);
   console.log(data);
   /*
	  app.api.Create( "qa", 
	   { name:data.name, member:data.member, desc:data.desc },
	   function(outgoing,incoming,ajax) {
		  $.modal.close();
		  Succeed("New Question Created!");
		  app.drawEditAssessment(incoming.data.id);
	   }
	  );*/
	  console.log(data);
	 });
  jQueryForm(model);
  
 },
 
 drawEditQuestion: function ( question_id ) {
 }  
  
  
};