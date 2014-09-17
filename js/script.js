var solution = new Array();
var columnSol = new Array();

$(document).ready(function(){
	var inputTable = '#inputTable';
	var errorMessage = $('#errorMessage');
	var startButton = $('#findSolution');
	var sizeSubButton = $('#sizeSub');
	var sizeAddButton = $('#sizeAdd');

	sizeSubButton.on('click', function() {
		errorMessage.html('');
		if ( $(inputTable + " tr").length > 2 ) {
			ClearRender();
			$(inputTable + " tr:last-child").remove();
			$(inputTable + " tr td:nth-last-child(2)").remove();
		} else {
			ClearRender();
			errorMessage.html('Мінімум змінних 2!');
		}
	});

	sizeAddButton.on('click', function() {
		errorMessage.html('');
		if ( $(inputTable + " tr").length < 20 ) {
			ClearRender();
			AddInputTableSize(inputTable);
		} else {
			ClearRender();
			errorMessage.html('Максимум змінних Х!');
		}
	});

	startButton.on('click', function() {
		if ( CheckInput() ) {
			errorMessage.html('');

			var tempArray = GetData();
			var matrixA = tempArray[0];
			var matrixB = tempArray[1];

			if ( CalcDeterminant( matrixA ) !== 0 ) {
				solution = new Array();
				columnSol = new Array();

				ClearRender();
				solution = StartSolving( matrixA, matrixB );
				RenderMatrixSolution( solution, columnSol );
				var vectSolution = CalculateVectorSolution( solution, columnSol );
				RenderSolution(vectSolution, CalculateVectorErrors( vectSolution, matrixA, matrixB ) );
			} else {
				ClearRender();
				errorMessage.html('Детермінант дорівнює 0, тому цю СЛАР не можна розвязати методом Гаусса з вибором головного елементу');
			}
		} else {
			ClearRender();
			errorMessage.html('Не вірно заповнені вхідні дані!');
		}
	});
});

function AddInputTableSize(tableId) {
	for (var i = 0; i < $(tableId + " tr").length; i++) {
		$(tableId + ' tr:nth-child(' + (i + 1) + ') td:last-child').clone().appendTo( tableId + ' tr:nth-child(' + (i + 1) + ')' );
		$(tableId + ' tr:nth-child(' + (i + 1) + ') td:nth-last-child(2) input').val(0);
	};

	$(tableId + ' tr:last-child').clone().appendTo(tableId);
	$(tableId + ' tr:last-child input').val(0);
}

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
	RenderMatrix( A, B );

	if ( newA.length != 1 ) {
		return StartSolving( newA, newB );
	} else {
		solution.push(newA[0]);
		solution[solution.length - 1].push(newB[0]);
		RenderMatrix( newA, newB );

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

function ClearRender() {
	$('.resultBlock > div').html('');
}

function RenderMatrix( matrixA, matrixB ) {
	var renderDiv = "#matrixTable";

	if ( $(renderDiv).find('h4').length == 0 )
		$(renderDiv).append('<h4>Покрово отримані матриці:</h4>');
	$(renderDiv).append('<table></table>');
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

function RenderMatrixSolution( solutionArray, solutionColumn ) {
	var renderDiv = "#matrixSolution";
	var symbolArray = new Array();

	for (var i = 0; i < solutionArray[0].length - 1; i++) {
		symbolArray.push('x<sub>' + (i + 1) + '</sub>')
	};

	$(renderDiv).append('<h4>Зведена система:</h4>');
	$(renderDiv).append('<table class="noBorder"></table>')
	for (var i = 0; i < solutionArray.length; i++) {
		$(renderDiv + ' table').append('<tr></tr>');

		for (var j = 0; j < solutionArray[i].length; j++) {
			if ( j < solutionArray[i].length - 1 ) {
				var plus = ( parseFloat(solutionArray[i][j]) >= 0 && j > 0 ) ? ' + ' : '';
				$(renderDiv + ' table tr:last-child').append('<td>' + plus +
					parseFloat(solutionArray[i][j]).toFixed(3) + '*' + symbolArray[j] + '</td>');
			} else {
				$(renderDiv + ' table tr:last-child').append('<td> = ' + 
					parseFloat(solutionArray[i][j]).toFixed(3) + '</td>');
			};
		};

		symbolArray.splice(solutionColumn[i],1);
	};
}

function CalculateVectorSolution( solutionArray, solutionColumn ) {
	var vectorSolution = new Object();
	var systemEquations = new Array();
	var symbolArray = new Array();

	for (var i = 0; i < solutionArray[0].length - 1; i++) {
		symbolArray.push('x' + (i + 1) + '')
	};

	for (var i = 0; i < solutionArray.length; i++) {
		systemEquations[i] = new Object();

		for (var j = 0; j < solutionArray[i].length; j++) {
			var obj = {};
			if ( j < solutionArray[i].length - 1 )
				obj[symbolArray[j]] = solutionArray[i][j];
			else
				obj.b = solutionArray[i][j];
			
			systemEquations[i] = Collect(systemEquations[i], obj);
		};

		symbolArray.splice(solutionColumn[i],1);
	};

	for (var i = systemEquations.length - 1; i >= 0 ; i--) {
		if ( i == systemEquations.length - 1 ) {
			var firstKey;
			for(var k in systemEquations[i]) 
				if ( k !== 'b') firstKey = k;
			vectorSolution[firstKey] = parseFloat(systemEquations[i]['b'] / systemEquations[i][firstKey]).toFixed(3);
		} else {
			var adding = 0;

			for(var k in systemEquations[i]) 
				if ( k !== 'b') 
					if ( vectorSolution.hasOwnProperty(k) )
						adding += vectorSolution[k] * systemEquations[i][k];
					else
						var newKey = k;

			vectorSolution[newKey] = parseFloat(( systemEquations[i]['b'] - adding ) / systemEquations[i][newKey]).toFixed(3);
		}
	};

	return vectorSolution;
};

function CalculateVectorErrors( vectorSolution, matrixA, matrixB ) {
	var vectorErrors = new Object();

	for (var i = 0; i < matrixA.length; i++) {
		var summ = 0;
		for (var j = 0; j < matrixA.length; j++) {
			summ += parseFloat(vectorSolution['x' + (j + 1)]) * parseFloat(matrixA[i][j]);
		}
		vectorErrors["e" + i] = parseFloat((parseFloat(matrixB[i]) - summ).toFixed(6));
	};

	return vectorErrors;
}

function RenderSolution(vectorSolution, vectorErrors) {
	var solDiv = "#vectSolution";
	var errorDiv = "#vectErros";


	$(solDiv).append('<h4>Вектор розв\'язку:</h4>');
	$(solDiv).append("<p>" + ObjectToString(vectorSolution) + "</p>");

	$(errorDiv).append('<h4>Вектор нев\'язок:</h4>');
	$(errorDiv).append("<p>" + ObjectToString(vectorErrors) + "</p>");

}

/* concatenate objects */
function Collect() {
  var ret = {};
  var len = arguments.length;
  for (var i=0; i<len; i++) {
    for (p in arguments[i]) {
      if (arguments[i].hasOwnProperty(p)) {
        ret[p] = arguments[i][p];
      }
    }
  }
  return ret;
}
/* object to string*/
function ObjectToString() {
  var ret = "";
  var len = arguments.length;
  for (var i=0; i<len; i++) {
    for (p in arguments[i]) {
      if (arguments[i].hasOwnProperty(p)) {
        ret += p + ": " + arguments[i][p] + "; ";
      }
    }
  }
  return ret;
}