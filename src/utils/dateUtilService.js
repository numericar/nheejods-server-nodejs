class DateUtilService {
    isFormatYYYYMM(stringDate = '') {
        if (stringDate.trim().length == 0) return false;

        const YEAR_COUNT = 4; // specific year character count

        let foundDash = false; // store found dash in string
        let foundYear = false; // store found year in sting (YYYY)
        let foundMonth = false; // store found month in string (MM)

        let isOnlyNumber = true; // store result of character found only number
        for (let index = 0; index < stringDate.length; index++) {
            let character = stringDate[index];

            // validate characer should between 0 - 9 or dash
            if ((character < '0' || character > '9') && character != '-') {
                isOnlyNumber = false;
            }

            // validate current count is equal YEAR_COUNT and has only number
            if ((index + 1) == YEAR_COUNT && isOnlyNumber) {
                let nextChanacter = stringDate[index + 1]; // get next character
                if (nextChanacter == '-') { // if next character is equal dash, all number before it is year !
                    foundYear = true; // true if found year number
                    continue;
                }
            }

            // validate current character is dash
            if (character == '-') {
                foundDash = true; // true if found year dash
                continue;
            }

            // validate after found it dash amd isOnlyNumber  is true
            if (foundDash && isOnlyNumber) {
                foundMonth = true; // true if foundDash and isOnlyNumber
                continue;
            }
        }

        // if we found year, dash, month it should true (correct format)
        return (foundYear && foundDash && foundMonth);        
    }

    parseStringDateToObject(stringDate) {
        const dateArr = stringDate.split(',');

        return {
            year: dateArr[0],
            month: dateArr[1]
        }
    }
}

module.exports = new DateUtilService();