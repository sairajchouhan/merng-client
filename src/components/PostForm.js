import { ValuesOfCorrectTypeRule } from 'graphql';
import React from 'react';
import { Button, Form } from 'semantic-ui-react';

const PostForm = () => {
  const onSubmit = () => {
    console.log('submitted');
  };
  return (
    <Form onSubmit={onSubmit}>
      <h2>Create a post</h2>
      <Form.Field>
        <Form.Input
          placeholder="Create a post"
          name="body"
          onChange={onChange}
          value={values.body}
        />
      </Form.Field>
    </Form>
  );
};

export default PostForm;
