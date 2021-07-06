
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

 LastToCSV: function () { return ObjectToCSVString(app.last_csv_data); }
  
};