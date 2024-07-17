import { adToBs, bsToAd } from "@sbmdkl/nepali-date-converter";
import { convertDateObjectToDateFormatString } from "./dateObjectToDateFormatString";

export const convertNepaliDate =(value) =>{
    const date = new Date(value);
    const formattedDate = convertDateObjectToDateFormatString(date)
    const convertedDate = adToBs(formattedDate); 
    return convertedDate;
};

export const convertEnglishDate =(value) =>{
    const date = new Date(value);
    const formattedDate = convertDateObjectToDateFormatString(date)
    const convertedDate = bsToAd(formattedDate); 
    return convertedDate;
};