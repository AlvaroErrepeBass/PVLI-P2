var battle = new RPG.Battle();
var actionForm, spellForm, targetForm;
var infoPanel;

function prettifyEffect(obj) {
    return Object.keys(obj).map(function (key) {
        var sign = obj[key] > 0 ? '+' : ''; // show + sign for positive effects
        return `${sign}${obj[key]} ${key}`;
    }).join(', ');
}


battle.setup({
    heroes: {
        members: [
            RPG.entities.characters.heroTank,
            RPG.entities.characters.heroWizard
        ],
        grimoire: [
            RPG.entities.scrolls.health,
            RPG.entities.scrolls.fireball
        ]
    },
    monsters: {
        members: [
            RPG.entities.characters.monsterSlime,
            RPG.entities.characters.monsterBat,
            RPG.entities.characters.monsterSkeleton,
            RPG.entities.characters.monsterBat
        ]
    }
});

battle.on('start', function (data) {
    console.log('START', data);
});

battle.on('turn', function (data) {
    console.log('TURN', data);
    // TODO: render the character
    var list = Object.keys(battle._charactersById);
    var render;
    var aux = battle._charactersById;
    for (var i = 0; i < list.length; i++){
        render = '<li data-chara-id="'+ list[i]+'">'+aux[list[i]].name+' (HP:<strong>'
		+aux[list[i]].hp+'</strong>/'+aux[list[i]].maxHp+', MP: <strong>'+aux[list[i]].mp+
		'</strong>/'+aux[list[i]].maxMp;	
	if(aux[list[i]].party === 'heroes'){
	    document.getElementById('heroP').innerHTML += render;
	}
	else if(aux[list[i]].party === 'monsters'){
	    document.getElementById('monsterP').innerHTML += render;
	}
    }
    // TODO: highlight current character
    var el = document.querySelector('[data-chara-id="'+data.activeCharacterId+'"]');
    el.classList.add("active");
    // TODO: show battle actions form

    //var optForm = document.querySelector('.choices');
    var opt = battle.options.list();
    for (var i = 0; i< opt.length;i++){
        //document.querySelector('.choices').innerHTML = '<li><label><input type="radio" name="option" value="attack"> attack</label></li>';
        document.querySelector('.choices').innerHTML 
        += '<li><label><input type="radio" name="option" value="'+ opt[i]+'">'+opt[i]+'</li>';
    }
    document.querySelector('[name="select-action').style="display:initial";
});

battle.on('info', function (data) {
    console.log('INFO', data);

    // TODO: display turn info in the #battle-info panel
});

battle.on('end', function (data) {
    console.log('END', data);

    // TODO: re-render the parties so the death of the last character gets reflected
    // TODO: display 'end of battle' message, showing who won
});

window.onload = function () {
    actionForm = document.querySelector('form[name=select-action]');
    targetForm = document.querySelector('form[name=select-target]');
    spellForm = document.querySelector('form[name=select-spell]');
    infoPanel = document.querySelector('#battle-info');

    actionForm.addEventListener('submit', function (evt) {
        evt.preventDefault();

        // TODO: select the action chosen by the player
        // TODO: hide this menu
        // TODO: go to either select target menu, or to the select spell menu
    });

    targetForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the target chosen by the player
        // TODO: hide this menu
    });

    targetForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
        // TODO: hide this form
        // TODO: go to select action menu
    });

    spellForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the spell chosen by the player
        // TODO: hide this menu
        // TODO: go to select target menu
    });

    spellForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
        // TODO: hide this form
        // TODO: go to select action menu
    });

    battle.start();
};
