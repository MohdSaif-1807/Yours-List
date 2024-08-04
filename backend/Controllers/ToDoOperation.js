import mongoose from "mongoose";
import { TodoModel } from "../Models/TodoModels.js";
import { TodoTypesModels } from "../Models/TodoTypesModels.js";
import { UserInfoModels } from "../Models/UserInfoModels.js";

export const addNewTask = async (req, res) => {
    try {
        const { task, task_date, task_from_time, task_to_time, task_category } = req.body;
        const { _id } = req.user;
        const mongoId = new mongoose.Types.ObjectId(_id);
        const TodoListItem = new TodoModel({
            'task': task,
            'personId': mongoId,
            'task_date': task_date,
            'task_from_time': task_from_time,
            'task_to_time': task_to_time,
            'task_category': task_category
        });
        const item = await TodoListItem.save();
        await UserInfoModels.updateOne({
            '_id': mongoId
        }, {
            $inc: {
                'todoListCount': 1
            }
        })

        await TodoTypesModels.updateOne({
            'personId': mongoId,
            'todoCategories': task_category
        }, {
            $inc: { 'count': 1 }
        })
        res.status(200).json({
            'message': 'Added item successfully',
            item
        })
    }
    catch (err) {
        console.log(err);
        res.status(403).json({
            'message': 'something went wrong',
            'error': err
        })
    }
}



export const getAllItems = async (req, res) => {
    try {
        const { _id } = req.user;
        const mongoId = new mongoose.Types.ObjectId(_id);
        const todoList = await TodoModel.find({ 'personId': mongoId });
        res.status(200).json({
            'message': 'fetched all data',
            'data': todoList
        })
    }
    catch (err) {
        console.log(err);
        res.status(403).json({
            'message': 'something went wrong!!',
            'error': err
        })
    }
}

export const editGetSpecificItems = async (req, res) => {
    try {
        const { _id } = req.user;
        const { id } = req.params;
        console.log(id);
        const editId = new mongoose.Types.ObjectId(id);
        const data = await TodoModel.findOne({ '_id': editId });
        res.status(200).json({
            'message': 'data fetched successfully',
            'data': data
        })
    }
    catch (err) {
        console.log(err);
        res.status(403).json({
            'message': 'something went wrong!',
            'error': err
        })
    }
}



export const updateItems = async (req, res) => {
    try {
        const { task, task_date, task_from_time, task_to_time, task_category } = req.body;
        const { _id } = req.user;
        const { id } = req.params;
        const mongoId = new mongoose.Types.ObjectId(_id);
        const itemId = new mongoose.Types.ObjectId(id);
        const tempData = await TodoModel.findOne({ '_id': itemId });
        const data = await TodoModel.updateOne({
            '_id': itemId
        }, {
            $set: {
                'task': task,
                'task_date': task_date,
                'task_from_time': task_from_time,
                'task_to_time': task_to_time,
                'task_category': task_category
            }
        }, { new: true });

        await UserInfoModels.updateOne({
            '_id': mongoId
        }, {
            $inc: {
                'todoListCount': -1
            }
        })

        await TodoTypesModels.updateOne({
            'personId': mongoId,
            'todoCategories': tempData?.task_category
        }, {
            $inc: { 'count': -1 }
        })


        tempData.task = task;
        tempData.task_date = task_date;
        tempData.task_from_time = task_from_time;
        tempData.task_to_time = task_to_time;
        tempData.task_category = task_category;


        await tempData.save();
        await TodoTypesModels.updateOne({
            'personId': mongoId,
            'todoCategories': task_category
        }, {
            $inc: { 'count': 1 }
        })

        res.status(200).json({
            'message': 'Data updated successfully'
        });
    }
    catch (err) {
        console.log(err);
        res.status(403).json({
            'message': 'something went wrong!',
            'error': err
        });
    }
}

export const addTodoCategory = async (req, res) => {
    try {
        const { todoCategories } = req.body;
        const { _id } = req.user;
        const mongoId = new mongoose.Types.ObjectId(_id);
        const todoCategory = new TodoTypesModels({
            'todoCategories': todoCategories,
            'personId': mongoId,
            'count': 0
        });
        const data = await todoCategory.save();
        res.status(200).json({
            message: 'Todo category added successfully',
            data
        });
    } catch (err) {
        console.log(err);
        res.status(403).json({
            message: 'Something went wrong!',
            error: err
        });
    }
};


export const getTodoCategory = async (req, res) => {
    try {
        const { _id } = req.user;
        const mongoId = new mongoose.Types.ObjectId(_id);
        const data = await TodoTypesModels.find({
            'personId': mongoId
        });
        res.status(200).json({
            'message': 'data succes',
            data
        })
    }
    catch (err) {
        console.log(err);
        res.status(403).json({
            'message': 'something went wrong!!',
            'error': err

        })
    }
}


export const getSpecificCategoryItems = async (req, res) => {
    try {
        const { _id } = req.user;
        const { todoCategories } = req.body;
        const mongoId = new mongoose.Types.ObjectId(_id);
        const todoNotes = await TodoModel.find({ 'personId': mongoId, 'task_category': todoCategories });
        res.status(200).json({
            'message': 'data fetched successfully',
            'data': todoNotes
        })
    }
    catch (err) {
        console.log(err);
        res.status(400).json({
            'message': 'something went wrong!',
            'error': err
        })
    }
}

export const deleteItem = async (req, res) => {

    try {
        const { id } = req.params;
        const { _id } = req.user;
        const mongoId = new mongoose.Types.ObjectId(_id);
        const tempId = new mongoose.Types.ObjectId(id);
        const tempData = await TodoModel.findOne({ '_id': tempId });
        await TodoModel.deleteOne({
            '_id': tempId
        })
        await UserInfoModels.updateOne({
            '_id': mongoId
        }, {
            $inc: {
                'todoListCount': -1
            }
        })
        await TodoTypesModels.updateOne({
            'personId': mongoId,
            'todoCategories': tempData?.task_category
        }, {
            $inc: { 'count': -1 }
        })
        res.status(200).json({
            'message': 'data deleted successfully'
        })
    }
    catch (err) {
        console.log(err);
        res.status(403).json({
            'message': 'something went wrong!!',
            'error': err
        })
    }
}