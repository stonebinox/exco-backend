import express from 'express';
import bodyParser from 'body-parser';
import router from './routes/index';
import mongoose from 'mongoose';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(router);

mongoose.connect('mongodb://exco:bodhistar1507@cluster0-shard-00-00-lpa44.mongodb.net:27017,cluster0-shard-00-01-lpa44.mongodb.net:27017,cluster0-shard-00-02-lpa44.mongodb.net:27017/exco?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: 1,
  });

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
