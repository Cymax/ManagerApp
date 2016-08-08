
//function to sort array object
function sortObject(object) {
    return Object.keys(object).sort().reduce(function (result, key) {
        result[key] = object[key];
        return result;
    }, {});
	//usage  var sortedRows =  sortObject(timeObj);		
} // end sortObject


// function to sort array data
function sortJSON(data, key, way) {
	return data.sort(function(a, b) {
		var x = a[key]; var y = b[key];
		if (way === '123' ) { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
		if (way === '321') { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
	});
	//usage  var nrOfRowsA = sortJSON(responseAvatar,'ID', '321'); 		
}// end sortJSON	

// function to sort convert date in yy-mm-dd format
 function fncFormateDate(dateObject) {
	var d = new Date(dateObject);
	var day = d.getDate();
	var month = d.getMonth() + 1;
	var year = d.getFullYear();
	if (day < 10) {
		day = "0" + day;
	}
	if (month < 10) {
		month = "0" + month;
	}
	var dateConvert = year + "-" + month + "-" + day;
	return dateConvert;
	//usage fncFormateDate(date); 		
}	 // end fncFormateDate

// function to sort convert date in yy-mm-dd format
$.dateConvert = function(dateObject) {
	var d = new Date(dateObject);
	var day = d.getDate();
	var month = d.getMonth() + 1;
	var year = d.getFullYear();
	if (day < 10) {
		day = "0" + day;
	}
	if (month < 10) {
		month = "0" + month;
	}
	var dateConvert = year + "-" + month + "-" + day;
	return dateConvert;
	//usage dateConvert(date); 		
};	 // end $.dateConvert 

// function to convert only first letter to Uppercase 
function convert_case(str) {
	  var lower = str.toLowerCase();
	  return lower.replace(/(^| )(\w)/g, function(x) {
		return x.toUpperCase();
	  });
	//  usage convert_case(val.CountryName);
}	// end convert_case
	
// function to check browser is private mode 	
var hasSessionStorage= !!function() {
  var result;
  var uid = +new Date;
  try {
	localStorage.setItem(uid, uid);
	result = localStorage.getItem(uid) == uid;
	localStorage.removeItem(uid);
	return result;
  } catch (exception) {}
  //usage  if (hasSessionStorage){}
}() && localStorage; // end hasSessionStorage

// function toclear session and cookies from browser
function clearAllHistory(){
	// declare variables session/storage  
	//var ds = sessionStorage.length; 	
	for (var obj in localStorage) {
		//console.log("obj:"+ obj); 
      if (localStorage.hasOwnProperty(obj)  &&  
	        obj != "storage_LockStatus" && 
			obj != "storage_LoggedOut" && 
			obj != "localStorageEmail" && 
			obj != "localStoragePassword" && 
			obj != "localStorageRememberPwd") {
				alert("localStorageRememberPwd");
       // localStorage.removeItem(obj);
		//localStorage.clear();
		//console.log("obj:"+ obj); 
      } else {alert("---");}
    }
	
   for (var obj in sessionStorage) {
		//console.log("obj:"+ obj); 
      if (sessionStorage.hasOwnProperty(obj)  &&  
	        obj != "interfaceItemsStorageKey" && 
			obj != "sCountrycode" && 
			obj != "countriesStorageKey" && 
			obj != "languagesStorageKey" ) {
         sessionStorage.removeItem(obj);
	     sessionStorage.clear();
		//console.log("obj:"+ obj); 
      }
    }
	//clear session	
	//alert(ds != '');
	/*if (ds != ''){	
		while(ds--) {
			var key = sessionStorage.key(ds);
			if(sessionStorage.hasOwnProperty(obj) && key != "interfaceItemsStorageKey" && 
			key != "sCountrycode" && 
			key !="countriesStorageKey" && 
			key!= "languagesStorageKey" ) {
				sessionStorage.removeItem(key);				
				sessionStorage.clear();
				//console.log("key:"+ key); 
			} 		
		}//while
	} else {
	  return false  
	}*/
	
   // window.location.href=rPage; 
} // end clearAllHistory
 
// function to replace old CSS/JS files (array of files)
function fncRefreshFiles(){  		
	//replace files	    
    var toRefreshList_js = 
	[	'js/wb_constants.js', 
		'js/main.js', 
		'js/custom/wb_utils.js', 
		'js/custom/wb_data_storage.js',
		'js/custom/wb_accountInfo.js', 
		'js/models/adminHomePage.js',
		'js/models/profilePage.js',
		'js/models/buyAppsPage.js',
		'js/models/myappsPage.js',
		'js/models/changeLoginEmailConfirmPage.js',
		'js/models/changeLoginEmailPage.js',
		'js/models/modal_avatarPage.js',
		'js/models/loginPage.js',
		'js/models/privateModePage.js',
		'js/models/buyCreditsPage.js',
		'js/models/toolsPage.js',
		'js/models/mybillingPage.js',
		'js/models/mycreditsPage.js',
		'js/models/inboxPage.js',
		'js/models/twofactorPage.js',
		'js/models/activerenPage.js',
		'js/models/pwdresetenPage.js',
		'js/models/registerPage.js',
		'js/models/pwdvergetenPage.js',
		'js/models/bevestigenPage.js',
		'js/models/lockPage.js',
		'js/models/action_changeAccountPage.js',
		'js/models/notFoundPage.js'
	]; 
	var toRefreshList_css = ['css/admin.css'];
    var scripts = document.getElementsByTagName('script');
	var styles = document.getElementsByTagName('link');
	
	var key = new Date().getTime();
    
	for(var i = 0; i < scripts.length; i++) {
        var aScript = scripts[i];
        for(var j = 0; j < toRefreshList_js.length; j++) {
            var toRefresh = toRefreshList_js[j];
            if(aScript.src && (aScript.src.indexOf(toRefresh) > -1)) {
                new_src = aScript.src.replace(toRefresh, toRefresh + '?v=' + key);
               // console.log('Force refresh on cached script files. From: ' + aScript.src + ' to ' + new_src)
                aScript.src = new_src;
            }
        }
    }
	
	  for(var i = 0; i < styles.length; i++) {
		var aStyles = styles[i];
		for(var j = 0; j < toRefreshList_css.length; j++) {
			var toRefreshS = toRefreshList_css[j];
			if(aStyles.href && (aStyles.href.indexOf(toRefreshS) > -1)) {
				new_href = aStyles.href.replace(toRefreshS, toRefreshS + '?v=' + key);
				//console.log('Force refresh on cached css files. From: ' + aStyles.href + ' to ' + new_href)
				aStyles.href = new_href;
			}
		}
	}	
} // end fncRefreshFiles

// function to replace old CSS/JS files (array of files)
function fncRefreshFilesAdmin(){  		
	//replace files	    	
    var toRefreshList_js_admin = 
	[	baseURL+'js/wb_constants.js', 		
		baseURL+'js/custom/wb_utils.js', 
		baseURL+'js/custom/wb_data_storage.js',
		baseURL+'js/custom/wb_accountInfo.js', 
		baseURL+'js/models/adminHomePage.js',
		baseURL+'js/models/profilePage.js',
		baseURL+'js/models/buyAppsPage.js',
		baseURL+'js/models/myappsPage.js',
		baseURL+'js/models/changeLoginEmailConfirmPage.js',
		baseURL+'js/models/changeLoginEmailPage.js',
		baseURL+'js/models/modal_avatarPage.js',
		baseURL+'js/models/loginPage.js',
		baseURL+'js/models/privateModePage.js',
		baseURL+'js/models/buyCreditsPage.js',
		baseURL+'js/models/toolsPage.js',
		baseURL+'js/models/mybillingPage.js',
		baseURL+'js/models/mycreditsPage.js',
		baseURL+'js/models/inboxPage.js',
		baseURL+'js/models/twofactorPage.js',
		baseURL+'js/models/activerenPage.js',
		baseURL+'js/models/pwdresetenPage.js',
		baseURL+'js/models/registerPage.js',
		baseURL+'js/models/pwdvergetenPage.js',
		baseURL+'js/models/bevestigenPage.js',
		baseURL+'js/models/lockPage.js',
		baseURL+'js/models/action_changeAccountPage.js',		
		baseURL+'admin/js/models/accountsPage.js',
		baseURL+'admin/js/models/appsPage.js',
		baseURL+'admin/js/models/avatarPage.js',
		baseURL+'admin/js/models/contentsPage.js',
		baseURL+'admin/js/models/countriesPage.js',
		baseURL+'admin/js/models/languagePage.js',
		baseURL+'admin/js/models/translationsPage.js',
		baseURL+'admin/js/models/homePage.js',
		baseURL+'js/models/notFoundPage.js'
		
	]; 
	var toRefreshList_css_admin = ['css/admin.css'];
    var scripts = document.getElementsByTagName('script');
	var styles = document.getElementsByTagName('link');
	
	var key = new Date().getTime();
    
	for(var i = 0; i < scripts.length; i++) {
        var aScript = scripts[i];
        for(var j = 0; j < toRefreshList_js_admin.length; j++) {
            var toRefresh = toRefreshList_js_admin[j];
            if(aScript.src && (aScript.src.indexOf(toRefresh) > -1)) {
                new_src = aScript.src.replace(toRefresh, toRefresh + '?ver=' + key);
                 //console.log('Force refresh on cached script files (admin). From: ' + aScript.src + ' to ' + new_src)
                aScript.src = new_src;
            }
        }
    }
	
	  for(var i = 0; i < styles.length; i++) {
		var aStyles = styles[i];
		for(var j = 0; j < toRefreshList_css_admin.length; j++) {
			var toRefreshS = toRefreshList_css_admin[j];
			if(aStyles.href && (aStyles.href.indexOf(toRefreshS) > -1)) {
				new_href = aStyles.href.replace(toRefreshS, toRefreshS + '?ver=' + key);
				//console.log('Force refresh on cached css files. From: ' + aStyles.href + ' to ' + new_href)
				aStyles.href = new_href;
			}
		}
	}	
} // end fncRefreshFiles

// function to remove/replace individual CSS/JS file
function removejscssfile(filename, filetype){
    var targetelement=(filetype=="js")? "script" : (filetype=="css")? "link" : "none" //determine element type to create nodelist from
    var targetattr=(filetype=="js")? "src" : (filetype=="css")? "href" : "none" //determine corresponding attribute to test for
    var allsuspects=document.getElementsByTagName(targetelement)
    for (var i=allsuspects.length; i>=0; i--){ //search backwards within nodelist for matching elements to remove
    if (allsuspects[i] && allsuspects[i].getAttribute(targetattr)!=null && allsuspects[i].getAttribute(targetattr).indexOf(filename)!=-1)
        allsuspects[i].parentNode.removeChild(allsuspects[i]) //remove element by calling parentNode.removeChild()
    }
}// end removejscssfile

// function to scrol to top after form click
var scrollItToTop = function(el, offeset) {
	var pos = (el && el.size() > 0) ? el.offset().top : 0;
	if (el) {             
		pos = pos + (offeset ? offeset : -1 * el.height());
	}		
	$('html,body').animate({
		scrollTop: pos
	}, 'slow');
	// usage 	scrollItToTop($('.bg-master-light'));
};// end scrollToTop		


// function to dynamically loop through form fields for update/insert 
$.fn.formDataToObject = function(frmID){
	var formObj = {}, fields = $(frmID).find(':input').serializeArray();  // $(':input').serializeArray(); 
	//formObj.push({name: 'langcode', value: slangcode,name:'sessionguid', value:ssessionguid,name:'accountid', value: saccountid});
	$.each(fields, function (i, field) {					
		if (this.name  == 'password') { this.value = md5( this.value);} 
		if (formObj[this.name] !== undefined) { 
			if (!formObj[this.name].push) {					
			 formObj[this.name] = [formObj[this.name]];
			}
			formObj[this.name].push(this.value || '');						
		} else {
			formObj[this.name] = this.value || '';					
		}				
	});
	//return JSON.stringify(formObj);
	return formObj;
	//usage   fncChangeAccount($('#change-account-form-billing').formDataToObject('#change-account-form-billing'));
};	//end fn.formDataToObject	

	


// function to remove querystring from URL
function remove_qs(url) {
    var a = document.createElement('a');
    a.href = url;
    a.search = "";
    return a.href;
	//usage remove_qs(url);
} //end remove_qs

// function to load CSS on demand 
function requireCss(url,dev,ver,media) {
	var link = document.createElement("link");
	link.type = "text/css";
	link.rel = "stylesheet";
	media ? link.media = media : '';
	link.href = url+"?bust=" + ((dev)? (new Date()).getTime(): ver);
	document.getElementsByTagName("head")[0].appendChild(link);
	//usage  requireCss("css/login_fix.css", false, "12",'');	
}//end requireCss

// function to sore browser language in session
function getBrowserLanguage(bLang){	
    //  bLang = (bLang).substring(0, 2).toLowerCase();	
	 (bLang === "en") ? bLang = "gb": bLang = bLang; 
	 (typeof bLang === "undefined" || bLang === null) ? store.set("sCountrycode",'gb'): store.set("sCountrycode",(bLang));	
	// usage getBrowserLanguage(window.navigator.userLanguage.substring(0, 2));	
}//end getBrowserLanguage

// function to grab url parameters
function getUrlVars() {
	var vars = {};
	var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
	  vars[key] = value;
	});
	return vars;
	//usage fncChangeLoginEmailAccount(getUrlVars()["guid"]);	  		
}//end getUrlVars
 
