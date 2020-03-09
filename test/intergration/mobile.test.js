const request = require('supertest');

let server ;

describe('/api/products' , ()=>{

    beforeEach( ()=>{ server =  require('../../index.js') })
    afterEach ( ()=> { server.close()} )

    describe('GET/' , ()=>{
        it('should return all Mobiles' , async ()=>{
              const res =  await request(server).get('/api/products')
              expect(res.status).toBe(200)
        })  

        it('should return single Mobile Product' , async ()=>{
            const res =  await request(server).get('/api/products/'+'5ca46d3daa772414b43a8e0f')
            expect(res.status).toBe(200)
      })  
    })

    describe('POST /', ()=>{

        it('should post the Mobile Product ' , async ()=>{
            const res = await request(server).post('/api/products/').send( {  

            company: "Nokia",
            model: "n7",
            screen_size: 5.2,
            price: 8500,
            camera_specifications: "12mp hd cam",
            ram: 4,
            isDiscountAvailable: true,
            imageUrl: "www.mobileurl.com/mob",
        
        
        })

            expect(res.status).toBe(200)
            expect(res).not.toBeNull()
            // expect(res.body.phone).toHaveLength(10);
            expect(res.body).toHaveProperty( 'company' ,'Nokia')
        })
    }) 

    describe('UPDATE /', ()=>{

        it('should update the Mobile product ' , async ()=>{
            const res = await request(server).put('/api/products/'+'5ca596f8a870321c188d0ce3').send({
                company: "updatedNokia",
                model: "n7",
                screen_size: 5.2,
                price: 8500,
                camera_specifications: "12mp hd cam",
                ram: 4,
                isDiscountAvailable: true,
                imageUrl: "www.mobileurl.com/mob"
            })
            expect(res.status).toBe(200)
            expect(res).not.toBeNull()
            // expect(res.body.phone).toHaveLength(10);
             expect(res.body).toHaveProperty( 'company' ,'updatedNokia')
           
        })
    }) 

    describe('DELETE /', ()=>{

        it('should delete the Mobile product ' , async ()=>{
            const res = await request(server).delete('/api/products/'+'5ca596f7a870321c188d0ce2')
            expect(res.status).toBe(200)
            
        })
    }) 


})