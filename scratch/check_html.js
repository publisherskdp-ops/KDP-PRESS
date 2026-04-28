const fs = require('fs');
const content = fs.readFileSync('c:/Users/Muhammad Ali Soomro/Desktop/kdp-press/src/app/dashboard/publish/page.tsx', 'utf8');

let balance = 0;
const tags = content.match(/<div|<\/div/g);
tags.forEach(tag => {
  if (tag === '<div') balance++;
  else balance--;
});
console.log('Total div balance:', balance);

// Now check step 2 block specifically
const step2Start = content.indexOf('{step === 2 && (');
const step2End = content.indexOf(')}', step2Start);
const step2Content = content.substring(step2Start, step2End);

let s2Balance = 0;
const s2Tags = step2Content.match(/<div|<\/div/g);
s2Tags.forEach(tag => {
  if (tag === '<div') s2Balance++;
  else s2Balance--;
});
console.log('Step 2 div balance:', s2Balance);
