function trim() {
    let name = '  Sneha Shrivastava    '
    console.log('Trimmed name is: ',name.trim())
}

function changetoLowerCase() {
    let name = 'SnEhA SHrivAsTavA'
    console.log('Name in lowercase is: ',name.toLowerCase())
}

function changeToUpperCase() {
    let name = 'SnehaShrivastava'
    console.log('Name in uppercase is: ',name.toUpperCase())
}

module.exports.trim = trim
module.exports.changetoLowerCase = changetoLowerCase
module.exports.changeToUpperCase = changeToUpperCase