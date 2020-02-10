const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const stuffSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model('Stuff', stuffSchema);
