const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  project_code: {
    type: String,
    required: true,
    unique: true
  },
  project_name: {
    type: String,
    required: true
  },
  project_description: {
    type: String,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);