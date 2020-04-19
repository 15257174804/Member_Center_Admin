import cryptoJs from 'crypto-js';
const Base64 = require('js-base64').Base64;

const stringToBytes  = (str) => {
  var ch, st, re = []; 
  for (var i = 0; i < str.length; i++ ) { 
      ch = str.charCodeAt(i);  // get char  
      st = [];                 // set up "stack"  

      do {  
          st.push( ch & 0xFF );  // push byte to stack  
          ch = ch >> 8;          // shift value down by 1 byte  
      }    

      while ( ch );  
      // add stack contents to result  
      // done because chars have "wrong" endianness  
      re = re.concat( st.reverse() ); 
  }  
  // return an array of bytes  
  return re;  
}

// DES加密
export const encryptDes = (message, key) => {
  var keyHex = cryptoJs.enc.Utf8.parse(key)
  console.log(keyHex);
  var option = { mode: cryptoJs.mode.ECB, padding: cryptoJs.pad.Pkcs7 }
  console.log(option);
  var encrypted = cryptoJs.DES.encrypt(message, keyHex, option)
  console.log(Base64.encode(stringToBytes(encrypted.ciphertext.toString())));
  return encrypted.toString()
}

// DES解密
export const decryptDes = (message, key) => {
  var keyHex = cryptoJs.enc.Utf8.parse(key)
  var decrypted = cryptoJs.DES.decrypt(
    {
      ciphertext: cryptoJs.enc.Hex.parse(message)
    },
    keyHex,
    {
      mode: cryptoJs.mode.ECB,
      padding: cryptoJs.pad.Pkcs7
    }
  )
  return decrypted.toString(cryptoJs.enc.Utf8)
}


