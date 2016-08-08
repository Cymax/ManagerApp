define(function(require) {
  'use strict';
  var Backbone      = require('backbone'),
      _             = require('underscore'),
      dashBoardTemplate  = require('text!./dashBoardTemplate.html'),
      Layout        = require('layouts/dashboardLayout/layout'),  oTable;

  var DashBoardPage = Backbone.View.extend({
    template: _.template(dashBoardTemplate),
    render: function() {
	  	  require(['jquery','jqueryui','bootstrap','jquery_validate','md5', 'store','wb_translate','underscore','datatables','datatables_responsive','datatablesColVis','datatablesTools','dataTablesColumnFilter','datatablesYadcf','highcharts','highcharts-3d','highcharts-exporting','highcharts-drilldown','xml2json','am_service'], function($){ 		
		 	
			fncRequireCssFile("https://login.workbee.eu/wb_dep/libs/dataTables/jquery.dataTables.min.css", false, "1");								
		    fncRequireCssFile("https://login.workbee.eu/wb_dep/libs/datatable-responsive/css/responsive.dataTables.min.css", false, "1");
			fncRequireCssFile("https://login.workbee.eu/wb_dep/libs/dataTables/dataTables.tableTools.css", false, "1");	
			
		
		  $(function(){				 
			 	renderTranslations();		
							
			    if(!sessionStorage["AbsEmployeeListStorageKey"]){				 
				//get emp list from db
				} else {	
				//get emp list from local storage			
				   	var absEmployeeList = JSON.parse(sessionStorage["AbsEmployeeListStorageKey"].toString());					
					var custArray = alasql('SELECT departmentName,\
					 SUM(CASE WHEN sickStatus=="true" THEN 1 ELSE 0 END) AS sSick, \
					 count(*) AS sNS, \
					 SUM(CASE WHEN gender=="F" THEN 1 ELSE 0 END) AS sFemale, \
					 SUM(CASE WHEN gender=="M" THEN 1 ELSE 0 END ) AS sMale  \
					 FROM ? GROUP BY departmentName',[absEmployeeList]);
					 
					var custArrayTotal = alasql('SELECT count(*) AS sTotal, SUM(CASE WHEN gender=="F" THEN 1 ELSE 0 END) AS sFemale, SUM(CASE WHEN gender=="M" THEN 1 ELSE 0 END ) AS sMale  \
					 FROM ? WHERE sickStatus=="true" ',[absEmployeeList]);			
									
					var ArrDept=[], arrSick=[], arrFemale=[], arrMale=[], arrTotal=[],totalArray,totalW,totalM; 
					$.map(custArray, function(obj, i) {
						ArrDept.push(obj.departmentName);
						arrSick.push(obj.sSick);
						arrFemale.push(obj.sFemale);
						arrMale.push(obj.sMale);
						arrTotal.push(obj.sNS);					
					});					
					$.map(custArrayTotal, function(obj, i) {
						totalArray=obj.sTotal; 
						totalW=obj.sFemale;
						totalM=obj.sMale;															
					});
					//console.log(totalArray);				
					$('#containerID').highcharts({
						title: {
							text: 'HRM data'
						},
						xAxis: {
							categories: ArrDept
						},
					    credits: {
							 enabled: false
						},	
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
						 colors: ['#367A01', '#00D700', '#FFD700', '#D9D9D9', '#F4FA58', '#757873'],
						 labels: {
							 items: [{
								 style: {
									 left: '40px',
									 top: '8px',
									 color: 'black'
								 }
							 }]
						 },				
						series: [{
							type: 'column',
							name: 'Vrouw',
							data: arrFemale
						},{
							type: 'column',
							name: 'Man',
							data: arrMale
						},{
							type: 'column',
							name: 'Totaal',
							data: arrTotal
						},{
							type: 'spline',
							name: 'Verzuim',
							data: arrSick,
							marker: {
								lineWidth: 2,
								lineColor: Highcharts.getOptions().colors[3],
								fillColor: 'red'
							}
						   }, {
							type: 'pie',
							name: 'Totaal verzuim',
							data: [{
								name: 'Totaal',
								y: totalArray,
								color: Highcharts.getOptions().colors[0] // Jane's color
							}, {
								name: 'Man',
								y: totalM,
								color: Highcharts.getOptions().colors[1] // John's color
							}, {
								name: 'Vrouw',
								y: totalW,
								color: Highcharts.getOptions().colors[2] // Joe's color
							}],
							center: [140, 4],
							size: 60,
							allowPointSelect: true,
                            cursor: 'pointer',
							showInLegend: false,
							dataLabels: {
								enabled: true,
								format: '<b>{point.name}</b>: {point.percentage:.1f} %',
								style: {
									color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
								}
							}
						}]
					});					
				
					$.fn.dataTable.ext.errMode = 'none';			   
					   $('#emp_table').on( 'error.dt', function ( e, settings, techNote, message ) { 
					   console.log( 'An error has been reported by DataTables: ', message );}).dataTable(); 	
				
					  oTable = $('#emp_table').dataTable({
						"responsive": true,			
					    "bPaginate": true,"bFilter": true,"bInfo": true,
						"data": absEmployeeList,
						"columns": [
							{ "data": null, "defaultContent": "", "title": "Naam", "orderable":true, className: "all" },																		
							{ "data": "birthdate",  "title": "Geb. datum", className: "desktop" },		
					    	{ "data": "departmentName",  "title": "Afd.", className: "desktop" },	
							{ "data": null, "defaultContent": "",  "title": "Detail","orderable":false, className: "details-control all" },	
							{ "data": null, "defaultContent": "",  "title": "Actie","orderable":false, className: "desktop" },							
							{ "data": "gender",  "title": "gender", className: "none"},	
							{ "data": "ID",  "title": "Code", className: "none"},													
							],						
						"createdRow": function( row, data, index ) {						
							row.id = data.ID;						    
						},													
						"autoWidth" : false,
						//"bJQueryUI": true,
						"bDestroy" : true,
						"stateSave": true,			
						"iDisplayLength": 10,
						"sDom": "Rlfrtip",											
						"columnDefs": [{					
							"targets":0,
							"render": function (data,type,row){	
							    var sPic, iData;
								 iData  =   (row.isManager == "true") ? '   <i class="fa fa-asterisk btn btn-xs btn-default" style="font-size:13px" title="Manager"></i>' : '';	
								 (row.gender == "M") ? sPic= 'images/mdw_male.png' :  sPic= 'images/mdw_female.png';	
								   return 	row.photoUrl === undefined ? "<span><img class=\"img-responsive img-thumbnail\" title='" + row.displayName + "'  style=\"width:22px; height:auto;margin-right: 10px; display:inline\" src='" + sPic + "'/>" + row.displayName  + iData  +"</span>": "<span><img class=\"img-responsive img-thumbnail\" alt='" + row.displayName + "'  style=\"width:22px; height:auto; margin-right: 10px; display:inline\" src='" + row.photoUrl + "'/>" + row.displayName + iData  +"</span>"; 																 
								}
							},{									
							"targets": 4,								
							"render": function (data, type, row){ //ID or empid
							   var sData =  (row.sickStatus == "false") ? '<a style="margin: 0px 0px 0px 16px;" href="pages/registerSick/registerSickTemplate.html" class="insert_sick_button btn btn-xs btn-default" empCode="'+ row.empid+'" data-id="'+ row.ID+'" ><i title="Ziekmelden" class="fa fa-ambulance" style="font-size:16px;color:green"></i></a>' : '<a style="margin: 0px 0px 0px 16px;" href="pages/registerBetter/registerBetterTemplate.html"  class="update_sick_button btn btn-xs btn-default" empCode="'+ row.empid+'"  data-id="'+ row.ID+'"><i title="Herstelmelden" class="fa fa-ambulance" style="font-size:16px;color:darkred"></i></a>';								
							   return sData + '  <div class="btn-group">'+
											//'<button type="button" class="btn btn-xs btn-default">Actie</button>'+
												'<button type="button" class="btn btn-xs btn-primary dropdown-toggle" data-toggle="dropdown">'+
												'<span class="caret"></span>'+
												'<span class="sr-only">Toggle</span>'+
											'</button>'+
											'<ul class="dropdown-menu" role="menu" style="font-size: 12px;">'+										         
												//'<li><a href="#/actionMonitor" class="translatable"><span class="glyphicon glyphicon-chevron-right"></span> Actiemonitor</a></li>'+
												//'<li><a href="#/sickHistory" class="translatable"><span class="glyphicon glyphicon-chevron-right"></span> Verzuimhistorie</a></li>'+
												//'<li role="separator" class="divider"></li>    '+        
												'<li><a href="#/documents" class="translatable"><span class="glyphicon glyphicon-chevron-right"></span> Documenten</a></li>  '+        
												//'<li class="divider"></li>'+											
												//'<li><a href="#/registerSick" class="translatable"><span class="glyphicon glyphicon-chevron-right"></span> Ziekmelden/Mutaties</a></li>'+
												//'<li><a href="#/registerBetter" class="translatable"><span class="glyphicon glyphicon-plus-sign"></span> Hersteldmelden</a></li>'+
												'<li><a href="#/registerPregnancy" class="translatable"><span class="glyphicon glyphicon-chevron-right"></span> Zwangerschapsmelden</a></li>'+         
												'<li><a href="#/meetingRequest" class="translatable"><span class="glyphicon glyphicon-chevron-right"></span> Aanvraag spreekuur</a></li> '+ 
												' <li><a href="#/makeDeclaration" class="translatable"><span class="glyphicon glyphicon-chevron-right"></span> Declaratiemaken</a></li> '+  									        
												'<li class="divider"></li>'+											
												//'<li><a href="#/hrm" class="translatable"><span class="glyphicon glyphicon-chevron-right"></span> HRM</a></li>'+
												'<li><a href="#/reintegration" class="translatable"><span class="glyphicon glyphicon-retweet"></span> Re-integratie</a></li>'+
												'<li><a href="#/prevention" class="translatable"><span class="glyphicon glyphicon-bell"></span> Preventie</a></li> '+            
												'<li><a href="#/wga" class="translatable"><span class="glyphicon glyphicon-folder-close"></span> WGA</a></li> '+        
												'<li class="divider"></li>'+
												'<li><a href="#" class="translatable"><span class="glyphicon glyphicon-briefcase"></span> Werk </a></li>'+
												//'<li><a href="#" class="translatable"><span class="glyphicon glyphicon-briefcase"></span> Werk 2</a></li>'+
												//'<li><a href="#" class="translatable"><span class="glyphicon glyphicon-calendar"></span> Agenda</a></li> '+            
												//'<li><a href="#" class="translatable"><span class="glyphicon glyphicon-chevron-right"></span> UWV</a></li> '+
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
						},//end language	  //http://yadcf-showcase.appspot.com/dom_source_externally_triggered.html					
						})
						/*.yadcf([{
								column_number: 0, 
								filter_type: "text",
								filter_container_id: 'multi-column-filter-01', 
								filter_default_label: 'Naam'
							},						
							{
								column_number: 2, 
								filter_container_id: 'department-filter', 
							    //filter_type: "auto_complete"
								filter_default_label: 'Afdeling'
							},{
								column_number: 5, 
								filter_container_id: 'gender-filter',	
								filter_default_label: 'Geslacht'						
							}
					])*/
					;							
				 }				
			
				var detailRows = [], table= $('#emp_table').DataTable(), sOrg = decodeURIComponent(escape(window.atob( store.get("session_Org_am_emp")))),
					sUser = decodeURIComponent(escape(window.atob( store.get("session_User_am_emp")))),
					sPass = decodeURIComponent(escape(window.atob( store.get("session_Pass_am_emp"))));
				$('#emp_table tbody').on('click','td.details-control', function(){
					var tr = $(this).closest('tr');
					var idx = $.inArray(tr.attr('id'), detailRows ); 
					var row = table.row( tr );			
					if (row.child.isShown()){
						tr.removeClass('details');
						row.child.hide();
						// remove from the 'open' array
						detailRows.splice(idx,1); //??
					}
					else {
						tr.addClass('details');
						row.child( absService.getEmployeeDetails(sOrg,sUser,sPass,tr.attr('id')) ).show();					
						if (idx=== -1){
							detailRows.push(tr.attr('id'));
						}
					}				
				}); //end of click function	
	
			    $('#filter_panel').on('click', function(e){ 				
					$('#filterSlider').slideToggle( "slow", function() {});					
			     });
				$('#containerID').hide(); 
				 $('#filter_chart').on('click', function(e){ 				
					$('#containerID').slideToggle( "slow", function() {					
				     });					
			     });		

				 $(document).on("click", ".insert_sick_button", function (evt,eid,ecode) {			
					evt.preventDefault();							
					eid = $(this).attr('data-id');
					ecode= $(this).attr('empCode');
					var modal = $('#sickModal').modal();
					modal.find('.modal-body').load($(this).attr('href'), function (responseText, textStatus) {					
							if ( textStatus === 'success' ||  textStatus === 'notmodified') {
								$('.modal-body #employeeId').val(eid);
								$('.modal-body #employeeCode').val(ecode);
								modal.show();								
							}
					});
				});
				
				 $(document).on("click", ".update_sick_button", function (evt,eid,ecode) {			
					evt.preventDefault();							
					eid = $(this).attr('data-id');
					ecode= $(this).attr('empCode');
					var modal = $('#betterModal').modal();
					modal.find('.modal-body').load($(this).attr('href'), function (responseText, textStatus) {					
							if ( textStatus === 'success' ||  textStatus === 'notmodified') {
								$('.modal-body #employeeId').val(eid);
								$('.modal-body #employeeCode').val(ecode);
								modal.show();								
							}
					});
				});			
										
	      });//ready		  
		  
	   });//require
      this.$el.html(this.template(this));    
      return this;
    }
  });
  return Layout.extend({
    content: DashBoardPage
  });
});

