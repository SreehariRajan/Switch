export const findDuration = (timeObject)=>{
    const Time = new Date();
    const year = Number(Time.getFullYear());
    const month = Number(Time.getMonth()+1);
    const day = Number(Time.getDate());
    const hours = Number(Time.getHours());
    const minutes = Number(Time.getMinutes());
    const seconds = Number(Time.getSeconds());
    if (timeObject){
        const currentTotalTiemInSeconds =(day*60*60*24) +(hours*60*60)+(minutes*60)+(seconds);
        const statusTotalTiemInSeconds = (timeObject.day*60*60*24)+(timeObject.hours*60*60)+(timeObject.minutes*60)+(timeObject.seconds);

        const differenceInSeconds = currentTotalTiemInSeconds - statusTotalTiemInSeconds;
        var Hours = 0;
        var Minutes = 0;
        var Seconds = 0;

        if (differenceInSeconds>3600){
            Hours = Math.floor((differenceInSeconds/3600));
            Minutes = differenceInSeconds%3600;
            if (Minutes>1800){
                return {difference:Hours+1,string:"hours"}
            }
            else{
                return {difference:Hours,string:"hours"}
            }
        }
        else{
            if (differenceInSeconds>60){
                Minutes = Math.floor(differenceInSeconds/60);
                Seconds = differenceInSeconds%60;
                if (Seconds>60){
                    return {difference:Minutes+1,string:"min"}
                }
                else{
                    return {difference:Minutes,string:"min"}
                }
            }
            else{
                return {difference:differenceInSeconds,string:"sec"}
            }
        }


        // if (yearDifference===0){
        //     if (monthDifference===0){
        //         if (dayDifference===0){
        //             if (hours)
        //         }
        //     }
        // }
        // if (year===timeObject?.year){
        //     if (month===timeObject.month){
        //         if (day===timeObject.day){
        //             if (hours===timeObject.hours){
        //                 if (minutes === timeObject.minutes){
        //                     return {difference:seconds-timeObject.seconds,string:"sec"}
        //                 }
        //                 else{
        //                     return {difference:minutes-timeObject.minutes,string:"min"}
        //                 }
        //             }
        //             else{
        //                 if (hours-timeObject.hours>1){
        //                     return {difference:hours-timeObject.hours,string:"hours"}
        //                 }
        //                 else{
        //                     return {difference:hours-timeObject.hours,string:"hour"}
        //                 }   
        //             }
        //         }
        //         else{
        //             return undefined
        //         }
        //     }
        //     else{
        //         return undefined
        //     }
        // }
        // else{
        //     return undefined
        // }
    }

}