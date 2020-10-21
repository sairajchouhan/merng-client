import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { gql, useQuery, useMutation } from '@apollo/client';
import {
  Grid,
  Image,
  Card,
  Button,
  Icon,
  Label,
  Form,
  Popup,
} from 'semantic-ui-react';
import { AuthContext } from '../context/auth';
import LikeButton from '../components/LikeButton';
import DeleteButton from '../components/DeleteButton';
import moment from 'moment';

const SinglePost = () => {
  const { postId } = useParams();
  const { user } = useContext(AuthContext);
  const [comment, setComment] = useState('');
  const { data, loading, error } = useQuery(GET_SINGLE_POST, {
    variables: { postId },
  });
  const [createComment] = useMutation(CREATE_COMMENT);

  if (loading) {
    return 'Loading';
  }
  if (error) {
    return 'Something went wrong';
  }
  const {
    id,
    body,
    createdAt,
    username,
    likeCount,
    commentCount,
    comments,
    likes,
  } = data.getPost;
  const submitComment = (e) => {
    e.preventDefault();
    createComment({
      variables: { postId, body: comment },
      refetchQueries: [{ query: FETCH_POSTS_QUERY }],
    });
    setComment('');
  };
  let postMarkup;

  postMarkup = (
    <Grid>
      <Grid.Row>
        <Grid.Column width={2}>
          <Image
            src="https://react.semantic-ui.com/images/avatar/large/molly.png"
            size="small"
            float="right"
          />
        </Grid.Column>
        <Grid.Column width={10}>
          <Card fluid>
            <Card.Content>
              <Card.Header>{username}</Card.Header>
              <Card.Meta>{moment(createdAt).fromNow()}</Card.Meta>
              <Card.Description>{body}</Card.Description>
            </Card.Content>
            <hr />
            <Card.Content extra>
              <LikeButton post={{ id, likeCount, likes, user }} />
              <Popup
                content="Comment"
                inverted
                trigger={
                  <Button as="div" labelPosition="right">
                    <Button basic color="blue">
                      <Icon name="comments" />
                    </Button>
                    <Label basic color="blue" pointing="left">
                      {commentCount}
                    </Label>
                  </Button>
                }
              />
              {user && user.username === username && (
                <DeleteButton postId={id} />
              )}
            </Card.Content>
          </Card>
          {user && (
            <Card fluid>
              <Card.Content>
                <p>Post a comment</p>
                <Form>
                  <div className="ui action input fluid">
                    <input
                      type="text"
                      placeholder="Comment.."
                      name="comment"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="ui button teal"
                      onClick={(e) => submitComment(e)}
                      disabled={comment.trim() === ''}
                    >
                      Post
                    </button>
                  </div>
                </Form>
              </Card.Content>
            </Card>
          )}
          {comments.map((comment) => (
            <Card fluid key={comment.id}>
              <Card.Content>
                {user && user.username === comment.username && (
                  <DeleteButton postId={id} commentId={comment.id} />
                )}
                <Card.Header>{comment.username}</Card.Header>
                <Card.Meta>{moment(comment.createdAt).fromNow()}</Card.Meta>
                <Card.Description>{comment.body}</Card.Description>
              </Card.Content>
            </Card>
          ))}
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );

  return postMarkup;
};

const CREATE_COMMENT = gql`
  mutation createComment($postId: ID!, $body: String!) {
    createComment(postId: $postId, body: $body) {
      id
      body
      username
      createdAt
      comments {
        id
        body
        username
        createdAt
      }
    }
  }
`;

const GET_SINGLE_POST = gql`
  query getPost($postId: ID!) {
    getPost(postId: $postId) {
      id
      body
      createdAt
      username
      likeCount
      commentCount
      comments {
        id
        body
        username
        createdAt
      }
      likes {
        id
        username
        createdAt
      }
    }
  }
`;
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

export default SinglePost;
