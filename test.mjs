import { compare } from 'compare-versions';
function toChangeType(allVersion) {
  if (allVersion.length === 0) {
    return null;
  }

  const semanticRegExp = /(\d+?)\.(\d+?)\.(\d+?)/;
  const allSemantic =
      allVersion
      .filter(version => version.match(semanticRegExp))
      .map(version => {
        const regExpResult = version.match(semanticRegExp);
        return `${regExpResult[1]}.${regExpResult[2]}.${regExpResult[3]}`;
      });
  if (allSemantic.length === 0) {
    return 'non-semantic';
  }

  // check if all versions are the same
  for (let i = 1; i < allSemantic.length; i++) {
    if (i >= allSemantic.length - 1) {
      return 'same';
    }
    if (!compare(allSemantic[0], allSemantic[i], '=')) {
      break;
    }
  }

  const allNumbers = [];
  for (const version of allSemantic) {
    const numbers = [];
    const numberRegExp = /\d+/g;
    let execResult;
    while (execResult = numberRegExp.exec(version)) {
      numbers.push(execResult[0]);
    }
    allNumbers.push(numbers);
  }

  let changeType = 'major';

  const allChangeType = ['major', 'minor', 'patch'];
  for (let i = 0; i < 3; i++) { // [major|minor|patch]
    changeType = allChangeType[i];
    const relevantNumbers = allNumbers.map(numbers => numbers[i]);
    const thereIsChange = new Set(relevantNumbers).size > 1;
    if (thereIsChange) {
      break;
    }
  }

  return changeType;
}


const versions = [
  '18.2.0',
  '18.1.0',
  '17.8.0'
]

const changeType = toChangeType(versions);
console.log(changeType);
