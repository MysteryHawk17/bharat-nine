const pujaDB = require("../models/pujaModel");
const asynchandler = require("express-async-handler")
const response = require("../middlewares/responseMiddleware");
const cloudinary = require("../utils/cloudinary");
const test = asynchandler(async (req, res) => {
    response.successResponst(res, '', 'Successfully established the puja routes');

})
//use mode to determine the mode of the puja and then accordingly create the new instance of puja db
//update wale me object leke check kr lena and then aaram se decide ho jayega ki kya hai kya nhi waise bhi modes se 
//decide ho jayega
const createOnlinePuja = asynchandler(async (req, res) => {
    const { name, specifications, qna, description, templeIds, based } = req.body;
    if (!name || !specifications || !qna || !description || !templeIds || !based || !req.file) {
        return response.validationError(res, 'Invalid inputs. Please enter all the fields');
    }
    const uploadedImg = await cloudinary.uploader.upload(req.file.path, {
        folder: "Bharat One"
    })
    const image = uploadedImg.secure_url;
    const newPuja = new pujaDB({
        name: name,
        description: description,
        qna: JSON.parse(qna),
        specifications: specifications,
        based: based,
        mode: "ONLINE",
        templeIds: templeIds.split(","),
        image: image,

    })
    const savedPuja = await newPuja.save();
    if (savedPuja) {
        response.successResponst(res, savedPuja, "Successfully created the online puja");
    }
    else {
        response.internalServerError(res, 'Failed to save the puja.');
    }

})
const createOfflinePuja = asynchandler(async (req, res) => {
    const { name, specifications, qna, description, panditIds, based, inclusions } = req.body;
    if (!name || !specifications || !qna || !description || !panditIds || !based || !req.file || !inclusions) {
        return response.validationError(res, 'Invalid inputs. Please enter all the fields');
    }
    const uploadedImg = await cloudinary.uploader.upload(req.file.path, {
        folder: "Bharat One"
    })
    const image = uploadedImg.secure_url;
    const newPuja = new pujaDB({
        name: name,
        description: description,
        qna: JSON.parse(qna),
        specifications: specifications,
        based: based,
        mode: "OFFLINE",
        panditIds: panditIds.split(","),
        image: image,
        inclusions: inclusions.split(',')
    })
    const savedPuja = await newPuja.save();
    if (savedPuja) {
        response.successResponst(res, savedPuja, "Successfully created the Offline puja");
    }
    else {
        response.internalServerError(res, 'Failed to save the puja.');
    }

})

const createBothPuja = asynchandler(async (req, res) => {
    const { name, specifications, qna, description, panditIds, based, templeIds, inclusions } = req.body;
    if (!name || !specifications || !qna || !description || !panditIds || !templeIds || !based || !req.file || !inclusions) {
        return response.validationError(res, 'Invalid inputs. Please enter all the fields');
    }
    const uploadedImg = await cloudinary.uploader.upload(req.file.path, {
        folder: "Bharat One"
    })
    const image = uploadedImg.secure_url;
    const newPuja = new pujaDB({
        name: name,
        description: description,
        qna: JSON.parse(qna),
        specifications: specifications,
        based: based,
        mode: "BOTH",
        panditIds: panditIds.split(","),
        templeIds: templeIds.split(","),
        image: image,
        inclusions: inclusions.split(',')
    })
    const savedPuja = await newPuja.save();
    if (savedPuja) {
        response.successResponst(res, savedPuja, "Successfully created the  puja");
    }
    else {
        response.internalServerError(res, 'Failed to save the puja.');
    }

})

const updatePuja = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        response.validationError(res, "Invalid parameters");
    }
    const findPuja = await pujaDB.findById({ _id: id });
    if (findPuja) {
        const updateData = {};
        const { name, specifications, qna, description, panditIds, based, templeIds, mode ,inclusions} = req.body;
        if (name) {
            updateData.name = name;
        }
        if (specifications) {
            updateData.specifications = specifications;
        }
        if (description) {
            updateData.description = description;
        }
        if (based) {
            updateData.based = based;
        }
        if (qna) {
            updateData.qna = JSON.parse(qna);
        }
        if (panditIds) {
            updateData.panditIds = panditIds.split(",");
        }
        if (templeIds) {
            updateData.templeIds = templeIds.split(",");
        }
        if (mode) {
            updateData.mode = mode;
        }

        if(inclusions){
            updateData.inclusions=inclusions.split(",");
        }
        const updatedPuja = await pujaDB.findByIdAndUpdate({ _id: id }, updateData, { new: true });
        if (updatedPuja) {
            response.successResponst(res, updatedPuja, "successfully updated the puja");
        }
        else {
            response.internalServerError(res, "Failed to update the puja")
        }
    }
    else {
        response.notFoundError(res, 'Cannot found the specified puja');
    }
})

const getAllPuja = asynchandler(async (req, res) => {
    const { mode, based } = req.query;
    const query = {};
    if (mode) {
        query.mode = mode;
    }
    if (based) {
        query.based = based;
    }
    const findAllPuja = await pujaDB.find(query).populate("templeIds").populate("panditIds");
    if (findAllPuja) {
        response.successResponst(res, findAllPuja, "Successfully fetched all the pujas");
    }
    else {
        response.internalServerError(res, "Error in fetchin all the puja");
    }
})

const basedPuja = asynchandler(async (req, res) => {
    const { based } = req.params;
    const findPuja = await pujaDB.find({ based: based }).populate("templeIds").populate("panditIds");
    if (findPuja) {
        response.successResponst(res, findPuja, "Successfully fetched all the pujas");
    }
    else {
        response.internalServerError(res, "Failed to fetch all the puja");
    }
})

const getOnePuja = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return response.validationError(res, 'Error in parameter');
    }
    const findPuja = await pujaDB.findById({ _id: id }).populate("templeIds").populate("panditIds");
    if (findPuja) {
        response.successResponst(res, findPuja, 'successfully fetched the puja');
    }
    else {
        response.notFoundError(res, 'Cannot find the specified puja');
    }
})

const deletePuja = asynchandler(async (req, res) => {
    const { id } = req.params;
    if (!id) {
        return response.validationError(res, 'Error in parameter');
    }
    const findPuja = await pujaDB.findById({ _id: id });
    if (findPuja) {
        const deletedPuja = await pujaDB.findByIdAndDelete({ _id: id });
        if (deletedPuja) {
            response.successResponst(res, deletedPuja, "Deleted puja successfully");
        }
        else {
            response.internalServerError(res, 'Failed to delete the puja .')
        }
    }
    else {
        response.notFoundError(res, 'Cannot find the specified puja');
    }
})

module.exports = { test, createOnlinePuja, createOfflinePuja, createBothPuja, getAllPuja, basedPuja, getOnePuja, deletePuja, updatePuja };

