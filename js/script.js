var matrixA = new Array();
var matrixB = new Array();
var matrixSize = 0;

$(document).ready(function(){
	var inputTable = '#inputTable';
	var errorMessage = $('#errorMessage');
	var startButton = $('#findSolution');

	startButton.on('click', function() {
		if ( CheckInput() ) {
			errorMessage.html('');
			GetData();
			if ( CalcDeterminant( matrixA ) !== 0 ) {

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
	$( inputTable ).find('tr').each(function(i){
		matrixA[i] = new Array();
		$( this ).find( 'td input' ).each(function(j){
			matrixA[i][j] = $( this ).val();
			matrixB[i] = $( this ).val();
		});
		matrixA[i].pop();
	});
	matrixSize = matrixA.length;
};

function FindGlavElement( dataArray ) {
	var temp = dataArray[0][0];
	var rows = dataArray.length;
	var cols = dataArray[0].length;

	for (var i = 0; i < rows; i++) {
		for (var j = 0; j < cols; j++) {
			if ( dataArray[i][j] > temp )
				temp = dataArray[i][j];
		};
	};
}

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