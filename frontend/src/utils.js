export const colors = {
  grass: '#a8ff98',
  poison: '#d6a2e4',
  normal: '#dcdcdc',
  fire: '#ffb971',
  water: '#8cc4e2',
  electric: '#F8D030',
  ice: '#8cf5e4',
  fighting: '#da7589',
  ground: '#e69a74',
  flying: '#bbc9e4',
  // psychic: '#ffa5da',
  psychic: '#a29bfe',
  bug: '#bae05f',
  rock: '#C9BB8A',
  ghost: '#8291e0',
  dark: '#8e8c94',
  dragon: '#88a2e8',
  steel: '#9fb8b9',
  // steel: '#B8B8D0',
  fairy: '#fdb9e9',
};

// Modal Overlay Background Colors
export const bgs = {
  grass: 'rgba(120, 200, 80, 0.5)',
  poison: 'rgba(160, 64, 160, 0.5)',
  normal: ' rgba(168, 168, 120, 0.5)',
  fire: 'rgb(240, 128, 48, 0.5)',
  water: 'rgba(104, 144, 240, 0.5)',
  electric: 'rgba(248, 208, 48, 0.5)',
  ice: 'rgba(152, 216, 216, 0.5)',
  fighting: ' rgba(192, 48, 40, 0.5)',
  ground: 'rgba(224, 192, 104, 0.5)',
  flying: 'rgba(168, 144, 240, 0.5)',
  psychic: 'rgba(248, 88, 136, 0.5)',
  bug: 'rgba(168, 184, 32, 0.5)',
  rock: 'rgba(184, 160, 56, 0.5)',
  ghost: 'rgba(112, 88, 152, 0.5)',
  dark: 'rgba(58, 45, 38, 0.5)',
  dragon: 'rgba(112, 56, 248, 0.5)',
  steel: 'rgba(184, 184, 208, 0.5)',
  fairy: 'rgba(238, 153, 172, 0.5)',
};

export const releasePokemon = (myTeam, id) => {
  // console.log(
  //   '\n\n=================== INSIDE releasePokemon ===================\n'
  // );
  // console.log('** Current Team:', myTeam);
  // console.log('ID to Remove:', id);

  const updatedTeam = myTeam.filter(member => member !== id);
  // console.log('Updated Team:', updatedTeam);
  // console.log(
  //   '=================== EXIT releasePokemon ===================\n\n'
  // );

  return updatedTeam;
};

export const catchPokemon = (myTeam, id) => {
  // console.log(
  //   '\n\n=================== INSIDE catchPokemon ===================\n'
  // );
  // console.log('** Current Team:', myTeam);
  // console.log(`     ADDING POKEMON WITH ID ${id} TO myTeam`);

  const updatedTeam = [...myTeam, id];
  // console.log('Updated Team:', updatedTeam);
  // console.log(
  //   '=================== EXIT catchPokemon =====================\n\n'
  // );

  return updatedTeam;
};

export const isInTeam = (myTeam, id) => {
  // console.log('\n\n=================== INSIDE isInTeam ===================\n');
  // console.log('** CHECK IF IN myTeam:', myTeam);
  // console.log('Current ID:', id);

  const isPresent = myTeam.includes(id);
  // console.log(`ID ${id} ${isPresent ? 'IS' : 'IS NOT'} IN TEAM!!!`);
  // console.log('=================== EXIT UTIL ===================\n\n');

  return isPresent;
};

export function getRandomID(max) {
  return Math.floor(Math.random() * max);
}

export function capitalize(string) {
  if (typeof string == 'object') {
    let res = string.map(
      (val, idx) =>
        val.charAt(0).toUpperCase() +
        val.slice(1) +
        (idx != string.length - 1 ? ', ' : '')
    );
    return res;
  }

  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function getType(list) {
  const typeList = [];
  list.forEach(ele => {
    typeList.push(ele.type.name);
  });
  // console.log(typeList);
  return typeList;
}

export function getAbilities(list) {
  const abilityList = [];
  list.forEach(ele => {
    abilityList.push(ele.ability.name);
  });
  makeString(abilityList);
  return abilityList;
}

export function getMoves(list) {
  const movesList = [];
  list.forEach(ele => {
    movesList.push(ele.move.name);
  });
  makeString(movesList);
  return movesList;
}

export function makeString(list) {
  let newString = '';

  for (let i = 0; i < list.length; i++) {
    newString += list[i] + (i != list.length - 1 ? ', ' : '');
  }
  return newString;
}

export const getBackgroundColors = type => {
  if (type.length === 2) {
    return [colors[type[0]], colors[type[1]]];
  }
  return [colors[type[0]], colors[type[0]]];
};

export const getFontSize = (text, isMobileView) => {
  const length = String(text).length;
  return length > 13
    ? isMobileView
      ? '.7rem'
      : '1rem'
    : isMobileView
    ? '1.5rem'
    : '2rem';
};

export const getIdPosition = (idString, isMobileView) => ({
  left:
    idString.length > 3
      ? isMobileView
        ? '250px'
        : '340px'
      : isMobileView
      ? '220px'
      : '300px',
  top:
    idString.length > 3
      ? isMobileView
        ? '20px'
        : '30px'
      : isMobileView
      ? '10px'
      : '20px',
});

export const getIdFontSize = (idString, isMobileView) => {
  return idString.length > 3
    ? isMobileView
      ? '1.7rem'
      : '2.5rem'
    : isMobileView
    ? '3rem'
    : '4.5rem';
};