// function to lockscreen after session expires
function fncRedirecToLockScreen(sPref, sUrl) {
	localStorage.setItem("storage_referer",window.location.href); 
	var sTime;
	window.onload = resetTimer;// catches onload event
	window.onmousemove = resetTimer;// catches onmousemove event
	window.onmousedown = resetTimer; // catches touchscreen presses
	window.onclick = resetTimer;     // catches touchpad clicks
	window.onscroll = resetTimer;    // catches scrolling with arrow keys
	window.onkeypress = resetTimer;  // catches on keys pressed
	
	function lockMe() {
		window.location.href = sUrl;
	}
	
	function resetTimer() {
		clearTimeout(sTime);
		sTime = setTimeout(lockMe, sPref);  // time is in milliseconds
	}
	
	//usage fncRedirecToLockScreen("20000",baseURL+'#/lock'); redirects to lockscreen after 2sec.			
}//end fncRedirecToLockScreen
  
// function to show OK message if action is OK
function fncDialogFaderOk(sID,sTime,sHeight,sWidth){	  
	$("."+sID).dialog({ 
	autoOpen: false,
	width: sWidth,
    height: sHeight,	
	show: {
        effect: "explode", //explode,slide,puff,drop,blind,clip, fold,scale,size,pulsate
        duration: 1000
      },
      hide: {
        effect: "fade",
        duration: 2000
      },	  
	 create: function (event, ui) {	
		  $(".ui-widget-header").hide();		
	}
	});
	$("."+sID).dialog('open'); 
	$("."+sID).html("<span style='text-align:center;'><i style='color:green!important; font-size:44px;' class='fa fa-check-circle'></i></span>");                
	setTimeout(
		function () {			 
			   $("."+sID).dialog("close");			
	}, sTime);	
	// usage fncDialogFaderOk('sMessageSpan','1000', '100','100'); 
}//end fncDialogFaderOk

