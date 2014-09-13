var solution = new Array();
var columnSol = new Array();

$(document).ready(function(){
	var inputTable = '#inputTable';
	var errorMessage = $('#errorMessage');
	var startButton = $('#findSolution');

	startButton.on('click', function() {
		if ( CheckInput() ) {
			errorMessage.html('');

			var tempArray = GetData();
			var matrixA = tempArray[0];
			var matrixB = tempArray[1];

			if ( CalcDeterminant( matrixA ) !== 0 ) {
				solution = new Array();
				columnSol = new Array();

				renderMatrixSolution( StartSolving( matrixA, matrixB ), columnSol );
			} else {
				errorMessage.html('Детермінант дорівнює 0, тому цю СЛАР не можна розвязати методом Гаусса з вибором головного елементу');
			}
		} else {
			errorMessage.html('Не вірно заповнені вхідні дані!');
		}
	});
});

function CheckInput() {
	var status = true;

	$(inputTable).find('td input').each(function(){
		if ( $( this ).val() == '' ) {
			$( this ).addClass('error');
			status = false;
		}

		if ( $( this ).val() !== '' && $( this ).hasClass('error') )
			$( this ).removeClass('error');
	});

	return status;
};

function GetData() {
	var A = new Array();
	var B = new Array();
	var Size = 0;

	$( inputTable ).find('tr').each(function(i){
		A[i] = new Array();
		$( this ).find( 'td input' ).each(function(j){
			A[i][j] = $( this ).val();
			B[i] = $( this ).val();
		});
		A[i].pop();
	});
	Size = A.length;

	return [A, B, Size];
};

function CalcDeterminant( A ) {
    var s;
    var det = 0;
    if (A.length == 1) { 
        return A[0][0];
    }
    if (A.length == 2) {       
        det =  A[0][0] * A[1][1] - A[1][0] * A [0][1];
        return det;
    }
    for (var i = 0; i < A.length; i++) {
        var smaller = new Array(A.length - 1);
        for (h = 0; h < smaller.length; h++) {
            smaller[h] = new Array(A.length - 1);
        }
        for (a = 1; a < A.length; a++) {
            for (b = 0; b < A.length; b++) {
                if (b < i) {
                    smaller[a - 1][b] = A[a][b];
                } else if (b > i) {
                    smaller[a - 1][b - 1] = A[a][b];
                };
            };
        };
        if (i % 2 == 0) {
            s = 1;
        } else {
            s = -1;
        };
        det += s * A[0][i] * (CalcDeterminant(smaller));
    };
    return (det);
};

function StartSolving( A, B ) {
	var temp 			= FindGlavElement( A );
	var mainElement 	= temp[0];
	var mainRow 		= temp[1];
	var mainColumn 		= temp[2];
	var coeffM 			= FindCoeff_m( A, mainElement, mainRow, mainColumn );
	var temp 			= FindCoeff_a( A, B, coeffM, mainRow, mainColumn );
	var newA 			= temp[0];
	var newB 			= temp[1];

	solution.push(A[mainRow]);
	solution[solution.length - 1].push(B[mainRow]);
	columnSol.push(mainColumn);
	renderMatrix( A, B );

	if ( newA.length != 1 ) {
		return StartSolving( newA, newB );
	} else {
		solution.push(newA[0]);
		solution[solution.length - 1].push(newB[0]);
		renderMatrix( newA, newB );

		return solution;
	};
};

function FindGlavElement( dataArray ) {
	var maxValue = Math.abs( dataArray[0][0] );
	var row = 0;
	var column = 0;

	for (var i = 0; i < dataArray[0].length; i++) {
		for (var j = 0; j < dataArray[0].length; j++) {
			if ( Math.abs( dataArray[i][j] ) > maxValue ) {
				maxValue = Math.abs( dataArray[i][j] );
				row = i;
				column = j;
			};
		};
	};

	return [maxValue, row, column];
};

function FindCoeff_m( A, elem, row, column ) {
	var m = new Array();

	for (var i = 0; i < A.length; i++) {
		if ( i != row ) {
			m.push( -1 * ( A[i][column] / elem ));
		};
	};

	return m;
};

function FindCoeff_a( matrixA, matrixB, m, row, column ) {
	var newMatrixA = new Array();
	var newMatrixB = new Array();

	for (var i = 0; i < matrixA.length; i++) {
		if ( i != row ) {
			newMatrixA[( i > row ? (i-1) : i )] = new Array();

			for (var j = 0; j < matrixA.length; j++) {
				if ( j != column ) 
					newMatrixA[( i > row ? (i-1) : i )][( j > column ? (j-1) : j )] = +(matrixA[i][j]) + +(matrixA[row][j] * ( i > row ? m[i-1] : m[i] ));
			};
		};
	};

	for (var i = 0; i < matrixB.length; i++) {
		if ( i != row )
			newMatrixB[( i > row ? (i-1) : i )] = +(matrixB[i]) + +(matrixB[row] * ( i > row ? m[i-1] : m[i] ));
	};

	return [newMatrixA, newMatrixB];
};

function renderMatrix( matrixA, matrixB ) {
	var renderDiv = "#matrixTable";

	$(renderDiv).append('<table></table>')
	for (var i = 0; i < matrixA.length; i++) {
		$(renderDiv + ' table:last-child').append('<tr></tr>');

		for (var j = 0; j < matrixA.length; j++) {
			$(renderDiv + ' table:last-child tr:last-child').append('<td>' + parseFloat(matrixA[i][j]).toFixed(3) + '</td>');
		};
	};

	for (var i = 0; i < matrixB.length; i++) {
		$(renderDiv + ' table:last-child tr:eq(' + i + ')').append('<td>' + parseFloat(matrixB[i]).toFixed(3) + '</td>');
	};
}

function renderMatrixSolution( solutionArray, solutionColumn ) {
	var renderDiv = "#matrixSolution";

	$(renderDiv).append('<table></table>')
	for (var i = 0; i < solutionArray.length; i++) {
		$(renderDiv + ' table').append('<tr></tr>');
		for (var j = 0; j < solutionArray[0].length; j++) {
			if ( solutionArray[i][j] !== undefined) {
				$(renderDiv + ' table tr:last-child').append('<td>' + parseFloat(solutionArray[i][j]).toFixed(3) + '</td>');
			};
		};
	};
}