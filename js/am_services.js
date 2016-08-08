/**
 * AMS Web service interface. 
 *  @author Kinfu Assefa
 */				
var absService = new absServices();

function absServices(){	
	this.processSuccess = function(data, status, req) {
		if (status == "success"){
			$("#response").text($(req.responseXML).find("HelloResult").text());
		}l
	};		
	this.processError = function(data, status, req) {
		$("#response").html(req.responseText + " " + status);
	};  
     /**
	 * checkLogin function. Get the services response and handle it with the 
	 * provided callback. This is enabled via the following assignment:
	 * xmlhttp.onreadystatechange=callback(data);
	 * @param form
	 */	
	this.checkLogin = function(sOrg, sUser, sPass){	
		var isOK = false;	
		restURL = (sessionStorage.amsserviceURL==undefined) ? restURL : switchAmsservicet(sessionStorage.amsserviceURL); 				
		var soapBody =
			[ '<?xml version="1.0" encoding="utf-8"?>'
			,  "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ser=\"http://www.login.absentiemanager.nl/service2\">"
			,  "<soapenv:Header/>"
			,   '<soapenv:Body>'
			,     '<ser:CheckLogin>'
			,       '<ser:login>'
			,         '<ser:Organization>'+sOrg+'</ser:Organization>'
			,         '<ser:Username>'+sUser+'</ser:Username>'
			,         '<ser:Password>'+sPass+'</ser:Password>'			
			,       '</ser:login>'
			,     '</ser:CheckLogin>'
			,   '</soapenv:Body>'
			, '</soapenv:Envelope>'
			].join('');		
	
		  $.ajax({  
			type: "POST",
			url: restURL+"AMS.Service2.cls",	
			async: false,	
			cache: false,			
			data: soapBody,			
			contentType: 'text/xml; charset=utf-8',
			headers: {		
				SOAPAction: 'http://www.login.absentiemanager.nl/service2/AMS.Service2.CheckLogin'
			},
		   success: function(data, status, req){			
			if (status == "success"){  
			  if($.xml2json(data).Body.CheckLoginResponse.CheckLoginResult.errorSpecified == 'false'){
				 isOK = true;
			  } else {				
				 $('#login_response').html("Oops...: "+  $.xml2json(data).Body.CheckLoginResponse.CheckLoginResult.errorMessage).css({"color": "rgb(255, 0, 0)","border": "1px solid #251f1","padding": "5px", "font-size": "14px", "background-color": "#fff", "width": "15%", "margin": "10px", "border-radius": "10px"});
				 isOK = false; 
			  }				
			}
		   },
		   error: function(data, status, req){
				isOK = false;  
				$('#login_response').html("Oops...: "+  req.responseText + " " + status).css({"color": "rgb(255, 0, 0)","border": "1px solid #251f1","padding": "5px", "font-size": "14px", "background-color": "#fff", "width": "15%", "margin": "10px", "border-radius": "10px"});
				//console.log(req.responseText + " " + status);
		 }
		});   
		return isOK; 
	};			
	/**
	 * Get the list of employees matching the provided parameters. 
	 * to process the returned soap result.
	 */
	this.getEmployeeList = function (sOrg, sUser, sPass){
		restURL = (sessionStorage.amsserviceURL==undefined) ? restURL : switchAmsservicet(sessionStorage.amsserviceURL); 	
		$.support.cors = true;	
		var soapBody =
			[ '<?xml version="1.0" encoding="utf-8"?>'
			,  "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:ser=\"http://www.login.absentiemanager.nl/service2\">"
			,  "<soapenv:Header/>"
			,   '<soapenv:Body>'
			,     '<ser:GetEmployeeList>'
			,       '<ser:login>'
			,         '<ser:Organization>'+sOrg+'</ser:Organization>'
			,         '<ser:Username>'+sUser+'</ser:Username>'
			,         '<ser:Password>'+sPass+'</ser:Password>'			
			,       '</ser:login>'
			,        '<ser:filter></ser:filter>'			
			,     '</ser:GetEmployeeList>'
			,   '</soapenv:Body>'
			, '</soapenv:Envelope>'
			].join('');		
	
		 $.ajax({  
			type: "POST",
			url: restURL+"AMS.Service2.cls",	
			async: false,	
			cache: false,			
			data: soapBody,			
			contentType: 'text/xml; charset=utf-8',
			headers: {		
				SOAPAction: 'http://www.login.absentiemanager.nl/service2/AMS.Service2.GetEmployeeList'
		   },
			success: function(data, status, req){ 																   
					//$('#submitbtn').show();	
					// Hide Gif Spinning Rotator
					//$('#ajax_loading').hide();  	
					if(status == "success") {  // LOGIN OK? 							
						if($.xml2json(data).Body.GetEmployeeListResponse.GetEmployeeListResult.errorSpecified == 'true'){						
							$('#login_response').html("Error");
						} else {	
						   var sTypedEmployeeList = $.xml2json(data).Body.GetEmployeeListResponse.GetEmployeeListResult.employees.TypedEmployeeList;
						   if (!jQuery.isArray(sTypedEmployeeList)) sTypedEmployeeList = [sTypedEmployeeList];					
														 		   
							store.set("AbsEmployeeListStorageKey", sTypedEmployeeList);							 
							localStorage.setItem("storage_LoggedOut_am_emp",false);								
							store.set("session_Org_am_emp", window.btoa(unescape(encodeURIComponent( sOrg )))); 
							store.set("session_User_am_emp",window.btoa(unescape(encodeURIComponent( sUser ))));
							store.set("session_Pass_am_emp",window.btoa(unescape(encodeURIComponent( sPass ))));	 
							store.set("session_eLanguage",'1');						
							var login_response = '<div id="logged_in">' +
							'<div style="text-align: center; margin-left: 10px; background-color: #65b0f3;border-radius: 8px;padding:10px;color:#fff">' + 						
							'<img  align="middle"  src="images/ajax-loader.gif"><br/>' +						
							"U bent succesvol ingelogd! <br /> Een moment geduld aub - bezig met laden...</div>"; 
							
							$('#loginform').hide();
						
							$('#login_response').html(login_response);				
							setTimeout(function() {			
								window.location.href =  baseURL+'#/dashboard';	
							}, 4000);		
						}	
					} else {  // ERROR? 
						$('#loginform').show(); 				
						$('#login_response').html(status);
					}        
			     //ajaxComplete			   
			    },//success
			   error: function(data, status, req){
			    $('#login_response').html(req.responseText + " " + status);	
				$('#loginform').show(); 		
			  }// error			  
			});    
			// -- End AJAX Call --
			return false;
	  };  
	  
	 this.getRoleList = function (sOrg, sUser, sPass){	
	    restURL = (sessionStorage.amsserviceURL==undefined) ? restURL : switchAmsservicet(sessionStorage.amsserviceURL); 			
		var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"  xmlns:ser="http://www.login.absentiemanager.nl/service2">'+
		'<soapenv:Header/>'+
		'<soapenv:Body>'+
		'<ser:GetRoleList>'+		
			'<ser:login>'+
			'<ser:Organization>'+sOrg+'</ser:Organization>'+	
			'<ser:Username>'+sUser+'</ser:Username>'+	
			'<ser:Password>'+sPass+'</ser:Password>'+				
			'</ser:login>'+		
		'</ser:GetRoleList>'+
		'</soapenv:Body></soapenv:Envelope>';		
		 $.ajax({  
			type: "POST",
			url: restURL+"AMS.Service2.cls",	
			async: false,	
			cache: false,			
			data: xml,			
			contentType: 'text/xml; charset=utf-8',
			headers: {		
				SOAPAction: 'http://www.login.absentiemanager.nl/service2/AMS.Service2.GetRoleList'
		   },
			success: function(data, status, req){ 		
				if(status == "success") {  // LOGIN OK? 			
					if($.xml2json(data).Body.GetRoleListResponse.GetRoleListResult.errorSpecified == 'true'){						
						$('#login_response').html("Error");
					} else {	
				  	  store.set("AbsRoleListStorageKey", $.xml2json(data).Body.GetRoleListResponse.GetRoleListResult);	
					   /* <SL10>true</SL10>
						<SL15>true</SL15>
						<SL20>true</SL20>
						<SL30>true</SL30>
						<SL50>true</SL50>
						<SL70>true</SL70>
						<SL97>false</SL97>
						<SL99>false</SL99>
						<SL100>false</SL100>*/
					  store.set("AbsRoleListRolsStorageKey", $.xml2json(data).Body.GetRoleListResponse.GetRoleListResult.roles);
						/*<TypedRoleList>
						<Item>C100</Item>
						<Access>Y</Access>
						</TypedRoleList>
						<TypedRoleList>
						<Item>C101</Item>
						<Access>Y</Access>
						</TypedRoleList>
                       */
					}
				} else {  // ERROR? 
				  $('#login_response').html("Error");  
				}        
			     //ajaxComplete			   
			    },//success
			   error: function(data, status, req){
				 $('#login_response').html("Error"+ req);	
			  }// error			  
			});    
			// -- End AJAX Call --
			return false;			
	};// -- End getRoleList --
	

	this.getEmployeeDetails= function (sOrg, sUser, sPass, empId){ 	
	   restURL = (sessionStorage.amsserviceURL==undefined) ? restURL : switchAmsservicet(sessionStorage.amsserviceURL); 		
			var sTable ='', xml = '<?xml version="1.0" encoding="utf-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"  xmlns:ser="http://www.login.absentiemanager.nl/service2">'+
			'<soapenv:Header/>'+
			'<soapenv:Body>'+
			'<ser:GetEmployeeData>'+		
			'<ser:login>'+
			'<ser:Organization>'+sOrg+'</ser:Organization>'+	
			'<ser:Username>'+sUser+'</ser:Username>'+	
			'<ser:Password>'+sPass+'</ser:Password>'+				
			'</ser:login>'+				
			'<ser:id>'+empId+'</ser:id>'+	//125630
			'</ser:GetEmployeeData>'+
			'</soapenv:Body></soapenv:Envelope>';		
			$.ajax({  
				type: "POST",
					url: restURL+"AMS.Service2.cls",	
					async: false,	
					cache: false,			
					data: xml,			
					contentType: 'text/xml; charset=utf-8',
				headers: {		
					SOAPAction: 'http://www.login.absentiemanager.nl/service2/AMS.Service2.GetEmployeeData'
				},
				success: function(data, status, req){ 		
					if(status == "success") {  // LOGIN OK? 			
						if($.xml2json(data).Body.GetEmployeeDataResponse.GetEmployeeDataResult.errorSpecified == 'true'){						
							$('#login_response').html("Oops");
						} else {							
						 sTable +=  '<table style="width:48%;float:left">';
						var empData = $.xml2json(data).Body.GetEmployeeDataResponse.GetEmployeeDataResult.data,
					    verzData = $.xml2json(data).Body.GetEmployeeDataResponse.GetEmployeeDataResult.sickHistory;	
						
						var sPic;		
						
						(empData.Gender == "2") ? sPic= 'images/mdw_male.png' :  sPic= 'images/mdw_female.png';							
											
						sTable += "<tr><td colspan='2' style='border-bottom:1pt solid black;'>Naam</td></tr>";
						//sTable += "<tr><td colspan='2' style='border-bottom:1pt solid black;'>" + empData.photoUrl === undefined ? "<img class=\"img-responsive img-thumbnail\" title='" + empData.displayName + "'  style=\"width:100px; height:auto;margin-right: 10px; display:inline\" src='" + sPic + "'/>" : "<img class=\"img-responsive img-thumbnail\" alt='" + empData.displayName + "'  style=\"width:100px; height:auto; margin-right: 10px; display:inline\" src='" + empData.PhotoUrl + "'/>"+ "</td></tr>";			
						console.log(empData.PhotoUrl);
						empData.PhotoUrl.length == 0 ? sTable += "<tr><td colspan='2'><img class=\"img-responsive img-thumbnail\"  style=\"width:100px; height:auto;margin-right: 10px; display:inline\" src='" + sPic + "'/></td></tr>" :	 sTable +="<tr><td colspan='2' ><img class=\"img-responsive img-thumbnail\" alt='" + empData.displayName + "'  style=\"width:100px; height:auto; margin-right: 10px; display:inline\" src='" +empData.PhotoUrl + "'/></td></tr>";							
						empData.Title.length == 0 ? sTable += "" : sTable += "<tr><td>Aanhef</td><td>" + empData.Title +"</td></tr>";
						empData.Initials.length == 0  ? sTable += "" : sTable += "<tr><td>Initialen</td><td>" + empData.Initials +"</td></tr>";	
						empData.Firstname.length == 0 ? sTable += "" : sTable += "<tr><td>Voornaam</td><td>" + empData.Firstname +"</td></tr>";						
						empData.Prefix.length == 0 ? sTable += "" : sTable += "<tr><td>Voorvoegsel</td><td>" + empData.Prefix +"</td></tr>";
						empData.Lastname.length == 0 ? sTable += "" : sTable += "<tr><td>Lastname</td><td>" + empData.Lastname +"</td></tr>";						
						empData.NickName.length == 0 ? sTable += "" : sTable += "<tr><td>Roepnaam</td><td>" + empData.NickName +"</td></tr>";
						empData.Title.length == 0 ? sTable += "" : sTable += "<tr><td>Titel</td><td>" + empData.Title +"</td></tr>";
						
						sTable += "<tr><td colspan='2' style='border-bottom:1pt solid black;'>Partner/Familie</td></tr>";	
							
						empData.Partner_firstname.length == 0 ? sTable += "" : sTable += "<tr><td>Voornaam partner</td><td>" + empData.Partner_firstname +"</td></tr>";						
						empData.Partner_prefix.length == 0 ? sTable += "" : sTable += "<tr><td>Voorvoegsel</td><td>" + empData.Partner_prefix +"</td></tr>";
						empData.Partner_lastname.length == 0 ? sTable += "" : sTable += "<tr><td>Achternaam partner</td><td>" + empData.Partner_lastname +"</td></tr>";				
						empData.Emergency_Contact.length == 0 ? sTable += "" : sTable += "<tr><td>Contact bij calamiteiten</td><td>" + empData.Emergency_Contact +"</td></tr>";
						empData.Emergency_PhoneNr.length == 0 ? sTable += "" : sTable += "<tr><td>Telefoon (calamiteiten)</td><td>" + empData.Emergency_PhoneNr +"</td></tr>";
						
						sTable += "<tr style='border-bottom:1pt solid black;'><td colspan='2' style='border-bottom:1pt solid black;'>Medewerker ID</td></tr>";	
						empData.Code.length == 0 ? sTable += "" : sTable += "<tr><td>Medewerker code</td><td>" + empData.Code +"</td></tr>";
						empData.Id.length == 0 ? sTable += "" : sTable += "<tr><td>Medewerker ID</td><td>" + empData.Id +"</td></tr>";
						
						sTable += "<tr style='border-bottom:1pt solid black;'><td colspan='2' style='border-bottom:1pt solid black;'>Verzuimhistorie</td></tr>";										
										
						if (typeof(verzData) !== "undefined"){											
							if (verzData.TypedSickHistoryList !== undefined){	 
								// If a single object is returned, wrap it in an array							
								if (!jQuery.isArray(verzData.TypedSickHistoryList)) verzData.TypedSickHistoryList = [verzData.TypedSickHistoryList];								
								$.each(verzData.TypedSickHistoryList, function(key, val){	
								     var eDate = (typeof(val.endDate)=== 'undefined') ? "---" : val.endDate;								
									sTable += "<tr><td>"+ val.startDate +"</td><td>"+ eDate +"</td></tr>";								
								}); 
							} else {
							  //console.log(verzData.TypedSickHistoryList);							
							}
						}	
						sTable += '</table>';						
						sTable +='<table style="width:48%;float:right">';
			            sTable += "<tr><td colspan='2' style='border-bottom:1pt solid black;'>Contactinformatie</td></tr>";
					 	empData.Street.length == 0 ? sTable += "" : sTable += "<tr><td>Straat</td><td>" + empData.Street +"</td></tr>";
						empData.Housenr.length == 0 ? sTable += "" : sTable += "<tr><td>Huisnummer</td><td>" + empData.Housenr +"</td></tr>";
						empData.Housenrsuffix.length == 0 ? sTable += "" : sTable += "<tr><td>Toevoeging</td><td>" + empData.Housenrsuffix +"</td></tr>";
						empData.Postalcode.length == 0 ? sTable += "" : sTable += "<tr><td>Postcode</td><td>" + empData.Postalcode +"</td></tr>";
						empData.City.length == 0 ? sTable += "" : sTable += "<tr><td>Plaats</td><td>" + empData.City +"</td></tr>";
						empData.Country.length == 0 ? sTable += "" : sTable += "<tr><td>Land</td><td>" + empData.Country +"</td></tr>";
						empData.Telephonenr.length == 0 ? sTable += "" : sTable += "<tr><td>Telefoon (privé)</td><td>" + empData.Telephonenr +"</td></tr>";
						empData.WorkTelephonenr.length == 0 ? sTable += "" : sTable += "<tr><td>Telefoon (werk)</td><td>" + empData.WorkTelephonenr +"</td></tr>";
						empData.Mobilenr.length == 0 ? sTable += "" : sTable += "<tr><td>Mobiel</td><td>" + empData.Mobilenr +"</td></tr>";
						
						empData.Email.length == 0 ? sTable += "" : sTable += "<tr><td>Primair e-mailadres</td><td>" + empData.Email +"</td></tr>";
						empData.EmailSecondary.length == 0 ? sTable += "" : sTable += "<tr><td>Secundair e-mailadres</td><td>" + empData.EmailSecondary +"</td></tr>";
						
						sTable += "<tr><td colspan='2' style='border-bottom:1pt solid black;'>Persoonlijke informatie</td></tr>";
						empData.Gender.length == 0 ? sTable += "" : sTable += "<tr><td>M/V</td><td>" + empData.Gender +"</td></tr>";
						empData.Maritalstatus_id.length == 0 ? sTable += "" : sTable += "<tr><td>Burgelijke stand</td><td>" + empData.Maritalstatus_id +"</td></tr>";
						empData.Birthdate.length == 0 ? sTable += "" : sTable += "<tr><td>Geboortedatum</td><td>" + empData.Birthdate +"</td></tr>";
						empData.Sofinr.length == 0 ? sTable += "" : sTable += "<tr><td>BSN</td><td>" + empData.Sofinr +"</td></tr>";
						empData.Nationality.length == 0 ? sTable += "" : sTable += "<tr><td>Nationaliteit</td><td>" + empData.Nationality +"</td></tr>";
						
						sTable += '</table>';							
						/*<Prefix/><Address><Startdate>	<Department_Id><DepartmentName><Company_Id><CompanyName><FunctionName/>
						<LocationName/> <Salutation><Clamourname><Faxnr/><Hoursperweek><External_ref/><Spouse/><DisplayName><displayname_code>1</displayname_code>
						<EndReason/> <Salary><is_manager>true</is_manager><manager_id><Manager2Active><Manager3Active><Permanent_Employment><VangnetStatus><PhotoUrl><ContractType/>*/				
					 }
					} else {  // ERROR? 
						$('#login_response').html("Oops");  
					}        
					//ajaxComplete			   
				},//success
				error: function(data, status, req){
					$('#login_response').html("Oops:"+ req);	
				}// error		
			});				
			return sTable;
      };// -- End getEmployeeDetails --		
	
	
	this.getFunctionList = function (sOrg, sUser, sPass, nameFilter, companyFilter){   		
		var xml = '<?xml version="1.0" encoding="utf-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"  xmlns:ser="http://www.login.absentiemanager.nl/service2">'+
		'<soapenv:Header/>'+
		'<soapenv:Body>'+
		'<ser:GetFunctionList>'+		
			'<ser:login>'+
			'<ser:Organization>'+sOrg+'</ser:Organization>'+	
			'<ser:Username>'+sUser+'</ser:Username>'+	
			'<ser:Password>'+sPass+'</ser:Password>'+				
			'</ser:login>'+	
			'<ser:filter>';
			if (nameFilter.length > 0){
				xml +='<ser:name>'+nameFilter+'</ser:name>';
			}
			if (companyFilter.length > 0){
				xml +='<ser:companyName>'+companyFilter+'</ser:companyName>';
			}    
			xml +='</ser:filter>'+		
		'</ser:GetFunctionList>'+
		'</soapenv:Body></soapenv:Envelope>';		
		 $.ajax({  
			type: "POST",
			url: restURL+"AMS.Service2.cls",	
			async: false,	
			cache: false,			
			data: xml,			
			contentType: 'text/xml; charset=utf-8',
			headers: {		
				SOAPAction: 'http://www.login.absentiemanager.nl/service2/AMS.Service2.GetFunctionList'
		   },
			success: function(data, status, req){ 		
				if(status == "success") {  // LOGIN OK? 			
					if($.xml2json(data).Body.GetFunctionListResponse.GetFunctionListResult.errorSpecified == 'true'){						
						$('#login_response').html("Oops");
					} else {	
					store.set("AbsFunctionListStorageKey", $.xml2json(data).Body.GetFunctionListResponse.GetFunctionListResult.functions);						 
						/*
						<TypedFunctionList>
						<ID>70350</ID>
						<name>Teamleider 5</name>
						<companyId>1732</companyId>
						<companyName>4 ESTHER BV DEMO</companyName>
						</TypedFunctionList>
						*/	
					}
				} else {  // ERROR? 
				  $('#login_response').html("Oops");  
				}        
			     //ajaxComplete			   
			    },//success
			   error: function(data, status, req){
				 $('#login_response').html("Oops:"+ req);	
			  }// error			  
			});    
			// -- End AJAX Call --
			return false;			
	};// -- End getFunctionList --
	
	this.getDepartmentList = function (sOrg, sUser, sPass, nameFilter, companyFilter){   		
		var xml = '<?xml version="1.0" encoding="utf-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"  xmlns:ser="http://www.login.absentiemanager.nl/service2">'+
		'<soapenv:Header/>'+
		'<soapenv:Body>'+
		'<ser:GetDepartmentList>'+		
			'<ser:login>'+
			'<ser:Organization>'+sOrg+'</ser:Organization>'+	
			'<ser:Username>'+sUser+'</ser:Username>'+	
			'<ser:Password>'+sPass+'</ser:Password>'+				
			'</ser:login>'+	
			'<ser:filter>';
			if (nameFilter.length > 0){
				xml +='<ser:name>'+nameFilter+'</ser:name>';
			}
			if (companyFilter.length > 0){
				xml +='<ser:companyName>'+companyFilter+'</ser:companyName>';
			}    
			xml +='</ser:filter>'+		
		'</ser:GetDepartmentList>'+
		'</soapenv:Body></soapenv:Envelope>';		
		 $.ajax({  
			type: "POST",
			url: restURL+"AMS.Service2.cls",	
			async: false,	
			cache: false,			
			data: xml,			
			contentType: 'text/xml; charset=utf-8',
			headers: {		
				SOAPAction: 'http://www.login.absentiemanager.nl/service2/AMS.Service2.GetDepartmentList'
		   },
			success: function(data, status, req){ 		
				if(status == "success") {  // LOGIN OK? 			
					if($.xml2json(data).Body.GetDepartmentListResponse.GetDepartmentListResult.errorSpecified == 'true'){						
						$('#login_response').html("Oops");
					} else {	
					store.set("AbsDepartmentListStorageKey", $.xml2json(data).Body.GetDepartmentListResponse.GetDepartmentListResult.departments);						 
						/*
						<TypedDepartmentList>
						  <ID>29627</ID>
						  <name>hrm4all</name>
						  <companyId>1732</companyId>
						  <companyName>4 ESTHER BV DEMO</companyName>
						</TypedDepartmentList>
						*/	
					}
				} else {  // ERROR? 
				  $('#login_response').html("Oops");  
				}        
			     //ajaxComplete			   
			    },//success
			   error: function(data, status, req){
				 $('#login_response').html("Oops:"+ req);	
			  }// error			  
			});    
			// -- End AJAX Call --
			return false;			
	};// -- End getDepartmentList --
		
	this.getLocationList = function (sOrg, sUser, sPass, nameFilter, companyFilter){   		
		var xml = '<?xml version="1.0" encoding="utf-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"  xmlns:ser="http://www.login.absentiemanager.nl/service2">'+
		'<soapenv:Header/>'+
		'<soapenv:Body>'+
		'<ser:GetLocationList>'+		
			'<ser:login>'+
			'<ser:Organization>'+sOrg+'</ser:Organization>'+	
			'<ser:Username>'+sUser+'</ser:Username>'+	
			'<ser:Password>'+sPass+'</ser:Password>'+				
			'</ser:login>'+	
			'<ser:filter>';
			if (nameFilter.length > 0){
				xml +='<ser:name>'+nameFilter+'</ser:name>';
			}
			if (companyFilter.length > 0){
				xml +='<ser:companyName>'+companyFilter+'</ser:companyName>';
			}    
			xml +='</ser:filter>'+		
		'</ser:GetLocationList>'+
		'</soapenv:Body></soapenv:Envelope>';		
		 $.ajax({  
			type: "POST",
			url: restURL+"AMS.Service2.cls",	
			async: false,	
			cache: false,			
			data: xml,			
			contentType: 'text/xml; charset=utf-8',
			headers: {		
				SOAPAction: 'http://www.login.absentiemanager.nl/service2/AMS.Service2.GetLocationList'
		   },
			success: function(data, status, req){ 		
				if(status == "success") {  // LOGIN OK? 			
					if($.xml2json(data).Body.GetLocationListResponse.GetLocationListResult.errorSpecified == 'true'){						
						$('#login_response').html("Oops");
					} else {	
					store.set("AbsLocationListStorageKey", $.xml2json(data).Body.GetLocationListResponse.GetLocationListResult.locations);						 
						/*
						<TypedLocationList>
						  <ID>29627</ID>
						  <name>hrm4all</name>
						  <companyId>1732</companyId>
						  <companyName>4 ESTHER BV DEMO</companyName>
						</TypedLocationList>
						*/	
					}
				} else {  // ERROR? 
				  $('#login_response').html("Oops");  
				}        
			     //ajaxComplete			   
			    },//success
			   error: function(data, status, req){
				 $('#login_response').html("Oops:"+ req);	
			  }// error			  
			});    
			// -- End AJAX Call --
			return false;			
	};// -- End getLocationList --
	
	this.getCauseAndEffects = function (sOrg, sUser, sPass, companyId){   	//1732	
		var xml = '<?xml version="1.0" encoding="utf-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"  xmlns:ser="http://www.login.absentiemanager.nl/service2">'+
		'<soapenv:Header/>'+
		'<soapenv:Body>'+
		'<ser:GetCauseAndEffect>'+		
			'<ser:login>'+
			'<ser:Organization>'+sOrg+'</ser:Organization>'+	
			'<ser:Username>'+sUser+'</ser:Username>'+	
			'<ser:Password>'+sPass+'</ser:Password>'+				
			'</ser:login>'+	
			'<ser:filter>';
			 if (companyId.length > 0){
	    	  xml +='<ser:companyId>'+companyId+'</ser:companyId>';
	   		 }
			xml +='</ser:filter>'+		
		'</ser:GetCauseAndEffect>'+
		'</soapenv:Body></soapenv:Envelope>';		
		 $.ajax({  
			type: "POST",
			url: restURL+"AMS.Service2.cls",	
			async: false,	
			cache: false,			
			data: xml,			
			contentType: 'text/xml; charset=utf-8',
			headers: {		
				SOAPAction: 'http://www.login.absentiemanager.nl/service2/AMS.Service2.GetCauseAndEffect'
		   },
			success: function(data, status, req){ 		
				if(status == "success") {  // LOGIN OK? 			
					if($.xml2json(data).Body.GetCauseAndEffectResponse.GetCauseAndEffectResult.errorSpecified == 'true'){						
						$('#login_response').html("Oops");
					} else {	
					store.set("AbsCauseAndEffectStorageKey", $.xml2json(data).Body.GetCauseAndEffectResponse.GetCauseAndEffectResult.causeAndEffects);						 
						/*
						<TypedCauseAndEffectList>
						  <ID>29627</ID>
						  <name>Niet meer vast te stellen</name>
						  <type>C</type>
						  <sequence>1</sequence>
						</TypedCauseAndEffectList>
						*/	
					}
				} else {  // ERROR? 
				  $('#login_response').html("Oops");  
				}        
			     //ajaxComplete			   
			    },//success
			   error: function(data, status, req){
				 $('#login_response').html("Oops:"+ req);	
			  }// error			  
			});    
			// -- End AJAX Call --
			return false;			
	};// -- End getCauseAndEffects --
	
	this.sendPasswordNotifyMail = function (sOrg, sUser){   	
		var xml = '<?xml version="1.0" encoding="utf-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"  xmlns:ser="http://www.login.absentiemanager.nl/service2">'+
		'<soapenv:Header/>'+
		'<soapenv:Body>'+
		'<ser:SendPasswordNotifyMail>'+		
			'<ser:login>'+
			'<ser:Organization>'+sOrg+'</ser:Organization>'+	
			'<ser:Username>'+sUser+'</ser:Username>'+	
			'<ser:Password>-1</ser:Password>'+				
			'</ser:login>'+				
		'</ser:SendPasswordNotifyMail>'+
		'</soapenv:Body></soapenv:Envelope>';		
		 $.ajax({  
			type: "POST",
			url: restURL+"AMS.Service2.cls",	
			async: false,	
			cache: false,			
			data: xml,			
			contentType: 'text/xml; charset=utf-8',
			headers: {		
				SOAPAction: 'http://www.login.absentiemanager.nl/service2/AMS.Service2.SendPasswordNotifyMail'
		   },
			success: function(data, status, req){ 		
				if(status == "success") {  // LOGIN OK? 			
					if($.xml2json(data).Body.SendPasswordNotifyMailResponse.SendPasswordNotifyMailResult.errorSpecified == 'true'){						
						$('#login_response').html("Oops");
					} else {	
					store.set("AbsPasswordNotifyMailStorageKey", $.xml2json(data).Body.SendPasswordNotifyMailResponse.SendPasswordNotifyMailResult.errorMessage);						 
						/*Login gegevens verzonden naar de Helpdesk; neem telefonisch contact op met applicatie beheerder.	*/	
					}
				} else {  // ERROR? 
				  $('#login_response').html("Oops");  
				}        
			     //ajaxComplete			   
			    },//success
			   error: function(data, status, req){
				 $('#login_response').html("Oops:"+ req);	
			  }// error			  
			});    
			// -- End AJAX Call --
			return false;			
	};// -- End sendPasswordNotifyMail --
	  
	
	this.getSickRecord = function (sOrg, sUser, sPass, sId){   
	    restURL = (sessionStorage.amsserviceURL==undefined) ? restURL : switchAmsservicet(sessionStorage.amsserviceURL); 		
		var xml = '<?xml version="1.0" encoding="utf-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"  xmlns:ser="http://www.login.absentiemanager.nl/service2">'+
		'<soapenv:Header/>'+
		'<soapenv:Body>'+
		'<ser:GetSickRecord>'+		
			'<ser:login>'+
			'<ser:Organization>'+sOrg+'</ser:Organization>'+	
			'<ser:Username>'+sUser+'</ser:Username>'+	
			'<ser:Password>'+sPass+'</ser:Password>'+				
			'</ser:login>'+				
			'<ser:id>'+sId+'</ser:id>'+
		  '</ser:GetSickRecord>'+
		'</soapenv:Body></soapenv:Envelope>';
				
		 $.ajax({  
			type: "POST",
			url: restURL+"AMS.Service2.cls",	
			async: false,	
			cache: false,			
			data: xml,			
			contentType: 'text/xml; charset=utf-8',
			headers: {		
				SOAPAction: 'http://www.login.absentiemanager.nl/service2/AMS.Service2.GetSickRecord'
		   },
			success: function(data, status, req){ 		
				if(status == "success") {  // LOGIN OK? 			
					if($.xml2json(data).Body.GetSickRecordResponse.GetSickRecordResult.errorSpecified == 'true'){						
						$('#login_response').html("Oops");
					} else {	
					store.set("AbsSickRecordStorageKey", $.xml2json(data).Body.GetSickRecordResponse.GetSickRecordResult);						 
						/*
						<TypedCauseAndEffectList>
						  <ID>29627</ID>
						  <name>Niet meer vast te stellen</name>
						  <type>C</type>
						  <sequence>1</sequence>
						</TypedCauseAndEffectList>
						*/	
					}
				} else {  // ERROR? 
				  $('#login_response').html("Oops");  
				}        
			     //ajaxComplete			   
			    },//success
			   error: function(data, status, req){
				 $('#login_response').html("Oops:"+ req);	
			  }// error			  
			});    
			// -- End AJAX Call --
			return false;			
	};// -- End getSickRecord -  
	
	/** Get the list of extra options to configure sick registration funtionalities. */
	this.getSickExtras = function (sOrg, sUser, sPass, orgId){   	
		var xml = '<?xml version="1.0" encoding="utf-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"  xmlns:ser="http://www.login.absentiemanager.nl/service2">'+
		'<soapenv:Header/>'+
		'<soapenv:Body>'+
		'<ser:GetSickExtras>'+		
			'<ser:login>'+
			'<ser:Organization>'+sOrg+'</ser:Organization>'+	
			'<ser:Username>'+sUser+'</ser:Username>'+	
			'<ser:Password>'+sPass+'</ser:Password>'+				
			'</ser:login>'+				
			'<ser:organizationId>'+orgId+'</ser:organizationId>'+
		  '</ser:GetSickExtras>'+
		'</soapenv:Body></soapenv:Envelope>';
				
		 $.ajax({  
			type: "POST",
			url: restURL+"AMS.Service2.cls",	
			async: false,	
			cache: false,			
			data: xml,			
			contentType: 'text/xml; charset=utf-8',
			headers: {		
				SOAPAction: 'http://www.login.absentiemanager.nl/service2/AMS.Service2.GetSickExtras'
		   },
			success: function(data, status, req){ 		
				if(status == "success") {  // LOGIN OK? 			
					if($.xml2json(data).Body.GetSickExtrasResponse.GetSickExtrasResult.errorSpecified == 'true'){						
						$('#login_response').html("Oops");
					} else {	
					store.set("AbsSickExtrasStorageKey", $.xml2json(data).Body.GetSickExtrasResponse.GetSickExtrasResult);						 
						/*
						<TypedCauseAndEffectList>
						  <ID>29627</ID>
						  <name>Niet meer vast te stellen</name>
						  <type>C</type>
						  <sequence>1</sequence>
						</TypedCauseAndEffectList>
						*/	
					}
				} else {  // ERROR? 
				  $('#login_response').html("Oops");  
				}        
			     //ajaxComplete			   
			    },//success
			   error: function(data, status, req){
				 $('#login_response').html("Oops:"+ req);	
			  }// error			  
			});    
			// -- End AJAX Call --
			return false;			
	};// -- End getSickExtras -  
	
	
	this.insertBetterRecord = function (sOrg, sUser, sPass, empId, sDate, sComment){  // <ID>125659</ID>
	   restURL = (sessionStorage.amsserviceURL==undefined) ? restURL : switchAmsservicet(sessionStorage.amsserviceURL); 	
		var xml = '<?xml version="1.0" encoding="utf-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"  xmlns:ser="http://www.login.absentiemanager.nl/service2">'+
		'<soapenv:Header/>'+
		'<soapenv:Body>'+
		'<ser:InsertBetterRecord>'+		
			'<ser:login>'+
			'<ser:Organization>'+sOrg+'</ser:Organization>'+	
			'<ser:Username>'+sUser+'</ser:Username>'+	
			'<ser:Password>'+sPass+'</ser:Password>'+				
			'</ser:login>'+				
			'<ser:betterObj>'+
			'   <ser:employeeId>'+empId+'</ser:employeeId>'+
			'   <ser:date>'+sDate+'</ser:date>'+
			'   <ser:comment>'+sComment+'</ser:comment>'+	    
			'</ser:betterObj>'+
		  '</ser:InsertBetterRecord>'+
		'</soapenv:Body></soapenv:Envelope>';
				
		 $.ajax({  
			type: "POST",
			url: restURL+"AMS.Service2.cls",	
			async: false,	
			cache: false,			
			data: xml,			
			contentType: 'text/xml; charset=utf-8',
			headers: {		
				SOAPAction: 'http://www.login.absentiemanager.nl/service2/AMS.Service2.InsertBetterRecord'
		   },
			success: function(data, status, req){ 		
				if(status == "success") {  // LOGIN OK? 
							
					if($.xml2json(data).Body.InsertBetterRecordResponse.InsertBetterRecordResult.errorSpecified == 'true'){					
					
						var loading_response = 	'<div style="margin-bottom:10px; text-align: center; background-color: #F44336;border-radius: 8px;color:#fff">' + 						
							'Fout: <br/>'+ $.xml2json(data).Body.InsertBetterRecordResponse.InsertBetterRecordResult.errorMessage +"</div>"; 
							$('#betterModal').modal('toggle');
							$('#betterModal').data('modal', null);
							//$('#ziekMeldenTable').hide();							
							//$('.modal-header').hide();
							//$('.modal-footer').hide();
					        $('#loading_response').html(loading_response).delay(1000).fadeOut(4000);	
					} else {						
						var loading_response = 	'<div style=" text-align: center; background-color: ##F44336;border-radius: 20px;color:#fff">' + 						
							'<img  align="middle"  src="images/ajax-loader.gif"><br/>' +						
							"Hersteld melden was succesvol! <br /> Een moment geduld aub - bezig met laden...</div>"; 
							//$('#ziekMeldenTable').hide();							
							//$('.modal-header').hide();
							//$('.modal-footer').hide();
							$('#betterModal').modal('toggle');
							$('#betterModal').data('modal', null);
					        $('#loading_response').html(loading_response).delay(1000).fadeOut(4000);											
						     absService.getEmployeeList(sOrg, sUser, sPass);							
							setTimeout(function() {			
								window.location.href =  baseURL+'#/dashboard';	
								$('#loading_response').html('');		
							}, 4000);	 
						
					}
				} else {  // ERROR? 
				  $('#loading_response').html("Oops");  
				  $('#betterModal').modal('toggle');	
				  $('#betterModal').data('modal', null);	
				}        
			     //ajaxComplete			   
			    },//success
			   error: function(data, status, req){
				 $('#loading_response').html("Oops:"+ req);
				 $('#betterModal').modal('toggle');	
				 $('#betterModal').data('modal', null);
			  }// error			  
			});    
			// -- End AJAX Call --
			return false;			
	};// -- End insertBetterRecord -  

	
	this.insertSickRecord = function (sOrg, sUser, sPass){ 	
	   restURL = (sessionStorage.amsserviceURL==undefined) ? restURL : switchAmsservicet(sessionStorage.amsserviceURL); 	
		/*$("#vangnet").prop("checked") ? true : false;*/				 
		var xml = '<?xml version="1.0" encoding="utf-8"?><soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://www.login.absentiemanager.nl/service2">'+		
		'<soapenv:Header/>'+
		'<soapenv:Body>'+		
		    '<ser:InsertSickRecord>'+	      
            '<ser:login>'+	
                '<ser:Organization>'+sOrg+'</ser:Organization>'+	
                '<ser:Username>'+sUser+'</ser:Username>'+	
                '<ser:Password>'+sPass+'</ser:Password>'+	
            '</ser:login>'+	
            '<ser:sick>'+	
                '<ser:id></ser:id>'+	
                '<ser:Employee_Id>'+$("#employeeId").val()+'</ser:Employee_Id>'+ //125673	
                '<ser:Employee_Code>'+$("#employeeCode").val()+'</ser:Employee_Code>'+	//10000016
                '<ser:illness_start_date>'+$("#illnessStartdate").val()+'</ser:illness_start_date>'+	//2016-06-29
                '<ser:sickstatus>'+$("#sickStatus").val()+'</ser:sickstatus>'+	//100
                '<ser:vangnet>'+$("#vangnet").val()+'</ser:vangnet>'+//false
                '<ser:periods>'+	
                    '<ser:SickPeriodRecord>'+	
                        '<ser:id></ser:id>'+	
                        '<ser:sickId></ser:sickId>'+	
                        '<ser:Employee_Id>'+$("#employeeId").val()+'</ser:Employee_Id>'+	
                        '<ser:Employee_Code>'+$("#employeeCode").val()+'</ser:Employee_Code>'+	
                        '<ser:period_start_date>'+$("#illnessStartdate").val()+'</ser:period_start_date>'+	
                        '<ser:sickstatus>'+$("#sickStatus").val()+'</ser:sickstatus>'+	
                    '</ser:SickPeriodRecord>'+	
                '</ser:periods>';	
                if( $("#comment").val() && $("#comment").val()!=null){xml+='<ser:comment>'+$("#comment").val()+'</ser:comment>';}	
                if( $("#responsible3rd").val() && $("#responsible3rd").val()!=null){xml+='<ser:responsible3rd>'+$("#responsible3rd").val()+'</ser:responsible3rd>';}	
                if( $("#responsible3rd").val() && $("#responsible3rd").val()!=null){xml+='<ser:companyAccident>'+$("#companyAccident").val()+'</ser:companyAccident>';}	
				
				if($("#street2").val() && $("#street2").val()!=null){			
					xml+='	<ser:temporaryAddress>';
					if($("#street1").val() && $("#street1").val()!=null){xml+='<ser:street1>'+$("#street1").val()+'</ser:street1>';}	   
					if($("#housenr").val() && $("#housenr").val()!=null){xml+='<ser:housenr>'+$("#housenr").val()+'</ser:housenr>';}
					if($("#street2").val() && $("#street2").val()!=null){xml+='<ser:street2>'+$("#street2").val()+'</ser:street2>';}
					if($("#zipcode").val() && $("#zipcode").val()!=null){xml+=' <ser:zipcode>'+$("#zipcode").val()+'</ser:zipcode>';}
					if($("#city").val() && $("#city").val()!=null){xml+='<ser:city>'+$("#city").val()+'</ser:city>';}
					if($("#country").val() && $("#country").val()!=null){xml+='<ser:country>'+$("#country").val()+'</ser:country>';}
					if($("#email").val() && $("#email").val()!=null){xml+='<ser:email>'+$("#email").val()+'</ser:email>';}			   
					if($("#tel").val() && $("#tel").val()!=null){xml+='<ser:tel>'+$("#tel").val()+'</ser:tel>';}
					if($("#worktel").val() && $("#worktel").val()!=null){xml+='<ser:worktel>'+$("#worktel").val()+'</ser:worktel>';}
					if($("#telcountrycode").val() && $("#telcountrycode").val()!=null){xml+=' <ser:telcountrycode>'+$("#telcountrycode").val()+'</ser:telcountrycode>';}
					if($("#mobile").val() && $("#mobile").val()!=null){xml+='<ser:mobile>'+$("#mobile").val()+'</ser:mobile>';}
					if($("#fax").val() && $("#fax").val()!=null){xml+='<ser:fax>'+$("#fax").val()+'</ser:fax>';}	   
					if($("#institution").val() && $("#institution").val()!=null){xml+='<ser:institution>'+$("#institution").val()+'</ser:institution>';}
				xml+='	</ser:temporaryAddress>';			
			  }		   
				xml+='</ser:sick>'+         
        '</ser:InsertSickRecord>'+			
		'</soapenv:Body></soapenv:Envelope>';	
		
		 $.ajax({  
			type: "POST",
			url: restURL+"AMS.Service2.cls",	
			async: false,	
			cache: false,			
			data: xml,			
			contentType: 'text/xml; charset=utf-8',
			headers: {		
				SOAPAction: 'http://www.login.absentiemanager.nl/service2/AMS.Service2.InsertSickRecord'
		   },
			success: function(data, status, req){ 		
				if(status == "success") {  // LOGIN OK? 			
					if($.xml2json(data).Body.InsertSickRecordResponse.InsertSickRecordResult.errorSpecified == 'true'){						
						var loading_response = 	'<div style="margin-bottom:10px; text-align: center; background-color: #F44336;border-radius: 8px;color:#fff">' + 						
							'Fout: <br/>'+ $.xml2json(data).Body.InsertSickRecordResponse.InsertSickRecordResult.errorMessage +"</div>"; 
							//$('#ziekMeldenTable').hide();							
							//$('.modal-header').hide();
							//$('.modal-footer').hide();
							$('#sickModal').modal('toggle');
					        $('#loading_response').html(loading_response).delay(1000).fadeOut(4000);	
					  } else {	
					
				    	var loading_response = 	'<div style=" text-align: center; background-color: #65b0f3;border-radius: 8px;color:#fff">' + 						
						'<img  align="middle"  src="images/ajax-loader.gif"><br/>' +						
						"Ziekmelden was succesvol! <br /> Een moment geduld aub - bezig met laden...</div>"; 
						//$('#ziekMeldenTable').hide();							
							//$('.modal-header').hide();
							//$('.modal-footer').hide();
						$('#sickModal').modal('toggle');
						$('#loading_response').html(loading_response).delay(1000).fadeOut(4000);		
								
						 absService.getEmployeeList(sOrg, sUser, sPass);								 
						
						setTimeout(function() {			
							window.location.href =  baseURL+'#/dashboard';	
							$('#loading_response').html('');		
						}, 4000);				
			
					}
				} else {  // ERROR? 
				  $('#login_response').html("Oops");
				  $('#sickModal').modal('toggle');  
				}        
			     //ajaxComplete			   
			    },//success
			   error: function(data, status, req){
				 $('#login_response').html("Oops:"+ req);
				 $('#sickModal').modal('toggle');	
			  }// error			  
			});    
			// -- End AJAX Call --
			return false;			
	};// -- End insertSickRecord -	
		
	this.insertSickPeriodRecord = function (sOrg, sUser, sPass, sickId, employeeCode, employeeId, noticeDate, periodStartdate, periodEnddate, sickStatus){  // <ID>125659</ID>
		var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"  xmlns:ser="http://www.login.absentiemanager.nl/service2">'+
		'<soapenv:Header/>'+
		'<soapenv:Body>'+
		'<ser:InsertSickPeriodRecord>'+		
			'<ser:login>'+
			'<ser:Organization>'+sOrg+'</ser:Organization>'+	
			'<ser:Username>'+sUser+'</ser:Username>'+	
			'<ser:Password>'+sPass+'</ser:Password>'+				
			'</ser:login>'+				
		    '<ser:sickPeriod>'+
	    '      	<ser:id></ser:id>'+
	    '      	<ser:sickId>'+sickId+'</ser:sickId>'+
	    '      	<ser:Employee_Id>'+employeeId+'</ser:Employee_Id>'+
	    '      	<ser:Employee_Code>'+employeeCode+'</ser:Employee_Code>';
	    if(noticeDate && noticeDate!=null){xml+='	<ser:noticedate>'+noticeDate+'</ser:noticedate>';}
	    if(periodStartdate && periodStartdate!=null){xml+='      	<ser:period_start_date>'+periodStartdate+'</ser:period_start_date>';}
	    if(periodEnddate && periodEnddate!=null){xml+='      	<ser:period_end_date>'+periodEnddate+'</ser:period_end_date>';}
	    if(sickStatus && sickStatus!=null){xml+='      	<ser:sickstatus>'+sickStatus+'</ser:sickstatus>';}    
	    xml+='</ser:sickPeriod>'+
	    '</ser:InsertSickPeriodRecord>'+
		'</soapenv:Body></soapenv:Envelope>';
				
		 $.ajax({  
			type: "POST",
			url: restURL+"AMS.Service2.cls",	
			async: false,	
			cache: false,			
			data: xml,			
			contentType: 'text/xml; charset=utf-8',
			headers: {		
				SOAPAction: 'http://www.login.absentiemanager.nl/service2/AMS.Service2.InsertSickPeriodRecord'
		   },
			success: function(data, status, req){ 		
				if(status == "success") {  // LOGIN OK? 			
					if($.xml2json(data).Body.InsertSickPeriodRecordResponse.InsertSickPeriodRecordResult.errorSpecified == 'true'){						
						$('#login_response').html("Oops");
					} else {	
					store.set("AbsSickExtrasStorageKey", $.xml2json(data).Body.InsertSickPeriodRecordResponse.InsertBetterRecordResult);						 
						/*
						<updatedSickId>125659||711549</updatedSickId>
						<updatedSickPeriodId>125659||711549||1</updatedSickPeriodId>
						*/	
					}
				} else {  // ERROR? 
				  $('#login_response').html("Oops");  
				}        
			     //ajaxComplete			   
			    },//success
			   error: function(data, status, req){
				 $('#login_response').html("Oops:"+ req);	
			  }// error			  
			});    
			// -- End AJAX Call --
			return false;			
	};// -- End insertSickPeriodRecord -  
	
	this.insertAddressChangeRecord = function (sOrg, sUser, sPass, sickId, address){  // <ID>125659</ID>
		var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"  xmlns:ser="http://www.login.absentiemanager.nl/service2">'+
		'<soapenv:Header/>'+
		'<soapenv:Body>'+
		'<ser:InsertAddressChangeRecord>'+		
			'<ser:login>'+
			'<ser:Organization>'+sOrg+'</ser:Organization>'+	
			'<ser:Username>'+sUser+'</ser:Username>'+	
			'<ser:Password>'+sPass+'</ser:Password>'+				
			'</ser:login>'+				
		   '<ser:addressObj>';
		xml+='<ser:sickId>'+sickId+'</ser:sickId>';
	    var addr = address;
	    xml+='   <ser:address>';
		if($("#street1").val() && $("street1").val()!=null){xml+='    	<ser:street1>'+$("#street1").val()+'</ser:street1>';}
		if($("#housenr").val() && $("#housenr").val()!=null){xml+='    	<ser:housenr>'+$("#housenr").val()+'</ser:housenr>';}
		if($("#street2").val() && $("#street2").val()!=null){xml+='    	<ser:street2>'+$("#street2").val()+'</ser:street2>';}
		if($("#zipcode").val() && $("#zipcode").val()!=null){xml+='    	<ser:zipcode>'+$("#zipcode").val()+'</ser:zipcode>';}
		if($("#city").val() && $("#city").val()!=null){xml+='    	<ser:city>'+$("#city").val()+'</ser:city>';}
		if($("#country").val() && $("#country").val()!=null){xml+='    	<ser:country>'+$("#country").val()+'</ser:country>';}
		if($("#email").val() && $("#email").val()!=null){xml+='    	<ser:email>'+$("#email").val()+'</ser:email>';}
		if($("#tel").val() && $("#tel").val()!=null){xml+='    	<ser:tel>'+$("#tel").val()+'</ser:tel>';}
		if($("#worktel").val() && $("#worktel").val()!=null){xml+='   		<ser:worktel>'+$("#worktel").val()+'</ser:worktel>';}
		if($("#telcountrycode").val() && $("#telcountrycod").val()!=null){xml+='    	<ser:telcountrycode>'+$("#telcountrycode").val()+'</ser:telcountrycode>';}
		if($("#mobile").val() && $("#mobile").val()!=null){xml+='    	<ser:mobile>'+$("#mobile").val()+'</ser:mobile>';}
		if($("#fax").val() && $("#fax").val()!=null){xml+='    	<ser:fax>'+$("#fax").val()+'</ser:fax>';}
		if($("#nstitution").val() && $("#institution").val()!=null){xml+=' <ser:institution>'+$("#institution").val()+'</ser:institution>';}
        xml+='</ser:address>';     
	    xml+='</ser:addressObj>'+
	    '</ser:InsertAddressChangeRecord>'+
		'</soapenv:Body></soapenv:Envelope>';
				
		 $.ajax({  
			type: "POST",
			url: restURL+"AMS.Service2.cls",	
			async: false,	
			cache: false,			
			data: xml,			
			contentType: 'text/xml; charset=utf-8',
			headers: {		
				SOAPAction: 'http://www.login.absentiemanager.nl/service2/AMS.Service2.InsertAddressChangeRecord'
		   },
			success: function(data, status, req){ 		
				if(status == "success") {  // LOGIN OK? 			
					if($.xml2json(data).Body.InsertAddressChangeRecordResponse.InsertAddressChangeRecordResult.errorSpecified == 'true'){						
						//$('#login_response').html("Oops");
					} else {	
					//store.set("AbsSickExtrasStorageKey", $.xml2json(data).Body.InsertAddressChangeRecordResponse.InsertBetterRecordResult);						 
						/*
						<updatedSickId>125659||711549</updatedSickId>
						<updatedSickPeriodId>125659||711549||1</updatedSickPeriodId>
						*/	
					}
				} else {  // ERROR? 
				  $('#login_response').html("Oops");  
				}        
			     //ajaxComplete			   
			    },//success
			   error: function(data, status, req){
				 $('#login_response').html("Oops:"+ req);	
			  }// error			  
			});    
			// -- End AJAX Call --
			return false;			
	};// -- End insertAddressChangeRecord - 
	
	
	
	 this.GetDepartmentList = function (sOrg, sUser, sPass){			
		var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"  xmlns:ser="http://www.login.absentiemanager.nl/service2">'+
		'<soapenv:Header/>'+
		'<soapenv:Body>'+
		'<ser:GetDepartmentList>'+		
			'<ser:login>'+
			'<ser:Organization>'+sOrg+'</ser:Organization>'+	
			'<ser:Username>'+sUser+'</ser:Username>'+	
			'<ser:Password>'+sPass+'</ser:Password>'+				
			'</ser:login>'+		
		'</ser:GetDepartmentList>'+
		'</soapenv:Body></soapenv:Envelope>';		
		 $.ajax({  
			type: "POST",
			url: restURL+"AMS.Service2.cls",	
			async: false,	
			cache: false,			
			data: xml,			
			contentType: 'text/xml; charset=utf-8',
			headers: {		
				SOAPAction: 'http://www.login.absentiemanager.nl/service2/AMS.Service2.GetDepartmentList'
		   },
		   success: function(data, status, req){ 		
				if(status == "success") {  // LOGIN OK? 			
					if($.xml2json(data).Body.GetDepartmentListResponse.GetDepartmentListResult.errorSpecified == 'true'){						
						$('#login_response').html("Error");
					} else {	
				  	  store.set("AbsDepartmentListStorageKey", $.xml2json(data).Body.GetDepartmentListResponse.departments);	
					   /* <TypedDepartmentList>
						  <ID>29627</ID>
                          <name>hrm4all</name>
                          <companyId>1732</companyId>
                          <companyName>4 ESTHER BV DEMO</companyName>
						</TypedDepartmentList>*/					
					}
				} else {  // ERROR? 
				  $('#login_response').html("Error");  
				}        
			     //ajaxComplete			   
			    },//success
			   error: function(data, status, req){
				 $('#login_response').html("Error"+ req);	
			  }// error			  
			});    
			// -- End AJAX Call --
			return false;			
	};// -- End GetDepartmentList --
	
	 this.GetServiceProviders = function (sOrg, sUser, sPass, empId){			
		var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"  xmlns:ser="http://www.login.absentiemanager.nl/service2">'+
		'<soapenv:Header/>'+
		'<soapenv:Body>'+
		'<ser:GetServiceProviders>'+		
			'<ser:login>'+
			'<ser:Organization>'+sOrg+'</ser:Organization>'+	
			'<ser:Username>'+sUser+'</ser:Username>'+	
			'<ser:Password>'+sPass+'</ser:Password>'+				
			'</ser:login>'+	
			'<ser:employeeId>'+empId+'</ser:employeeId>'+		
		'</ser:GetServiceProviders>'+
		'</soapenv:Body></soapenv:Envelope>';		
		 $.ajax({  
			type: "POST",
			url: restURL+"AMS.Service2.cls",	
			async: false,	
			cache: false,			
			data: xml,			
			contentType: 'text/xml; charset=utf-8',
			headers: {		
				SOAPAction: 'http://www.login.absentiemanager.nl/service2/AMS.Service2.GetServiceProviders'
		   },
		   success: function(data, status, req){ 		
				if(status == "success") {  // LOGIN OK? 			
						if($.xml2json(data).Body.GetServiceProvidersResponse.GetServiceProvidersResult.errorSpecified == 'true'){						
							$('#login_response').html("Error");
						} else {	
						  store.set("AbsServiceProvidersStorageKey", $.xml2json(data).Body.GetServiceProvidersResponse.GetServiceProvidersResult);	
						   /* */					
						}
					} else {  // ERROR? 
					  $('#login_response').html("Error");  
					}        
			     //ajaxComplete			   
			    },//success
			   error: function(data, status, req){
				 $('#login_response').html("Error"+ req);	
			  }// error			  
			});    
			// -- End AJAX Call --
			return false;			
	};// -- End GetServiceProviders --
	
	
	this.InsertEmployee = function (sOrg, sUser, sPass){			
		var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"  xmlns:ser="http://www.login.absentiemanager.nl/service2">'+
		'<soapenv:Header/>'+
		'<soapenv:Body>'+		
		'<ser:InsertEmployee>'+		
			'<ser:login>'+
			'<ser:Organization>'+sOrg+'</ser:Organization>'+	
			'<ser:Username>'+sUser+'</ser:Username>'+	
			'<ser:Password>'+sPass+'</ser:Password>'+				
			'</ser:login>'+	
			'<ser:employee>'+				
				'<ser:Id>'+$("#Id").val()+'</ser:Id>'+
				'<ser:Code>'+$("#Code").val()+'</ser:Code>'+
				'<ser:Initials>'+$("#Initials").val()+'</ser:Initials>'+			
				'<ser:Title>'+$("#Title").val()+'</ser:Title>'+			
				'<ser:Prefix>'+$("#Prefix").val()+'</ser:Prefix>'+			
				'<ser:Firstname>'+$("#Firstname").val()+'</ser:Firstname>'+
				'<ser:Lastname>'+$("#Lastname").val()+'</ser:Lastname>'+			
				'<ser:Street>'+$("#Street").val()+'</ser:Street>'+		
				'<ser:Housenr>'+$("#Housenr").val()+'</ser:Housenr>'+			
				'<ser:Housenrsuffix>'+$("#Housenrsuffix").val()+'</ser:Housenrsuffix>'+			
				'<ser:Postalcode>'+$("#Postalcode").val()+'</ser:Postalcode>'+			
				'<ser:City>'+$("#City").val()+'</ser:City>	'+		
				'<ser:Address>'+$("#Address").val()+'</ser:Address>'+
				'<ser:Birthdate>'+$("#Birthdate").val()+'</ser:Birthdate>'+			
				'<ser:Telephonenr>'+$("#Telephonenr").val()+'</ser:Telephonenr>'+			
				'<ser:WorkTelephonenr>'+$("#WorkTelephonenr").val()+'</ser:WorkTelephonenr>'+
				'<ser:Gender>'+$("#Gender").val()+'</ser:Gender>	'+		
				'<ser:Sofinr>'+$("#Sofinr").val()+'</ser:Sofinr>'+			
				'<ser:Email>'+$("#Email").val()+'</ser:Email>'+			
				'<ser:EmailSecondary>'+$("#EmailSecondary").val()+'</ser:EmailSecondary>'+
				'<ser:Startdate>'+$("#Startdate").val()+'</ser:Startdate>'+			
				'<ser:Department_Id>'+$("#Department_Id").val()+'</ser:Department_Id>'+			
				'<ser:DepartmentName>'+$("#DepartmentName").val()+'</ser:DepartmentName>'+
				'<ser:Company_Id>'+$("#Company_Id").val()+'</ser:Company_Id>	'+		
				'<ser:CompanyName>'+$("#CompanyName").val()+'</ser:CompanyName>'+			
				'<ser:Function_Id>'+$("#Function_Id").val()+'</ser:Function_Id>'+			
				'<ser:FunctionName>'+$("#FunctionName").val()+'</ser:FunctionName>	'+		
				'<ser:Location_Id>'+$("#Location_Id").val()+'</ser:Location_Id>'+			
				'<ser:LocationName>'+$("#LocationName").val()+'</ser:LocationName>	'+		
				'<ser:Maritalstatus_id>'+$("#Maritalstatus_id").val()+'</ser:Maritalstatus_id>	'+		
				'<ser:Salutation>'+$("#Salutation").val()+'</ser:Salutation>	'+		
				'<ser:Clamourname>'+$("#Clamourname").val()+'</ser:Clamourname>'+			
				'<ser:Faxnr>'+$("#Faxnr").val()+'</ser:Faxnr>'+
				'<ser:Country>'+$("#Country").val()+'</ser:Country>'+			
				'<ser:Hoursperweek>'+$("#Hoursperweek").val()+'</ser:Hoursperweek>	'+		
				'<ser:Enddate>'+$("#Enddate").val()+'</ser:Enddate>'+			
				'<ser:External_ref>'+$("#External_ref").val()+'</ser:External_ref>	'+		
				'<ser:Spouse>'+$("#Spouse").val()+'</ser:Spouse>	'+		
				'<ser:Nationality>'+$("#Nationality").val()+'</ser:Nationality>'+			
				'<ser:NickName>'+$("#NickName").val()+'</ser:NickName>	'+		
				'<ser:DisplayName>'+$("#DisplayName").val()+'</ser:DisplayName>	'+		
				'<ser:Partner_prefix>'+$("#Partner_prefix").val()+'</ser:Partner_prefix>	'+		
				'<ser:Partner_firstname>'+$("#Partner_firstname").val()+'</ser:Partner_firstname>	'+		
				'<ser:Partner_lastname>'+$("#Partner_lastname").val()+'</ser:Partner_lastname>	'+		
				'<ser:displayname_code>'+$("#displayname_code").val()+'</ser:displayname_code>	'+		
				'<ser:Hours_monday>'+$("#Hours_monday").val()+'</ser:Hours_monday>	'+		
				'<ser:Hours_tuesday>'+$("#Hours_tuesday").val()+'</ser:Hours_tuesday>'+			
				'<ser:Hours_wednesday>'+$("#Hours_wednesday").val()+'</ser:Hours_wednesday>'+			
				'<ser:Hours_thursday>'+$("#Hours_thursday").val()+'</ser:Hours_thursday>	'+		
				'<ser:Hours_friday>'+$("#Hours_friday").val()+'</ser:Hours_friday>'+
				'<ser:Hours_saturday>'+$("#Hours_saturday").val()+'</ser:Hours_saturday>	'+		
				'<ser:Hours_sunday>'+$("#Hours_sunday").val()+'</ser:Hours_sunday>	'+		
				'<ser:EndReason>'+$("#EndReason").val()+'</ser:EndReason>	'+		
				'<ser:EndContract>'+$("#EndContract").val()+'</ser:EndContract>	'+		
				'<ser:EndTemporaryContract>'+$("#EndTemporaryContract").val()+'</ser:EndTemporaryContract>	'+	
				'<ser:Mobilenr>'+$("#Mobilenr").val()+'</ser:Mobilenr>	'+		
				'<ser:Salary>'+$("#Salary").val()+'</ser:Salary>	'+		
				'<ser:is_manager>'+$("#is_manager").val()+'</ser:is_manager>	'+		
				'<ser:manager_id>'+$("#manager_id").val()+'</ser:manager_id>'+			
				'<ser:manager2_id>'+$("#manager2_id").val()+'</ser:manager2_id>'+			
				'<ser:manager3_id>'+$("#manager3_id").val()+'</ser:manager3_id>	'+		
				'<ser:Manager2Active>'+$("#Manager2Active").val()+'</ser:Manager2Active>	'+		
				'<ser:Manager3Active>'+$("#Manager3Active").val()+'</ser:Manager3Active>	'+		
				'<ser:Permanent_Employment>'+$("#Permanent_Employment").val()+'</ser:Permanent_Employment>	'+		
				'<ser:Emergency_Contact>'+$("#Emergency_Contact").val()+'</ser:Emergency_Contact>	'+		
				'<ser:Emergency_PhoneNr>'+$("#Emergency_PhoneNr").val()+'</ser:Emergency_PhoneNr>	'+		
				'<ser:VangnetStatus>'+$("#VangnetStatus").val()+'</ser:VangnetStatus>	'+		
				'<ser:PhotoUrl>'+$("#PhotoUrl").val()+'</ser:PhotoUrl>	'+	
				'<ser:ContractType>'+$("#ContractType").val()+'</ser:ContractType>	'+				
			'</ser:employee>'+		
		'</ser:InsertEmployee>'+
		'</soapenv:Body></soapenv:Envelope>';		
		 $.ajax({  
			type: "POST",
			url: restURL+"AMS.Service2.cls",	
			async: false,	
			cache: false,			
			data: xml,			
			contentType: 'text/xml; charset=utf-8',
			headers: {		
				SOAPAction: 'http://www.login.absentiemanager.nl/service2/AMS.Service2.InsertEmployee'
		   },
		   success: function(data, status, req){ 		
				if(status == "success") {  // LOGIN OK? 			
						if($.xml2json(data).Body.InsertEmployeeResponse.InsertEmployeeResult.errorSpecified == 'true'){						
							$('#login_response').html("Error");
						} else {	
						  //store.set("AbsServiceProvidersStorageKey", $.xml2json(data).Body.GetServiceProvidersResponse.GetServiceProvidersResult);	
						   /* */					
						}
					} else {  // ERROR? 
					  $('#login_response').html("Error");  
					}        
			     //ajaxComplete			   
			    },//success
			   error: function(data, status, req){
				 $('#login_response').html("Error"+ req);	
			  }// error			  
			});    
			// -- End AJAX Call --
			return false;			
	};// -- End InsertEmployee --
	
	
	this.UpdateEmployee = function (sOrg, sUser, sPass,empID){			
		var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"  xmlns:ser="http://www.login.absentiemanager.nl/service2">'+
		'<soapenv:Header/>'+
		'<soapenv:Body>'+		
		'<ser:UpdateEmployee>'+		
			'<ser:login>'+
			'<ser:Organization>'+sOrg+'</ser:Organization>'+	
			'<ser:Username>'+sUser+'</ser:Username>'+	
			'<ser:Password>'+sPass+'</ser:Password>'+				
			'</ser:login>'+	
			'<ser:employee>'+				
				'<ser:Id>'+empID+'</ser:Id>'+
				'<ser:Code>'+$("#Code").val()+'</ser:Code>'+
				'<ser:Initials>'+$("#Initials").val()+'</ser:Initials>'+			
				'<ser:Title>'+$("#Title").val()+'</ser:Title>'+			
				'<ser:Prefix>'+$("#Prefix").val()+'</ser:Prefix>'+			
				'<ser:Firstname>'+$("#Firstname").val()+'</ser:Firstname>'+
				'<ser:Lastname>'+$("#Lastname").val()+'</ser:Lastname>'+			
				'<ser:Street>'+$("#Street").val()+'</ser:Street>'+		
				'<ser:Housenr>'+$("#Housenr").val()+'</ser:Housenr>'+			
				'<ser:Housenrsuffix>'+$("#Housenrsuffix").val()+'</ser:Housenrsuffix>'+			
				'<ser:Postalcode>'+$("#Postalcode").val()+'</ser:Postalcode>'+			
				'<ser:City>'+$("#City").val()+'</ser:City>	'+		
				'<ser:Address>'+$("#Address").val()+'</ser:Address>'+
				'<ser:Birthdate>'+$("#Birthdate").val()+'</ser:Birthdate>'+			
				'<ser:Telephonenr>'+$("#Telephonenr").val()+'</ser:Telephonenr>'+			
				'<ser:WorkTelephonenr>'+$("#WorkTelephonenr").val()+'</ser:WorkTelephonenr>'+
				'<ser:Gender>'+$("#Gender").val()+'</ser:Gender>	'+		
				'<ser:Sofinr>'+$("#Sofinr").val()+'</ser:Sofinr>'+			
				'<ser:Email>'+$("#Email").val()+'</ser:Email>'+			
				'<ser:EmailSecondary>'+$("#EmailSecondary").val()+'</ser:EmailSecondary>'+
				'<ser:Startdate>'+$("#Startdate").val()+'</ser:Startdate>'+			
				'<ser:Department_Id>'+$("#Department_Id").val()+'</ser:Department_Id>'+			
				'<ser:DepartmentName>'+$("#DepartmentName").val()+'</ser:DepartmentName>'+
				'<ser:Company_Id>'+$("#Company_Id").val()+'</ser:Company_Id>	'+		
				'<ser:CompanyName>'+$("#CompanyName").val()+'</ser:CompanyName>'+			
				'<ser:Function_Id>'+$("#Function_Id").val()+'</ser:Function_Id>'+			
				'<ser:FunctionName>'+$("#FunctionName").val()+'</ser:FunctionName>	'+		
				'<ser:Location_Id>'+$("#Location_Id").val()+'</ser:Location_Id>'+			
				'<ser:LocationName>'+$("#LocationName").val()+'</ser:LocationName>	'+		
				'<ser:Maritalstatus_id>'+$("#Maritalstatus_id").val()+'</ser:Maritalstatus_id>	'+		
				'<ser:Salutation>'+$("#Salutation").val()+'</ser:Salutation>	'+		
				'<ser:Clamourname>'+$("#Clamourname").val()+'</ser:Clamourname>'+			
				'<ser:Faxnr>'+$("#Faxnr").val()+'</ser:Faxnr>'+
				'<ser:Country>'+$("#Country").val()+'</ser:Country>'+			
				'<ser:Hoursperweek>'+$("#Hoursperweek").val()+'</ser:Hoursperweek>	'+		
				'<ser:Enddate>'+$("#Enddate").val()+'</ser:Enddate>'+			
				'<ser:External_ref>'+$("#External_ref").val()+'</ser:External_ref>	'+		
				'<ser:Spouse>'+$("#Spouse").val()+'</ser:Spouse>	'+		
				'<ser:Nationality>'+$("#Nationality").val()+'</ser:Nationality>'+			
				'<ser:NickName>'+$("#NickName").val()+'</ser:NickName>	'+		
				'<ser:DisplayName>'+$("#DisplayName").val()+'</ser:DisplayName>	'+		
				'<ser:Partner_prefix>'+$("#Partner_prefix").val()+'</ser:Partner_prefix>	'+		
				'<ser:Partner_firstname>'+$("#Partner_firstname").val()+'</ser:Partner_firstname>	'+		
				'<ser:Partner_lastname>'+$("#Partner_lastname").val()+'</ser:Partner_lastname>	'+		
				'<ser:displayname_code>'+$("#displayname_code").val()+'</ser:displayname_code>	'+		
				'<ser:Hours_monday>'+$("#Hours_monday").val()+'</ser:Hours_monday>	'+		
				'<ser:Hours_tuesday>'+$("#Hours_tuesday").val()+'</ser:Hours_tuesday>'+			
				'<ser:Hours_wednesday>'+$("#Hours_wednesday").val()+'</ser:Hours_wednesday>'+			
				'<ser:Hours_thursday>'+$("#Hours_thursday").val()+'</ser:Hours_thursday>	'+		
				'<ser:Hours_friday>'+$("#Hours_friday").val()+'</ser:Hours_friday>'+
				'<ser:Hours_saturday>'+$("#Hours_saturday").val()+'</ser:Hours_saturday>	'+		
				'<ser:Hours_sunday>'+$("#Hours_sunday").val()+'</ser:Hours_sunday>	'+		
				'<ser:EndReason>'+$("#EndReason").val()+'</ser:EndReason>	'+		
				'<ser:EndContract>'+$("#EndContract").val()+'</ser:EndContract>	'+		
				'<ser:EndTemporaryContract>'+$("#EndTemporaryContract").val()+'</ser:EndTemporaryContract>	'+	
				'<ser:Mobilenr>'+$("#Mobilenr").val()+'</ser:Mobilenr>	'+		
				'<ser:Salary>'+$("#Salary").val()+'</ser:Salary>	'+		
				'<ser:is_manager>'+$("#is_manager").val()+'</ser:is_manager>	'+		
				'<ser:manager_id>'+$("#manager_id").val()+'</ser:manager_id>'+			
				'<ser:manager2_id>'+$("#manager2_id").val()+'</ser:manager2_id>'+			
				'<ser:manager3_id>'+$("#manager3_id").val()+'</ser:manager3_id>	'+		
				'<ser:Manager2Active>'+$("#Manager2Active").val()+'</ser:Manager2Active>	'+		
				'<ser:Manager3Active>'+$("#Manager3Active").val()+'</ser:Manager3Active>	'+		
				'<ser:Permanent_Employment>'+$("#Permanent_Employment").val()+'</ser:Permanent_Employment>	'+		
				'<ser:Emergency_Contact>'+$("#Emergency_Contact").val()+'</ser:Emergency_Contact>	'+		
				'<ser:Emergency_PhoneNr>'+$("#Emergency_PhoneNr").val()+'</ser:Emergency_PhoneNr>	'+		
				'<ser:VangnetStatus>'+$("#VangnetStatus").val()+'</ser:VangnetStatus>	'+		
				'<ser:PhotoUrl>'+$("#PhotoUrl").val()+'</ser:PhotoUrl>	'+	
				'<ser:ContractType>'+$("#ContractType").val()+'</ser:ContractType>	'+				
			'</ser:employee>'+		
		'</ser:UpdateEmployee>'+
		'</soapenv:Body></soapenv:Envelope>';		
		 $.ajax({  
			type: "POST",
			url: restURL+"AMS.Service2.cls",	
			async: false,	
			cache: false,			
			data: xml,			
			contentType: 'text/xml; charset=utf-8',
			headers: {		
				SOAPAction: 'http://www.login.absentiemanager.nl/service2/AMS.Service2.UpdateEmployee'
		   },
		   success: function(data, status, req){ 		
				if(status == "success") {  // LOGIN OK? 			
						if($.xml2json(data).Body.UpdateEmployeeResponse.UpdateEmployeeResult.errorSpecified == 'true'){						
							$('#login_response').html("Error");
						} else {	
						  //store.set("AbsServiceProvidersStorageKey", $.xml2json(data).Body.GetServiceProvidersResponse.GetServiceProvidersResult);	
						   /* */					
						}
					} else {  // ERROR? 
					  $('#login_response').html("Error");  
					}        
			     //ajaxComplete			   
			    },//success
			   error: function(data, status, req){
				 $('#login_response').html("Error"+ req);	
			  }// error			  
			});    
			// -- End AJAX Call --
			return false;			
	};// -- End UpdateEmployee --	
	
	this.InsertFunction = function (sOrg,sUser,sPass,compID,sID,sName,sCOmpany){			
		var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"  xmlns:ser="http://www.login.absentiemanager.nl/service2">'+
		'<soapenv:Header/>'+
		'<soapenv:Body>'+		
		'<ser:InsertFunction>'+		
			'<ser:login>'+
			'<ser:Organization>'+sOrg+'</ser:Organization>'+	
			'<ser:Username>'+sUser+'</ser:Username>'+	
			'<ser:Password>'+sPass+'</ser:Password>'+				
			'</ser:login>'+	
			'<ser:companyid>'+compID+'</ser:companyid>'+
			'<ser:function>'+				
				'<ser:Id>'+sID+'</ser:Id>'+
				'<ser:Name>'+sName+'</ser:Name>'+
				'<ser:CompanyId>'+sCompanyId+'</ser:CompanyId>'+								
			'</ser:employee>'+		
		'</ser:InsertFunction>'+
		'</soapenv:Body></soapenv:Envelope>';		
		 $.ajax({  
			type: "POST",
			url: restURL+"AMS.Service2.cls",	
			async: false,	
			cache: false,			
			data: xml,			
			contentType: 'text/xml; charset=utf-8',
			headers: {		
				SOAPAction: 'http://www.login.absentiemanager.nl/service2/AMS.Service2.InsertFunction'
		   },
		   success: function(data, status, req){ 		
				if(status == "success") {  // LOGIN OK? 			
						if($.xml2json(data).Body.InsertFunctionResponse.InsertFunctionResult.errorSpecified == 'true'){						
							$('#login_response').html("Error");
						} else {						  
						   /* */					
						}
					} else {  // ERROR? 
					  $('#login_response').html("Error");  
					}        
			     //ajaxComplete			   
			    },//success
			   error: function(data, status, req){
				 $('#login_response').html("Error"+ req);	
			  }// error			  
			});    
			// -- End AJAX Call --
			return false;			
	};// -- End InsertFunction --
	
	this.UpdateFunction = function (sOrg,sUser,sPass,compID,sID,sName,sCompanyId){	// $(this).find('Name').text();		
		var xml = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/"  xmlns:ser="http://www.login.absentiemanager.nl/service2">'+
		'<soapenv:Header/>'+
		'<soapenv:Body>'+		
		'<ser:UpdateFunction>'+		
			'<ser:login>'+
			'<ser:Organization>'+sOrg+'</ser:Organization>'+	
			'<ser:Username>'+sUser+'</ser:Username>'+	
			'<ser:Password>'+sPass+'</ser:Password>'+				
			'</ser:login>'+	
			'<ser:companyid>'+compID+'</ser:companyid>'+
			'<ser:function>'+				
				'<ser:Id>'+sID+'</ser:Id>'+
				'<ser:Name>'+sName+'</ser:Name>'+
				'<ser:CompanyId>'+sCompanyId+'</ser:CompanyId>'+								
			'</ser:employee>'+		
		'</ser:UpdateFunction>'+
		'</soapenv:Body></soapenv:Envelope>';		
		 $.ajax({  
			type: "POST",
			url: restURL+"AMS.Service2.cls",	
			async: false,	
			cache: false,			
			data: xml,			
			contentType: 'text/xml; charset=utf-8',
			headers: {		
				SOAPAction: 'http://www.login.absentiemanager.nl/service2/AMS.Service2.UpdateFunction'
		   },
		   success: function(data, status, req){ 		
				if(status == "success") {  // LOGIN OK? 			
						if($.xml2json(data).Body.UpdateFunctionResponse.UpdateFunctionResult.errorSpecified == 'true'){						
							$('#login_response').html("Error");
						} else {						  
						   /* */					
						}
					} else {  // ERROR? 
					  $('#login_response').html("Error");  
					}        
			     //ajaxComplete			   
			    },//success
			   error: function(data, status, req){
				 $('#login_response').html("Error"+ req);	
			  }// error			  
			});    
			// -- End AJAX Call --
			return false;			
	};// -- End UpdateFunction --	  		
}






