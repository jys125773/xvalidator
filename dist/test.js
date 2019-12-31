"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var index_1 = require("./lib/index");
var validator = new index_1.default({
    email: {
        required: true,
        type: 'email',
        enum: ['yousong.jiang@163.com', 'yousong.jiang@qq.com'],
    },
    password: [
        { required: true },
        { pattern: /^(\w){6,20}$/, message: 'password只能输入6-20个字母、数字、下划线' },
    ],
    confirmPassword: { required: true, equalTo: 'password' },
    phones: {
        required: true,
        type: 'array',
        defaultField: { type: 'mobile' }
    }
});
validator.validate({
    name: 'd',
    phones: ['13718259140', 'dd']
}, { first: false }, function (errors) {
    console.log(errors);
});
