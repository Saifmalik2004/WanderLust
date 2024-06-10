const Joi = require("joi");

module.exports.listingSchema = Joi.object({
  listing: Joi.object({
    title: Joi.string().required().messages({
      'any.required': 'Title is required',
      'string.empty': 'Title cannot be empty'
    }),
    description: Joi.string().required().messages({
      'any.required': 'Description is required',
      'string.empty': 'Description cannot be empty'
    }),
    price: Joi.number().required().min(0).messages({
      'any.required': 'Price is required',
      'number.min': 'Price must be a positive number',
      'number.base': 'Price must be a number'
    }),
    country: Joi.string().required().messages({
      'any.required': 'Country is required',
      'string.empty': 'Country cannot be empty'
    }),
    location: Joi.string().required().messages({
      'any.required': 'Location is required',
      'string.empty': 'Location cannot be empty'
    }),
    image: Joi.object({
      url: Joi.string().allow('', null).uri().messages({
        'string.uri': 'Image URL must be a valid URI'
      }),
      filename: Joi.string().allow('', null).messages({
        'string.empty': 'Filename cannot be empty'
      })
    }),
    category: Joi.object({
      type: Joi.string().allow('', null)
    })

  }).required().messages({
    'any.required': 'Listing data is required'
  })
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    rating: Joi.number().required().min(1).max(5),
    comment: Joi.string().required()
  }).required(),
});
