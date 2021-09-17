import { render, screen } from '@testing-library/react';
import Header from './layout/header';



describe('Logo', () => {
  test('Logo must have src = "logo.png"', () => {
    render(<Header/>);
    const logo = screen.getByRole('img');
    expect(logo).toHaveAttribute('src', 'logo.png');
  });
});  

