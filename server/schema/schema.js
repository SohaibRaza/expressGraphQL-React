/*

     //   ) )  //   ) )  //    / / //   / /  /|    //| |     // | |
    ((        //        //___ / / //____    //|   // | |    //__| |
      \\     //        / ___   / / ____    // |  //  | |   / ___  |
        ) ) //        //    / / //        //  | //   | |  //    | |
 ((___ / / ((____/ / //    / / //____/ / //   |//    | | //     | |

*/

/**
 * A schema consists of three components or has 3 responsibilities
 * **1 Define Types**
 * **2 Define relationship between types**
 * **3 Define Root Queries**  root queries are how we describe the user can
 * initially jump into the graph and grab data
 * At the top level of every GraphQL server is a type that represents all of
 * the possible entry points into the GraphQL API, it's often called the Root
 * type or the Query type.
 */

/* --------------------------------- imports -------------------------------- */

const graphql = require('graphql');
const { query } = require('express');
const { ObjectId } = require('mongodb');
// const _ = require('lodash');
const Authors = require('../models/author');
const Books = require('../models/book');

const {
        GraphQLObjectType,
        GraphQLString,
        GraphQLSchema,
        GraphQLID,
        GraphQLInt,
        GraphQLList,
        GraphQLNonNull
    } = graphql; // Importing

// Dummy data
const book = [
    {
        id: '1', name: 'Zero to One', genere: 'business', author_id: '3'
    },
    {
        id: '2', name: '5 am Club', genere: 'Self Growth', author_id: '2'
    },
    {
        id: '3', name: 'The Lean Startup Guide', genere: 'business', author_id: '1'
    },
    {
        id: '4', name: 'Monk who sold his ferrari', genere: 'business', author_id: '2'
    }
];
const author = [
    { id: '3', name: 'Peter Thiel', age: '52' },
    { id: '2', name: 'Robbin Sharma', age: '45' },
    { id: '1', name: 'Eric Ries', age: '37' }
];

/* ---------------------------- Types Definition ---------------------------- */

/**
 *  **1 Define Types** /////
 */
const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString }, // We cannot use any string but Only GraphQLString
        genere: { type: GraphQLString },
        author: {
            type: AuthorType,
            resolve(parent, args) {
                console.log('BOOKS Parent: ', parent);
                // return _.find(author, { id: parent.author_id });
                console.log(ObjectId(parent.authorId));
                return Authors.findById(ObjectId(parent.authorId));
            }
        }
    }) // Defining fiels on this object Type
});

const AuthorType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        id: { type: GraphQLID },
        name: { type: GraphQLString },
        age: { type: GraphQLInt },
        books: {
            type: new GraphQLList(BookType), // we have > 1 book per author we use GraphQLList
            resolve(parent, args) {
                console.log('Author Parent: ', parent);
                // return _.filter(books, { author_id: parent.id });
                return Books.find({ authorId: parent.id });
            }
        }
    }) // Defining fiels on this object Type
});

/* --------------------------------- Queris --------------------------------- */

/**
 * **3 Define Root Queries** /////
  _______                    _       ___                              _
 |_   __ \                  / |_   .'   `.                           (_)
   | |__) |   .--.    .--. `| |-' /  .-.  \  __   _   .---.  _ .--.  __  .---.  .--.
   |  __ /  / .'`\ \/ .'`\ \| |   | |   | | [  | | | / /__\\[ `/'`\][  |/ /__\\( (`\]
  _| |  \ \_| \__. || \__. || |,  \  `-'  \_ | \_/ |,| \__., | |     | || \__., `'.'.
 |____| |___|'.__.'  '.__.' \__/   `.___.\__|'.__.'_/ '.__.'[___]   [___]'.__.'[\__) )

 *
 * Each Object is a field in root query.
 * Suppose we have Books, Autohor, Genre objects we will have 3
 * types of root queries.
 * One root query for books, one for authors ...
 */

const RootQueries = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: { // Each field is a type of root query
        book: { // book is the name of the query and it matters
            type: BookType,
            args: {
                id: { type: GraphQLID } // we are expecting that we will get an 'id' as
                                        // argument  with book query to identify the book.
            },
            resolve(parent, args) { // resolve function takes two arguments
                                    // in this function we write code to get whatever
                                    // data we need from database or some other source
                // return _.find(books, { id: args.id });
                return Books.findById(args.id);
            }
        },
        author: {
            type: AuthorType,
            args: {
                id: { type: GraphQLID }
            },
            resolve(parent, args) {
                // return _.find(author, { id: args.id });
                return Authors.findById(args.id);
            }
        },
        books: {
            type: GraphQLList(BookType), // GraphQLList() to return lists data
            resolve() {
                return Books.find({});
                // return AuthorsBooksDB.find().where('book').all();
            }
        },
        authors: {
            type: GraphQLList(AuthorType),
            resolve() {
                return Authors.find({});
            }
        }
    }
});
/** From Frontend we will query like this
 * book(id: '123'){
 *      name
 *      genere
 * }
*/

/* -------------------------------- Mutation -------------------------------- */

const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                age: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve(parent, args) {
                const authors = new Authors({
                    name: args.name,
                    age: args.age
                });
                return authors.save();
            }
        },
        addBook: {
            type: BookType,
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                genere: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLID) }
            },
            resolve(parent, args) {
                console.log(args);
                const books = new Books({
                    name: args.name,
                    genere: args.genere,
                    authorId: args.authorId
                });
                return books.save();
            }
        }
    }
});

/* --------------------------------- Schema --------------------------------- */

/**
 *  in **GraphQLSchema**  we are defining which query we are allowing the user to use when they are
 *  making queries from the frontend
*/
module.exports = new GraphQLSchema({
    query: RootQueries,
    mutation: Mutation
});
