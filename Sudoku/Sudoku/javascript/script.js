document.addEventListener('DOMContentLoaded', function () {
    const btnResolver = document.getElementById("btnResolver");
    btnResolver.addEventListener('click', resolverJuego);

    const btnReiniciar = document.getElementById("btnReiniciar");
    btnReiniciar.addEventListener('click', reiniciarSudoku);

    const tablaSudoku = document.getElementById("tabla-sudoku");
    const medidaCuadricula = 9;

    for (let fila = 0; fila < medidaCuadricula; fila++) {
        const nuevaFila = document.createElement("tr");
        for (let col = 0; col < medidaCuadricula; col++) {
            const celda = document.createElement("td");
            const input = document.createElement("input");
            input.type = "number";
            input.className = "celda";
            input.id = `celda-${fila}-${col}`; // Uso de comillas inversas (`) en lugar de comillas simples

            //Validar en tiempo real
            input.addEventListener('input', function(event){
                validarEntrada(event, fila, col);
            });
            //Fin validar

            celda.appendChild(input);
            nuevaFila.appendChild(celda);
        }
        tablaSudoku.appendChild(nuevaFila);
    }

    //Función para reiniciar el juego
    function reiniciarSudoku(){
        for(let fila = 0; fila < medidaCuadricula; fila++){
            for(let col = 0; col < medidaCuadricula; col++){
                const celdaId = `celda-${fila}-${col}` ; // Uso de comillas inversas (`) en lugar de comillas simples
                const celda = document.getElementById(celdaId);
                celda.value = "";
                celda.classList.remove("resolverEfecto", "entradaUsuario");
            }
        }
    }
});

async function resolverJuego(){
    const medidaCuadricula = 9;
    const listaSudoku = [];

    //Se llena de valores
    for (let fila = 0; fila < medidaCuadricula; fila++){
        listaSudoku[fila] = [];
        for(let col = 0; col < medidaCuadricula; col++){
            const celdaId = `celda-${fila}-${col}`; // Uso de comillas inversas (`) en lugar de comillas simples
            const celdaValor = document.getElementById(celdaId).value;
            listaSudoku[fila][col] = celdaValor !== ""? parseInt(celdaValor): 0;
        }
    }

    //Identificamos las celdas que ingresa el usuario
    for (let fila = 0; fila < medidaCuadricula; fila++){
        for(let col = 0; col < medidaCuadricula; col++){
            const celdaId = `celda-${fila}-${col}`; // Uso de comillas inversas (`) en lugar de comillas simples
            const celda = document.getElementById(celdaId);

            if(listaSudoku[fila][col] !== 0){
                celda.classList.add("entradaUsuario");
            }
        }
    }

    //Una vez resuelto el juego mostramos la solución en el tablero
    if(maestroSudoku(listaSudoku)){
        for(let fila = 0; fila < medidaCuadricula; fila++){
            for(let col = 0; col < medidaCuadricula; col++){
                const celdaId = `celda-${fila}-${col}`; // Uso de comillas inversas (`) en lugar de comillas simples
                const celda = document.getElementById(celdaId);

                if(!celda.classList.contains("entradaUsuario")){
                    celda.value = listaSudoku[fila][col];
                    celda.classList.add("resolverEfecto");
                    await efectoRetraso(20);
                }
            }
        }
    } else{
        alert("No tiene solución el juego");
    }
}

//Función Maestro sudoku - Solucionador

function maestroSudoku(tablero){
    const medidaCuadricula = 9;

    for(let fila = 0; fila < medidaCuadricula; fila++){
        for(let col = 0; col < medidaCuadricula; col++){
            if(tablero[fila][col]===0){
                for(let num = 1; num <= 9; num++){
                    if(verificaConflictos(tablero,fila,col,num)){
                        tablero[fila][col] = num;

                        //Intentamos resolverlo con recursividad
                        if(maestroSudoku(tablero)){
                            return true;
                        }

                        tablero[fila][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}


//Función para evitar errores en la solución

function verificaConflictos(tablero, fila, col, num){
    const medidaCuadricula = 9;

    //Verificamos
    for(let i = 0; i < medidaCuadricula; i++){
        if(tablero[fila][i] === num || tablero[i][col] === num){
            return false;
        }
    }

    //Verificamos la cuadrícula 3x3

    const filaInicio = Math.floor(fila / 3)*3;
    const colInicio = Math.floor(col / 3)*3;

    for(let i = filaInicio; i < filaInicio + 3; i++){
        for(let j = colInicio; j < colInicio + 3; j++){
            if(tablero[i][j] === num){
                return false;
            }
        }        
    }
    return true;
} 

//Función llenar el tablero

function efectoRetraso(ms){
    return new Promise(resolve => setTimeout(resolve, ms))
}

//Función para validar la entrada
function validarEntrada(event, fila, col){
    const celdaId = `celda-${fila}-${col}`;
    const celda = document.getElementById(celdaId);
    const valor = celda.value;

    //Validar el número del 1 al 9
    if(!/^[1-9]$/.test(valor)){
        Swal.fire({
            icon: "warning",
            title: 'El número ['+numeroIngresado+'], ya existe en la Columna.',
            showConfirmButton: false,
            timer: 2500
        });
        celda.value = "";
        return;
    }

    //Verificar si el número existe en la fila o en la columna

    const numeroIngresado = parseInt(valor);

    for(let i = 0; i < 9; i++){
        if(i !== col && document.getElementById(`celda-${fila}-${i}`).value == numeroIngresado){
            Swal.fire({
                icon: "warning",
                title: 'El número ['+numeroIngresado+'],  ya existe en la Fila.',
                showConfirmButton: false,
                timer: 2500
            });
            celda.value = "";
            return;
        }
        if(i !== fila && document.getElementById(`celda-${i}-${col}`).value == numeroIngresado){
            Swal.fire({
                icon: "warning",
                title: 'El número ['+numeroIngresado+'],  ya existe en la Columna.',
                showConfirmButton: false,
                timer: 2500
            });
            celda.value = "";
            return;
        }
    }

    //Verificar que no sea el mismo
    const subcuadriculaFilaInicio = Math.floor(fila / 3) * 3;
    const subcuadriculaColInicio = Math.floor(col / 3) * 3;

    for(let i = subcuadriculaFilaInicio; i < subcuadriculaColInicio + 3; i++){
        for(let j = subcuadriculaColInicio; j < subcuadriculaColInicio + 3; j++){
            if(i !== fila && j !== col && document.getElementById(`celda-${i}-${j}`).value == numeroIngresado){
                Swal.fire({
                    icon: "warning",
                    title: 'El número ['+numeroIngresado+'], ya existe en la misma subcuadrícula 3x3.',
                    showConfirmButton: false,
                    timer: 2500
                });
                celda.value = "";
                return;
            }
        }
    }
}
