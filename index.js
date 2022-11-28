const express = require('express')
const app = express()
const port = 3000

app.get('/rendu2', (rep, res)=>{
    const fs = require('fs')
    const csv = require('csv-parser')
    const resultats = [];
    const download = require('download');
    const unzip = require('unzip-stream')
    var i = 0;
    var countTrue = 0;

    download('https://files.data.gouv.fr/insee-sirene/StockEtablissementLiensSuccession_utf8.zip', 'data').then(() => {
        fs.createReadStream('data/StockEtablissementLiensSuccession_utf8.zip').pipe(unzip.Parse()).on('entry', function (entry) {
            const fileName = entry.path;
            const type = entry.type;
            const size = entry.size;
            if (fileName === "Data.csv") {
                entry.pipe(csv()).on('data', (data) => resultats.push(data)).on('end', () => {
    resultats.forEach(element => {
        if(element.transfertSiege == 'true'){
            countTrue++;
        }
        i++;
    });
    let pourcent = countTrue/i*100;
    res.send(`Le pourcentage de société qui ont transféré leur siège social deouis le 1er Novembre 2022 est de ${pourcent.toFixed(3)}%`)
  })
            } else {
                entry.autodrain();
            }
        });
})
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
