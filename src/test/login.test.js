import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // for additional matchers
import Login from './Login';

describe('Login Component', () => {
  it('should render without errors', () => {
    const { getByText, getByPlaceholderText } = render(<Login />);
    
    expect(getByText('Login')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter Username')).toBeInTheDocument();
    expect(getByPlaceholderText('Enter Password')).toBeInTheDocument();
  });

  it('should update state on input change', () => {
    const { getByPlaceholderText } = render(<Login />);
    const usernameInput = getByPlaceholderText('Enter Username');
    const passwordInput = getByPlaceholderText('Enter Password');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });

    expect(usernameInput.value).toBe('testuser');
    expect(passwordInput.value).toBe('testpassword');
  });

  it('should call onSubmitHandler when form is submitted', async () => {
    const mockSubmitHandler = jest.fn();
    const { getByPlaceholderText, getByText } = render(<Login onSubmitHandler={mockSubmitHandler} />);
    
    const usernameInput = getByPlaceholderText('Enter Username');
    const passwordInput = getByPlaceholderText('Enter Password');
    const submitButton = getByText('Login');

    fireEvent.change(usernameInput, { target: { value: 'testuser' } });
    fireEvent.change(passwordInput, { target: { value: 'testpassword' } });
    fireEvent.click(submitButton);

    // Wait for asynchronous operations (if any)
    await waitFor(() => {
      expect(mockSubmitHandler).toHaveBeenCalledTimes(1);
    });
  });
});
