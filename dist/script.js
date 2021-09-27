var gsroffset = 0;
var batchcomplete = null;
var queryin = "";
var continueFired = false;
var pg1 = true;

var baseurl = "https://en.wikipedia.org/w/api.php?action=query&format=json";
var searchparams =  "&prop=extracts|info&inprop=url&generator=search&exchars=150&exlimit=10&exintro=1&explaintext=1&gsrlimit=10&gsrsearch=";
var contparams = "&continue=gsroffset%7C%7C&gsroffset=";
var randomparams = "&prop=extracts|info&inprop=url&exchars=250&explaintext&generator=random&grnnamespace=*&grnlimit=1&grnnamespace=0";


function continueCallback(){
	if(!batchcomplete /*&&  queryin!== null*/){
		continueFired = true;
		sendRequest(baseurl + searchparams + queryin +contparams + gsroffset);
	}
	else
		$("#loader").removeClass("spineffect").hide();
}

function getrandomPage(){
	
	/* Clear the previous search results */
	$("div#result").empty();
	/* Clear input field */	
	$("input#inputquery").val("");
	
	var html = "<div id='rnd-loader' style='height:100%;width:100%;text-align:center;'><img src='http://www.darwinrecruitment.com/img/ajax-loader.png' style='height:50px;width:50px;'></div>"; 
	$("#result").append(html);
	
	sendRequest(baseurl + randomparams);	
}

function processRsp(result){
	
	//alert(JSON.stringify(result));
	
	batchcomplete	= result.batchcomplete;
	gsroffset		= result.continue.gsroffset;
	
	/* stop and hide the spinner */
	if(continueFired === true)
		$("#loader").removeClass("spineffect").hide();
	if($("#rnd-loader").css("display"))
		$("#result").empty();
	
	/* Display Response */
	var htmlstr = "";
	var pgarray = result.query.pages;
	for(var key in pgarray)
	{
		htmlstr += '<div class="row">';
		htmlstr += '<a target="_blank" href="' + pgarray[key].fullurl + '">';
		htmlstr += '<h4>' + pgarray[key].title + '</h4>';
		htmlstr += '<p>' + pgarray[key].extract + '</p>';
		//htmlstr += '</p><hr style="margin:0px"><div>Read Article</div></div>';
		htmlstr += '</a></div>';
	}

	$("div#result").append(htmlstr).slideDown(2000);	
}

function sendRequest(fullurl){	
	$.ajax({
		url		:	fullurl,	
		type		:	"GET",
	 contentType 	:	"application/x-www-form-urlencoded" ,
		success 	: 	function(result,status,xhr){
						//alert("success");
						processRsp(result);	
						},
		error	: 	function(xhr,status,error) {
						alert("ERRor");},
		dataType	: 	'jsonp'
	});
}



function display_result_page(){
	
	pg1= false;
	
	$("#top-bar").slideUp(function(){
		$("#top-bar").addClass("pg2-container");
		$("#title").addClass("pg2-title");
		$("#rnd-btn").addClass("pg2-rnd-button");
		$("input").addClass("pg2-input");
		$("#search-box>div").css(
			{"display" : "inline-block" ,
			 "vertical-align" : "middle"
			});
		$("i.fa-search").addClass("pg2-fa-search");
		$("#top-bar").slideDown();
	});
}

function reset(){
	$("div#result").empty().hide();

	gsroffset = 0;
	batchcomplete = null;
	pgarray=[];
	queryin = "";
	continueFired = false;
}


function searchCallback(){
	/*Reset variables*/
	 reset();
	/*Send Request*/
	 queryin = $("#search-box input").val();
	 sendRequest(baseurl + searchparams + queryin + contparams + gsroffset);
}


$(document).ready(function(){
	
	$(".hideatstart").hide();
	$("#result").hide();

/*	1.Opted for Random Article */
	$("button#rnd-btn").click(function(){
		if(pg1)
			display_result_page();
		getrandomPage();
	});
	
/*	2.Clicked search btn after entering input query  */
	$(".fa-search").click(function(){
		if( $("#search-box input").css("display") === "none" )
		{
			$(".hideatstart").show(1000);
		}	
		else
		{
			if($("#search-box input").val() === "")
			{	
				alert("Enter Input");		
			}
			else
			{
				if(pg1)	
					display_result_page();
				searchCallback();
			}	
		}
		
	});
	
/*	3.Handling the Enter key press instead of btn click */	
	$("#inputquery").on({
		keypress		: function(event)
					  {
						if(event.which == 13)	//keycode for enter key
						$("i#enter-btn").click();
						else
						$("i#close-icon").show();
					   }
	});
	
/*	4.Input query Close icon hide*/	
	$(document).on("click",function(){
		if($("#inputquery").val() === "")
		   $("i#close-icon").hide();
	});
/*	5.Input field clear value */	
	$("#close-icon").click(function(){
		$("#inputquery").val("");
	});

/*	6.infinite scrolling (untill query result is over) */
	/* with continue btn*/
	$("button#continue").click(continueCallback);
	/* without btn*/
	$(window).scroll(function()
	{	
		//$("span#value").text($(window).scrollTop() +" " + $(window).height() + " " + Number($(document).height() - 5) );
			if($(window).scrollTop() + $(window).height() >= Number($(document).height() -1))
			{
				/* TODO show animation loading effects*/
				$("#loader").show().addClass("spineffect");
				continueCallback();
			}
	 });	
	
	
	/* auto click setting for taking screenshot purpose*/
	$(".fa-search").click();
	/**/
});