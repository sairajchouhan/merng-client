import React, { useEffect, useState } from 'react';
import { Icon, Label, Button, Popup } from 'semantic-ui-react';
import { useMutation, gql } from '@apollo/client';
import { Link } from 'react-router-dom';

const LikeButton = ({ post: { likeCount, likes, id, user } }) => {
  const [liked, setLiked] = useState(false);
  useEffect(() => {
    if (user && likes.find((like) => user.username === like.username)) {
      setLiked(true);
    } else {
      setLiked(false);
    }
  }, [user, likes]);

  const likeButton = user ? (
    liked ? (
      <Button color="teal" filled>
        <Icon name="heart" />
      </Button>
    ) : (
      <Button color="teal" basic>
        <Icon name="heart" />
      </Button>
    )
  ) : (
    <Button color="teal" basic as={Link} to="/login">
      <Icon name="heart" />
    </Button>
  );

  const [likePost] = useMutation(LIKE_MUTATION);

  const handleClick = () => {
    likePost({ variables: { postId: id } })
      .then((res) => console.log('liked the post'))
      .catch((err) => console.log('error'));
  };

  return (
    <Popup
      content="Like post"
      inverted
      trigger={
        <Button as="div" labelPosition="right" onClick={handleClick}>
          {likeButton}
          <Label basic color="teal" pointing="left">
            {likeCount}
          </Label>
        </Button>
      }
    />
  );
};

const LIKE_MUTATION = gql`
  mutation likePost($postId: ID!) {
    likePost(postId: $postId) {
      id
      username
      likes {
        id
        username
      }
      likeCount
    }
  }
`;

export default LikeButton;
