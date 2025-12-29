import tw from 'twin.macro';
import { breakpoint } from '@/theme';
import styled from 'styled-components/macro';

const ContentContainer = styled.div`
    ${tw`mx-auto w-full`};
    max-width: var(--jex-layout-max-width, 1200px);
    padding-left: var(--jex-layout-padding, 24px);
    padding-right: var(--jex-layout-padding, 24px);

    ${breakpoint('xl')`
        padding-left: var(--jex-layout-padding, 24px);
        padding-right: var(--jex-layout-padding, 24px);
    `};
`;

ContentContainer.displayName = 'ContentContainer';

export default ContentContainer;
