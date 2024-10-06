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
 data: Joi.string().min(5).required().messages({
  'string.min': 'At least 5 character!',
  'string.empty': 'Not content yet!',
 }),
 title: Joi.string().min(5).max(100).required().messages({
  'string.min': 'At least 5 character!',
  'string.empty': 'Not title yet!',
 }),
 dueAt: Joi.date().max('now').allow('').allow(null).messages({
  'date.max': 'Current maximum date',
 }),

 idFolder: Joi.number().integer().allow(null),
 type: Joi.string().allow('').allow(null),
 color: Joi.string().allow('').allow(null),
 notePublic: Joi.number().integer().allow('').allow(null),
 pinned: Joi.boolean().allow('').allow(null),
 lock: Joi.string().allow('').allow(null),
})

export const schemaNoteCreate = Joi.object({
 data: Joi.string().min(5).required().messages({
  'string.min': 'At least 5 character!',
  'string.empty': 'Not content yet!',
 }),
 
 title: Joi.string().min(5).max(100).required().messages({
  'string.min': 'At least 5 character!',
  'string.empty': 'Not title yet!',
 }),

 dueAt: Joi.date().greater('now').required().messages({
  'date.greater': 'Greater current date now',
  'date.empty': 'Not content yet!',
 }),

 // no require  .....................

 remindAt: Joi.date().min('now').allow(null).messages({
  'date.max': 'Min Current date',
 }),

 idFolder: Joi.number().integer().allow(null),
 color: Joi.string().allow('').allow(null),
 notePublic: Joi.number().integer().allow('').allow(null),
 pinned: Joi.boolean().allow('').allow(null),
 lock: Joi.string().allow('').allow(null),
})
