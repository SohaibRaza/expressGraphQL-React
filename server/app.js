const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ debug: true });
const { graphqlHTTP } = require('express-graphql');
const schema = require('./schema/schema');


const app = express();

app.use(cors());
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: 1
}));

// console.log(schema);

/* ------------------------------- DB Connect ------------------------------- */
mongoose.connect(
    process.env.CONNECT_DB,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    },
    () => console.log('Database connected')
);

/* --------------------------------- Server --------------------------------- */

app.listen('3400', () => {
    console.log('server is running');
});