// function to show Error message if action is NOT OK
function fncDialogFaderError(sID,sTime, sHeight,sWidth, sMessage){	  
	$("."+sID).dialog({ 
	autoOpen: false,
	width: sWidth,
    height: sHeight,	
	show: {
        effect: "explode", //explode,slide,puff,drop,blind,clip, fold,scale,size,pulsate
        duration: 1000
      },
      hide: {
        effect: "fade",
        duration: 2000
      },	  
	 create: function (event, ui) {	
		  $(".ui-widget-header").hide();		
	}
	});
	$("."+sID).dialog('open'); 
	$("."+sID).html("<span style='text-align:center;'>"+sMessage+"</span>");                
	setTimeout(
		function () {			 
			   $("."+sID).dialog("close");			
	}, sTime);
	// usage fncDialogFaderError('eMessageSpan','1000', '200','200'); 
}//end fncDialogFaderError

// function to show message  on Admin page
function fncDialogFaderAdmin(sID,sMassage,sTime, sTitle, sHeight,sWidth){	
   if(sTitle==true){
	   sHeight = sHeight + 100
   } else {sHeight = sHeight}
	$("#"+sID).dialog({ 
	autoOpen: false,
	width: sWidth,
    height: sHeight,	
	show: {
        effect: "explode", //explode,slide,puff,drop,blind,clip, fold,scale,size,pulsate
        duration: 1000
      },
      hide: {
        effect: "fade",
        duration: 2000
      },	  
	 create: function (event, ui) {
		if (sTitle == false){	
		  $(".ui-widget-header").hide();
		}
	}
	});
	$("#"+sID).dialog('open'); 
	$("#"+sID).html("<h1 style='color:green!important; text-align:center;'>" + sMassage  +"</h1>");                
	setTimeout(
		function () {			 
			   $("#"+sID).dialog("close");			
	}, sTime);
}//end fncDialogFaderAdmin

