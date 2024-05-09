import GoFish from '../GoFish.js';
import {cleanup, render} from '@testing-library/react';
import '@testing-library/jest-dom'

afterEach(cleanup);

it('says go fish', () => {
    const {getByText} = render(
    <GoFish></GoFish>,
    );

    expect(getByText('Go fish!')).toBeInTheDocument();
});