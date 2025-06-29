import React from "react";
import { SearchOutlined } from "@mui/icons-material";
import styled from "styled-components";

// Wrapper to center the search bar horizontally
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 40px; /* optional: adds space from top */
`;

const SearchBarContainer = styled.div`
  max-width: 550px;
  display: flex;
  width: 90%;
  border: 1px solid ${({ theme }) => theme.text_secondary + "90"};
  color: ${({ theme }) => theme.text_primary};
  border-radius: 8px;
  padding: 12px 16px;
  cursor: pointer;
  gap: 6px;
  align-items: center;
`;

const StyledInput = styled.input`
  border: none;
  outline: none;
  flex: 1;
  color: inherit;
  font-size: 16px;
  background: transparent;
`;

const SearchBar = ({ search, setSearch }) => {
  return (
    <Wrapper>
      <SearchBarContainer>
        <SearchOutlined />
        <StyledInput
          placeholder="Search with prompt or name . . ."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </SearchBarContainer>
    </Wrapper>
  );
};

export default SearchBar;
