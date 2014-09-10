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
				StartSolving( matrixA, matrixB );
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
                }
            }
        }
        if (i % 2 == 0) {
            s = 1;
        } else {
            s = -1;
        }
        det += s * A[0][i] * (CalcDeterminant(smaller));
    }
    return (det);
}

function StartSolving( A, B ) {
	for ( var i = 0; i < A.length; i++ ) {
		var temp = FindGlavElement( A );
		var mainElement = temp[0];
		var mainRow = temp[1];
		var mainColumn = temp[2];
		console.log(mainElement, mainRow, mainColumn);
	}
}

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
}