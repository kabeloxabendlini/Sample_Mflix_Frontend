import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders Movie Reviews navbar brand', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

  const brandElement = screen.getByText(/movie reviews/i);
  expect(brandElement).toBeInTheDocument();
});
