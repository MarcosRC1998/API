let errors = [];

function ValidationService() {
    errors = [];
}

ValidationService.prototype.isRequired = (value, message) => {
    if (!value || value.length <= 0)
        errors.push({ message: message });
}

ValidationService.prototype.hasMinLen = (value, min, message) => {
    if (!value || value.length < min)
        errors.push({ message: message });
}

ValidationService.prototype.hasMaxLen = (value, max, message) => {
    if (!value || value.length > max)
        errors.push({ message: message });
}

ValidationService.prototype.isFixedLen = (value, len, message) => {
    if (value.length != len)
        errors.push({ message: message });
}

ValidationService.prototype.hasMinValue = (value, min, message) => {
    if (value < min)
        errors.push({ message: message });
}

ValidationService.prototype.isEmail = (value, message) => {
    var reg = new RegExp(/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/);
    if (!reg.test(value))
        errors.push({ message: message });
}

ValidationService.prototype.isEqual = (valueOne, valueTwo, message) => {
    if (valueOne != valueTwo) {
        errors.push({ message: message });
    }
}

ValidationService.prototype.isValidPassword = (value, message) => {
    var reg = new RegExp(/((?=.+[\d])(?=.+[a-z])(?=.*[A-Z])(?=.+[%#$&!?@])).{6,}/g);
    if (!reg.test(value)) {
        errors.push({ message: message });
    }
}

ValidationService.prototype.errors = () => {
    return errors;
}

ValidationService.prototype.clear = () => {
    errors = [];
}

ValidationService.prototype.isValid = () => {
    return errors.length == 0;
}

module.exports = ValidationService;