// function to show modal dialog containing avatar and pictures to Crop
function fncSetImageCanvasAvatar(sPicToCrop, sDialog, sInput, sHidden, imageOutput, imageOutput2, imageRev, imgSrc, sWidth, sHeight) {
	var inputFile = document.getElementById(sPicToCrop); //'customerpictureToCrop'
	inputFile.addEventListener('click', function() {
		this.value = null;
	}, false);
	inputFile.addEventListener('change', readData, false);		
	function readData(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		var objFile = evt.dataTransfer !== undefined ? evt.dataTransfer.files[0] : evt.target.files[0];
		// Create variables (in this scope) to hold the Jcrop API and image size
		var jcrop_api, boundx, boundy;
		// hide all errors
		$('.error').hide();
		// check for image type (jpg and png are allowed)		
		var rFilter = /^(image\/jpeg|image\/png|image\/gif)$/i;
		if (!rFilter.test(objFile.type)) {				
			$('.error').html('Only jpg,gif and png are allowed').show();
		return;
		}	
		// check for file size
		if (objFile.size > 1950 * 2024) {					
			$('.error').html('Please select a smaller image file').show();
		return;
		}	
		if (objFile === '') {
			$('.error').html('Please select image file').show();
		return;
		}
			
		var reader = new FileReader();
		reader.onload = (function(theFile) {
			$("#" + sDialog).dialog({
				//dialogClass: 'DynamicDialogStyle',
				autoOpen: false,
				modal: true,
				width: 450,
				height: 400,
				//position: 'center',		
				closeOnEscape: false,
				buttons: {
					"Upload": function() {
						$(this).dialog("close");
					},
					"Cancel": function() {
						$(this).dialog("close");
					}
				}
			});
			/*$("#" + sDialog).modal({show:true});*/
			$('#' + imageOutput).css("display", "block");	
			$('#' + imageOutput2).css("display", "block");		
			$("#" + sDialog).dialog("open"); //imageUploadDialog	
			return function(e) {
				var image = new Image();
				image.src = e.target.result;
				image.onload = function(e) {
					var canvas = document.createElement('canvas');
					canvas.width = 350;
					canvas.height = image.height * (300 / image.width);
					var ctx = canvas.getContext('2d');
					ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
					$('#' + sInput).html(['<img src="', canvas.toDataURL(), '"/>'].join('')); //image_input		
					//$('#'+sHidden).val(canvas.toDataURL());//image_input_hidden
					var img = $('#' + sInput + ' img')[0]; //image_input
					var canvas = document.createElement('canvas');							
						
					$('#' + sInput + ' img').Jcrop({ //image_input
						trackDocument: true,							
						onSelect: imgSelect,
						onChange: imgSelect,	
						bgColor:     'black',
						bgOpacity:   .4,
						setSelect:   [ 100, 100, 50, 50 ],
						/*aspectRatio: 16 / 9	,								
						minSize: [32, 32], 
						bgFade: true,
						bgOpacity: .3,     
						boxWidth: 500, 
						boxHeight: 500,
						aspectRatio: 1,							
						onSelect: imgSelect,
						onChange: imgSelect,*/
					});		
					function imgSelect(selection) {
						$('#x').val(selection.x);
						$('#y').val(selection.y);
						$('#w').val(selection.w);
						$('#h').val(selection.h);
						canvas.width = sWidth; //120;
						canvas.height = sHeight;
						var ctx = canvas.getContext('2d');
						ctx.drawImage(img, selection.x, selection.y, selection.w, selection.h, 0, 0, canvas.width, canvas.height);
						$('#' + imageOutput).attr('src', canvas.toDataURL()); //image_output	
						$('#' + imageOutput2).attr('src', canvas.toDataURL()); //image_output			
						$('#' + imageRev).attr('src', canvas.toDataURL()); //image_outputrev
						$('#' + imgSrc).text(canvas.toDataURL()); //image_source
						$('#' + sHidden).val(canvas.toDataURL()); //image_input_hidden
					}
				}
			}
		})(objFile);
		reader.readAsDataURL(objFile);
	}
	// usage  fncSetImageCanvasAvatar('customerpictureToCrop', 'imageUploadDialog', 'image_input', 'image_input_hidden', 'image_output', 'image_output2','image_outputrev', 'image_source', '200', '200');    
}//end fncSetImageCanvasAvatar			

