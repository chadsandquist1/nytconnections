This is a simple application that hosts multiple react apps.

There is TF folder that is used to deploy the application using terraform.  IMPORTANT: NEVER CHECKIN THE .tfstate file to source control or git.

RULES OF STRANDS:
Here are the UI/interaction rules from a React developer perspective:
- The game board is a 6x8 grid (48 total cells) of letter components
- Each cell contains a single uppercase letter as a clickable element
- Cells have at least three states: default, selected, and locked (part of found word)
- Users can click individual cells to select them and build a word path
- Selected cells should visually indicate they're part of the current selection (different background color/border)
- Cells are selectable only if they're adjacent to the last selected cell (8-directional adjacency)
- First click can be any cell in the grid, subsequent clicks must be adjacent to the previously selected cell
- Adjacent means horizontally, vertically, or diagonally neighboring (up to 8 possible neighbors per cell)
- Corner cells have 3 neighbors, edge cells have 5 neighbors, interior cells have 8 neighbors
- Users can click a previously selected cell to deselect it and all cells selected after it (backtracking)
- Double-clicking the last selected cell submits the current word selection
- There should be a submit button as an alternative to double-clicking
- Selected cells should display in order of selection (visual connection/path)
- The path between selected cells should be visually clear (line connector or sequential highlighting)
- Once a word is found and validated, those cells lock and change to a distinct "found" state (blue highlight)
- Once a word is try to use a different shade of blue for each completed word.
- Locked cells cannot be selected again for new 
- Words can in the clues can go in any direction..so left to right, up to down, right to left, down to up, diagonally, and don't have to be in a straight line.
- The spangram cells get a different locked state (red highlight instead of the different shades blue)
- There should be a clear/deselect button to reset the current selection without submitting
- The interface needs a hint button that reveals letters sequentially when activated
- Hint activation should highlight or reveal specific cells in the grid
- All 48 cells must eventually transition to a locked state when puzzle is complete
- The grid should prevent selection patterns that violate adjacency rules (disable non-adjacent cells)
- Visual feedback should indicate why a cell isn't selectable (grayed out/disabled state)
- The current word being formed should display above or below the grid as user selects
- A success animation should play when a valid word is found and locked into the grid