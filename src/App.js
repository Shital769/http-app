import React, { Component } from "react";
import { ToastContainer } from "react-toastify";
import config from "./config.json";
import "react-toastify/dist/ReactToastify.css";
import http from "./services/httpService";
import "./App.css";

class App extends Component {
  state = {
    posts: [],
  };
  async componentDidMount() {
    //promise method will do promise > resolved (succes) OR rejected (failure)
    const { data: posts } = await http.get(config.apiEndpoint);
    this.setState({ posts });
  }

  handleAdd = async () => {
    const obj = { title: "a", body: "b" };
    const { data: post } = await http.post(config.apiEndpoint, obj);

    const posts = [post, ...this.state.posts];
    this.setState({ posts });
  };

  handleUpdate = async (post) => {
    post.title = "UPDATED";
    await http.put(config.apiEndpoint + "/" + post.id, post);
    //put method to update all properties
    // patch method to update one or more properties
    const posts = [...this.state.posts];
    const index = posts.indexOf(post);
    posts[index] = { ...posts };
    this.setState({ posts });
  };

  handleDelete = async (post) => {
    const originalPosts = this.state.posts;

    const posts = this.state.posts.filter((p) => p.id !== post.id);
    this.setState({ posts });
    try {
      //for expected error
      await http.delete( "s" + config.apiEndpoint + "/" + post.id);
      //for unexpected error
      //await axios.delete("s" + apiEndpoint + "/" + post.id);
      // throw new Error("");
    } catch (exception) {
      //Expected Errors (404: not found, 400: bad request) - CLIENT Errors
      // -Display a specific error message
      //Unexpected Errors (network down, server down, database down, bugs)
      // -Log them
      // -Display a generic and friendly error message

      if (exception.response && exception.response.status === 404);
      alert("This post has already been deleted");
      this.setState({ posts: originalPosts });
    }
  };

  render() {
    return (
      <React.Fragment>
        < ToastContainer />
        <button className="btn btn-primary" onClick={this.handleAdd}>
          Add
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map((post) => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => this.handleUpdate(post)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => this.handleDelete(post)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default App;
