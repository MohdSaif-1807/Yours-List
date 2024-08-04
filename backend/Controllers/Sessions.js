import { SessionModels } from "../Models/SessionModels.js";

export const getAllSessions = async (req, res) => {
    try {
        const data = await SessionModels.find();
        res.status(200).json({
            'message': 'data fetched successfully',
            'data': data
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