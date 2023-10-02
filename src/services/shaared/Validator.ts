import { SpaceEntry } from "../model/Model";

export class MissingFieldError extends Error {
    constructor(missingField: string) {
        super(`Missing field ${missingField}`);
        
    }
}

export const validatedAsSpaceEntry = (data: SpaceEntry) => {
    if(!data.name){
        throw new MissingFieldError("name");
    }
    if(!data.description){
        throw new MissingFieldError("description");
    }
    if(!data.location){
        throw new MissingFieldError("location");
    }
    if(!data.photoUrl){
        throw new MissingFieldError("photoUrl");
    }
}