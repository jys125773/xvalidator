import Xvalidator from './lib/index';

const validator = new Xvalidator({
  email: [
    {
      required: true,
      type: 'email',
      enum: ['1@163.com', '2@qq.com'],
    },
    {
      validator: (value, callback, options) => {
        setTimeout(() => {
          if (Math.random() > 0.5) {
            callback({
              message: `${value}已经被使用`,
              ruleType: 'validator',
              field: options.fullField,
            })
          } else {
            callback();
          }
        }, 1000);
      },
      trigger: 'blur',
    }
  ],
  password: [
    { required: true },
    { pattern: /^(\w){6,20}$/, message: 'password只能输入6-20个字母、数字、下划线' },
  ],
  confirmPassword: { required: true, equalTo: 'password' },
  phones: {
    required: true,
    type: 'array',
    defaultField: { type: 'mobile' }
  },
  user: {
    type: 'object',
    fields: {
      name: { required: true, type: 'string' },
      age: { required: true, type: 'number' },
    }
  }
});

validator.validate({
  email: 'email string',
  password: '123456',
  confirmPassword: '123456',
  phones: ['13718259540', 'dd']
}, { first: false }, errors => {
  console.log(errors);
});

validator.validate({
  email: '1@163.com',
}, { trigger: 'blur' }, errors => {
  console.log(errors);
});

validator.validate('13718259540', { fullField: 'phones[0]' }, errors => {
  console.log(errors);
});

validator.validate(123, { fullField: 'user.name' }, errors => {
  console.log(errors);
});