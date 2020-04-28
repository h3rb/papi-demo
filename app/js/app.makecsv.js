
var csv = "";

function ObjectToCSVString(obj) {
 var csv="";
 forEachNested(obj, function(currentValue){
 	if(!currentValue) return false;
  if(currentValue.constructor === Object ) {
   csv += "\n" + implode(",",Object.keys(currentValue).reverse()) + "\n";
  } else {
 	 if (typeof currentValue === 'string' || currentValue instanceof String)        csv += currentValue.replace(/(<([^>]+)>)/ig,"")+",";
   else if ( typeof currentValue === 'number' )        csv += currentValue+",";
	 }
	 return true;
 });
 return csv;
}

class MakeCSV {
  constructor() {
   this.csv=[];
   this.decimals=0; // unlimited
   this.sep=',';
   this.ender='\n';
   this.base64=false;
   this.insertJSON=false;
   this.filn="download.csv";
  }
  filename(fn) { this.filn=fn; }
  rows() { return this.csv.length; }
  width() {
   var longest=0;
   for ( var i=0; i<this.csv.length; i++ ) if ( this.csv[i].length > longest ) longest=this.csv[i].length;
  }
  widest() {
   var longest=0;
   for ( var i=0; i<this.csv.length; i++ ) if ( this.csv[i].length > longest ) longest=i;
   return i;
  }
  add( ) {
   var newRow=this.csv.length;
   this.csv[this.csv.length]=[];
   for (var i = 0; i < arguments.length; i++) this.csv[newRow][i]=arguments[i];
  }
  addRow( ) {
   var newRow=this.csv.length;
   this.csv[this.csv.length]=[];
   for (var i = 0; i < arguments.length; i++) this.csv[newRow][i]=arguments[i];
  }
  newline() { this.ender='\n'; }
  msdos() { this.ender='\r\n'; }
  ending(c) { this.ender=c; }
  comma() { this.sep=','; }
  tab() { this.sep='\t'; }
  separator(c) { this.sep=c; }
  inBounds(row,col) { return get(row,col) != null; }
  get(row,col) {
   if ( row < 0 || col < 0 ) return null;
   if ( row >= this.csv.length ) return null;
   if ( col >= this.csv[row].length ) return null;
   return this.csv[row][col];
  }
  toString() {
   var s="";
   for (var row=0; row<this.csv.length; row++ ) {
    for ( var col=0; col<this.csv[row].length; col++ ) {
     var value=this.csv[row][col];
     if ( !value ) s+="";
     else if ( is_array(value) ) { s+=value.join(sep); }
     else if ( isBoolean(value) ) { s+= value ? "TRUE" : "FALSE"; }
     else if ( value.constructor === Object ) {
      if ( this.insertJSON ) {
       s+=JSON.stringify(value);
      } else {
       s += ObjectToCSVString(value);
      }
     }
     else if ( typeof value === "number" ) {
      if ( this.decimals != 0 ) s+=nf(value,this.decimals);
      else s+=""+nf(value,this.decimals);
     } else s+=""+value;
     if ( col != this.csv[row].length-1 ) s+=this.sep;
    }
    s+=this.ender;
   }
   return s;
  }
  download() {
   app.downloadAsFile(this.toString(),this.filename,"text");
  }
}