// function to show modal dialog containing avatar and pictures to Crop
function fncSetImageCanvasAdmin(sPicToCrop,sDialog,sInput,sHidden,imageOutput,imageRev,imgSrc, sWidth, sHeight){		
	var inputFile = document.getElementById(sPicToCrop);//'customerpictureToCrop'
	inputFile.addEventListener('click', function() {this.value = null;}, false);
	inputFile.addEventListener('change', readData, false);
	
	function readData(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		var objFile = evt.dataTransfer !== undefined ? evt.dataTransfer.files[0] : evt.target.files[0];
		// Create variables (in this scope) to hold the Jcrop API and image size
		var jcrop_api, boundx, boundy;
		// hide all errors
		$('.error').hide();
		// check for image type (jpg and png are allowed)
		var rFilter = /^(image\/jpeg|image\/png|image\/gif)$/i;
		if (!rFilter.test(objFile.type)) {				
			$('.error').html('Only jpg and png are allowed').show();
		return;
		}	
		// check for file size
		if (objFile.size > 1950 * 2024) {					
			$('.error').html('Please select a smaller image file').show();
		return;
		}	
		if (objFile === '') {
			$('.error').html('Please select image file').show();
		return;
		}
	
	var reader = new FileReader();
	reader.onload = (function(theFile) {	
		$("#"+sDialog).dialog({
			//dialogClass: 'DynamicDialogStyle',
			autoOpen: false,
			modal: true,
			width: 450,
			height: 450,
			//position: 'center',		
			closeOnEscape: false,
			buttons: {
				"Upload": function() {
					$(this).dialog("close");
				},
				"Cancel": function() {
					$(this).dialog("close");
				}
			}
		}); 
		$('#'+imageOutput).css("display","block");	
	
		$("#"+sDialog).dialog("open"); //imageUploadDialog	
		return function(e) {
			var image = new Image();
			image.src = e.target.result;
			image.onload = function(e) {			
			var canvas = document.createElement('canvas');
			canvas.width = 400;
			canvas.height = image.height * (400 / image.width);
			var ctx = canvas.getContext('2d');
			ctx.drawImage(image, 0, 0, canvas.width, canvas.height); 
			$('#'+sInput).html(['<img src="', canvas.toDataURL(), '"/>'].join(''));//image_input
			
			//$('#'+sHidden).val(canvas.toDataURL());//image_input_hidden
			var img = $('#'+sInput +' img')[0];//image_input
			var canvas = document.createElement('canvas');
		
		$('#'+sInput+  ' img').Jcrop({//image_input
	     	trackDocument: true,
			//bgColor: 'black',
			//bgOpacity: .1,
			//setSelect: [50, 50, 100, 100],
			//aspectRatio: 1,
			onSelect: imgSelect,
			onChange: imgSelect,
			//minSize: [100, 100],
			//maxSize: [500, 500]
    	});
	
	function imgSelect(selection) {
		canvas.width = sWidth;//120;
		canvas.height = sHeight;			
		var ctx = canvas.getContext('2d');
		ctx.drawImage(img, selection.x, selection.y, selection.w, selection.h, 0, 0, canvas.width, canvas.height);	
			$('#'+imageOutput).attr('src', canvas.toDataURL());//image_output			
			$('#'+imageRev).attr('src', canvas.toDataURL());//image_outputrev
			$('#'+imgSrc).text(canvas.toDataURL());//image_source
			$('#'+sHidden).val(canvas.toDataURL());//image_input_hidden
	   }
	 }
	}
   })(objFile);
	 reader.readAsDataURL(objFile);
   }	
   // usage  fncSetImageCanvasAdmin('customerpictureToCrop', 'imageUploadDialog', 'image_input', 'image_input_hidden', 'image_output', 'image_output2','image_outputrev', 'image_source', '200', '200');    
}//end 	fncSetImageCanvasAdmin
 
