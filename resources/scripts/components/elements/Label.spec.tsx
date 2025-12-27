import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import Label from './Label';

describe('Label', () => {
    it('renders label text', () => {
        render(<Label>Billing Status</Label>);

        const label = screen.getByText('Billing Status');
        expect(label.tagName).toBe('LABEL');
    });
});
