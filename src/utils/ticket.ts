import {TicketInfo} from "~/utils/interfaces";


function toByteArray(ticketInfo: TicketInfo) {
    const jsonString = JSON.stringify(ticketInfo);
    const byteArray = new Uint8Array(jsonString.length);
    for (let i = 0; i < jsonString.length; i++) {
        byteArray[i] = jsonString.charCodeAt(i);
    }
    return Array.from(byteArray);
}

function toByte(array: Array) {
    const jsonString = JSON.stringify(array);
    const byteArray = new Uint8Array(jsonString.length);
    for (let i = 0; i < jsonString.length; i++) {
        byteArray[i] = jsonString.charCodeAt(i);
    }
    return Array.from(byteArray);
}

function fromByte(byteArray: Array) {
    const byteNumbers = Array.from(byteArray);
    const jsonString = String.fromCharCode.apply(null, byteNumbers);
    const ticketInfo = JSON.parse(jsonString);
    return ticketInfo;
}

export {toByte, fromByte, toByteArray}