// function to show modal dialog containing avatar and pictures to Crop
function fncSetImageCanvas(sPicToCrop, sDialog, sInput, sHidden, imageOutput, imageOutput2, imageRev, imgSrc, sWidth, sHeight) {
	var inputFile = document.getElementById(sPicToCrop); //'customerpictureToCrop'
	inputFile.addEventListener('click', function() {
		this.value = null;
	}, false);
	inputFile.addEventListener('change', readData, false);		
	function readData(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		var objFile = evt.dataTransfer !== undefined ? evt.dataTransfer.files[0] : evt.target.files[0];
		// Create variables (in this scope) to hold the Jcrop API and image size
		var jcrop_api, boundx, boundy;
		// hide all errors
		$('.error').hide();
		// check for image type (jpg and png are allowed)		
		var rFilter = /^(image\/jpeg|image\/png|image\/gif)$/i;
		if (!rFilter.test(objFile.type)) {				
			$('.error').html('Only jpg,gif and png are allowed').show();
		return;
		}	
		// check for file size
		if (objFile.size > 1950 * 2024) {					
			$('.error').html('Please select a smaller image file').show();
		return;
		}	
		if (objFile === '') {
			$('.error').html('Please select image file').show();
		return;
		}
			
		var reader = new FileReader();
		reader.onload = (function(theFile) {
			$("#" + sDialog).dialog({
				//dialogClass: 'DynamicDialogStyle',
				autoOpen: false,
				modal: true,
				width: 450,
				height: 400,
				//position: 'center',		
				closeOnEscape: false,
				buttons: {
					"Upload": function() {
						$(this).dialog("close");
					},
					"Cancel": function() {
						$(this).dialog("close");
					}
				}
			});
			/*$("#" + sDialog).modal({show:true});*/
			$('#' + imageOutput).css("display", "block");	
			$('#' + imageOutput2).css("display", "block");		
			$("#" + sDialog).dialog("open"); //imageUploadDialog	
			return function(e) {
				var image = new Image();
				image.src = e.target.result;
				image.onload = function(e) {
					var canvas = document.createElement('canvas');
					canvas.width = 350;
					canvas.height = image.height * (300 / image.width);
					var ctx = canvas.getContext('2d');
					ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
					$('#' + sInput).html(['<img src="', canvas.toDataURL(), '"/>'].join('')); //image_input		
					//$('#'+sHidden).val(canvas.toDataURL());//image_input_hidden
					var img = $('#' + sInput + ' img')[0]; //image_input
					var canvas = document.createElement('canvas');							
						
					$('#' + sInput + ' img').Jcrop({ //image_input
						trackDocument: true,							
						onSelect: imgSelect,
						onChange: imgSelect,	
						bgColor:     'black',
						bgOpacity:   .4,
						setSelect:   [ 100, 100, 50, 50 ],
						/*aspectRatio: 16 / 9	,								
						minSize: [32, 32], 
						bgFade: true,
						bgOpacity: .3,     
						boxWidth: 500, 
						boxHeight: 500,
						aspectRatio: 1,							
						onSelect: imgSelect,
						onChange: imgSelect,*/
					});		
					function imgSelect(selection) {
						$('#x').val(selection.x);
						$('#y').val(selection.y);
						$('#w').val(selection.w);
						$('#h').val(selection.h);
						canvas.width = sWidth; //120;
						canvas.height = sHeight;
						var ctx = canvas.getContext('2d');
						ctx.drawImage(img, selection.x, selection.y, selection.w, selection.h, 0, 0, canvas.width, canvas.height);
						$('#' + imageOutput).attr('src', canvas.toDataURL()); //image_output	
						$('#' + imageOutput2).attr('src', canvas.toDataURL()); //image_output			
						$('#' + imageRev).attr('src', canvas.toDataURL()); //image_outputrev
						$('#' + imgSrc).text(canvas.toDataURL()); //image_source
						$('#' + sHidden).val(canvas.toDataURL()); //image_input_hidden
					}
				}
			}
		})(objFile);
		reader.readAsDataURL(objFile);
	}
	// usage  fncSetImageCanvasAvatar('customerpictureToCrop', 'imageUploadDialog', 'image_input', 'image_input_hidden', 'image_output', 'image_output2','image_outputrev', 'image_source', '200', '200');    
}//end 	fncSetImageCanvas  

