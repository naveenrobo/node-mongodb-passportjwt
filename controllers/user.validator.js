const Validator = require('validator');
const isEmpty = require('../helpers/isEmpty');
const config = require('../helpers/config')

module.exports = {
    validateRegisterInput: (data) => {
        let errors = {};
        data.email = !isEmpty(data.email) ? data.email : '';
        data.name = !isEmpty(data.name) ? data.name : '';
        data.password = !isEmpty(data.password) ? data.password : '';
        data.year = !isEmpty(data.year) ? data.year : '';

        if (!Validator.isLength(data.name.first, {
                min: 2,
                max: 30
            })) {
            errors.name = 'Name must be between 2 to 30 chars';
        }

        if (Validator.isEmpty(data.name.first)) {
            errors.name = 'Name field is required';
        }

        if (!Validator.isEmail(data.email)) {
            errors.email = 'Email is invalid';
        }

        if (Validator.isEmpty(data.email)) {
            errors.email = 'Email is required';
        }

        if (!Validator.isLength(data.password, {
                min: 6,
                max: 30
            })) {
            errors.password = 'Password must have 6 chars';
        }


        if (Validator.isEmpty(data.password)) {
            errors.password = 'Password is required';
        }

        if (data.year && data.year.length == 4) {
            errors.year = 'Year must have 4 digits';
        }

        return {
            errors,
            isValid: isEmpty(errors)
        }
    },
    validateLoginInput: (data) => {
        let errors = {};
        data.email = !isEmpty(data.email) ? data.email : '';
        data.password = !isEmpty(data.password) ? data.password : '';

        if (!Validator.isEmail(data.email)) {
            errors.email = 'Email is invalid';
        }

        if (Validator.isEmpty(data.email)) {
            errors.email = 'Email is required';
        }

        if (!Validator.isLength(data.password, {
                min: 6,
                max: 30
            })) {
            errors.password = 'Password must have 6 chars';
        }

        if (Validator.isEmpty(data.password)) {
            errors.password = 'Password is required';
        }

        return {
            errors,
            isValid: isEmpty(errors)
        }
    },
    validatePermission: (user, data) => {
        data.year = !isEmpty(data.year) ? data.year : '';
        user.year = !isEmpty(user.year) ? user.year : '';

        user.role = !isEmpty(user.role) ? user.role : '';
        data.role = !isEmpty(data.role) ? data.role : '';

        console.log(user.role, config.ROLE.ADMIN)
        console.log(user.role, config.ROLE.SU)

        if(user.role == config.ROLE.SU) {
            return {
                reason: "making way for super user",
                hasPermission: true
            }
        }

        //Reject users from adding another user
        if (user.role != config.ROLE.ADMIN) {
            return {
                reason: "You don't have sufficient role to add a user",
                hasPermission: false
            }
        }
        //adding admin/anyone from adding user of another year
        if (data.year != user.year) {
            return {
                reason: "You are not authorized to add a user for another year",
                hasPermission: false
            }
        }
        //reject users/admins from adding superuser
        if (data.role == config.ROLE.SU) {
            return {
                reason: "Do you think i am an idiot?",
                hasPermission: false
            }
        }

        return {
            reason: null,
            hasPermission: false
        }
    },
    validateChangePassword: (data) => {
        let errors = {};
        data.password = !isEmpty(data.password) ? data.password : '';
        data.npassword = !isEmpty(data.npassword) ? data.npassword : '';

        if (!Validator.isLength(data.npassword, {
                min: 6,
                max: 30
            })) {
            errors.npassword = 'Password must have 6 chars';
        }

        if (Validator.isEmpty(data.npassword)) {
            errors.npassword = 'Password is required';
        }

        return {
            errors,
            isValid: isEmpty(errors)
        }
    },
}