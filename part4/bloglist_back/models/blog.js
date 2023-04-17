const { model, Schema } = require("mongoose");

const blogSchema = new Schema({
  title: { type: String, required: true },
  author: String,
  url: { type: String, required: true },
  likes: { type: Number, required: true, default: 0 },
  user: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
});

blogSchema.set("toJSON", {
  transform: (doc, returnedObj) => {
    returnedObj.id = returnedObj._id.toString();
    delete returnedObj._id;
    delete returnedObj.__v;
  },
});

module.exports = model("Blog", blogSchema);
