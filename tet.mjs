import { inspect } from 'util';

async function myfetch() {
  const url = 
    `https://api.github.com/repos/Teidesat/paqueteCommsOBC/commits`;
  const response = await fetch(url,
      {
        headers: {'User-Agent': 'Our script'},
      });
  const json = await response.json();
  console.log(inspect(json));
}

myfetch();
