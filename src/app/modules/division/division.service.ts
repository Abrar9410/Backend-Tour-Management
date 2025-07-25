import { IDivision } from "./division.interface";
import { Divisions } from "./division.model";

const createDivisionService = async (payload: IDivision) => {

    const existingDivision = await Divisions.findOne({ name: payload.name });
    if (existingDivision) {
        throw new Error("A division with this name already exists.");
    }

    const division = await Divisions.create(payload);

    return division
};

const getAllDivisionsService = async () => {
    const divisions = await Divisions.find({});
    const totalDivisions = await Divisions.countDocuments();
    return {
        data: divisions,
        meta: {
            total: totalDivisions
        }
    }
};
const getSingleDivisionService = async (slug: string) => {
    const division = await Divisions.findOne({ slug });
    return {
        data: division,
    }
};



const updateDivisionService = async (id: string, payload: Partial<IDivision>) => {

    const existingDivision = await Divisions.findById(id);
    if (!existingDivision) {
        throw new Error("Division not found.");
    }

    const duplicateDivision = await Divisions.findOne({
        name: payload.name,
        _id: { $ne: id },
    });

    if (duplicateDivision) {
        throw new Error("A division with this name already exists.");
    }

    const updatedDivision = await Divisions.findByIdAndUpdate(id, payload, { new: true, runValidators: true })

    return updatedDivision;

};

const deleteDivisionService = async (id: string) => {
    await Divisions.findByIdAndDelete(id);
    return null;
};

export const DivisionServices = {
    createDivisionService,
    getAllDivisionsService,
    getSingleDivisionService,
    updateDivisionService,
    deleteDivisionService,
};