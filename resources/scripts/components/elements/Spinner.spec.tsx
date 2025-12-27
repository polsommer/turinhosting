import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Spinner from './Spinner';

describe('Spinner', () => {
    it('renders a spinner element', () => {
        const { container } = render(<Spinner />);

        expect(container.querySelectorAll('div')).toHaveLength(1);
    });

    it('wraps the spinner when centered', () => {
        const { container } = render(<Spinner centered />);

        expect(container.querySelectorAll('div')).toHaveLength(2);
    });
});
