const getCrediCardInfo = string => {
    const creditCardInfo = string.split('_');
    const number = creditCardInfo[0].replace(/\s/g, '');
    const exp_month = parseInt(creditCardInfo[1].split('/')[0]);
    const exp_year = parseInt(`20${creditCardInfo[1].split('/')[1]}`);
    const cvc = creditCardInfo[2]
    return { number, exp_month, exp_year, cvc };
}

module.exports = {
    getCrediCardInfo
};