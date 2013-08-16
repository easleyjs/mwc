/*
	to-do: initial prompt for new group - Hero / Henchman, Unit Type (to determine, spellcaster, etc.)
	create 3 different DIV "editors" for Hero, Henchman, Spellcaster
	(behind the scenes, this will do an ajax req for JSON object that has that info.)
*/

/*
	Initial page prepping. Hide the editor.
*/
$(document).ready(function() {


	// var obj = jQuery.parseJSON('{
	// array.splice(array.length,0,"thing_one","thing_two"); // can remove X number of elements.. denoted by 2nd position
	// array.push()   // add elements to end of array.

	var raceList = new Array({id:1,name:"Skaven"},{id:2,name:"Undead"});

	function warband() {
		this.game = ""; // seq. #/PK in the db for parent game type (mordheim/coreheim)
		this.race = ""; // int. seq. #/PK from the db for the parent race type.
		this.wbId = ""; // int. sequence/PK # in the db for this unique warband.
		this.wbName = ""; // string.
		this.groups = []; // array of Group objs.
		this.wbRating = ""; // int.
		this.unitCount = ""; // int. Regular (hero/henchman units.)
		this.dPCount = ""; // int. Dramatis Personae units.
		this.hSwordCount = ""; // int. Hired Sword units.
		this.lGCreatureCount = ""; // int. Large creature units.
		this.items = []; // array of int index references to wb item list. (maybe objs later w/ descriptions and such.)
		this.gCAmt = ""; // int. Gold Crowns amount.
		this.wShardsAmt = ""; // int. Warpstone Shards amount.
		/*
		this.wins = ""; // int. to be implemented with logging features.
		this.losses = ""; // int. to be implemented with logging features.
		this.draws = ""; // int. to be implemented with logging features.
		this.logEntries = []; // array of objs. to be implemented with logging features.
		*/
		/*
		functions:
		deriveWbRating
		updateTroopCounts // regular, large creatures, DPs, H Swords, etc.
		*/
	}

	function unit() {
		this.unitId = ""; // sequence/PK # in the db for this group's parent unit.
		this.rank = ""; // string (or int?) Hero/Henchman/Dramatis Personae/Hired Sword/etc.
		this.isLdr = ""; // bool? Is this the leader unit?
		this.isCaster = ""; // boolean? Is this unit a spellcaster?
		this.isLgCreature = ""; // boolean? Is this a large creature?
		this.unitMaxAmt = ""; // int. total # of units of this type allowed in warband.
		this.groupSizeAmt = ""; // int. # of units per group.
		this.usesRankItemTable = "";
		this.canUseItems = ""; // double check logic on this. boolean?
		this.canUseMutations = ""; // boolean?
		this.skillTrees = [];  // array of strings
		this.spellTrees = [];  // array of strings
		this.startXp = "";
		this.canGainXp = "";
		this.std_cost = "";
		this.std_mvmt = "";
		this.max_mvmt = "";
		this.std_ws = "";
		this.max_ws = "";
		this.std_bs = "";
		this.max_bs = "";
		this.std_str = "";
		this.max_str = "";
		this.std_t = "";
		this.max_t = "";
		this.std_wnd = "";
		this.max_wnd = "";
		this.std_init = "";
		this.max_init = "";
		this.std_atk = "";
		this.max_atk = "";
		this.std_ld = "";
		this.max_ld = "";
		this.specRules = []; // array of strings for spec. rules such as "causes fear", etc.
		// DP/Hired Sword fields:
		this.armor = "";
		this.shield = "";
		this.melee = [];
		this.ranged = [];
		this.items = [];
	};

	function group(groupId,unitIdx,rank,unitCount
				   ,names,xp,cur_cost,cur_mvmt,cur_ws
				   ,cur_bs,cur_str,cur_t,cur_wnd
				   ,cur_init,cur_atk,cur_ld
				   ,armor,shield,melee,ranged,items
				   ,notes) {
		this.groupId = ""; // int. sequence/PK # in the db for this group.
		this.unitIdx = ""; // int. index # in the unit reference obj's array for this group's parent unit.
		this.unitCount = ""; // int. current # of units in this group. 
		this.names = []; // strings.
		this.xp = ""; // int. current amount of xp accrued by this group.
		this.cur_cost = "";
		this.cur_mvmt = "";
		this.cur_ws = "";
		this.cur_bs = "";
		this.cur_str = "";
		this.cur_t = "";
		this.cur_wnd = "";
		this.cur_init = "";
		this.cur_atk = "";
		this.cur_ld = "";
		this.armor = ""; // int. index ref to armor ref obj array
		this.shield = ""; // int. index ref to shield ref obj array
		this.melee = []; // int. index refs to melee ref obj array
		this.ranged = []; // int. index refs to ranged ref obj array
		this.items = []; // int. index refs to item ref obj array
		this.notes = "";
		// Hero-related vars
		this.injuries = []; // array of objs w/ info about each injury.
		this.skills = []; // array of strings (maybe later, objs. if skills modify stats, etc.)
		this.mutations = []; // array of objs w/ info about the mutation(s)
		this.spells = []; // array of strings (maybe later objs, if I decide to put descriptions of spells in.)
	};

	//eventually functionize this so that generic SELECT elements can be populated with it.
	//function populateSelect( selectId, fieldName, objArray ) {};
	$("#raceSelect").append(
							$("<option></option>")
								.text("-- Select Race --"));
	for (var i=0;i<raceList.length;i++){
		$("#raceSelect").append(
								$("<option></option>")
									.attr("value", raceList[i].id)
									.text(raceList[i].name));
	};

	//alert(raceList[1].name); // canary for testing.

	var numGroupsInt = 0;
	$("#newGrpEditorDiv").hide();
	/*
		Add Group button functionality.
	*/
	$("#addGrpButton").click(function() {
		$('#dialog-form').children().val(''); // clear out editor.
		$('input[type=radio]').prop('checked', function () {
    		return this.getAttribute('checked') == 'checked';
    	});
		// need to put this in a loop for all to-be spinner elements.
		// for weapon amount, make 0 the minimum. then on change, spawn appropriate # dropdowns
		$( "input[name*='Amt']" ).spinner({ min: 0, max: 5 });
		/*
		var spinner = $( "#grpAmt" ).spinner();
		spinner.spinner( "option", "min", 1 ); // need to set dynamically
		spinner.spinner( "option", "max", 5 ); // need to set dynamically
		spinner.spinner( "enable" );
		*/

		$( "#dialog-form" ).dialog( "open" );
	});
	/* 
		Saving groups within the editor div.
		need to add try/catch for writing via ajax to the db. Also, error msgs.
	*/
	/*
	$("#saveGroupButton").click(function() {
		$("#grpSaveSuccessMsg").fadeIn("slow");
		$("#grpSaveSuccessMsg").fadeOut(700);
		$("#newGrpEditorDiv").hide();
		$newGroup = $("#blankGrpDiv").clone().attr("id","#grp" + numGroupsInt + "Div"); // create group entry in memory via clone.
		// foreach style loop to copy editor to in-memory DIV object.
		$('#newGrpEditorDiv *').each(function() {
			var $itemClass = $(this).attr("class");
			var $value = $(this).val();
			//console.log('#grp' + numGroupsInt + 'Div');
			$newGroup.find("." + $itemClass).text($value);	
		});
		$('#newGrpEditorDiv').children().val(''); // clear out editor.
		$newGroup.insertBefore($("#blankGrpDiv")).slideDown(300); // take finished group out of memory, send to DOM.
		$newGroup = "";
		$("#grpCntInt").text(numGroupsInt+1); // if successful......
		++numGroupsInt;
	*/

		/*
			then clone that to a new one, and copy stuff from the editor into that div.
			(then eventually update totals and do math.)
		*/	
	$( "#dialog-form" ).dialog({
		autoOpen: false,
		height: 700,
		width: 320,
		modal: true,
		buttons: {
		"Create group": function() {
			var bValid = true;
			allFields.removeClass( "ui-state-error" );
			/*
			bValid = bValid && checkLength( name, "username", 3, 16 );
			bValid = bValid && checkLength( email, "email", 6, 80 );
			bValid = bValid && checkLength( password, "password", 5, 16 );
			bValid = bValid && checkRegexp( name, /^[a-z]([0-9a-z_])+$/i, "Username may consist of a-z, 0-9, underscores, begin with a letter." );
			// From jquery.validate.js (by joern), contributed by Scott Gonzalez: http://projects.scottsplayground.com/email_address_validation/
			bValid = bValid && checkRegexp( email, /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i, "eg. ui@jquery.com" );
			bValid = bValid && checkRegexp( password, /^([0-9a-zA-Z])+$/, "Password field only allow : a-z 0-9" );
			if ( bValid ) {
			$( "#users tbody" ).append( "<tr>" +
			"<td>" + name.val() + "</td>" +
			"<td>" + email.val() + "</td>" +
			"<td>" + password.val() + "</td>" +
			"</tr>" );
			$( this ).dialog( "close" );
			}*/
			},
		Cancel: function() {
			// allFields.val( "" ).removeClass( "ui-state-error" );
			$( this ).dialog( "close" );
			} 
		}
	});
});