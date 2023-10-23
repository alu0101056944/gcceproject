const currentDate = new Date();
const currentDay = currentDate.getDate();
const currentMonth = currentDate.getMonth() + 1; // Add 1 to get a 1-based month
const currentYear = currentDate.getFullYear();

console.log(`Current Date: ${currentYear}-${currentMonth}-${currentDay}`);