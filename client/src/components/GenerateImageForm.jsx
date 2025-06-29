import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import Button from "./button";
import TextInput from "./TextInput";
import { AutoAwesome, CreateRounded } from "@mui/icons-material";
import { CreatePost, GenerateAIImage } from "../api";

const Form = styled.div`
  flex: 1;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 9%;
  justify-content: center;
`;

const Top = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const Title = styled.div`
  font-size: 28px;
  font-weight: 500;
  color: ${({ theme }) => theme.text_primary};
`;

const Desc = styled.div`
  font-size: 17px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary};
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  font-size: 12px;
  font-weight: 400;
  color: ${({ theme }) => theme.text_secondary};
`;

const ErrorMsg = styled.div`
  color: red;
  font-size: 13px;
`;

const Actions = styled.div`
  flex: 1;
  display: flex;
  gap: 8px;
`;

const GenerateImageForm = ({
  post,
  setPost,
  createPostLoading,
  setGenerateImageLoading,
  generateImageLoading,
  setCreatePostLoading,
}) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const generateImageFun = async () => {
    if (!post.prompt.trim()) {
      setError("Prompt cannot be empty.");
      return;
    }

    setError("");
    setGenerateImageLoading(true);

    try {
      const res = await GenerateAIImage({ prompt: post.prompt });
      setPost({
  ...post,
  photo: res?.data?.photo, // use as image src directly
});

    } catch (error) {
      setError(error?.response?.data?.message || "Failed to generate image.");
    } finally {
      setGenerateImageLoading(false);
    }
  };

  const createPostFun = async () => {
    setCreatePostLoading(true);
    try {
      await CreatePost(post);
      navigate("/");
    } catch (error) {
      setError(error?.response?.data?.message || "Failed to create post.");
    } finally {
      setCreatePostLoading(false);
    }
  };

  return (
    <Form>
      <Top>
        <Title>Generate Image with Prompt</Title>
        <Desc>
          Write your prompt according to the image you want to generate!
        </Desc>
      </Top>
      <Body>
        <TextInput
          label="Author"
          placeholder="Enter your name.."
          name="name"
          value={post.name}
          handelChange={(e) => setPost({ ...post, name: e.target.value })}
        />
        <TextInput
          label="Image Prompt"
          placeholder="Write a detailed prompt about the image . . . "
          name="prompt"
          rows="8"
          textArea
          value={post.prompt}
          handelChange={(e) => setPost({ ...post, prompt: e.target.value })}
        />
        {error && <ErrorMsg>{error}</ErrorMsg>}
        <div>** You can post the AI Generated Image to the Community **</div>
      </Body>
      <Actions>
        <Button
          text="Generate Image"
          $flex
          leftIcon={<AutoAwesome />}
          $isLoading={generateImageLoading}
          $isDisabled={post.prompt === ""}
          onClick={generateImageFun}
        />
        <Button
          text="Post Image"
          $flex
          type="secondary"
          leftIcon={<CreateRounded />}
          $isLoading={createPostLoading}
          $isDisabled={
            post.name === "" || post.prompt === "" || post.photo === ""
          }
          onClick={createPostFun}
        />
      </Actions>
    </Form>
  );
};

export default GenerateImageForm;
