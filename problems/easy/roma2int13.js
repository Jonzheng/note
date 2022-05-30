/**
  Input: s = "MCMXCIV"
  Output: 1993
  Explanation: M = 1000, CM = 900, XC = 90 and IV = 3.
  左减只能是1位
 */
const roma2int = (s) => {
  let mp = { M: 1000, D: 500, C: 100, L: 50, X: 10, V: 5, I: 1 }
  let arr = s.split('')
  let idx = 0;
  let res = 0;
  while (idx < arr.length) {
    if (idx + 1 < arr.length) {
      if (mp[arr[idx]] < mp[arr[idx + 1]]) {
        res += mp[arr[idx + 1]] - mp[arr[idx]]
        idx++;
      } else {
        res += mp[arr[idx]]
      }
    } else {
      res += mp[arr[idx]]
    }
    idx++;
  }
  return res;
}

let ans = roma2int('MCD')
console.log('ans', ans)