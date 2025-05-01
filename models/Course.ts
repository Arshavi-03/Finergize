import mongoose from 'mongoose';

// Define the CourseModule Schema
const CourseModuleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  videoId: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
});

// Define the Course Schema
const CourseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  bgColor: {
    type: String,
    required: true,
  },
  modules: [CourseModuleSchema],
}, {
  timestamps: true,
});

// Create the model
const Course = mongoose.models.Course || mongoose.model('Course', CourseSchema);

export default Course;