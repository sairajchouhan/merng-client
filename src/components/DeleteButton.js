import React from 'react';
import { Button, Icon, Popup } from 'semantic-ui-react';
import { gql, useMutation } from '@apollo/client';
import { useHistory } from 'react-router-dom';

const DeleteButton = ({ postId, commentId }) => {
  const history = useHistory();
  const mutation = commentId ? DELETE_COMMENT : DELETE_POST;
  const [del] = useMutation(mutation, {
    variables: { postId, commentId },
  });

  const handleClick = (postId, commentId) => {
    if (commentId) {
      del({ refetchQueries: [{ query: FETCH_POSTS_QUERY }] });
    } else {
      del({ refetchQueries: [{ query: FETCH_POSTS_QUERY }] });

      history.push('/');
    }
  };

  return (
    <Popup
      content={`Delete ${commentId ? 'comment' : 'post'}`}
      inverted
      trigger={
        <Button
          as="div"
          color="red"
          onClick={() => handleClick(postId, commentId)}
          floated="right"
        >
          <Icon name="trash" style={{ margin: 0 }} />
        </Button>
      }
    />
  );
};

const DELETE_POST = gql`
  mutation deletePost($postId: ID!) {
    deletePost(postId: $postId)
  }
`;

const DELETE_COMMENT = gql`
  mutation deleteComment($postId: ID!, $commentId: ID!) {
    deleteComment(postId: $postId, commentId: $commentId) {
      id
      body
      username
      createdAt
      comments {
        id
        username
        body
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

export default DeleteButton;
