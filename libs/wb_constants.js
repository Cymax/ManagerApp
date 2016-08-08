//constants
var baseURL, 
	sUrl = window.location.pathname.split('/')[1],
	bLanguage = (window.navigator.userLanguage || window.navigator.language).substring(0, 2).toLowerCase(),
	availableTrans = 'ar,bg,ca,cs,da,de,el,en, es, et,eu,fa,fi,fr,gb,gl,he,hr,hu,id,is,it,ja,ka,kk,ko,lt,lv,my,nl,no,pl,pt,ro,ru,si,sk,sl,sr,sv,th,tj,tr,uk,vi,zh',
	availableLangCode = 'nl,gb';//,de,fr,es

if (sUrl == "wb"){
	baseURL = "http://localhost/wb/wb_dep/";	
	//restURL = "https://demo.absentiemanager.nl/abs3demo/";//https://demo.absentiemanager.nl:443/abs3demo/
	restURL = "https://login.absentiemanager.nl/abs/";	
} else if (sUrl == "acc"){
	baseURL = "https://login.workbee.eu/acc/wb_dep/";
	restURL = "https://demo.absentiemanager.nl/abs3demo/";	
} else {
    baseURL = "https://login.workbee.eu/wb_dep/";	
	restURL = "https://login.absentiemanager.nl/abs/";	
}
//function to define and include required css files
function fncRequireCssFile(url,dev,ver,media) {
	var link = document.createElement("link");
	link.type = "text/css";
	link.rel = "stylesheet";
	media ? link.media = media : '';
	link.href = url+"?bust=" + ((dev)? (new Date()).getTime(): ver);
	document.getElementsByTagName("head")[0].appendChild(link);
}	// end fncRequireCssFile
		
var _vers =  "01"; 
//required css files	
fncRequireCssFile(baseURL+"libs/bootstrap/css/bootstrap.min.css", false, _vers, "screen");	
fncRequireCssFile(baseURL+"libs/font-awesome/css/font-awesome.min.css", false, _vers);
fncRequireCssFile(baseURL+"libs/jqueryui/css/jquery-ui.css", false, _vers);
fncRequireCssFile(baseURL+"libs/datatables/jquery.dataTables.min.css", false, _vers);
fncRequireCssFile(baseURL+"libs/datatable-responsive/css/dataTables.responsive.css", false, _vers);
//fncRequireCssFile(baseURL+"libs/datatables/dataTables.bootstrap.css", false, _vers);

fncRequireCssFile(baseURL+"css/customstyles.css", false, _vers);
fncRequireCssFile(baseURL+"css/slider.css", false, _vers);
fncRequireCssFile(baseURL+"css/cookie.css", false, _vers);
    