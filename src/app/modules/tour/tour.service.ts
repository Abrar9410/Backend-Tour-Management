import { deleteImageFromCLoudinary } from "../../config/cloudinary.config";
import { QueryBuilder } from "../../utils/QueryBuilder";
import { tourSearchableFields } from "./tour.constant";
import { ITour, ITourType } from "./tour.interface";
import { Tours, TourTypes } from "./tour.model";

const createTourService = async (payload: ITour) => {
    const existingTour = await Tours.findOne({ title: payload.title });
    if (existingTour) {
        throw new Error("A tour with this title already exists.");
    }

    // const baseSlug = payload.title.toLowerCase().split(" ").join("-")
    // let slug = `${baseSlug}`

    // let counter = 0;
    // while (await Tour.exists({ slug })) {
    //     slug = `${slug}-${counter++}` // dhaka-division-2
    // }

    // payload.slug = slug;

    const tour = await Tours.create(payload)

    return tour;
};

// const getAllToursServiceOld = async (query: Record<string, string>) => {
//     console.log(query);
//     const filter = query
//     const searchTerm = query.searchTerm || "";
//     const sort = query.sort || "-createdAt";
//     const page = Number(query.page) || 1
//     const limit = Number(query.limit) || 10
//     const skip = (page - 1) * limit

//     //field filtering
//     const fields = query.fields?.split(",").join(" ") || ""

//     //old field => title,location
//     //new fields => title location

//     // delete filter["searchTerm"]
//     // delete filter["sort"]



//     for (const field of excludeField) {
//         // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
//         delete filter[field]
//     }

//     console.log(filter);



//     const searchQuery = {
//         $or: tourSearchableFields.map(field => ({ [field]: { $regex: searchTerm, $options: "i" } }))
//     }

//     // [remove][remove][remove](SKip)[][][][][][]

//     // [][][][][](limit)[remove][remove][remove][remove]

//     // 1 page => [1][1][1][1][1][1][1][1][1][1] skip = 0 limit =10
//     // 2 page => [1][1][1][1][1][1][1][1][1][1]=>skip=>[2][2][2][2][2][2][2][2][2][2]<=limit skip = 10 limit =10
//     // 3 page => [1][1][1][1][1][1][1][1][1][1]=>skip=>[2][2][2][2][2][2][2][2][2][2]<=limit skip = 20 limit = 10

//     // skip = (page -1) * 10 = 30

//     // ?page=3&limit=10

//     // const tours = await Tours.find(searchQuery).find(filter).sort(sort).select(fields).skip(skip).limit(limit);

//     const filterQuery = Tours.find(filter)

//     const tours = filterQuery.find(searchQuery)

//     const allTours = await tours.sort(sort).select(fields).skip(skip).limit(limit)

//     // location = Dhaka
//     // search = Golf
//     const totalTours = await Tours.countDocuments();
//     // const totalPage = 21/10 = 2.1 => ceil(2.1) => 3
//     const totalPage = Math.ceil(totalTours / limit)

//     const meta = {
//         page: page,
//         limit: limit,
//         total: totalTours,
//         totalPage: totalPage,
//     }
//     return {
//         data: allTours,
//         meta: meta
//     }
// };

const getAllToursService = async (query: Record<string, string>) => {


    const queryBuilder = new QueryBuilder(Tours.find(), query)

    const tours = await queryBuilder
        .search(tourSearchableFields)
        .filter()
        .sort()
        .fields()
        .paginate()

    // const meta = await queryBuilder.getMeta()

    const [data, meta] = await Promise.all([
        tours.build(),
        queryBuilder.getMeta()
    ])


    return {
        data,
        meta
    }
};


const updateTourService = async (id: string, payload: Partial<ITour>) => {

    const existingTour = await Tours.findById(id);

    if (!existingTour) {
        throw new Error("Tour not found.");
    };

    // if (payload.title) {
    //     const baseSlug = payload.title.toLowerCase().split(" ").join("-")
    //     let slug = `${baseSlug}`

    //     let counter = 0;
    //     while (await Tour.exists({ slug })) {
    //         slug = `${slug}-${counter++}` // dhaka-division-2
    //     }

    //     payload.slug = slug
    // }

    if (payload.images && payload.images.length > 0 && existingTour.images && existingTour.images.length > 0) {
        payload.images = [...payload.images, ...existingTour.images];
    };

    if (payload.deleteImages && payload.deleteImages.length > 0 && existingTour.images && existingTour.images.length > 0) {

        const restDBImages = existingTour.images.filter(imageUrl => !payload.deleteImages?.includes(imageUrl))

        const updatedPayloadImages = (payload.images || [])
            .filter(imageUrl => !payload.deleteImages?.includes(imageUrl))
            .filter(imageUrl => !restDBImages.includes(imageUrl));

        payload.images = [...restDBImages, ...updatedPayloadImages];
    };

    const updatedTour = await Tours.findByIdAndUpdate(id, payload, { new: true });

    if (payload.deleteImages && payload.deleteImages.length > 0 && existingTour.images && existingTour.images.length > 0) {
        await Promise.all(payload.deleteImages.map(url => deleteImageFromCLoudinary(url)))
    };

    return updatedTour;
};

const deleteTourService = async (id: string) => {
    return await Tours.findByIdAndDelete(id);
};

const createTourTypeService = async (payload: ITourType) => {
    const existingTourType = await TourTypes.findOne({ name: payload.name });

    if (existingTourType) {
        throw new Error("Tour type already exists.");
    }

    return await TourTypes.create({ name });
};

const getAllTourTypesService = async () => {
    return await TourTypes.find();
};

const updateTourTypeService = async (id: string, payload: ITourType) => {
    const existingTourType = await TourTypes.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }

    const updatedTourType = await TourTypes.findByIdAndUpdate(id, payload, { new: true });
    return updatedTourType;
};

const deleteTourTypeService = async (id: string) => {
    const existingTourType = await TourTypes.findById(id);
    if (!existingTourType) {
        throw new Error("Tour type not found.");
    }

    return await TourTypes.findByIdAndDelete(id);
};

export const TourServices = {
    createTourService,
    createTourTypeService,
    deleteTourTypeService,
    updateTourTypeService,
    getAllTourTypesService,
    getAllToursService,
    updateTourService,
    deleteTourService,
};