const inventoryModel= require('../models/inventoryModel');
const userModel= require('../models/userModel');

const createInventoryController= async (req,res)=> {
    try{
        const {email, inventoryType}= req.body;
        const user= await userModel.findOne({email});
        if(!user){
            throw new Error('User not found');
        }
        if(inventoryType==='in' && user.role!=='donor'){
            throw new Error('Not a donor account');
        }
        if(inventoryType==='out' && user.role!=='hospital'){
            throw new Error('Not a hospital');
        }

        const inventory= new inventoryModel(req.body);
        await inventory.save();
        return res.status(201).send({
            success: true,
            message: 'New blood record added'
        });
    }catch(error){
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in inventory API',
            error
        });
    }
};

const getInventoryController= async (req,res) => {
    try{
        const inventory= await inventoryModel.find({organisation: req.body.userId});
        return res.status(200).send({
            success: true,
            message: 'Got all records successfully',
            inventory
        });
    }catch(error){
        console.log(error);
        return res.status(500).send({
            success: false,
            message: 'Error in getting all inventories',
            error
        });
    }
};

module.exports= {createInventoryController, getInventoryController};