import { render, screen } from '@testing-library/react';
import Toolbar from './Toolbar';




describe('Save', () => {
  test('Tests that save buttons text is "Spara"', () => {
    render(<Toolbar/>);
        expect(screen.getByTestId("save")).toHaveValue("Spara");
  });
});  
