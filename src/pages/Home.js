import React, { useContext, useState } from 'react';
import { gql, useQuery, useMutation } from '@apollo/client';
import { Grid, Form, Button, Transition } from 'semantic-ui-react';
import PostCard from '../components/PostCard';
import { AuthContext } from '../context/auth';

const FETCH_POSTS_QUERY = gql`
  {
    getPosts {
      id
      body
      createdAt
      username
      likeCount
      commentCount
      likes {
        username
      }
      comments {
        id
        username
        createdAt
        body
      }
    }
  }
`;

const CREATE_POST = gql`
  mutation createPost($body: String!) {
    createPost(body: $body) {
      id
      body
      createdAt
      username
      likeCount
      commentCount
      likes {
        id
        username
        createdAt
      }
      comments {
        id
        body
        username
        createdAt
      }
    }
  }
`;

const Home = () => {
  const [input, setInput] = useState('');
  const { loading, data } = useQuery(FETCH_POSTS_QUERY);
  const [createPost, { loading: loadingMutation, error }] = useMutation(
    CREATE_POST,
    {
      variables: { body: input },
      refetchQueries: [{ query: FETCH_POSTS_QUERY }],
    }
  );
  const { user } = useContext(AuthContext);
  const onSubmit = (e) => {
    console.log('form submited');
    createPost()
      .then((res) => {
        console.log(res);
        setInput('');
      })
      .catch((err) => {
        console.log(err.graphQLErrors);
        setInput('');
      });
  };

  return (
    <Grid columns={3}>
      <Grid.Row className="page-title">
        {user && (
          <Grid.Column>
            <Form
              onSubmit={onSubmit}
              className={loadingMutation ? 'loading' : ''}
            >
              <h2>Create a post</h2>
              <Form.Field>
                <Form.Input
                  placeholder="Create a post"
                  name="body"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  error={error ? true : false}
                />
                <Button type="submit" color="teal">
                  Submit
                </Button>
              </Form.Field>
            </Form>
            {error && (
              <div className="ui error message" style={{ padding: '0px 10px' }}>
                <ul className="list">
                  <li style={{ fontSize: '1rem' }}>
                    {error.graphQLErrors[0].message}
                  </li>
                </ul>
              </div>
            )}
          </Grid.Column>
        )}
      </Grid.Row>
      <Grid.Row className="page-title">
        <h1>Recent Posts</h1>
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <h1>Loading posts...</h1>
        ) : (
          <Transition.Group>
            {data.getPosts.map((post) => (
              <Grid.Column key={post.id} style={{ marginBottom: '20px' }}>
                <PostCard post={post} />
              </Grid.Column>
            ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
};

export default Home;
