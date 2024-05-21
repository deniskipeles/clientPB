
export function toString(s) {
    if (typeof s === 'string') {
        return s;
    }
    if (typeof s === 'undefined') {
        return '';
    }
    // Change the encoding type if needed
    return JSON.stringify(s);
}

export function reduceItem(key, value, reducedItem) {
    if (Array.isArray(value)) {
        value.forEach((subItem, i) => {
            reduceItem(key + '_' + toString(i), subItem, reducedItem);
        });
    }
    else if (typeof value === 'object') {
      //console.log(value)
        Object.keys(value).forEach(subKey => {
          try{
            reduceItem(key + (key&&key.length?'_':"") + toString(subKey), value[subKey], reducedItem);
          }catch(e){
            //console.log(e)
          }
        });
    }
    else {
        reducedItem[toString(key)] = toString(value);
    }
}

export function arrayToCsv(data) {
    let processedData = [];
    let header = [];

    data.forEach(item => {
        let reducedItem = {};
        reduceItem('', item, reducedItem);
        header = header.concat(Object.keys(reducedItem));
        processedData.push(reducedItem);
    });

    header = [...new Set(header)].sort();

    let csvString = header.join(',') + '\n';
    processedData.forEach(row => {
        let csvRow = '';
        header.forEach(key => {
            if (csvRow.length > 0) {
                csvRow += ',';
            }
            csvRow += `"${toString(row[key])}"`;
        });
        csvString += csvRow + '\n';
    });

    return csvString;
}
