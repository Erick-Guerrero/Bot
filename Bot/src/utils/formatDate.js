module.exports = (date) => {
    var day = String(date.getDate()).padStart(2, '0');
    var month = String(date.getMonth() + 1).padStart(2, '0'); // Los meses en JavaScript van de 0 a 11, por lo que añadimos 1
    var year = date.getFullYear();
    return day + '-' + month + '-' + year;
}

