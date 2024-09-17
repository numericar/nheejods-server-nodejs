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

            if ((index + 1) == YEAR_COUNT && isOnlyNumber) {
                let nextChanacter = stringDate[index + 1];
                if (nextChanacter == '-') {
                    foundYear = true;
                    continue;
                }
            }

            if (character == '-') {
                foundDash = true;
                continue;
            }

            if (foundDash && isOnlyNumber) {
                foundMonth = true;
                continue;
            }
        }

        return (foundYear && foundDash && foundMonth);        
    }

    parseStringDateToObject(stringDate) {

    }
}

module.exports = new DateUtilService();