
var formattedData;


$(document).ready(function() {
    var ctx = document.getElementById('myChart').getContext('2d');
    var ctx2 = document.getElementById('myChart2').getContext('2d');

    //step 0 - load the data in /data/data.json
    $.getJSON('data/data.json', function(data) {
        formattedData = data;

        //first chart, diferents types of contract by year
        let d = getSumType(formattedData);
        generateSumTypeGraph(ctx, d);
        generateByTrimesterGraph(ctx2, getByTrimester(formattedData));
    });
});

function createChart(ctx, data){
    var myChart = new Chart(ctx,data);
}

//functions to generate base graph
function generateSumTypeGraph(ct, d){
    let finalD = {};
    let labels = [];

    for(var year in d){
        labels.push(year);
        for(var contractType in d[year]){
            if(!finalD[contractType]){
                finalD[contractType] = [];
            }
            finalD[contractType].push(d[year][contractType]);
        }
    }
    createChart(ct, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'CDD > 1 month',
                    data: finalD['CDD de plus d\'un mois'],
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'CDI',
                    data: finalD['CDI'],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: 'Number of contracts by year (in France)'
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Number of contracts'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Year'
                    }
                }
            }
        }
    })
}

function generateByTrimesterGraph(ct, d){
    let finalD =  {};
    let labels = ["Trimester 1", "Trimester 2", "Trimester 3", "Trimester 4"];
    //setup new data in following format
    /*
    "TRIMESTER:{
        "YEAR": {
            "contract": SUMCOUNT
        },
        ...
    }
    ...
     */
    console.log(d);

    //generate data grouped by trimester
    let datasets = [];
    let avgData = {};
    for(var year in d){
        let yearDataset = {};
        yearDataset.label = year;
        yearDataset.data = [];
        yearDataset.borderRadius = 500;
        for(var trimester in d[year]){
            let cdd = d[year][trimester]["CDD de plus d'un mois"];
            let cdi = d[year][trimester]["CDI"];
            yearDataset.data.push(cdd + cdi);
        }
        datasets.push(yearDataset);
    }

    createChart(ct, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Number of contracts by trimester'
                }
            },
            scales: {
                y: {
                    title: {
                        display: true,
                        text: 'Number of contracts'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'Trimester(grouped by year)'
                    }
                }
            }
        }
    })

}


//function to get from raw data
function getSumType(d){
    var newData = {};
    /*
    * "YEAR": {
    *   "CDD de plus d'un mois": SUMCOUNT
    *   "CDI": SUMCOUNT
    * }
    */

    for(var i = 0; i < d.length; i++){
        var year = d[i].annee;
        var contractType = d[i].nature_de_contrat;
        var sumCount = d[i].dpae_brut;

        if(!newData[year]){
            newData[year] = {};
        }

        if(!newData[year][contractType]){
            newData[year][contractType] = 0;
        }

        newData[year][contractType] += sumCount;
    }
    return newData;
}

function getByTrimester(d){
    var newData = {};
    /*
    * "YEAR": {
    *   "TRIMESTER":{
    *      "CDD de plus d'un mois": SUMCOUNT
    *      "CDI": SUMCOUNT
    *   },
    *   ...
    * }
    */

    for(var i = 0; i < d.length; i++){
        var year = d[i].annee;
        var trimester = d[i].trimestre;
        var contractType = d[i].nature_de_contrat;
        var sumCount = d[i].dpae_brut;

        if(!newData[year]){
            newData[year] = {};
        }

        if(!newData[year][trimester]){
            newData[year][trimester] = {};
        }

        if(!newData[year][trimester][contractType]){
            newData[year][trimester][contractType] = 0;
        }

        newData[year][trimester][contractType] += sumCount;
    }
    return newData;
}