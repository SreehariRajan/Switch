async function IndexFinder(listObject,arrayTocheck){
    var index =await arrayTocheck.findIndex(
        (elmnt,ind)=>elmnt.message === listObject.message &&
                    elmnt.time===listObject.time &&
                    elmnt.timeObject.year===listObject.timeObject.year &&
                    elmnt.timeObject.month===listObject.timeObject.month &&
                    elmnt.timeObject.day===listObject.timeObject.day &&
                    elmnt.timeObject.hours===listObject.timeObject.hours &&
                    elmnt.timeObject.minutes===listObject.timeObject.minutes &&
                    elmnt.timeObject.seconds===listObject.timeObject.seconds &&
                    ind <=arrayTocheck.length 
        );
        return index;
}

export default IndexFinder;