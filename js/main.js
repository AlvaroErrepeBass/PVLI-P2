var battle = new RPG.Battle();
var actionForm, spellForm, targetForm;
var infoPanel;
var auxFX = 1;

function sound(){
    // No es necesario pero implementamos musica de batalla y un efecto de seleccion de opcion
    // Usamos un audio en silencio para conseguir que se reproduzca el loop de musica de batalla
    // justo despues de la entrada sin que se note un silencio a la hora de cargar el audio
    var aud = document.getElementById('silence');
    aud.onended = function (){
        document.getElementById('battleMusic').play();
    };
    
}

function fx(){
    // No es posible volver a reproducir un audio cuando ya se esta reproduciendo por eso tenemos
    // dos elementos de audio que tienen el mismo fx y cada vez se reproduce uno distinto
    if (auxFX === 1){
	document.getElementById('beep1').play();
	auxFX = 2;
    }
    else if (auxFX === 2){
	document.getElementById('beep2').play();
	auxFX = 1;
    }
}

function writeForm(form){
    document.querySelectorAll('.choices')[form].innerHTML = '';
    var opt = battle.options.list();
    for (var i = 0; i< opt.length;i++){
	if (form !== 2){
            document.querySelectorAll('.choices')[form].innerHTML += 
            '<li><label><input type="radio" name="option" value="'+ opt[i]+'" required>'+opt[i]+
	    '</label></li>';
	}
	else{
	    var color;
	    if (battle._charactersById[opt[i]].party === 'heroes'){
	        color = 'style="background:#2EE458"';
	    }
	    else
		color = 'style="background:#E93915"';
	    document.querySelectorAll('.choices')[form].innerHTML += 
            '<li><label ' + color + '><input type="radio" name="option" value="'+ opt[i]+
	    '" required>' + opt[i] + '</label></li>';
	}
    }
    // Si i vale 0 es que no ha entrado en el bucle asi que el boton está desactivado,
    // si vale algo distinto lo activa
    if (i === 0){
        document.querySelectorAll('button[type="submit"]')[form].disabled = true;
    }
    else
	document.querySelectorAll('button[type="submit"]')[form].disabled = false;
}

function prettifyEffect(obj) {
    return Object.keys(obj).map(function (key) {
        var sign = obj[key] > 0 ? '+' : ''; // show + sign for positive effects
        return `${sign}${obj[key]} ${key}`;
    }).join(', ');
}

function getRandomParty(party){
	var rnd = Math.floor(Math.random ()* (5 -1) + 1);
	var rnd2;
	var array = [];
	if (party === 'heroes'){
		for (var i = 0; i < rnd; i++){
			rnd2 = Math.floor(Math.random ()* (3 -1) + 1);
			switch (rnd2){
				case 1: 
				array[i] = RPG.entities.characters.heroTank;
				break;
				case 2:
				array [i] = RPG.entities.characters.heroWizard;
				break;
			}
		}

	}
	else {
		for (var i = 0; i < rnd; i++){
			rnd2 = Math.floor(Math.random ()* (4 -1) + 1);
			switch(rnd2){
				case 1: 
				array[i] = RPG.entities.characters.monsterBat;
				break;

				case 2:
				array[i] = RPG.entities.characters.monsterSkeleton;
				break;

				case 3:
				array[i] = RPG.entities.characters.monsterSlime;
				break;
			}
		}
	}
	
	return array;
}

battle.setup({
    heroes: {
        members: getRandomParty('heroes'),
            /*[
            RPG.entities.characters.heroTank,
            RPG.entities.characters.heroWizard
            ],*/
        
        grimoire: [
            RPG.entities.scrolls.health,
            RPG.entities.scrolls.fireball
        ]
    },
    monsters: {
        members: getRandomParty('monsters')
        /*[
            RPG.entities.characters.monsterSlime,
            RPG.entities.characters.monsterBat,
            RPG.entities.characters.monsterSkeleton,
            RPG.entities.characters.monsterBat
        ]*/
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
    var partyR = document.querySelectorAll('.character-list');
    partyR[0].innerHTML = '';
    partyR[1].innerHTML = '';
    var aux = battle._charactersById;
    for (var i = 0; i < list.length; i++){
	if (aux[list[i]].hp >0){
            render = '<li data-chara-id="'+ list[i]+'">'+aux[list[i]].name+' (HP:<strong>'
	    +aux[list[i]].hp+'</strong>/'+aux[list[i]].maxHp+', MP: <strong>'+aux[list[i]].mp+
	    '</strong>/'+aux[list[i]].maxMp + ')';
	}
	else{
	    render = '<li data-chara-id="'+ list[i]+'" class="dead">'+aux[list[i]].name+' (HP:<strong>'
	    +aux[list[i]].hp+'</strong>/'+aux[list[i]].maxHp+', MP: <strong>'+aux[list[i]].mp+
	    '</strong>/'+aux[list[i]].maxMp + ')';
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
    var target = battle._charactersById[data.targetId].name;
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
    var partyR =document.querySelectorAll('.character-list');
    partyR[0].innerHTML = '';
    partyR[1].innerHTML = '';
    var aux = battle._charactersById;
    for (var i = 0; i < list.length; i++){
	if (aux[list[i]].hp >0){
            render = '<li data-chara-id="'+ list[i]+'">'+aux[list[i]].name+' (HP:<strong>'
	    +aux[list[i]].hp+'</strong>/'+aux[list[i]].maxHp+', MP: <strong>'+aux[list[i]].mp+
	    '</strong>/'+aux[list[i]].maxMp + ')';
	}
	else{
	    render = '<li data-chara-id="'+ list[i]+'" class="dead">'+aux[list[i]].name+' (HP:<strong>'
	    +aux[list[i]].hp+'</strong>/'+aux[list[i]].maxHp+', MP: <strong>'+aux[list[i]].mp+
	    '</strong>/'+aux[list[i]].maxMp + ')';
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
    document.body.innerHTML += '<center><form name="reset" style="display:block">' +
                '<p><button type="submit">FIGHT AGAIN</button></p>' +
                '</form></center>';
    var vMusic = '<audio id="victory" autoplay src="sound/Victory.ogg"></audio>';
    document.querySelector('.sound').innerHTML = vMusic;
});

window.onload = function () {
    actionForm = document.querySelector('form[name=select-action]');
    targetForm = document.querySelector('form[name=select-target]');
    spellForm = document.querySelector('form[name=select-spell]');
    infoPanel = document.querySelector('#battle-info');
    sound();

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
	fx();
    });

    actionForm.onchange = function(){
	fx();
    };

    targetForm.addEventListener('submit', function (evt) {
        evt.preventDefault();
        // TODO: select the target chosen by the player
	var action = targetForm.elements['option'].value;
        battle.options.select(action);
        // TODO: hide this menu
	targetForm.style="display:none";
	fx();
    });

    targetForm.onchange = function(){
	fx();
    };

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
	fx();
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
	fx();
    });

    spellForm.onchange = function(){
	fx();
    };

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
	fx();
    });

    battle.start();
};
