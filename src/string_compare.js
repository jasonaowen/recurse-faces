import jdu from 'jdu'

/**
  * Compare a string case insensitive and diacritic insensitively
  */
export function string_compare(str1, str2) {
    str1 = str1.toLowerCase();
    str2 = str2.toLowerCase();

    // Compare lowercase
    if (str1 === str2) {
        return true;
    }

    // Compare without diacritics
    if (jdu.replace(str1) === jdu.replace(str2)) {
        return true;
    }

    // Compare only letters and spaces
    let regex = /[^\w\s]/g
    if (str1.replace(regex, '') === str2.replace(regex, '')) {
        return true;
    }

    return false;
}