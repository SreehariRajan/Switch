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
                    elmnt.starredMessage === listObject.starredMessage &&
                    elmnt.ImageStatus === listObject.ImageStatus &&
                    elmnt.DocumentStatus === listObject.DocumentStatus &&
                    elmnt.AudioStatus === listObject.AudioStatus &&
                    (elmnt.AudioStatus?elmnt.audio.location===listObject.audio.location:listObject.audio.value===null) &&
                    (elmnt.DocumentStatus?elmnt.document.location===listObject.document.location:listObject.document.value===null) &&
                    (elmnt.ImageStatus?elmnt.image.location===listObject.image.location:listObject.image.value===null) &&
                    elmnt.replyStatus === listObject.replyStatus &&
                    elmnt.from.userNumber === listObject.from.userNumber &&
                    elmnt.to.userNumber === listObject.to.userNumber &&
                    ind <=arrayTocheck.length

        );
        return index;
}

module.exports=IndexFinder;