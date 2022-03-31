import * as React from 'react';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { Stack, IStackTokens } from '@fluentui/react/lib/Stack';

const stackTokens: Partial<IStackTokens> = { childrenGap: 20 };

const SearchBoxFullSize = () => {
  return (
    <Stack tokens={stackTokens}>
      <SearchBox placeholder="Search" onSearch={newValue => console.log('value is ' + newValue)} />
    </Stack>
  );
};

export default SearchBoxFullSize