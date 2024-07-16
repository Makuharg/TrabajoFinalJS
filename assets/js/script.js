const selectMoneda = document.querySelector("#selectMoneda");
let myLineChart;

// llamo a la api
async function getApi() {
    const res = await fetch("https://mindicador.cl/api/");
    data = await res.json();
}

getApi();

// Funcion que convierte el valor de la moneda
const convertirValor = () => {
    const valorInput = document.querySelector("#ingresoValor").value;
    const valorSelect = document.querySelector("#selectMoneda").value;
    const parrafo = document.querySelector("#parrafoValor");

    try {
        const valorFinal = valorInput / data[valorSelect].valor;

        parrafo.textContent = `${valorInput} CLP son: ${valorFinal.toFixed(2)} ${valorSelect}`
    } catch {
        parrafo.textContent = `No se puede mostrar el valor actualmente`
    }
}

// evento onclick sobre el boton
const btn = document.querySelector("#devuelvoValor");
btn.addEventListener("click", convertirValor);

// evento onchange sobre el select
selectMoneda.addEventListener("change", ()=> {

    const value = selectMoneda.value
    renderGrafica(value);
})


// creamos las variables de la grafica
async function getAndCreateDataToChart(moneda = "dolar") {
  const res = await fetch(`https://mindicador.cl/api/${moneda}`);
  const valores = await res.json();
 
  const ultimosDiez = valores.serie.slice(21,30).reverse()

  const labels = ultimosDiez.map((dia) => {
    return dia.fecha.split("T")[0].split("-").reverse().join("-");
  });

  const data = ultimosDiez.map((dia) => {
    return dia.valor;
  });

  const datasets = [
    {
      label: `Ultimo 10 dias de ${moneda}`,
      borderColor: "rgb(255, 99, 132)",
      data,
    },
  ];
  return { labels, datasets };
}


// Renderizamos el grafico
async function renderGrafica(moneda) {
  const data = await getAndCreateDataToChart(moneda);
  const config = {
    type: "line",
    data,
  };
  const myChart = document.getElementById("myChart");
  myChart.style.backgroundColor = "white";
  
  if (myLineChart) {
    myLineChart.destroy();
  }
  const chartDOM = document.getElementById("myChart");
  myLineChart = new Chart(chartDOM, config);
}
renderGrafica();
