const url = 'https://companiesmarketcap.com/largest-companies-by-number-of-employees/';
const pageNumberRegExp = /employees\/?(page\/(?<currentpage>\d+)\/?)?/;

console.log(pageNumberRegExp.exec(url));
