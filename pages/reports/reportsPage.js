define(function(require) {
  'use strict';
  var Backbone      = require('backbone'),
      _             = require('underscore'),
      reportsTemplate  = require('text!./reportsTemplate.html'),
      Layout        = require('layouts/dashboardLayout/layout');

  var reportsPage = Backbone.View.extend({
    template: _.template(reportsTemplate),
    render: function() {
	  	  require(['jquery','jqueryui','bootstrap','jquery_validate','md5', 'store','wb_translate','underscore','highcharts','highcharts-3d','highcharts-exporting','highcharts-drilldown','xml2json','am_service'], function($){ 		
		 
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
					$('#containerIDR').highcharts({
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
				}
				
				
	      });//ready
		  
	   });//require
      this.$el.html(this.template(this));    
      return this;
    }
  });
  return Layout.extend({
    content: reportsPage
  });
});


