
const Joi = require('joi'); 

 function validateMobileProduct(mobile){
    const validSchema = {
        company : Joi.string().min(3),
        model: Joi.string().min(2).max(8),
        screen_size: Joi.number(),
        price: Joi.number().greater(0),
        camera_specifications: Joi.string().trim(),
        ram: Joi.number().valid([2,4,8]),
        isDiscountAvailable: Joi.boolean(),
        imageUrl: Joi.string()
    }
    return Joi.validate(mobile , validSchema);
}


function validateSketchartUser(user){
    const validSchema = {
        username : Joi.string().min(3),
        useremail: Joi.string().min(2).max(16),
    }
    return Joi.validate(user , validSchema);
}


module.exports = {
    validateMobileProduct,
    validateSketchartUser
};
