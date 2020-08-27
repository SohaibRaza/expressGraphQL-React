import React from 'react';
import { getAuthorsQuery } from '../queries/queries';
import { graphql } from 'react-apollo';

function displayBooksList (data) {
    const getAuthors = data;
    console.log(getAuthors)
    if (getAuthors.loading) return (<option disabled>Loading...</option>);
    else {
        return getAuthors.authors.map((author) => {
            return <option className="optnz" key={ author.id } value={ author.id }>{ author.name }</option>;
        });
    }
}

function AuthorsList(props) {
    console.log("Authors", props.data)
    return (
        <div className="justify-content-center">
            <div className="row justify-content-center ">
                <form action="" className="col-6">
                    <div className="form-group">
                        <label>Book Name</label>
                        <input type="text" placeholder="Book Name" className="form-control"/>
                    </div>
                    <div className="form-group">
                        <label>Genre</label>
                        <input type="text" placeholder="Genre" className="form-control"/>
                    </div>
                    <div className="form-group">
                        <select className="form-control">
                            <option value="seledt">Select Author</option>
                            { displayBooksList(props.data) }
                        </select>
                    </div>
                    <button type="submit" class="btn btn-primary">Add</button>
                </form>
            </div>
        </div>
    );
}

export default graphql(getAuthorsQuery)(AuthorsList);
