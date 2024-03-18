import React, { useEffect, useState } from 'react';
import { InputAdornment, TextField } from '@mui/material';
import PageviewIcon from '@mui/icons-material/Pageview';

interface SearchInputProps {
  emitNewTerm: (term: string) => void;
  initialSearchTerm?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({ emitNewTerm, initialSearchTerm }) => {
  const [searchTerm, setSearchTerm] = useState<string>(initialSearchTerm || '');
  const [isDirty, setIsDirty] = useState<boolean>(false);

  useEffect(() => {
    if (!isDirty) return; // Exit early if not dirty to avoid triggering on initial render

    // Now we only set the timeout if the field is dirty
    const timeoutId = setTimeout(() => {
      // Optionally check for non-empty searchTerm
      emitNewTerm(searchTerm);
    }, 500); // Debounce delay

    return () => clearTimeout(timeoutId);
  }, [searchTerm, isDirty, emitNewTerm]); // Depend on isDirty

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsDirty(true); // Set dirty on change
    setSearchTerm(event.target.value);
  };

  return (
    <TextField
      label="Search"
      color="primary"
      InputProps={{
        endAdornment: (
          <InputAdornment position="start">
            <PageviewIcon color='primary'/>
          </InputAdornment>
        ),
      }}
      variant="outlined"
      value={searchTerm}
      onChange={handleSearchChange}
      fullWidth // This makes the TextField responsive within the parent component's width
      style={{ margin: '20px', borderRadius: '5px' }}
    />
  );
};

export default SearchInput;
