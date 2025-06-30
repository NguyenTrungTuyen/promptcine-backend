export const MongoConfig = {
  uri: process.env.MONGO_URI || 'mongodb://localhost:27017/ai-video',
  options: {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
};
