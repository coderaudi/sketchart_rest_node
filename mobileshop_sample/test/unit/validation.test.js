
const validateTest = require('../../validate.js')


describe('Validation fun' , ()=>{
   
    it('check user input - comp name char more than 3 ' , ()=>{
       
          const {error} = validateTest( {
            "company": "testProduct",
            "model": "n7",
            "screen_size": 5.2,
            "price": 8500,
            "camera_specifications": "12mp hd cam",
            "ram": 4,
            "isDiscountAvailable": true,
            "imageUrl": "www.mobileurl.com/mob"
          })
          
          expect(!error);
    })
    
   
})