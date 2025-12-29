import tw from 'twin.macro';
import { breakpoint, tokens } from '@/theme';
import styled from 'styled-components/macro';

const ContentContainer = styled.div`
    ${tw`mx-auto w-full`};
    max-width: ${tokens.layout.maxWidth};
    padding-left: ${tokens.layout.padding};
    padding-right: ${tokens.layout.padding};

    ${breakpoint('xl')`
        padding-left: ${tokens.layout.padding};
        padding-right: ${tokens.layout.padding};
    `};
`;

ContentContainer.displayName = 'ContentContainer';

export default ContentContainer;
