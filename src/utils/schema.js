import Joi from 'joi'

export const schemaGroup = Joi.object({
 groupName: Joi.string().min(5).max(100).required().messages({
  'string.min': 'At least 5 character!',
  'string.empty': 'Not group name yet!',
 }),

 desc: Joi.string().min(5).max(100).required().messages({
  'string.min': 'At least 5 character!',
  'string.empty': 'Not description yet!',
 }),

 members: Joi.array().min(1).required().messages({
  'array.min': 'At least 1 member!',
 }),
 linkAvatar: Joi.string().base64().required().messages({
  'string.empty': 'Not avatar yet!',
 }),
})

export const schemaNoteEdit = Joi.object({
 title: Joi.string().min(5).max(100).required().messages({
  'string.min': 'At least 5 character!',
  'string.empty': 'Not title yet!',
 }),

 dueAt: Joi.date().greater('now').required().messages({
  'date.greater': 'Greater current date now',
  'date.empty': 'Not content yet!',
 }),

 remindAt: Joi.date().min('now').allow(null).messages({
  'date.min': 'Min Current date',
 }),

 // no require  .....................

 idFolder: Joi.number().integer().allow(null),
 type: Joi.string().allow('').allow(null),
 color: Joi.string().allow('').allow(null),
 notePublic: Joi.number().integer().allow('').allow(null),
 pinned: Joi.boolean().allow('').allow(null),
 lock: Joi.string().allow('').allow(null),
})

export const schemaNoteCreate = Joi.object({
 title: Joi.string().min(5).max(100).required().messages({
  'string.min': 'At least 5 character!',
  'string.empty': 'Not title yet!',
 }),

 dueAt: Joi.date().greater('now').required().messages({
  'date.greater': 'Greater current date now',
  'date.empty': 'Not content yet!',
 }),
 remindAt: Joi.date().min('now').required().messages({
  'date.min': 'Min Current date',
 }),

 // no require  .....................
 type: Joi.string().allow('').allow(null),
 idFolder: Joi.number().integer().allow(null),
 color: Joi.string().allow('').allow(null),
 notePublic: Joi.number().integer().allow('').allow(null),
 pinned: Joi.boolean().allow('').allow(null),
 lock: Joi.string().allow('').allow(null),
})

export const registerSchema = Joi.object({
 gmail: Joi.string().required().messages({
  'string.empty': 'Please enter a email',
 }),

 user_name: Joi.string().required().min(6).messages({
  'string.empty': 'Please enter a user name',
  'string.min': 'User name at least 6 characters',
 }),

 password: Joi.string().min(6).required().messages({
  'string.empty': 'Please enter a password',
  'string.min': 'Password at least 6 characters',
 }),

 confirm_password: Joi.any().valid(Joi.ref('password')).required().messages({
  'any.only': 'Password must match',
 }),
})

export const loginSchema = Joi.object({
 user_name: Joi.string().required().messages({
  'string.empty': 'Please enter a email or user name',
 }),

 password: Joi.string().required().messages({
  'string.empty': 'Please enter a password',
 }),
})

export const forgotSchema = Joi.object({
 gmail: Joi.string().required().messages({
  'string.empty': 'Please enter a email',
 }),

 password: Joi.string().required().messages({
  'string.empty': 'Please enter a password',
 }),

 new_password: Joi.string().min(6).required().messages({
  'string.empty': 'Please enter a password',
  'string.min': 'New password at least 6 characters',
 }),
})

//setting avatar

export const settingSchema = Joi.object({
 name: Joi.string().required().min(3).messages({
  'string.empty': 'Please enter a name',
  'string.min': 'at least 3 characters',
 }),

 gmail: Joi.string().allow('').allow(null),
})

///setting password

export const SettingChangePwSchema = Joi.object({
 password: Joi.string().required().messages({
  'string.empty': 'Please enter a password',
 }),

 new_password: Joi.string().min(6).required().messages({
  'string.empty': 'Please enter a new password',
  'string.min': 'New password at least 6 characters',
 }),
})
export const SettingChangePwSchemaPw2 = Joi.object({
 private_password: Joi.string().min(6).required().messages({
  'string.empty': 'Please enter a new password',
  'string.min': 'New password at least 6 characters',
 }),
 confirm_private_password: Joi.any()
  .valid(Joi.ref('private_password'))
  .required()
  .messages({
   'any.only': 'Password must match',
  }),
})

export const SettingEditPw2Schema = Joi.object({
 old_private_password: Joi.string().required().messages({
  'string.empty': 'Please enter old password',
 }),
 new_private_password: Joi.string().min(6).required().messages({
  'string.empty': 'Please enter a new password',
  'string.min': 'New password at least 6 characters',
 }),
 confirm_private_password: Joi.any()
  .valid(Joi.ref('new_private_password'))
  .required()
  .messages({
   'string.empty': 'Please enter a new password',
   'any.only': 'Password must match',
  }),
})

export const SettingForgotPw2Schema = Joi.object({
 email: Joi.string()
  .required()
  .email({ tlds: { allow: false } })
  .messages({
   'string.empty': 'Please enter an email',
   'string.email': 'Please enter a valid email address',
  }),
})

export const SettingDeleteAccountSchema = Joi.object({
 user_name: Joi.string().required().messages({
  'string.empty': 'Please enter a email or user name',
 }),

 password: Joi.string().required().messages({
  'string.empty': 'Please enter a password',
 }),
})

export const SettingForgotPwSchema = Joi.object({
 gmail: Joi.string()
  .required()
  .email({ tlds: { allow: false } })
  .messages({
   'string.empty': 'Please enter an gmail',
   'string.email': 'Please enter a valid gmail address',
  }),
})