const AppCSV = {

 LastScanToCSV: function () { return ObjectToCSVString(app.last_scan_data); },
 
 DownloadLastScanDataCSV: function () {
	 console.log("LastScanData:");
	 console.log(app.last_scan_data);
	 if ( !app.last_scan_data ) return;
	 var scan_id=app.last_scan_data.data.scan.ID;
	 var crop_id = app.last_scan_data.crop.id;
//	 app.downloadAsFile(app.LastScanToCSV(),"scan"+scan_id+".csv","text");
  app.downloadAsFile(app.CSVForBatch(crop_id,scan_id),"crop"+crop_id+"scan"+scan_id+".csv","text");
 },

 DownloadLastPlantDataCSV: function () {
	 if ( !app.last_scan_data ) return;
	 var scan_id=app.last_scan_data.data.scan.ID;
	 var plant_id=app.last_plant_data_id;
	 app.downloadAsFile(app.last_sample_csv,plant_id+"_Set_of_Scan"+scan_id+".csv","text");
 },

 DownloadLastScanDataJSON: function () {
	 if ( !app.last_scan_data ) return;
	 var scan_id=app.last_scan_data.data.scan.ID;
	 app.downloadAsFile(JSON.stringify(app.last_scan_data),"scan"+scan_id+".json","text");
 },
 
 CSVForBatch: function ( crop_id, scan_id ) {
	 var data=this.last_scan_data;
	 
	 console.log(data);
	 
	 var csv="";
	 	 
	 var crop=data.crop;
	 var facility=this.FacilityByID(crop.facility);
	 var scan=this.ScanByIDForCrop(crop,scan_id);

		 var plants=data.crop.data.plants.length;
		 console.log("Plants = "+plants);
	 
		 csv += crop.name+", "+facility.name+",Plant tags: "+plants+"\n";
		 var scandate=ts(scan.Created);
		 csv +="Sample View for Scan #"+scan.ID+" taken "+scandate+"\n";
		 
		 
		 var planttags=data.crop.data.plants;
		 var samplings=data.plantscans;
		 
	for ( var pnum=0; pnum<plants; pnum++ ) {
		
		var plant=planttags[pnum];
		
	 csv += "Plant #,Plant Tag,Scan,Scan Name,Scan Notes,Crop\n"+pnum+","+plant.id+","+scan_id+","+scan.Name+","+scan.Notes+","+crop_id+"\n";
		
		var plantscans=samplings[pnum];
		csv += "------- Plant #"+pnum+"\n";
		csv += 'Samples Taken in Scan: '+plantscans.samples.length+'\n'
	        +'Sampling location:  Row '+(plant.y+1)+' Column '+(plant.x+1)+'\n'
	        +'Plant Location Tag: '+plant.id+' U#'+plant.u+' Pnum='+pnum+'\n'
			;
	 if ( plantscans.samples[0] ) {
		var ps=plantscans.samples[0];
		if ( ps.detection_counts_global ) {
	 	var total_average_count=ps.detection_counts_global.amber_count+ps.detection_counts_global.clear_count+ps.detection_counts_global.cloudy_count;
	    csv+="Avg Amber, Avg Clear, Avg Cloudy, Total Trichomes\n"
	   +ps.detection_counts_global.amber_count+","
	   +ps.detection_counts_global.clear_count+","
	   +ps.detection_counts_global.cloudy_count+","
	   +total_average_count+"\n"; 
		}
	 }
	
	
	// counts
	{
	 var datasets=[];
	 
	 csv+="\nSampling: Trichome Counts Per Type\n"+"Sample,Amber,Clear,Cloudy\n";
	 
	 for ( var i=0; i<plantscans.samples.length; i++ ) {
		var d=[];
        d[d.length]=plantscans.samples[i].amber_count;
        d[d.length]=plantscans.samples[i].clear_count;
        d[d.length]=plantscans.samples[i].cloudy_count;
		csv += "Sample "+i+","+plantscans.samples[i].amber_count+","+plantscans.samples[i].clear_count+","+plantscans.samples[i].cloudy_count+"\n";
	 }

	}
		 
	// size distribution
	{
	 csv+="Chart: Size Distribution\n"+"Sample,Size,center_x,center_y,radius\n";
	 	 
	 for ( var i=0; i<plantscans.samples.length; i++ ) {
		var d=[];
		for ( var j=0; j<plantscans.samples[i].sizes.length; j++ ) {
			 if ( plantscans.samples[i].sizes[j] && plantscans.samples[i].sizes[j].area ) {
				 d[d.length]=plantscans.samples[i].sizes[j].area;
                 csv += "Sample "+i+","+plantscans.samples[i].sizes[j].area+","+plantscans.samples[i].sizes[j].circle_x+","+plantscans.samples[i].sizes[j].circle_y+","+plantscans.samples[i].sizes[j].radius+"\n";
			 } 		
		}
		d.sort(function(a,b){return b-a;});
	 }
	}
	
	
	// size distribution: ambers
	{
	 
	 
	 csv+="Chart: Size Distribution: Amber Trichomes\n"+"Sample,Size,top_left_x,top_left_y,width,height\n";
	 
	 for ( var i=0; i<plantscans.samples.length; i++ ) {
		var samp=plantscans.samples[i];
		var d=[];
		if ( samp.detections)
		for ( var j=0; j<samp.detections.length; j++ ) {
			var det=samp.detections[j];
			det.trichome_type=parseInt(det.trichome_type);
			if ( det.trichome_type == this.trichome_types.amber ) {
				var ds=plantscans.samples[i].detections[j];
				d[d.length]=ds.width*ds.height;
                csv += "Sample "+i+","+ds.width*ds.height+","+ds.upper_left_x+","+ds.upper_left_y+","+ds.width+","+ds.height+"\n";
			}
		}
	 }
	}
	
	
	// size distribution: cloudy
	{
	 	 
	 csv+="Chart: Size Distribution: Cloudy Trichomes\n"+"Sample,Size,top_left_x,top_left_y,width,height\n";
	 for ( var i=0; i<plantscans.samples.length; i++ ) {
		var samp=plantscans.samples[i];
		var a=[];
		if ( samp.detections)
		for ( var j=0; j<samp.detections.length; j++ ) {
			var det=samp.detections[j];
			det.trichome_type=parseInt(det.trichome_type);
			if ( det.trichome_type == this.trichome_types.cloudy ) {
				var d=plantscans.samples[i].detections[j];
				a[a.length]=d.width*d.height;
                csv += "Sample "+i+","+d.width*d.height+","+d.upper_left_x+","+d.upper_left_y+","+d.width+","+d.height+"\n";
			}
		}
	 }

	}
	

	// size distribution: clear
	{
	 csv+="Chart: Size Distribution: Clear Trichomes\n"+"Sample,Size,top_left_x,top_left_y,width,height\n";

	 for ( var i=0; i<plantscans.samples.length; i++ ) {
		var samp=plantscans.samples[i];
		var a=[];
		if ( samp.detections)
		for ( var j=0; j<samp.detections.length; j++ ) {
			var det=samp.detections[j];
			det.trichome_type=parseInt(det.trichome_type);
			if ( det.trichome_type == this.trichome_types.clear ) {
				var d=plantscans.samples[i].detections[j];
				a[a.length]=d.width*d.height;
                csv += "Sample "+i+","+d.width*d.height+","+d.upper_left_x+","+d.upper_left_y+","+d.width+","+d.height+"\n";
			}
		}
	 }

	}	
	  
	}
	return csv;
 }

  
};