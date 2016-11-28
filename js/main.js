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
    //
    // Primero restablecemos la configuración de html por defecto
    //
    document.querySelector('.parties').innerHTML = '<section id="heroes" class="party">' + 
	'<h1>Heroes</h1> <ul class="character-list"></ul> </section> <section id="monsters"' + 
	'class="party"> <h1>Monsters</h1> <ul class="character-list"></ul> </section>';
    var list = Object.keys(battle._charactersById);
    var render;
    var aux = battle._charactersById;
    for (var i = 0; i < list.length; i++){
        render = '<li data-chara-id="'+ list[i]+'">'+aux[list[i]].name+' (HP:<strong>'
		+aux[list[i]].hp+'</strong>/'+aux[list[i]].maxHp+', MP: <strong>'+aux[list[i]].mp+
		'</strong>/'+aux[list[i]].maxMp;
	// Porque sabemos que los unicos elementos de esta clase son las listas de party heroes y monster	
	if(aux[list[i]].party === 'heroes'){
	    document.querySelectorAll('.party')[0].innerHTML += render;
	}
	else if(aux[list[i]].party === 'monsters'){
	    document.querySelectorAll('.party')[1].innerHTML += render;
	}
    }
    // TODO: highlight current character
    var el = document.querySelector('[data-chara-id="'+data.activeCharacterId+'"]');
    el.classList.add("active");
    // TODO: show battle actions form
    //
    // Primero reiniciamos el formulario a los valores por defecto
    //
    document.querySelector('[name="select-action').innerHTML = '<ul class="choices"></ul>' +
         '<p><button type="submit">Select action</button></p>';
    // Porque sabemos que los unicos elementos de esta clase son las listas de opciones
    // 0 es el primer formulario que es el de accion.
    var opt = battle.options.list();
    for (var i = 0; i< opt.length;i++){
        document.querySelectorAll('.choices')[0].innerHTML += 
        '<li><label><input type="radio" name="option" value="'+ opt[i]+'" required>'+opt[i]+'</li>';
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
        var action = actionForm.elements['option'].value;
        battle.options.select(action);
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
