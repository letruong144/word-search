document.addEventListener('DOMContentLoaded', () => {
    // Danh sách từ vựng tiếng Anh lớp 6
    const words = ['FAMILY', 'SCHOOL', 'FRIEND', 'HOUSE', 'SUBJECT', 'SPORTS', 'KITCHEN', 'LIVINGROOM'];
    const gridSize = 15;
    const gridContainer = document.getElementById('grid-container');
    const wordList = document.getElementById('word-list');
    const message = document.getElementById('message');

    let grid = [];
    let foundWords = 0;
    let selectedCells = [];
    let isDragging = false;

    // Khởi tạo lưới
    function createGrid() {
        gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
        grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));

        // Đặt từ vào lưới
        placeWords(words);

        // Điền các ô trống bằng chữ cái ngẫu nhiên
        fillEmptyCells();

        // Hiển thị lưới và danh sách từ
        renderGrid();
        renderWordList();
    }

    // Đặt từ vào lưới
    function placeWords(wordsToPlace) {
        // ... (Đây là phần logic phức tạp để đặt từ theo chiều ngang, dọc, chéo.
        // Tôi sẽ cung cấp một phiên bản đơn giản hơn để bạn dễ hình dung.
        // Bạn có thể mở rộng phần này sau.)
        let placedWords = 0;
        wordsToPlace.forEach(word => {
            const direction = Math.floor(Math.random() * 2); // 0: ngang, 1: dọc
            let placed = false;
            let attempts = 0;

            while (!placed && attempts < 100) {
                let row = Math.floor(Math.random() * gridSize);
                let col = Math.floor(Math.random() * gridSize);

                if (canPlaceWord(word, row, col, direction)) {
                    placeWord(word, row, col, direction);
                    placed = true;
                    placedWords++;
                }
                attempts++;
            }
        });
    }

    function canPlaceWord(word, row, col, direction) {
        if (direction === 0) { // Ngang
            if (col + word.length > gridSize) return false;
            for (let i = 0; i < word.length; i++) {
                if (grid[row][col + i] !== '' && grid[row][col + i] !== word[i]) {
                    return false;
                }
            }
        } else { // Dọc
            if (row + word.length > gridSize) return false;
            for (let i = 0; i < word.length; i++) {
                if (grid[row + i][col] !== '' && grid[row + i][col] !== word[i]) {
                    return false;
                }
            }
        }
        return true;
    }

    function placeWord(word, row, col, direction) {
        if (direction === 0) {
            for (let i = 0; i < word.length; i++) {
                grid[row][col + i] = word[i];
            }
        } else {
            for (let i = 0; i < word.length; i++) {
                grid[row + i][col] = word[i];
            }
        }
    }

    // Điền các ô trống
    function fillEmptyCells() {
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (grid[r][c] === '') {
                    grid[r][c] = String.fromCharCode(65 + Math.floor(Math.random() * 26));
                }
            }
        }
    }

    // Hiển thị lưới
    function renderGrid() {
        gridContainer.innerHTML = '';
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                cell.dataset.row = r;
                cell.dataset.col = c;
                cell.textContent = grid[r][c];
                gridContainer.appendChild(cell);
            }
        }
    }

    // Hiển thị danh sách từ
    function renderWordList() {
        wordList.innerHTML = '';
        words.forEach(word => {
            const li = document.createElement('li');
            li.id = `word-${word}`;
            li.textContent = word;
            wordList.appendChild(li);
        });
    }

    // Xử lý sự kiện kéo và thả
    gridContainer.addEventListener('mousedown', (e) => {
        isDragging = true;
        const cell = e.target;
        if (cell.classList.contains('grid-cell')) {
            selectedCells = [cell];
            cell.classList.add('selected');
        }
    });

    gridContainer.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const cell = e.target;
        if (cell.classList.contains('grid-cell') && !selectedCells.includes(cell)) {
            selectedCells.push(cell);
            cell.classList.add('selected');
        }
    });

    gridContainer.addEventListener('mouseup', () => {
        isDragging = false;
        checkWord();
        selectedCells.forEach(cell => {
            if (!cell.classList.contains('found')) {
                cell.classList.remove('selected');
            }
        });
        selectedCells = [];
    });
    
    // Tắt kéo khi ra ngoài lưới
    gridContainer.addEventListener('mouseleave', () => {
        if (isDragging) {
            isDragging = false;
            selectedCells.forEach(cell => {
                if (!cell.classList.contains('found')) {
                    cell.classList.remove('selected');
                }
            });
            selectedCells = [];
        }
    });

    // Kiểm tra từ
    function checkWord() {
        if (selectedCells.length === 0) return;

        const foundWord = selectedCells.map(cell => cell.textContent).join('');
        const reversedWord = foundWord.split('').reverse().join('');

        if (words.includes(foundWord) || words.includes(reversedWord)) {
            let foundWordItem = document.getElementById(`word-${foundWord}`);
            if (!foundWordItem) {
                foundWordItem = document.getElementById(`word-${reversedWord}`);
            }

            if (foundWordItem && !foundWordItem.classList.contains('found')) {
                foundWords++;
                foundWordItem.classList.add('found');
                selectedCells.forEach(cell => cell.classList.add('found'));

                if (foundWords === words.length) {
                    message.textContent = 'Chúc mừng! Bạn đã tìm thấy tất cả các từ!';
                }
            }
        }
    }

    // Bắt đầu trò chơi
    createGrid();
});