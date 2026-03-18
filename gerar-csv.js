const fs = require('fs');

const fileName = 'herois_100k.csv';
const stream = fs.createWriteStream(fileName);

stream.write('civilName,heroName,age,team,photoUrl\n');

console.log('🚀 Gerando exatamente 100.000 linhas...');

for (let i = 1; i <= 100000; i++) {
  let civilName = `Nome Civil ${i}`;
  let heroName = `Heroi ${i}`;
  let age = 20 + (i % 50);
  let team = i % 2 === 0 ? 'Avengers' : 'Justice League';
  let photoUrl = ''; 


  if (i === 10) age = 'TRINTA'; 
  if (i === 20) photoUrl = 'perfil.pdf'; 
  if (i === 30) heroName = ''; 

  stream.write(`${civilName},${heroName},${age},${team},${photoUrl}\n`);

  if (i % 25000 === 0) console.log(`... ${i} linhas gravadas no arquivo`);
}

stream.end(() => {
  console.log('\n✅ Arquivo "herois_100k.csv" pronto com 100.000 linhas!');
});