// function to show modal dialog containing avatar and pictures to Crop
function fncSetImageCanvas909090(sPicToCrop, sDialog, sInput, sHidden, imageOutput, imageOutput2, imageRev, imgSrc, sWidth, sHeight) {
	 // fncSetImageCanvas('typelogo','imageUploadDialog','image_input','image_input_hidden', 'image_output','image_output2','image_outputrev', 'image_source', '200', '200');
	var inputFile = document.getElementById('typelogo'); //'customerpictureToCrop'
	inputFile.addEventListener('click', function() {
		this.value = null;
	}, false);
	inputFile.addEventListener('change', readData, false);		
	function readData(evt) {
		evt.stopPropagation();
		evt.preventDefault();
		var objFile = evt.dataTransfer !== undefined ? evt.dataTransfer.files[0] : evt.target.files[0];
		// Create variables (in this scope) to hold the Jcrop API and image size
		var jcrop_api, boundx, boundy;
		// hide all errors
		$('.error').hide();
		// check for image type (jpg and png are allowed)		
		var rFilter = /^(image\/jpeg|image\/png|image\/gif)$/i;
		if (!rFilter.test(objFile.type)) {				
			$('.error').html('Only jpg,gif and png are allowed').show();
		return;
		}	
		// check for file size
		if (objFile.size > 1950 * 2024) {					
			$('.error').html('Please select a smaller image file').show();
		return;
		}	
		if (objFile === '') {
			$('.error').html('Please select image file').show();
		return;
		}
			
		var reader = new FileReader();
		reader.onload = (function(theFile) {
			$("#imageUploadDialog").dialog({
				//dialogClass: 'DynamicDialogStyle',
				autoOpen: false,
				modal: true,
				width: 450,
				height: 400,
				//position: 'center',		
				closeOnEscape: false,
				buttons: {
					"Upload": function() {
						$(this).dialog("close");
					},
					"Cancel": function() {
						$(this).dialog("close");
					}
				}
			});
			/*$("#" + sDialog).modal({show:true});*/
			$('#image_output').css("display", "block");	
			$('#image_output2').css("display", "block");		
			$("#imageUploadDialog").dialog("open"); //imageUploadDialog	
			return function(e) {
				var image = new Image();
				image.src = e.target.result;
				image.onload = function(e) {
					var canvas = document.createElement('canvas');
					canvas.width = 350;
					canvas.height = image.height * (300 / image.width);
					var ctx = canvas.getContext('2d');
					ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
					$('#image_input').html(['<img src="', canvas.toDataURL(), '"/>'].join('')); //image_input		
					//$('#'+sHidden).val(canvas.toDataURL());//image_input_hidden
					var img = $('#image_input img')[0]; //image_input
					var canvas = document.createElement('canvas');							
						
					$('#image_input img').Jcrop({ //image_input
						trackDocument: true,							
						onSelect: imgSelect,
						onChange: imgSelect,	
						bgColor:     'black',
						bgOpacity:   .4,
						setSelect:   [ 100, 100, 50, 50 ],
						/*aspectRatio: 16 / 9	,								
						minSize: [32, 32], 
						bgFade: true,
						bgOpacity: .3,     
						boxWidth: 500, 
						boxHeight: 500,
						aspectRatio: 1,							
						onSelect: imgSelect,
						onChange: imgSelect,*/
					});		
					function imgSelect(selection) {
						$('#x').val(selection.x);
						$('#y').val(selection.y);
						$('#w').val(selection.w);
						$('#h').val(selection.h);
						canvas.width = '200'; //120;
						canvas.height = '200';
						var ctx = canvas.getContext('2d');
						ctx.drawImage(img, selection.x, selection.y, selection.w, selection.h, 0, 0, canvas.width, canvas.height);
						$('#image_output').attr('src', canvas.toDataURL()); //image_output	
						$('#image_output2').attr('src', canvas.toDataURL()); //image_output			
						$('#image_outputrev').attr('src', canvas.toDataURL()); //image_outputrev
						$('#image_source').text(canvas.toDataURL()); //image_source
						$('#image_input_hidden').val(canvas.toDataURL()); //image_input_hidden
					}
				}
			}
		})(objFile);
		reader.readAsDataURL(objFile);
	}
	// usage  fncSetImageCanvasAvatar('customerpictureToCrop', 'imageUploadDialog', 'image_input', 'image_input_hidden', 'image_output', 'image_output2','image_outputrev', 'image_source', '200', '200');    
}//end 	fncSetImageCanvas  