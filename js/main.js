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
    var list = Object.keys(battle._charactersById);
    var render;
    var partyR =document.querySelectorAll('.party');
    partyR[0].innerHTML = '';
    partyR[1].innerHTML = '';
    var aux = battle._charactersById;
    for (var i = 0; i < list.length; i++){
	if (aux[list[i]].hp >0){
            render = '<li data-chara-id="'+ list[i]+'">'+aux[list[i]].name+' (HP:<strong>'
	    +aux[list[i]].hp+'</strong>/'+aux[list[i]].maxHp+', MP: <strong>'+aux[list[i]].mp+
	    '</strong>/'+aux[list[i]].maxMp;
	}
	else{
	    render = '<li data-chara-id="'+ list[i]+'" class="dead">'+aux[list[i]].name+' (HP:<strong>'
	    +aux[list[i]].hp+'</strong>/'+aux[list[i]].maxHp+', MP: <strong>'+aux[list[i]].mp+
	    '</strong>/'+aux[list[i]].maxMp;
	}
	// Porque sabemos que los unicos elementos de esta clase son las listas de party heroes y monster	
	if(aux[list[i]].party === 'heroes'){
	    partyR[0].innerHTML += render;
	}
	else if(aux[list[i]].party === 'monsters'){
	    partyR[1].innerHTML += render;
	}
    }
    // TODO: highlight current character
    var el = document.querySelector('[data-chara-id="'+data.activeCharacterId+'"]');
    el.classList.add("active");
    // TODO: show battle actions form
    //
    // Primero reiniciamos el formulario a los valores por defecto
    //
    // Porque sabemos que los unicos elementos de esta clase son las listas de opciones
    // 0 es el primer formulario que es el de accion, 1 sera el de hechizos y 2 el de target.
    writeForm(0);
    actionForm.style="display:block";
});

battle.on('info', function (data) {
    console.log('INFO', data);

    // TODO: display turn info in the #battle-info panel
    var name = battle._charactersById[data.activeCharacterId].name;
    var target = battle._charactersById[data.activeCharacterId].name;
    var effectsTxt = prettifyEffect(data.effect || {});
    if (data.action === 'attack'){
	if (data.success){
            infoPanel.innerHTML = '<strong>'+ name +'</strong> attacked <strong>' + target +
            '</strong> and caused ' + effectsTxt;
	}
	else {
	    infoPanel.innerHTML = '<strong>'+ name +'</strong> missed the attack';
	}
    }
    if (data.action === 'cast'){
	if (data.success){
            infoPanel.innerHTML = '<strong>'+ name +'</strong> casted <em>' + data.scrollName +
            '</em> on <strong>' + target + '</strong> and caused ' + effectsTxt;
	}
	else {
	    infoPanel.innerHTML = '<strong>'+ name +'</strong> failed to cast an spell';
	}
    }
    if (data.action === 'defend'){
        infoPanel.innerHTML = '<strong>'+ name +'</strong> defense raises. New defense: ' +
       	data.newDefense;
    }
});

battle.on('end', function (data) {
    console.log('END', data);

    // TODO: re-render the parties so the death of the last character gets reflected
    var list = Object.keys(battle._charactersById);
    var render;
    var partyR =document.querySelectorAll('.party');
    partyR[0].innerHTML = '';
    partyR[1].innerHTML = '';
    var aux = battle._charactersById;
    for (var i = 0; i < list.length; i++){
	if (aux[list[i]].hp >0){
            render = '<li data-chara-id="'+ list[i]+'">'+aux[list[i]].name+' (HP:<strong>'
	    +aux[list[i]].hp+'</strong>/'+aux[list[i]].maxHp+', MP: <strong>'+aux[list[i]].mp+
	    '</strong>/'+aux[list[i]].maxMp;
	}
	else{
	    render = '<li data-chara-id="'+ list[i]+'" class="dead">'+aux[list[i]].name+' (HP:<strong>'
	    +aux[list[i]].hp+'</strong>/'+aux[list[i]].maxHp+', MP: <strong>'+aux[list[i]].mp+
	    '</strong>/'+aux[list[i]].maxMp;
	}
	// Porque sabemos que los unicos elementos de esta clase son las listas de party heroes y monster	
	if(aux[list[i]].party === 'heroes'){
	    partyR[0].innerHTML += render;
	}
	else if(aux[list[i]].party === 'monsters'){
	    partyR[1].innerHTML += render;
	}
    }
    // TODO: display 'end of battle' message, showing who won
    infoPanel.innerHTML = 'The ' + data.winner + ' won the battle';
});
function writeForm(form){
    document.querySelectorAll('.choices')[form].innerHTML = '';
    var opt = battle.options.list();
    for (var i = 0; i< opt.length;i++){
        document.querySelectorAll('.choices')[form].innerHTML += 
        '<li><label><input type="radio" name="option" value="'+ opt[i]+'" required>'+opt[i]+'</li>';
    }
    // Si i vale 0 es que no ha entrado en el bucle asi que el boton está desactivado,
    // si vale algo distinto lo activa
    if (i === 0){
        document.querySelectorAll('button[type="submit"]')[form].disabled = true;
    }
    else
	document.querySelectorAll('button[type="submit"]')[form].disabled = false;
}
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
	actionForm.style="display:none";
        // TODO: go to either select target menu, or to the select spell menu
	if (action === 'cast') {
	    writeForm(1);
	    spellForm.style="display:block";
	}
	else if (action === 'attack') {
	    writeForm(2);
	    targetForm.style="display:block";
	}
    });

    targetForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the target chosen by the player
	var action = targetForm.elements['option'].value;
        battle.options.select(action);
        // TODO: hide this menu
	targetForm.style="display:none";
    });

    targetForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
	battle.options.cancel();
        // TODO: hide this form
	targetForm.style="display:none";
        // TODO: go to select action menu
	writeForm(0);
        actionForm.style="display:block";
    });

    spellForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the spell chosen by the player
	var action = spellForm.elements['option'].value;
        battle.options.select(action);
        // TODO: hide this menu
	spellForm.style="display:none";
        // TODO: go to select target menu
	writeForm(2);
        targetForm.style="display:block";
    });

    spellForm.querySelector('.cancel')
    .addEventListener('click', function (evt) {
        evt.preventDefault();
        // TODO: cancel current battle options
	battle.options.cancel();
        // TODO: hide this form
	spellForm.style="display:none";
        // TODO: go to select action menu
	writeForm(0);
        actionForm.style="display:block";
    });

    battle.start();
};
