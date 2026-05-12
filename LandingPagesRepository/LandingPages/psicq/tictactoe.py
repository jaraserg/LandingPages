import random
import time
from functools import lru_cache

class TicTacToe:
    def __init__(self):
        self.board = [' ' for _ in range(9)]
        self.current_winner = None
    
    def print_board(self):
        rows = []
        for i in range(3):
            start_idx = i * 3
            rows.append(self.board[start_idx:start_idx + 3])
        
        for row in rows:
            print('| ' + ' | '.join(row) + ' |')
    
    @staticmethod
    def print_board_nums():
        for i in range(3):
            start = i * 3
            row = [str(start), str(start + 1), str(start + 2)]
            print('| ' + ' | '.join(row) + ' |')
    
    def available_moves(self):
        return [i for i, spot in enumerate(self.board) if spot == ' ']
    
    def empty_squares(self):
        return ' ' in self.board
    
    def num_empty_squares(self):
        return self.board.count(' ')
    
    def make_move(self, square, letter):
        if self.board[square] == ' ':
            self.board[square] = letter
            if self.winner(square, letter):
                self.current_winner = letter
            return True
        return False
    
    def winner(self, square, letter):
        row_ind = square // 3
        row_start = row_ind * 3
        if all(self.board[row_start + i] == letter for i in range(3)):
            return True
        
        col_ind = square % 3
        if all(self.board[col_ind + i*3] == letter for i in range(3)):
            return True
        
        if square % 2 == 0:
            if square in [0, 4, 8] and all(self.board[i] == letter for i in [0, 4, 8]):
                return True
            if square in [2, 4, 6] and all(self.board[i] == letter for i in [2, 4, 6]):
                return True
        
        return False

@lru_cache(maxsize=10000)
def minimax_cached(board_tuple, player, winner_player):
    board = list(board_tuple)
    max_player = 'O'
    other_player = 'X'
    
    empty_count = board.count(' ')
    
    if winner_player == other_player:
        return {'position': None, 'score': 1 * (empty_count + 1) if other_player == max_player else -1 * (empty_count + 1)}
    elif empty_count == 0:
        return {'position': None, 'score': 0}
    
    if player == max_player:
        best = {'position': None, 'score': -float('inf')}
    else:
        best = {'position': None, 'score': float('inf')}
    
    available = [i for i, spot in enumerate(board) if spot == ' ']
    
    for possible_move in available:
        board[possible_move] = player
        new_winner = winner_player
        
        row_ind = possible_move // 3
        row_start = row_ind * 3
        if all(board[row_start + i] == player for i in range(3)):
            new_winner = player
        elif all(board[possible_move % 3 + i*3] == player for i in range(3)):
            new_winner = player
        elif possible_move % 2 == 0:
            if possible_move in [0, 4, 8] and all(board[i] == player for i in [0, 4, 8]):
                new_winner = player
            elif possible_move in [2, 4, 6] and all(board[i] == player for i in [2, 4, 6]):
                new_winner = player
        
        sim_score = minimax_cached(tuple(board), other_player, new_winner)
        board[possible_move] = ' '
        sim_score['position'] = possible_move
        
        if player == max_player:
            if sim_score['score'] > best['score']:
                best = sim_score
        else:
            if sim_score['score'] < best['score']:
                best = sim_score
    
    return best

def minimax(state, player):
    return minimax_cached(tuple(state.board), player, state.current_winner or ' ')

def play(game, x_player, o_player, print_game=True):
    if print_game:
        game.print_board_nums()
    
    letter = 'X'
    while game.empty_squares():
        if letter == 'O':
            square = o_player.get_move(game)
        else:
            square = x_player.get_move(game)
        
        if game.make_move(square, letter):
            if print_game:
                print(letter + f' makes a move to square {square}')
                game.print_board()
                print('')
            
            if game.current_winner:
                if print_game:
                    print(letter + ' wins!')
                return letter
            
            letter = 'O' if letter == 'X' else 'X'
    
    if print_game:
        print('It\'s a tie!')

class HumanPlayer:
    def __init__(self, letter):
        self.letter = letter
    
    def get_move(self, game):
        valid_square = False
        val = None
        while not valid_square:
            square = input(self.letter + '\'s turn. Input move (0-8): ')
            try:
                val = int(square)
                if val not in game.available_moves():
                    raise ValueError
                valid_square = True
            except ValueError:
                print('Invalid square. Try again.')
        return val

class RandomComputerPlayer:
    def __init__(self, letter):
        self.letter = letter
    
    def get_move(self, game):
        square = random.choice(game.available_moves())
        return square

class SmartComputerPlayer:
    def __init__(self, letter):
        self.letter = letter
        self.total_moves = 0
        self.total_time = 0
    
    def get_move(self, game):
        available = game.available_moves()
        if len(available) == 9:
            square = random.choice([0, 2, 4, 6, 8])
        else:
            start_time = time.perf_counter()
            result = minimax(game, self.letter)
            end_time = time.perf_counter()
            
            self.total_moves += 1
            self.total_time += end_time - start_time
            
            if self.total_moves % 5 == 0:
                avg_time = self.total_time / self.total_moves
                print(f"[Performance] Average minimax time: {avg_time:.4f}s over {self.total_moves} moves")
            
            square = result['position']
        return square

if __name__ == '__main__':
    print("Welcome to Tic Tac Toe!")
    print("Choose game mode:")
    print("1. Human vs Human")
    print("2. Human vs Computer (Easy)")
    print("3. Human vs Computer (Unbeatable)")
    print("4. Computer vs Computer")
    
    choice = input("Enter your choice (1-4): ")
    
    x_player = None
    o_player = None
    
    if choice == '1':
        x_player = HumanPlayer('X')
        o_player = HumanPlayer('O')
    elif choice == '2':
        x_player = HumanPlayer('X')
        o_player = RandomComputerPlayer('O')
    elif choice == '3':
        x_player = HumanPlayer('X')
        o_player = SmartComputerPlayer('O')
    elif choice == '4':
        x_player = RandomComputerPlayer('X')
        o_player = SmartComputerPlayer('O')
    else:
        print("Invalid choice. Starting Human vs Computer game.")
        x_player = HumanPlayer('X')
        o_player = SmartComputerPlayer('O')
    
    t = TicTacToe()
    play(t, x_player, o_player, print_game=True)