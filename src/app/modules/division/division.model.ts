import { model, Schema } from "mongoose";
import { IDivision } from "./division.interface";


const divisionSchema = new Schema<IDivision>({
    name: {type: String, required: true},
    slug: {type: String, unique: true},
    thumbnail: {type: String},
    description: {type: String}
}, {
    timestamps: true
});

export const Divisions = model<IDivision>("Divisions", divisionSchema);