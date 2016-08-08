/**
 * The workbee component for frontend translation 
 * 
 */

/**
 * Translator functions
 */
var wbTranslate = new WBTranslate();
wbTranslate.map = new Array();
wbTranslate.defaultLang="nl";
wbTranslate.langs = new Array();
//var transPackDir = "wbtranslate/";
wbTranslate.langs["nl"] = baseURL+"js/lang/wb_nl.js";
wbTranslate.langs["en"] = baseURL+"js/lang/wb_en.js";

// shortcut function
function _(text){
	//return text;
	var tr = wbTranslate.translateText($.trim(text));
	if (tr){
		return tr;
	} else {
		return text;
	}
}

// renders all values of tags with class translatable
function renderTranslations(prefix){
	if (!prefix){ prefix = "" }
	
	var translationMap = wbTranslate.getTranslateMap("nl"); // get multiple language support
	
	$(prefix+" .translatable").each(function(){
		var elem = $(this);
		
		// check if translation is wrapped in span because of ui-btn
		if($(this).hasClass("ui-btn")){
			var elem = $(this).find(".ui-btn-text");
		}

		// translate
		try {
			var tag = elem.get(0).tagName;
		} catch (e){
			alert(elem + ": "+e);
		}
		if (tag == "INPUT"){
			var key = elem.attr("placeholder");
			var translation = translationMap[key];
			elem.attr("placeholder", translation);
		} else {
			var key = elem.html();
			var translation = translationMap[key];
			elem.html(translation);
		}
		
	});	
}


function WBTranslate(){
	this.map;
	this.langs;
	this.defaultLang;
	this.currLang;
	
	/**
	 * Switch the language translation to the specified one.
	 */
	this.switchLanguage = function(nextLang){
		//In case nextLang is not defined or is not available
		if((!nextLang || nextLang=="") || (!this.langs[nextLang] || this.langs[nextLang]=="")){
			nextLang = this.defaultLang;
		}
		
		var loadJs = function(filePath){
			$.ajaxSetup({async: false, cache: true});
			$.getScript(filePath);
			$.ajaxSetup({async: true, cache: false});
		};
	
		
		//Init. active language
		if(!this.currLang || this.currLang==""){
			loadJs(this.langs[nextLang]);
			this.currLang = nextLang;
			return ;
		}
		
		//Replace active language
		if(this.currLang!=nextLang){
			loadJs(this.langs[nextLang]);
			this.currLang = nextLang;
			return ; 
		}		
	};
	
	/**
	 * Just make access to translation map transparent
	 */
	this.getTranslateMap = function(lang){
		if (!lang){
			lang = this.currLang;
		}
		this.switchLanguage(lang);
		return wbTranslate.map;
	};

	this.translateText = function(text){
		return wbTranslate.getTranslateMap(this.currLang)[text];
	};
}
