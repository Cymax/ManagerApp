define(function(require) {
  'use strict';
  var Backbone      = require('backbone'),
      _             = require('underscore'),
      loginTemplate  = require('text!./loginTemplate.html'),
      Layout        = require('layouts/loginLayout/layout');
  var LoginPage = Backbone.View.extend({
    template: _.template(loginTemplate),
    render: function() {
	  	 require(['jquery','jqueryui','bootstrap','jquery_validate','md5', 'store','wb_translate', 'xml2json','am_service'], function($){ 		
		 
		  $(function(){	
		  			 
			    renderTranslations();  
					  	
				$("#advancedsettings").click(function(e){
					$("#amsservice").toggle();
				})	
				
				function utf8_to_b64( str ) {
					return window.btoa(unescape(encodeURIComponent( str )));
				}
				
				function b64_to_utf8( str ) {
					return decodeURIComponent(escape(window.atob( str )));
				}
				
				sessionStorage.removeItem('amsserviceURL');				   
				for (var obj in sessionStorage) {
				 //console.log("obj:"+ obj); 
				  if (sessionStorage.hasOwnProperty(obj)  &&  
						obj != "AbsEmployeeListStorageKey" && 
						obj != "session_Org_am_emp" && 
						obj != "session_Pass_am_emp" && 
						obj != "session_User_am_emp" ) {
					 sessionStorage.removeItem(obj);					
				  }
				}					
				// check if browser private mode is activated and ridirect to private mode message
				try {
					localStorage.setItem("storage_LoggedOut_am_emp",true); 
					 for (var obj in sessionStorage) {		
						 sessionStorage.removeItem(obj);
						 sessionStorage.clear();		
					  }			      
				} catch (e) {	
					  window.location.href = baseURL+'#/privateMode';				
				}
				
				$(document).on('change', '#amsservice', function (){
					sessionStorage.amsserviceURL = $('#amsservice').val();	
					//store.set("amsserviceStorageKey", $('#amsservice').val());				
				});	
							  
			   // var sPass;
				if (localStorage.localStorageRememberPwd_am_emp) {		
					if (localStorage.localStorageRememberPwd_am_emp) {									
						$('#remember_password').prop("checked", true);
						$('#companycode').val(b64_to_utf8(localStorage.localStorageOrganization_am_emp));
						$('#username').val(b64_to_utf8(localStorage.localStorageUsername_am_emp));
						$('#password').val(b64_to_utf8(localStorage.localStoragePassword_am_emp));															
					} else if (!localStorage.localStorageRememberPwd_am_emp){						
						$('#remember_password').prop("checked", false);
						$('#companycode').val('');
						$('#username').val('');
						$('#password').val('');									
					}
				}	//	var apiIDs = window.atob(getUrlVars()["api_id"]);
							
				 $(document).on("click", '#remember_password', function (e) {							 
					if ($('#remember_password').prop('checked')===true) {											
						localStorage.localStorageOrganization_am_emp = utf8_to_b64($('#companycode').val());
						localStorage.localStorageUsername_am_emp = utf8_to_b64($('#username').val());
						localStorage.localStoragePassword_am_emp = utf8_to_b64($('#password').val());								
						localStorage.localStorageRememberPwd_am_emp = true; 
					} else if ($('#remember_password').prop('checked')===false) {
						localStorage.localStorageOrganization_am_emp = '';
						localStorage.localStorageUsername_am_emp = '';
						localStorage.localStoragePassword_am_emp = '';	
						localStorage.localStorageRememberPwd_am_emp = '';	
						$('#password').val('');											
					}				
				});								 
								
				$("#login-form").validate({
					//errorPlacement: $.noop,		
					//errorElement:'label',		
					//Rules for form validation
					rules : {
						companycode : {
						required : true,							
					},
						username : {
						required : true,						
					},
						password : {
						required : true,				
					}
					},				
					submitHandler : function( form) {	
					    								
						if (localStorage.localStorageRememberPwd_am_emp && localStorage.localStorageRememberPwd_am_emp!=undefined) {							
							 var uName =  utf8_to_b64($("#username").val()), pwd =  utf8_to_b64($('#password').val());			
						} else {
							var uName = $("#username").val(), pwd = $('#password').val();	
						}	   
						 if (absService.checkLogin($("#companycode").val(),$("#username").val(), $('#password').val()) ) {																			
							 absService.getEmployeeList($("#companycode").val(),$("#username").val(), $('#password').val());	
						 } else { 
							// $('#login_response').html("Fout");
						 }			 					
							return false;	
						}			
				 });
				
			
	      });//ready		  
	   });//require   
	   
      this.$el.html(this.template(this));    
      return this;
    }
  });
  return Layout.extend({
    content: LoginPage
  });
});


