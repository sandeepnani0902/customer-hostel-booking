import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import Dropdown from '../components/Dropdown'

const mockProps = {
  isOpen: false,
  onToggle: jest.fn(),
  value: '',
  placeholder: 'Select option',
  options: [
    { value: 'option1', label: 'Option 1' },
    { value: 'option2', label: 'Option 2' }
  ],
  onSelect: jest.fn()
}

describe('Dropdown', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('renders with placeholder when no value', () => {
    render(<Dropdown {...mockProps} />)
    expect(screen.getByText('Select option')).toBeInTheDocument()
  })

  test('renders with value when provided', () => {
    render(<Dropdown {...mockProps} value="Test Value" />)
    expect(screen.getByText('Test Value')).toBeInTheDocument()
  })

  test('calls onToggle when clicked', () => {
    render(<Dropdown {...mockProps} />)
    fireEvent.click(screen.getByRole('button'))
    expect(mockProps.onToggle).toHaveBeenCalled()
  })

  test('shows options when isOpen is true', () => {
    render(<Dropdown {...mockProps} isOpen={true} />)
    expect(screen.getByText('Option 1')).toBeInTheDocument()
    expect(screen.getByText('Option 2')).toBeInTheDocument()
  })

  test('calls onSelect when option clicked', () => {
    render(<Dropdown {...mockProps} isOpen={true} />)
    fireEvent.click(screen.getByText('Option 1'))
    expect(mockProps.onSelect).toHaveBeenCalledWith('option1')
  })

  test('handles keyboard navigation', () => {
    render(<Dropdown {...mockProps} />)
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' })
    expect(mockProps.onToggle).toHaveBeenCalled()
  })
})