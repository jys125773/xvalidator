"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    required: '%s是必填项',
    enum: '%s必须是%s其中的一个',
    equal: '%s必须等于%s',
    equalTo: '%s必须与%s一致',
    whitespace: '%s不能为空',
    pattern: '请输入正确的%s',
    string: {
        len: '%s必须是%s个字符',
        min: '%s至少是%s个字符',
        max: '%s不能超过%s个字符',
        range: '%s必须在%s与%s个字符之间',
    },
    number: {
        len: '%s必须等于%s',
        min: '%s不能小于%s',
        max: '%s不能大于%s',
        range: '%s必须在%s与%s之间',
    },
    array: {
        len: '%s长度必须是%s',
        min: '%s长度至少是%s',
        max: '%s长度不能超过%s',
        range: '%s长度必须在%s与%s之间',
    },
    type: {
        string: '%s必须是字符',
        array: '%s必须是数组',
        object: '%s必须是对象',
        number: '%s必须是数字',
        date: '%s必须是日期',
        boolean: '%s必须是布尔值',
        regexp: '%s必须是正则表达式',
        integer: '%s必须是整数',
        float: '%s必须是小数',
        email: '请输入正确的邮箱',
        mobile: '请输入正确的手机号',
    },
};
