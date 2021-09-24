import { render, screen } from '@testing-library/react';
import Footer from './layout/footer';



describe('Link', () => {
  test('Link should be google', () => {
    render(<Footer/>);
    const link = screen.getByTestId("googleLink");
    expect(link.getAttribute('href')).toBe('http://www.google.com/');
  });
});  

