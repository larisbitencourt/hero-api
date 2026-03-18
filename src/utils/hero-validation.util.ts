export function validateHeroRow(row: any) {
  
  if (!row.heroName || typeof row.heroName !== 'string' || row.heroName.trim() === '') {
    throw { column: 'heroName', message: 'Nome do herói inválido ou vazio, precisa ser um texto' };
  }

  if (!row.civilName || typeof row.civilName !== 'string' || row.civilName.trim() === '') {
    throw { column: 'civilName', message: 'Nome civil inválido ou vazio, precisa ser um texto' };
  }

  const age = Number(row.age);
  if (isNaN(age)) {
    throw { column: 'age', message: `Idade inválida, precisa ser um número: ${row.age}` };
  }

  if (row.team) {
    if (typeof row.team !== 'string' || row.team.trim() === '') {
      throw { column: 'team', message: 'O campo team deve ser um texto válido' };
    }
  }

 
  if (row.photoUrl) {
    if (typeof row.photoUrl !== 'string' || row.photoUrl.trim() === '') {
      throw { column: 'photoUrl', message: 'O campo photoUrl deve ser um texto válido' };
    }

    const url = row.photoUrl.trim();
    const imageRegex = /\.(jpg|jpeg|png|gif|webp)$/i;
    
    if (!imageRegex.test(url)) {
      throw { column: 'photoUrl', message: 'A photoUrl precisa ser um link de imagem (.jpg, .png, etc)' };
    }
  }

  return {
    heroName: row.heroName.trim(),
    civilName: row.civilName.trim(),
    age: age,
    team: row.team?.trim() || null,
    photoUrl: row.photoUrl ? row.photoUrl.trim() : null,
  };
}