define(function(require) {
  'use strict';
  var Backbone      = require('backbone'),
      _             = require('underscore'),
      dashBoardTemplate2  = require('text!./dashBoardTemplate2.html'),
      Layout        = require('layouts/dashboardLayout/layout');

  var DashBoardPage2 = Backbone.View.extend({
    template: _.template(dashBoardTemplate2),
    render: function() {
	  	  require(['jquery','jqueryui','bootstrap','jquery_validate','md5', 'store','wb_translate','underscore','datatables','bootstrap','datatables_responsive','datatablesColVis','datatablesTools','dataTablesColumnFilter','highcharts','highcharts-3d','highcharts-exporting','highcharts-drilldown'], function($){ 		
		 	
			fncRequireCssFile("https://login.workbee.eu/wb_dep/libs/dataTables/jquery.dataTables.min.css", false, "1");								
		    fncRequireCssFile("https://login.workbee.eu/wb_dep/libs/datatable-responsive/css/responsive.dataTables.min.css", false, "1");
			fncRequireCssFile("https://login.workbee.eu/wb_dep/libs/dataTables/dataTables.tableTools.css", false, "1");				
			/*
				**dependencies
				(jquery, highchart, datatables, underscore)
				
				**usage
				<input id="filter" placeholder="filter data" autofocus>
				<div id="chart"></div>    
				<table id="table"></table>	
				
				json structure	
				[{ "date":"Tue Oct 29 2013", "visitor":"Orlando Magic", "visitor points":87,"home":"Indiana Pacers","home points":97},...]	
			*/
			$(document).ready(function () {    
			   	renderTranslations();						
			    if(!sessionStorage["AbsEmployeeListStorageKey"]){				 
				//get emp list from db
				} else {	  
			  
			  
				var escape = function(s) {
					return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
				};
				
				var parsedate = function(s) {
					return new Date(s).getTime();
				};
			
				var bydate = function(property, i, j) {
					return new Date(i[property]).getTime() - new Date(j[property]).getTime();
				};
				
				var filter = function(data, regex) {
					return _.filter(data, function (doc) {
						return _.some(_.values(doc, regex), function (value) {
							return regex.test(value);
						});
					});
				};
			
				var absEmployeeList = JSON.parse(sessionStorage["AbsEmployeeListStorageKey"].toString());		
				
					var custArray = alasql('SELECT departmentName,\
					 SUM(CASE WHEN sickStatus=="true" THEN 1 ELSE 0 END) AS sSick, \
					 count(*) AS sNS, \
					 SUM(CASE WHEN gender=="F" THEN 1 ELSE 0 END) AS sFemale, \
					 SUM(CASE WHEN gender=="M" THEN 1 ELSE 0 END ) AS sMale  \
					 FROM ? GROUP BY departmentName',[absEmployeeList]);
					 
					//var custArrayTotal = alasql('SELECT count(*) AS sTotal, SUM(CASE WHEN gender=="F" THEN 1 ELSE 0 END) AS sFemale, SUM(CASE WHEN gender=="M" THEN 1 ELSE 0 END ) AS sMale  \
					// FROM ? WHERE sickStatus=="true" ',[absEmployeeList]);			
				
				
					var ArrDept=[], arrSick=[], arrFemale=[], arrMale=[], arrTotal=[],totalArray,totalW,totalM; 
					$.map(custArray, function(obj, i) {
						ArrDept.push(obj.departmentName);
						arrSick.push(obj.sSick);
						arrFemale.push(obj.sFemale);
						arrMale.push(obj.sMale);
						arrTotal.push(obj.sNS);					
					});					
											
					/*var byStartDT = _.partial(bydate, "date"),
						data      = data.sort(byStartDT),
						dates     = _.map(_.pluck(data, "date"), parsedate),
						
						home      = _.pluck(data, "home points"),
						visitor   = _.pluck(data, "visitor points"),*/
						
						var chart     = new Highcharts.Chart({
							   chart:   { renderTo: "containerID2" },
							   credits: { enabled: false },
							   title:   { text: "HRM data" },							  
						       xAxis: {	categories: ArrDept	},						   
							   yAxis:   { min: 0, title: { text: "Afd" } }, 
							   labels: {
								items: [{
									html: 'Total verzuim',
									style: {
									left: '50px',
									top: '18px',
									color: (Highcharts.theme && Highcharts.theme.textColor) || 'black'
									}
									}]
								},						
								//colors: ['#367A01', '#00D700', '#FFD700', '#D9D9D9', '#F4FA58', '#757873'],
									labels: {
									items: [{
										style: {
										left: '40px',
										top: '8px',
										color: 'black'
										}
									}]
							    },	
							   series: [							   
							   {
									type: 'spline',
									name: 'Verzuim',
									data: arrSick,
									/*marker: {
									lineWidth: 2,
										lineColor: Highcharts.getOptions().colors[3],
										fillColor: 'red'
									}*/
							   }, {
								   type: 'column',
								   name: "Vrouw",
								   data: arrFemale//_.zip(dates, visitor)
							   }, {
								   type: 'column',
							       name: 'Man',
							       data: arrMale
							   }, {
								    type: 'column',
									name: 'Totaal',
									data: arrTotal
							   }],
						 });
						 
					
			
					$("#emp_table2").dataTable({
						"responsive": true,			
					    "bPaginate": true,"bFilter": true,"bInfo": true,
						"data": absEmployeeList,
						"columns": [						 
							{ "data": null, "defaultContent": "", "title": "", "orderable":true, className: "all" , "width": "10%" },
							{ "data": "displayName",  "title": "Naam", "orderable":true, className: "all" },	
							{ "data": null, "defaultContent": "","type": 'boolean', "title": "M/V", "orderable":true, className: "desktop", "width": "10%"  },																		
							{ "data": "birthdate",  "title": "Geb. datum", className: "desktop" },		
					    	{ "data": "departmentName",  "title": "Afd.", className: "desktop" },												
							{ "data": "managerName",  "title": "Naam manager", className: "none" },														
					    	{ "data": "sickPercentage",  "title": "Verzuim %", className: "none" },
							{ "data": "numberOfSickdays",  "title": "Verzuimdagen" , className: "none" },
							{ "data": "sickFrequency",  "title": "Verzuim  freeq.", className: "none" },
							{ "data": null, "defaultContent": "",  "title": "Actie","orderable":false, className: "all" },								
							{ "data": "ID",  "title": "ID", className: "none" },
							{ "data": "empid",  "title": "Empid", className: "none" },
							{ "data": "lastName",  "title": "Achternaam", className: "none" },
							{ "data": "firstName",  "title": "Voornaam", className: "none" },
							{ "data": "initials",  "title": "Voorletters", className: "none" },
							{ "data": "nickName",  "title": "Roepnaam", className: "none" },	
							{ "data": "employmentStatus",  "title": "Status", className: "none" },														
							],													
						"autoWidth" : true,
						"bDestroy" : true,
						"stateSave": true,			
						"iDisplayLength": 10,
						"sDom": "Rlfrtip",											
						"columnDefs": [{					
							"targets":1,
							"render": function (data,type,row){	
							    	var sPic, iData;
								 iData  =   (row.isManager == "true") ? '   <i class="fa fa-asterisk btn btn-xs btn-default" style="font-size:13px" title="Manager"></i>' : '';	
								 (row.gender == "M") ? sPic= 'images/mdw_male.png' :  sPic= 'images/mdw_female.png';	
								   return 	row.photoUrl == undefined ? "<span><img class=\"img-responsive img-circle\" title='" + row.displayName + "'  style=\"width:22px;height:auto; margin-right: 10px; display:inline\" src='" + sPic + "'/>" + row.displayName  + iData  : "<img class=\"img-responsive img-circle\" alt='" + row.displayName + "'  style=\"width:22px;height:auto; margin-right: 10px; display:inline\" src='" + row.photoUrl + "'/>" + row.displayName + iData  +"</span>"; 																 
								}
							},{						
							"targets": 2,								
							"render": function (data, type, row ){ 							 
								return  (row.gender == "M") ? '<i class="fa fa-male btn btn-xs btn-default" style="font-size:18px;color:#3284cd" title="Man"></i>' : '<i class="fa fa-female btn btn-xs btn-default" style="font-size:18px; color:#ab7597" title="Vrouw"></i>';
							   } 						
							},					
							{						
							"targets": 9,								
							"render": function (data, type, row){ 
							   var sData =  (row.sickStatus == "false") ? '<a href="pages/registerSick/sickModal.html" class="btn btn-xs btn-default " data-toggle="modal" data-target="#sickModal"><i title="Ziekmelden" class="fa fa-ambulance" style="font-size:16px;color:green"></i></a>' : '<a href="pages/registerBetter/betterModal.html"  class="btn btn-xs btn-default" data-toggle="modal" data-target="#betterkModal"><i title="Herstelmelden" class="fa fa-ambulance" style="font-size:16px;color:darkred"></i></a>';								
							   return sData + '  <div class="btn-group">'+
											//'<button type="button" class="btn btn-xs btn-default">Actie</button>'+
												'<button type="button" class="btn btn-xs btn-primary dropdown-toggle" data-toggle="dropdown">'+
												'<span class="caret"></span>'+
												'<span class="sr-only">Toggle</span>'+
											'</button>'+
											'<ul class="dropdown-menu" role="menu" style="font-size: 12px;">'+										         
												'<li><a href="#/actionMonitor" class="translatable"><span class="glyphicon glyphicon-chevron-right"></span> Actiemonitor</a></li>'+
												'<li><a href="#/sickHistory" class="translatable"><span class="glyphicon glyphicon-chevron-right"></span> Verzuimhistorie</a></li>'+
												'<li role="separator" class="divider"></li>    '+        
												'<li><a href="#/documents" class="translatable"><span class="glyphicon glyphicon-chevron-right"></span> Documenten</a></li>  '+        
												'<li class="divider"></li>'+											
												'<li><a href="#/registerSick" class="translatable"><span class="glyphicon glyphicon-chevron-right"></span> Ziekmelden/Mutaties</a></li>'+
												'<li><a href="#/registerBetter" class="translatable"><span class="glyphicon glyphicon-plus-sign"></span> Hersteldmelden</a></li>'+
												'<li><a href="#/registerPregnancy" class="translatable"><span class="glyphicon glyphicon-chevron-right"></span> Zwangerschapsmelden</a></li>'+         
												'<li><a href="#/meetingRequest" class="translatable"><span class="glyphicon glyphicon-chevron-right"></span> Aanvraag spreekuur</a></li> '+ 
												' <li><a href="#/makeDeclaration" class="translatable"><span class="glyphicon glyphicon-chevron-right"></span> Declaratiemaken</a></li> '+  									        
												'<li class="divider"></li>'+											
												'<li><a href="#/hrm" class="translatable"><span class="glyphicon glyphicon-chevron-right"></span> HRM</a></li>'+
												'<li><a href="#/reintegration" class="translatable"><span class="glyphicon glyphicon-retweet"></span> Re-integratie</a></li>'+
												'<li><a href="#/prevention" class="translatable"><span class="glyphicon glyphicon-bell"></span> Preventie</a></li> '+            
												'<li><a href="#/wga" class="translatable"><span class="glyphicon glyphicon-folder-close"></span> WGA</a></li> '+        
												'<li class="divider"></li>'+
												'<li><a href="#" class="translatable"><span class="glyphicon glyphicon-briefcase"></span> Werk 1</a></li>'+
												'<li><a href="#" class="translatable"><span class="glyphicon glyphicon-briefcase"></span> Werk 2</a></li>'+
												'<li><a href="#" class="translatable"><span class="glyphicon glyphicon-calendar"></span> Agenda</a></li> '+            
												'<li><a href="#" class="translatable"><span class="glyphicon glyphicon-chevron-right"></span> UWV</a></li> '+
												'<li><a href="#" class="translatable"><span class="glyphicon glyphicon-chevron-right"></span> Verz. begeleiders</a></li> '+ 
												'<li><a href="#" class="translatable"><span class="glyphicon glyphicon-chevron-right"></span> Afdelingshistorie </a></li> '+         
											'</ul>'+
										'</div>' ; 							
										
							  } 						
							},/**/
						],				
						"language": {		
							"sProcessing": ((store.get("session_eLanguage") == "1") ? "Bezig..."  : "Processing..."), 
							"sLengthMenu":((store.get("session_eLanguage") == "1") ? "_MENU_ resultaten weergeven"  : "Show _MENU_ entries"), 
							"sZeroRecords": ((store.get("session_eLanguage") == "1") ? "Geen resultaten gevonden"  : "No matching records found"),
							"sInfo":  ((store.get("session_eLanguage") == "1") ? "_START_ tot _END_ van _TOTAL_ resultaten"  : "Showing _START_ to _END_ of _TOTAL_ entries"),
							"sInfoEmpty": ((store.get("session_eLanguage") == "1") ? "Geen resultaten om weer te geven" : "Showing 0 to 0 of 0 entries") ,
							"sInfoFiltered":  ((store.get("session_eLanguage") == "1") ? "(gefilterd uit _MAX_ resultaten)"  : "(filtered from _MAX_ total entries)"),
							"sInfoPostFix":((store.get("session_eLanguage") == "1") ? ""  : ""),
							"sSearch": ((store.get("session_eLanguage") == "1") ? "Zoeken:"  : "Search:"),
							"sEmptyTable":  ((store.get("session_eLanguage") == "1") ? "Geen resultaten aanwezig in de tabel"  : "No data available in table"),
							"sInfoThousands": ".",
							"sLoadingRecords": ((store.get("session_eLanguage")=="1") ? "<i class='fa fa-gear fa-1x fa-spin'></i> Een moment geduld aub - bezig met laden...":"<i class='fa fa-gear fa-1x fa-spin'></i> Loading..."),
							"oPaginate": {
							"sFirst":  ((store.get("session_eLanguage") == "1") ? "Eerste"  : "First"),
							"sLast":  ((store.get("session_eLanguage") == "1") ? "Laatste"  : "Last"),
							"sNext":  ((store.get("session_eLanguage") == "1") ? "Volgende" : "Next"),
							"sPrevious":  ((store.get("session_eLanguage") == "1") ? "Vorige"  : "Previous")						
							}
						},//end language	
						
					});
			
					$("#filter2").on("keyup", function() { 
						var table    = $("#emp_table2").DataTable(),
							regex    = new RegExp(escape(this.value), "i"),
							filtered = filter(absEmployeeList, regex),
							
							fdepartmentName    = _.pluck(filtered, "departmentName"),
							fdepartmentName    = _.pluck(filtered, "departmentName"),
							fdepartmentName    = _.pluck(filtered, "departmentName"),
							fdepartmentName    = _.pluck(filtered, "departmentName"),
							
							fvisitor = _.pluck(filtered, "visitor points"),
							fdates   = _.map(_.pluck(filtered, "date"), parsedate);     
							       
						chart.series[0].setData(_.zip(fdates, fdepartmentName));						
						chart.series[1].setData(_.zip(fdates, fvisitor));
						chart.series[2].setData(_.zip(fdates, fvisitor));
						chart.series[3].setData(_.zip(fdates, fvisitor));
						//chart.series[4].setData(_.zip(fdates, fvisitor));
						
						table.search(this.value).draw();   
					});
				//});
			}//if
		 });//ready
	   });//require
      this.$el.html(this.template(this));    
      return this;
    }
  });
  return Layout.extend({
    content: DashBoardPage2
  });
});
