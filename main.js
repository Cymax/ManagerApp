define([], function() {
  'use strict';
  // Configure require.js paths and shims
  require.config({
    paths: {
		'text': 'libs/requirejs-text/text',
		'router': 'libs/requirejs-router/router',
		'backbone': 'libs/backbone/backbone',
		'underscore': 'libs/underscore/underscore',
		'jquery': 'libs/jquery/js/jquery-2.0.2.min',
		'bootstrap': 'libs/bootstrap/js/bootstrap.min',	 
		'jqueryui':  'libs/jqueryui/js/jquery-ui-1.10.3.min',
		'md5' :  'libs/md5',	
		'store':'libs/store',
		'underscore':'libs/underscore/underscore',
		'select2':'libs/select2/js/select2.min', 
		'datatables':'libs/datatables/jquery.dataTables.min',	
		'datatables_responsive':'libs/datatable-responsive/js/dataTables.responsive',		 
		'jquery_validate': 'libs/jquery/jquery.validate',	
		'pwstrength':'libs/bootstrap/js/pwstrength',	 	 
		'xml2json':'libs/jquery.xml2json', 
		//'custumJS':'libs/custom', 	    
		'datatablesColVis':'libs/datatables/dataTables.colVis.min',
		'datatablesTools':'libs/datatables/dataTables.tableTools.min',
		'datatablesBootstrap':'libs/datatables/dataTables.bootstrap.min',
		'datatablesResponsive':'libs/datatables/dataTables.responsive.min',
		'dataTablesColumnFilter':'libs/datatables/jquery.dataTables.columnFilter',
		
		'highcharts':'https://login.workbee.eu/highcharts/js/highcharts',
		'highcharts-3d':'https://login.workbee.eu/highcharts/js/highcharts-3d',
		'highcharts-exporting':'https://login.workbee.eu/highcharts/js/modules/exporting',
		'highcharts-drilldown':'https://login.workbee.eu/highcharts/js/modules/drilldown',
		'highcharts-more':'https://login.workbee.eu/highcharts/js/highcharts-more',
		'highcharts-boost':'https://login.workbee.eu/highcharts/js/modules/boost',	
		
		'alasql':'libs/alasql',	
		
		'wb_translate':'js/lang/wbTranslate',
		'am_service':'js/am_services',
		
		'datatablesYadcf':'libs/datatables/jquery.dataTables.yadcf',
    },
	shim: {
		'jquery': {exports: '$'},
		'underscore': {	exports: '_'},
		'backbone': {deps: ['jquery', 'underscore'],exports: 'Backbone'	},
		'bootstrap': {deps: ['jquery']	},	
		'jqueryui': {deps: ['jquery']},
		'md5': {deps: ['jquery']},
		'select2': {deps: ['jquery']},
		'store': {deps: ['jquery']},
		'underscore': {deps: ['jquery']},		
		'datatables': {deps: ['jquery', 'bootstrap']},
		'datatables_responsive': {deps: ['jquery', 'datatables']},		
		'jquery_validate': {deps: ['jquery']},
		'pwstrength': {deps: ['jquery', 'bootstrap']},		
		'xml2json': {deps: ['jquery']},
		'wb_translate': {deps: ['jquery']},	
		'datatablesColVis': {deps: ['jquery','datatables','bootstrap']},	
		'datatablesTools': {deps: ['jquery','datatables','bootstrap']},	
		'datatablesBootstrap': {deps: ['jquery','datatables','bootstrap']},	
		'datatablesResponsive': {deps: ['jquery','datatables','bootstrap']},	
		
		'highcharts': {deps: ['jquery']},
		'highcharts-3d': {deps: ['jquery', 'highcharts']},
		'highcharts-exporting': {deps: ['jquery', 'highcharts']},
		'highcharts-drilldown': {deps: ['jquery', 'highcharts']},
		'highcharts-more': {deps: ['jquery', 'highcharts']},	
		'highcharts-boost': {deps: ['jquery', 'highcharts']},
		
		'alasql': {deps: ['jquery']},	
		'datatablesYadcf': {deps: ['jquery', 'datatables']},
		
    }
	
  });
  // Load the router
  require(['router', 'jquery','store'], function(router, $) {
    // Keep track of the currently loaded view so we can run teardown before loading the new view
    var view;
    router
      .registerRoutes({      
		dashboard: { path: '/dashboard', moduleId: 'pages/dashboard/dashboardPage' },	
		dashboard2: { path: '/dashboard2', moduleId: 'pages/dashboard/dashboardPage2' },		
		privateMode: { path: '/privateMode', moduleId: 'pages/privateMode/privateModePage' },	
		login: { path: '/login', moduleId: 'pages/login/loginPage' },			
		actionMonitor: { path: '/actionMonitor', moduleId: 'pages/actionMonitor/actionMonitorPage' },		
		sickHistory: { path: '/sickHistory', moduleId: 'pages/sickHistory/sickHistoryPage' },
		documents: { path: '/documents', moduleId: 'pages/documents/documentsPage' },
		
		registerSick: { path: '/registerSick', moduleId: 'pages/registerSick/registerSickPage' },
		registerBetter: { path: '/registerBetter', moduleId: 'pages/registerBetter/registerBetterPage' },
		registerPregnancy: { path: '/registerPregnancy', moduleId: 'pages/registerPregnancy/registerPregnancyPage' },
        meetingRequest: { path: '/meetingRequest', moduleId: 'pages/meetingRequest/meetingRequestPage' },
		makeDeclaration: { path: '/makeDeclaration', moduleId: 'pages/makeDeclaration/makeDeclarationPage' },	
		
		hrm: { path: '/hrm', moduleId: 'pages/hrm/hrmPage' },	
		reintegration: { path: '/reintegration', moduleId: 'pages/reintegration/reintegrationPage' },		
		prevention: { path: '/prevention', moduleId: 'pages/prevention/preventionPage' },
		wga: { path: '/wga', moduleId: 'pages/wga/wgaPage' },	
		
		reports: { path: '/reports', moduleId: 'pages/reports/reportsPage' },	
		updateSick: { path: '/updateSick', moduleId: 'pages/updateSick/updateSickPage' },
		details: { path: '/details', moduleId: 'pages/details/detailsSickPage' },
		
		notFound: { path: '*', moduleId: 'pages/dashboard/dashboardPage' }
      })	  
      .on('routeload', function onRouteLoad(View, routeArguments) {
        // When a route loads, render the view and attach it to the document
        if (view) {
          view.remove();
        }
        view = new View(null, routeArguments);
        view.render();
        $('body').append(view.el);
      })
      .init(); // Set up event handlers and trigger the initial page load
  });  
  // requirejs.onError = function (err) {
		//console.log(err.requireType);
		//if (err.requireType === 'timeout') {
		//	console.log('modules: ' + err.requireModules);
		//}	
		//throw err;
	//};	
});


