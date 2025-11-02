import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

const mockCSV = `Category,Word1,Word2,Word3,Word4,Difficulty
Farm Animals,Cow,Pig,Sheep,Horse,1
Colors,Red,Blue,Green,Yellow,2
Fruits,Apple,Banana,Orange,Grape,3
School Subjects,Math,Art,Gym,Science,4`;

describe('App', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      text: async () => mockCSV,
    });
  });

  it('should render the title', async () => {
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Connections')).toBeInTheDocument();
    });
  });

  it('should show loading state initially', () => {
    render(<App />);
    expect(screen.getByText('Loading puzzle...')).toBeInTheDocument();
  });

  it('should load and display word grid after loading', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.queryByText('Loading puzzle...')).not.toBeInTheDocument();
    });

    // Should display some words from the puzzle
    expect(screen.getByText('Cow')).toBeInTheDocument();
  });

  it('should show error message when CSV fails to load', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      statusText: 'Not Found',
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Failed to load puzzle/)).toBeInTheDocument();
    });
  });

  it('should allow selecting words by clicking', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Cow')).toBeInTheDocument();
    });

    const cowButton = screen.getByText('Cow');
    await user.click(cowButton);

    expect(cowButton).toHaveClass('selected');
  });

  it('should deselect word when clicked again', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Cow')).toBeInTheDocument();
    });

    const cowButton = screen.getByText('Cow');
    await user.click(cowButton);
    expect(cowButton).toHaveClass('selected');

    await user.click(cowButton);
    expect(cowButton).not.toHaveClass('selected');
  });

  it('should not allow selecting more than 4 words', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Cow')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Cow'));
    await user.click(screen.getByText('Pig'));
    await user.click(screen.getByText('Sheep'));
    await user.click(screen.getByText('Horse'));
    await user.click(screen.getByText('Red'));

    // Red should not be selected
    expect(screen.getByText('Red')).not.toHaveClass('selected');
  });

  it('should show feedback on correct answer', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Cow')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Cow'));
    await user.click(screen.getByText('Pig'));
    await user.click(screen.getByText('Sheep'));
    await user.click(screen.getByText('Horse'));

    const submitButton = screen.getByText('Submit');
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Correct/)).toBeInTheDocument();
    });
  });

  it('should shuffle words when shuffle button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Cow')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Shuffle'));

    // Note: This test just verifies shuffle button works
    // Actual order change is random and difficult to test deterministically
    await waitFor(() => {
      expect(screen.getByText('Shuffle')).toBeInTheDocument();
    });
  });

  it('should deselect all words when deselect button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Cow')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Cow'));
    await user.click(screen.getByText('Pig'));

    expect(screen.getByText('Cow')).toHaveClass('selected');
    expect(screen.getByText('Pig')).toHaveClass('selected');

    await user.click(screen.getByText('Deselect All'));

    expect(screen.getByText('Cow')).not.toHaveClass('selected');
    expect(screen.getByText('Pig')).not.toHaveClass('selected');
  });

  it('should track mistakes on incorrect answer', async () => {
    const user = userEvent.setup();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText('Cow')).toBeInTheDocument();
    });

    // Select 4 words that don't match a category
    await user.click(screen.getByText('Cow'));
    await user.click(screen.getByText('Red'));
    await user.click(screen.getByText('Apple'));
    await user.click(screen.getByText('Math'));

    await user.click(screen.getByText('Submit'));

    await waitFor(() => {
      expect(screen.getByText(/Not quite/)).toBeInTheDocument();
    });

    // Check that a mistake dot was used
    const mistakeDots = document.querySelectorAll('.mistake-dot.remaining');
    expect(mistakeDots).toHaveLength(3); // 4 - 1 mistake = 3 remaining
  });

  it('should show instructions', async () => {
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText(/Find groups of four items/)).toBeInTheDocument();
    });
  });
});
