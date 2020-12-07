const Views_Search = {
  
  BrowsePrograms: function ( search_terms=null ) {
   console.log("BrowsePrograms");
   
   var toparea=div(
                  div(
                    button("Search",null,"btn btn-info","mcapp-mainsearchbtn"),
                    "input-group-btn"
                     )
                  +input( "mcapp-mainsearch", "text", "Enter keywords", "form-control", null, (search_terms != null ? search_terms : "") ),
                  "input-group input-group-sm"
              );

   
   var content="";
     
   content += div( 
                  (search_terms != null ? ('<center><img src="i/loader.gif"><BR> '+"Looking for ``"+search_terms+"``</center>") : ""),
                  null,"mcapp-searchresults"
              );
   
   content += '<hr size=1>';
   
   content += '<h4>Looking for more?  Try these...</h4>';
   
   content += div( "", null, "mcapp-discovery" );
   
   app.Main( "Discover", "Learn and Get Certified", toparea, content, null );
   
   if ( search_terms != null )
   app.api.Search( search_terms, function(o,i,a) {
    if ( o.terms != null ) {
     var content = "";
     content += div( "Showing results for <i>"+o.terms+"</i>" );
     content += div( i.data.length+" results" );
     $("#mcapp-searchresults").html(content);
    }
   });
   
   app.api.Discover( function(o,i,a) {
    console.log(o);
    console.log(i);
    console.log(a);
    var content = "";
    content += div( i.data.length+" results" );
    $("#mcapp-discovery").html(content);
   });
  }
  
  
  
};