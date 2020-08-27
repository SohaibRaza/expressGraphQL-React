import React from 'react';
import { getBooksQuery } from '../queries/queries';
import { graphql } from 'react-apollo';

function displayBooksList (data) {
    const getBooks = data;
    if (getBooks.loading) return (<div>Loading...</div>);
    else {
        return getBooks.books.map((book) => {
            return <li key={book.id}>{ book.name }</li>;
        });
    }
}

function BooksList(props) {
    console.log("Books", props.data)
    return (
        <div className="card mt-2">
            <div className="card-header">
                <h2 className="card-title">Books List</h2>
            </div>
            <div className="card-body">
                <ul>
                    { displayBooksList(props.data) }
                </ul>
            </div>
        </div>
    );
}

export default graphql(getBooksQuery)(BooksList);
