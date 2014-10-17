QUnit.test('Test CalcDeterminant function', function ( assert ) {
	assert.equal(CalcDeterminant([[1, 2],[3, 1]]), -5, 'Матриця 1 2; 3 1');
	assert.equal(CalcDeterminant([[0, 2],[0, 5]]), 0, 'Матриця 0 2; 3 0');
	assert.equal(CalcDeterminant([[1, 2],[3, 1],[2, 5]]), 0, 'Не квадратна матриця');
	assert.equal(CalcDeterminant([[1, 2, 5, 6],[3, 1],[2, 5]]), 0, 'Не матриця');
	assert.equal(CalcDeterminant(''), 0, 'Пустий рядок');
	assert.equal(CalcDeterminant([[]]), 0, 'Пустий масив');
	assert.equal(CalcDeterminant([[1]]), 1, 'Матриця з одного елементу');
});
QUnit.test('Test StartSolving function', function ( assert ) {
	assert.equal(StartSolving([[1, 2],[1, 1]], [4, 7]), [[1,2,4], [0.5, 5]], 'Матриця 1 2 = 4; 3 1 = 7');

	assert.equal(StartSolving([[0, 2],[0, 1]], [0, 7]), 'error', 'Детермінант 0');
	assert.equal(StartSolving([[0, 2],[0, 1],[0, 1]], [0, 7]), 'error', 'Не матриця');
	assert.equal(StartSolving([[],[]], []), 'error', 'Пустий масив');
});