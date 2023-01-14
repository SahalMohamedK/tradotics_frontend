import { fileSize } from "../utils"

export function fileSizeValidator(size){
    return (files) => {
        for(var i in files){
            if(files[0].size > size){
                return `File should be lessthan ${fileSize(size)}.`
            }
        }
    }
}